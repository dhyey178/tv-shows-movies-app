import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
const mockCommentsService = {
  createComment: jest.fn(),
};

describe('CommentsController (Integration)', () => {
  let app: INestApplication;
  let service: CommentsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
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

    service = moduleFixture.get<CommentsService>(CommentsService);
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

  describe('POST /comments', () => {
    const validMovieId = uuid();
    const validTvShowId = uuid();
    const nonExistentMovieId = uuid();
    const nonExistentTvShowId = uuid();


    const baseCreateCommentDto: CreateCommentDto = {
      content: 'Awesome content!',
      author: 'TestUser',
      rating: 9,
      avatar: 'http://example.com/user.jpg',
      movieId: undefined,
      tvShowId: undefined,
    };

    const createdCommentResponse: CommentResponseDto = {
      id: uuid(),
      content: 'Awesome content!',
      author: 'TestUser',
      rating: 9,
      avatar: 'http://example.com/user.jpg',
      createdAt: new Date(),
      movieId: null,
      tvShowId: null,
    };

    it('should create a comment for a movie successfully and return 201', async () => {
      const createCommentDto: CreateCommentDto = {
        ...baseCreateCommentDto,
        movieId: validMovieId,
        tvShowId: undefined,
      };
      const expectedResponse: CommentResponseDto = {
        ...createdCommentResponse,
        movieId: validMovieId,
        tvShowId: null,
      };

      mockCommentsService.createComment.mockResolvedValue(expectedResponse);

      const response = await request(app.getHttpServer())
        .post('/comments')
        .send(createCommentDto)
        .expect(HttpStatus.CREATED);

      expect(mockCommentsService.createComment).toHaveBeenCalledWith(createCommentDto);
      expect(response.body).toEqual({
        ...expectedResponse,
        createdAt: response.body.createdAt,
      });
    });

    it('should create a comment for a TV show successfully and return 201', async () => {
      const createCommentDto: CreateCommentDto = {
        ...baseCreateCommentDto,
        movieId: undefined,
        tvShowId: validTvShowId,
      };
      const expectedResponse: CommentResponseDto = {
        ...createdCommentResponse,
        movieId: null,
        tvShowId: validTvShowId,
      };

      mockCommentsService.createComment.mockResolvedValue(expectedResponse);

      const response = await request(app.getHttpServer())
        .post('/comments')
        .send(createCommentDto)
        .expect(HttpStatus.CREATED);

      expect(mockCommentsService.createComment).toHaveBeenCalledWith(createCommentDto);
      expect(response.body).toEqual({
        ...expectedResponse,
        createdAt: response.body.createdAt,
      });
    });

    it('should return 400 for missing content (validation error)', async () => {
      const invalidDto: Partial<CreateCommentDto> = {
        author: 'TestUser',
        rating: 5,
        movieId: validMovieId,
      };

      await request(app.getHttpServer())
        .post('/comments')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockCommentsService.createComment).not.toHaveBeenCalled();
    });

    it('should return 400 if both movieId and tvShowId are provided', async () => {
      const invalidDto: CreateCommentDto = {
        ...baseCreateCommentDto,
        movieId: validMovieId,
        tvShowId: validTvShowId,
      };

      mockCommentsService.createComment.mockRejectedValue(
        new BadRequestException('A comment must be associated with either a movie OR a TV show, but not both.'),
      );

      await request(app.getHttpServer())
        .post('/comments')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'A comment must be associated with either a movie OR a TV show, but not both.',
          error: 'Bad Request',
        });

      expect(mockCommentsService.createComment).toHaveBeenCalledWith(invalidDto);
    });

    it('should return 400 if neither movieId nor tvShowId is provided', async () => {
      const invalidDto: CreateCommentDto = {
        ...baseCreateCommentDto,
        movieId: undefined,
        tvShowId: undefined,
      };

      mockCommentsService.createComment.mockRejectedValue(
        new BadRequestException('A comment must be associated with either a movie OR a TV show, but not both.'),
      );

      await request(app.getHttpServer())
        .post('/comments')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'A comment must be associated with either a movie OR a TV show, but not both.',
          error: 'Bad Request',
        });

      expect(mockCommentsService.createComment).toHaveBeenCalledWith(invalidDto);
    });

    it('should return 404 if movieId is provided but movie not found', async () => {
      const invalidDto: CreateCommentDto = {
        ...baseCreateCommentDto,
        movieId: nonExistentMovieId,
        tvShowId: undefined,
      };

      mockCommentsService.createComment.mockRejectedValue(
        new NotFoundException(`Movie with ID ${nonExistentMovieId} not found.`),
      );

      await request(app.getHttpServer())
        .post('/comments')
        .send(invalidDto)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Movie with ID ${nonExistentMovieId} not found.`,
          error: 'Not Found',
        });

      expect(mockCommentsService.createComment).toHaveBeenCalledWith(invalidDto);
    });

    it('should return 404 if tvShowId is provided but TV show not found', async () => {
      const invalidDto: CreateCommentDto = {
        ...baseCreateCommentDto,
        movieId: undefined,
        tvShowId: nonExistentTvShowId,
      };

      mockCommentsService.createComment.mockRejectedValue(
        new NotFoundException(`TV Show with ID ${nonExistentTvShowId} not found.`),
      );

      await request(app.getHttpServer())
        .post('/comments')
        .send(invalidDto)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: HttpStatus.NOT_FOUND,
          message: `TV Show with ID ${nonExistentTvShowId} not found.`,
          error: 'Not Found',
        });

      expect(mockCommentsService.createComment).toHaveBeenCalledWith(invalidDto);
    });

    it('should return 400 for invalid rating (less than 0) - validation error', async () => {
      const invalidDto: Partial<CreateCommentDto> = {
        ...baseCreateCommentDto,
        rating: -1,
        movieId: validMovieId,
      };

      await request(app.getHttpServer())
        .post('/comments')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockCommentsService.createComment).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid avatar URL - validation error', async () => {
      const invalidDto: Partial<CreateCommentDto> = {
        ...baseCreateCommentDto,
        avatar: 'not-a-valid-url',
        movieId: validMovieId,
      };

      await request(app.getHttpServer())
        .post('/comments')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockCommentsService.createComment).not.toHaveBeenCalled();
    });
  });
});