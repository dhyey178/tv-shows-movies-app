import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';

const mockMoviesService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findCommentsForMovie: jest.fn(),
};

describe('MoviesController (Integration)', () => {
  let app: INestApplication;
  let service: MoviesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));
    await app.init();

    service = moduleFixture.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('POST /movies', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'Test Movie',
      description: 'A movie for testing.',
      releaseYear: 2023,
      genre: ['Action', 'Comedy'],
      imageUrl: 'http://example.com/test.jpg',
      director: 'Test Director',
      duration: 120,
      cast: ['Actor A', 'Actor B'],
    };

    const createdMovieResponse: MovieResponseDto = {
      id: 'movie-id-1',
      title: 'Test Movie',
      description: 'A movie for testing.',
      releaseYear: 2023,
      genre: ['Action', 'Comedy'],
      imageUrl: 'http://example.com/test.jpg',
      director: 'Test Director',
      duration: 120,
      cast: ['Actor A', 'Actor B'],
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      totalComments: 0,
      averageRating: null,
    };

    it('should create a movie successfully and return 201', async () => {
      mockMoviesService.create.mockResolvedValue(createdMovieResponse);

      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(createMovieDto)
        .expect(HttpStatus.CREATED);

      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto);
      expect(response.body).toEqual({
        ...createdMovieResponse,
        createdAt: response.body.createdAt,
        updatedAt: response.body.updatedAt,
      });
    });

    it('should return 400 for invalid input (e.g., missing title)', async () => {
      const invalidDto: Partial<CreateMovieDto> = {
        description: 'Missing title',
        releaseYear: 2023,
      };

      await request(app.getHttpServer())
        .post('/movies')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockMoviesService.create).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid input (e.g., non-array genre)', async () => {
      const invalidDto: any = { 
        ...createMovieDto,
        genre: 'not-an-array',
      };

      await request(app.getHttpServer())
        .post('/movies')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockMoviesService.create).not.toHaveBeenCalled();
    });

    it('should return 409 if movie title already exists', async () => {
      mockMoviesService.create.mockRejectedValue(
        new ConflictException(`Movie with title "${createMovieDto.title}" already exists.`),
      );

      await request(app.getHttpServer())
        .post('/movies')
        .send(createMovieDto)
        .expect(HttpStatus.CONFLICT)
        .expect({
          statusCode: HttpStatus.CONFLICT,
          message: `Movie with title "${createMovieDto.title}" already exists.`,
          error: 'Conflict',
        });

      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('GET /movies/:id', () => {
    const movieId = 'test-movie-id';
    const movieDetails: MovieResponseDto = {
      id: movieId,
      title: 'Found Movie',
      description: 'Details for found movie.',
      releaseYear: 2020,
      genre: ['Thriller'],
      imageUrl: 'http://example.com/found.jpg',
      director: 'Director X',
      duration: 150,
      cast: ['Actor C'],
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      totalComments: 0,
      averageRating: null,
    };

    it('should return a movie by ID successfully', async () => {
      mockMoviesService.findOne.mockResolvedValue(movieDetails);

      const response = await request(app.getHttpServer())
        .get(`/movies/${movieId}`)
        .expect(HttpStatus.OK);

      expect(mockMoviesService.findOne).toHaveBeenCalledWith(movieId);
      expect(response.body).toEqual({
        ...movieDetails,
        createdAt: response.body.createdAt,
        updatedAt: response.body.updatedAt,
      });
    });

    it('should return 404 if movie not found', async () => {
      mockMoviesService.findOne.mockRejectedValue(
        new NotFoundException(`Movie with ID ${movieId} not found.`),
      );

      await request(app.getHttpServer())
        .get(`/movies/${movieId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Movie with ID ${movieId} not found.`,
          error: 'Not Found',
        });

      expect(mockMoviesService.findOne).toHaveBeenCalledWith(movieId);
    });
  });

  describe('GET /movies', () => {
    const mockMoviesList: MovieResponseDto[] = [
      {
        id: 'm1',
        title: 'Movie One',
        description: 'Desc one',
        releaseYear: 2021,
        genre: ['Sci-Fi'],
        imageUrl: 'url1',
        director: 'D1',
        duration: 100,
        cast: ['A1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        totalComments: 0,
        averageRating: null,
      },
      {
        id: 'm2',
        title: 'Movie Two',
        description: 'Desc two',
        releaseYear: 2022,
        genre: ['Drama'],
        imageUrl: 'url2',
        director: 'D2',
        duration: 110,
        cast: ['A2'],
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        totalComments: 0,
        averageRating: null,
      },
    ];

    const paginatedResponse: PaginatedResponseDto<MovieResponseDto> = {
      data: mockMoviesList,
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    it('should return a paginated list of movies', async () => {
      mockMoviesService.findAll.mockResolvedValue(paginatedResponse);

      const response = await request(app.getHttpServer())
        .get('/movies?page=1&limit=10')
        .expect(HttpStatus.OK);

      expect(mockMoviesService.findAll).toHaveBeenCalledWith(1, 10);
      expect(response.body).toEqual({
        data: response.body.data.map((movie: MovieResponseDto, index: number) => ({
          ...movie,
          createdAt: response.body.data[index].createdAt,
          updatedAt: response.body.data[index].updatedAt,
        })),
        meta: paginatedResponse.meta,
      });
      expect(response.body.data.length).toBe(mockMoviesList.length);
    });

    it('should use default pagination query if not provided', async () => {
      mockMoviesService.findAll.mockResolvedValue(paginatedResponse);

      await request(app.getHttpServer())
        .get('/movies')
        .expect(HttpStatus.OK);

      expect(mockMoviesService.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('GET /movies/:id/comments', () => {
    const movieId = 'movie-with-comments';
    const mockComments: CommentResponseDto[] = [
      {
        id: 'c1',
        content: 'Great movie!',
        author: 'Commenter 1',
        rating: 9,
        avatar: null,
        createdAt: new Date(),
        movieId: movieId,
        tvShowId: null,
      },
      {
        id: 'c2',
        content: 'Loved it!',
        author: 'Commenter 2',
        rating: 10,
        avatar: 'http://example.com/avatar2.jpg',
        createdAt: new Date(),
        movieId: movieId,
        tvShowId: null,
      },
    ];

    const paginatedCommentsResponse: PaginatedResponseDto<CommentResponseDto> = {
      data: mockComments,
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    it('should return paginated comments for a movie by ID', async () => {
      mockMoviesService.findCommentsForMovie.mockResolvedValue(paginatedCommentsResponse);

      const response = await request(app.getHttpServer())
        .get(`/movies/${movieId}/comments?page=1&limit=10`)
        .expect(HttpStatus.OK);

      expect(mockMoviesService.findCommentsForMovie).toHaveBeenCalledWith(movieId, 1, 10);
      expect(response.body).toEqual({
        data: response.body.data.map((comment: CommentResponseDto, index: number) => ({
          ...comment,
          createdAt: response.body.data[index].createdAt,
        })),
        meta: paginatedCommentsResponse.meta,
      });
      expect(response.body.data.length).toBe(mockComments.length);
    });

    it('should return 404 if movie not found when getting comments', async () => {
      mockMoviesService.findCommentsForMovie.mockRejectedValue(
        new NotFoundException(`Movie with ID ${movieId} not found.`),
      );

      await request(app.getHttpServer())
        .get(`/movies/${movieId}/comments?page=1&limit=10`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Movie with ID ${movieId} not found.`,
          error: 'Not Found',
        });

      expect(mockMoviesService.findCommentsForMovie).toHaveBeenCalledWith(movieId, 1, 10);
    });
  });
});