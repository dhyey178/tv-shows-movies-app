import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { TvShowsController } from './tv-shows.controller';
import { TvShowsService } from './tv-shows.service';
import { CreateTvShowDto } from './dto/create-tv-show.dto';
import { TvShowResponseDto } from './dto/tv-show-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';

const mockTvShowsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findCommentsForTvShow: jest.fn(),
};

describe('TvShowsController (Integration)', () => {
  let app: INestApplication;
  let service: TvShowsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TvShowsController],
      providers: [
        {
          provide: TvShowsService,
          useValue: mockTvShowsService,
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

    service = moduleFixture.get<TvShowsService>(TvShowsService);
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

  describe('POST /tv-shows', () => {
    const createTvShowDto: CreateTvShowDto = {
      title: 'Test TV Show',
      description: 'A TV show for testing.',
      releaseYear: 2022,
      genre: ['Fantasy', 'Drama'],
      imageUrl: 'http://example.com/tvshow.jpg',
      creator: 'Show Creator',
      cast: ['Actor X', 'Actor Y'],
      seasons: 3,
      episodes: 30,
    };

    const createdTvShowResponse: TvShowResponseDto = {
      id: 'tvshow-id-1',
      title: 'Test TV Show',
      description: 'A TV show for testing.',
      releaseYear: 2022,
      genre: ['Fantasy', 'Drama'],
      imageUrl: 'http://example.com/tvshow.jpg',
      creator: 'Show Creator',
      cast: ['Actor X', 'Actor Y'],
      seasons: 3,
      episodes: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      totalComments: 0,
      averageRating: null,
    };

    it('should create a TV show successfully and return 201', async () => {
      mockTvShowsService.create.mockResolvedValue(createdTvShowResponse);

      const response = await request(app.getHttpServer())
        .post('/tv-shows')
        .send(createTvShowDto)
        .expect(HttpStatus.CREATED);

      expect(mockTvShowsService.create).toHaveBeenCalledWith(createTvShowDto);
      expect(response.body).toEqual({
        ...createdTvShowResponse,
        createdAt: response.body.createdAt,
        updatedAt: response.body.updatedAt,
      });
    });

    it('should return 400 for invalid input (e.g., missing title)', async () => {
      const invalidDto: Partial<CreateTvShowDto> = {
        description: 'Missing title',
        releaseYear: 2023,
      };

      await request(app.getHttpServer())
        .post('/tv-shows')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockTvShowsService.create).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid input (e.g., non-numeric seasons)', async () => {
      const invalidDto: any = {
        ...createTvShowDto,
        seasons: 'three',
      };

      await request(app.getHttpServer())
        .post('/tv-shows')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockTvShowsService.create).not.toHaveBeenCalled();
    });

    it('should return 409 if TV show title already exists', async () => {
      mockTvShowsService.create.mockRejectedValue(
        new ConflictException(`TV Show with title "${createTvShowDto.title}" already exists.`),
      );

      await request(app.getHttpServer())
        .post('/tv-shows')
        .send(createTvShowDto)
        .expect(HttpStatus.CONFLICT)
        .expect({
          statusCode: HttpStatus.CONFLICT,
          message: `TV Show with title "${createTvShowDto.title}" already exists.`,
          error: 'Conflict',
        });

      expect(mockTvShowsService.create).toHaveBeenCalledWith(createTvShowDto);
    });
  });

  describe('GET /tv-shows/:id', () => {
    const tvShowId = 'test-tvshow-id';
    const tvShowDetails: TvShowResponseDto = {
      id: tvShowId,
      title: 'Found TV Show',
      description: 'Details for found TV show.',
      releaseYear: 2018,
      genre: ['Sci-Fi'],
      imageUrl: 'http://example.com/found-tv.jpg',
      creator: 'Creator Y',
      cast: ['Actor D'],
      seasons: 5,
      episodes: 60,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      totalComments: 0,
      averageRating: null,
    };

    it('should return a TV show by ID successfully', async () => {
      mockTvShowsService.findOne.mockResolvedValue(tvShowDetails);

      const response = await request(app.getHttpServer())
        .get(`/tv-shows/${tvShowId}`)
        .expect(HttpStatus.OK);

      expect(mockTvShowsService.findOne).toHaveBeenCalledWith(tvShowId);
      expect(response.body).toEqual({
        ...tvShowDetails,
        createdAt: response.body.createdAt,
        updatedAt: response.body.updatedAt,
      });
    });

    it('should return 404 if TV show not found', async () => {
      mockTvShowsService.findOne.mockRejectedValue(
        new NotFoundException(`TV show with ID ${tvShowId} not found.`),
      );

      await request(app.getHttpServer())
        .get(`/tv-shows/${tvShowId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: HttpStatus.NOT_FOUND,
          message: `TV show with ID ${tvShowId} not found.`,
          error: 'Not Found',
        });

      expect(mockTvShowsService.findOne).toHaveBeenCalledWith(tvShowId);
    });
  });

  describe('GET /tv-shows', () => {
    const mockTvShowsList: TvShowResponseDto[] = [
      {
        id: 'tv1',
        title: 'TV Show One',
        description: 'Desc tv one',
        releaseYear: 2019,
        genre: ['Action'],
        imageUrl: 'url_tv1',
        creator: 'C_tv1',
        cast: ['A_tv1'],
        seasons: 2,
        episodes: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        totalComments: 0,
        averageRating: null,
      },
      {
        id: 'tv2',
        title: 'TV Show Two',
        description: 'Desc tv two',
        releaseYear: 2020,
        genre: ['Comedy'],
        imageUrl: 'url_tv2',
        creator: 'C_tv2',
        cast: ['A_tv2'],
        seasons: 3,
        episodes: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        totalComments: 0,
        averageRating: null,
      },
    ];

    const paginatedResponse: PaginatedResponseDto<TvShowResponseDto> = {
      data: mockTvShowsList,
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    it('should return a paginated list of TV shows', async () => {
      mockTvShowsService.findAll.mockResolvedValue(paginatedResponse);

      const response = await request(app.getHttpServer())
        .get('/tv-shows?page=1&limit=10')
        .expect(HttpStatus.OK);

      expect(mockTvShowsService.findAll).toHaveBeenCalledWith(1, 10);
      expect(response.body).toEqual({
        data: response.body.data.map((tvShow: TvShowResponseDto, index: number) => ({
          ...tvShow,
          createdAt: response.body.data[index].createdAt,
          updatedAt: response.body.data[index].updatedAt,
        })),
        meta: paginatedResponse.meta,
      });
      expect(response.body.data.length).toBe(mockTvShowsList.length);
    });

    it('should use default pagination query if not provided', async () => {
      mockTvShowsService.findAll.mockResolvedValue(paginatedResponse);

      await request(app.getHttpServer())
        .get('/tv-shows')
        .expect(HttpStatus.OK);

      expect(mockTvShowsService.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('GET /tv-shows/:id/comments', () => {
    const tvShowId = 'tvshow-with-comments';
    const mockComments: CommentResponseDto[] = [
      {
        id: 'c1',
        content: 'Great show!',
        author: 'Viewer 1',
        rating: 8,
        avatar: null,
        createdAt: new Date(),
        movieId: null,
        tvShowId: tvShowId,
      },
      {
        id: 'c2',
        content: 'Binged it!',
        author: 'Viewer 2',
        rating: 9,
        avatar: 'http://example.com/viewer_avatar.jpg',
        createdAt: new Date(),
        movieId: null,
        tvShowId: tvShowId,
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

    it('should return paginated comments for a TV show by ID', async () => {
      mockTvShowsService.findCommentsForTvShow.mockResolvedValue(paginatedCommentsResponse);

      const response = await request(app.getHttpServer())
        .get(`/tv-shows/${tvShowId}/comments?page=1&limit=10`)
        .expect(HttpStatus.OK);

      expect(mockTvShowsService.findCommentsForTvShow).toHaveBeenCalledWith(tvShowId, 1, 10);
      expect(response.body).toEqual({
        data: response.body.data.map((comment: CommentResponseDto, index: number) => ({
          ...comment,
          createdAt: response.body.data[index].createdAt,
        })),
        meta: paginatedCommentsResponse.meta,
      });
      expect(response.body.data.length).toBe(mockComments.length);
    });

    it('should return 404 if TV show not found when getting comments', async () => {
      mockTvShowsService.findCommentsForTvShow.mockRejectedValue(
        new NotFoundException(`TV Show with ID ${tvShowId} not found.`),
      );

      await request(app.getHttpServer())
        .get(`/tv-shows/${tvShowId}/comments?page=1&limit=10`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: HttpStatus.NOT_FOUND,
          message: `TV Show with ID ${tvShowId} not found.`,
          error: 'Not Found',
        });

      expect(mockTvShowsService.findCommentsForTvShow).toHaveBeenCalledWith(tvShowId, 1, 10);
    });
  });
});