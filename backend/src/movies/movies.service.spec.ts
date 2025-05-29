import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { Comment } from '@prisma/client';

const mockPrismaService = {
  movie: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
  comment: {
    aggregate: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe('MoviesService', () => {
  let service: MoviesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    prisma = module.get<PrismaService>(PrismaService);

    for (const model in mockPrismaService) {
      for (const method in mockPrismaService[model]) {
        mockPrismaService[model][method].mockReset();
      }
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createMovieDto = {
      title: 'New Movie Title',
      description: 'A description',
      releaseYear: 2023,
      genre: ['Action', 'Sci-Fi'],
      imageUrl: 'http://example.com/new_movie.jpg',
      cast: ['Actor A', 'Actor B'],
      director: 'Director C',
      duration: 120,
    };

    const createdPrismaMovie: Movie = {
      id: 'movie-id-1',
      title: 'New Movie Title',
      description: 'A description',
      releaseYear: 2023,
      genre: '["Action","Sci-Fi"]',
      imageUrl: 'http://example.com/new_movie.jpg',
      cast: '["Actor A","Actor B"]',
      director: 'Director C',
      duration: 120,
      createdAt: new Date('2025-05-29T10:00:00.000Z'),
      updatedAt: new Date('2025-05-29T10:00:00.000Z'),
    };

    const expectedMovieResponseDto = {
      id: 'movie-id-1',
      title: 'New Movie Title',
      description: 'A description',
      releaseYear: 2023,
      genre: ['Action', 'Sci-Fi'],
      imageUrl: 'http://example.com/new_movie.jpg',
      cast: ['Actor A', 'Actor B'],
      director: 'Director C',
      duration: 120,
      createdAt: new Date('2025-05-29T10:00:00.000Z'),
      updatedAt: new Date('2025-05-29T10:00:00.000Z'),
      comments: [],
      totalComments: 0,
      averageRating: null,
    };

    it('should successfully create a new movie', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue(null);
      mockPrismaService.movie.create.mockResolvedValue(createdPrismaMovie);
      mockPrismaService.comment.aggregate.mockResolvedValue({
        _count: { id: 0 },
        _avg: { rating: null },
      });
      const result = await service.create(createMovieDto);

      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { title: createMovieDto.title },
      });
      expect(prisma.movie.create).toHaveBeenCalledWith({
        data: {
          ...createMovieDto,
          genre: JSON.stringify(createMovieDto.genre),
          cast: JSON.stringify(createMovieDto.cast),
        },
      });
      expect(prisma.comment.aggregate).toHaveBeenCalledWith({
        _count: { id: true },
        _avg: { rating: true },
        where: { movieId: createdPrismaMovie.id },
      });
      expect(result).toEqual(expectedMovieResponseDto);
    });

    it('should throw ConflictException if movie with title already exists', async () => {
       mockPrismaService.movie.findUnique.mockResolvedValue(createdPrismaMovie);
      await expect(service.create(createMovieDto)).rejects.toThrow(
        new ConflictException(`Movie with title "${createMovieDto.title}" already exists.`),
      );
      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { title: createMovieDto.title },
      });
      expect(prisma.movie.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const movieId = 'test-movie-id';
    const existingPrismaMovie: Movie & { comments: Comment[] } = {
      id: movieId,
      title: 'Existing Movie',
      description: 'An existing description',
      releaseYear: 2020,
      genre: '["Drama"]',
      imageUrl: 'http://example.com/existing.jpg',
      cast: '["Actor X"]',
      director: 'Director Y',
      duration: 90,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      comments: [
        {
          id: 'comment-1',
          content: 'Great movie!',
          author: 'User1',
          rating: 9,
          avatar: null,
          createdAt: new Date(),
          movieId: movieId,
          tvShowId: null,
        },
        {
          id: 'comment-2',
          content: 'Loved it!',
          author: 'User2',
          rating: 8,
          avatar: null,
          createdAt: new Date(),
          movieId: movieId,
          tvShowId: null,
        },
      ],
    };

    const expectedMovieResponseDto = {
      id: movieId,
      title: 'Existing Movie',
      description: 'An existing description',
      releaseYear: 2020,
      genre: ['Drama'],
      imageUrl: 'http://example.com/existing.jpg',
      cast: ['Actor X'],
      director: 'Director Y',
      duration: 90,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      comments: [
        {
          id: 'comment-1',
          content: 'Great movie!',
          author: 'User1',
          rating: 9,
          avatar: null,
          createdAt: expect.any(Date),
          movieId: movieId,
          tvShowId: null,
        },
        {
          id: 'comment-2',
          content: 'Loved it!',
          author: 'User2',
          rating: 8,
          avatar: null,
          createdAt: expect.any(Date),
          movieId: movieId,
          tvShowId: null,
        },
      ],
      totalComments: 2,
      averageRating: 8.5,
    };

    it('should return a movie if found', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue(existingPrismaMovie);
      mockPrismaService.comment.aggregate.mockResolvedValue({
        _count: { id: 2 },
        _avg: { rating: 8.5 },
      });

      const result = await service.findOne(movieId);

      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { id: movieId },
        include: {
          comments: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
      expect(prisma.comment.aggregate).toHaveBeenCalledWith({
        _count: { id: true },
        _avg: { rating: true },
        where: { movieId: movieId },
      });
      expect(result).toEqual(expectedMovieResponseDto);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue(null);

      await expect(service.findOne(movieId)).rejects.toThrow(
        new NotFoundException(`Movie with ID ${movieId} not found.`),
      );
      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { id: movieId },
        include: {
          comments: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
      expect(prisma.comment.aggregate).not.toHaveBeenCalled();
    });

    it('should handle movie with no comments gracefully', async () => {
      const movieWithoutComments: Movie & { comments: Comment[] } = {
        ...existingPrismaMovie,
        comments: [],
      };
      mockPrismaService.movie.findUnique.mockResolvedValue(movieWithoutComments);
      mockPrismaService.comment.aggregate.mockResolvedValue({
        _count: { id: 0 },
        _avg: { rating: null },
      });

      const result = await service.findOne(movieId);
      expect(result.comments).toEqual([]);
      expect(result.totalComments).toBe(0);
      expect(result.averageRating).toBeNull();
    });

    it('should handle genre/cast parsing errors gracefully', async () => {
        const movieWithBadJson: Movie & { comments: Comment[] } = {
            ...existingPrismaMovie,
            genre: '{"bad-json',
            cast: '[unquoted-string]',
        };
        mockPrismaService.movie.findUnique.mockResolvedValue(movieWithBadJson);
        mockPrismaService.comment.aggregate.mockResolvedValue({
          _count: { id: 0 },
          _avg: { rating: null },
        });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const result = await service.findOne(movieId);

        expect(result.genre).toEqual([]);
        expect(result.cast).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
        consoleErrorSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    const page = 1;
    const limit = 10;
    const totalMovies = 25;
    const mockPrismaMovies: (Movie & { comments: Comment[] })[] = [
      {
        id: 'movie-1', title: 'Movie 1', description: 'desc1', releaseYear: 2020, genre: '["Action"]', imageUrl: 'url1', cast: '["A1"]', director: 'D1', duration: 100, createdAt: new Date(), updatedAt: new Date(), comments: []
      },
      {
        id: 'movie-2', title: 'Movie 2', description: 'desc2', releaseYear: 2021, genre: '["Comedy"]', imageUrl: 'url2', cast: '["A2"]', director: 'D2', duration: 110, createdAt: new Date(), updatedAt: new Date(), comments: []
      },
    ];

    it('should return a paginated list of movies', async () => {
      mockPrismaService.movie.count.mockResolvedValue(totalMovies);
      mockPrismaService.movie.findMany.mockResolvedValue(mockPrismaMovies);
      mockPrismaService.comment.aggregate.mockImplementation((params) => {
        return Promise.resolve({
          _count: { id: 0 },
          _avg: { rating: null },
        });
      });

      const result = await service.findAll(page, limit);

      expect(prisma.movie.count).toHaveBeenCalledTimes(1);
      expect(prisma.movie.findMany).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          comments: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.comment.aggregate).toHaveBeenCalledTimes(mockPrismaMovies.length);

      expect(result.data.length).toBe(mockPrismaMovies.length);
      expect(result.meta.total).toBe(totalMovies);
      expect(result.meta.page).toBe(page);
      expect(result.meta.limit).toBe(limit);
      expect(result.meta.totalPages).toBe(Math.ceil(totalMovies / limit));
    });

    it('should return empty data for an empty list of movies', async () => {
      mockPrismaService.movie.count.mockResolvedValue(0);
      mockPrismaService.movie.findMany.mockResolvedValue([]);
      mockPrismaService.comment.aggregate.mockResolvedValue({
        _count: { id: 0 },
        _avg: { rating: null },
      });

      const result = await service.findAll(page, limit);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.page).toBe(page);
      expect(result.meta.limit).toBe(limit);
      expect(result.meta.totalPages).toBe(0);
    });
  });

  describe('findCommentsForMovie', () => {
    const movieId = 'movie-id-with-comments';
    const nonExistentMovieId = 'non-existent-movie-id';
    const page = 1;
    const limit = 5;
    const totalComments = 12;

    const mockComments: Comment[] = [
      { id: 'c1', content: 'C1', author: 'A1', rating: 10, avatar: null, createdAt: new Date(), movieId: movieId, tvShowId: null },
      { id: 'c2', content: 'C2', author: 'A2', rating: 9, avatar: null, createdAt: new Date(), movieId: movieId, tvShowId: null },
      { id: 'c3', content: 'C3', author: 'A3', rating: 8, avatar: null, createdAt: new Date(), movieId: movieId, tvShowId: null },
      { id: 'c4', content: 'C4', author: 'A4', rating: 7, avatar: null, createdAt: new Date(), movieId: movieId, tvShowId: null },
      { id: 'c5', content: 'C5', author: 'A5', rating: 6, avatar: null, createdAt: new Date(), movieId: movieId, tvShowId: null },
    ];

    it('should return paginated comments for a movie', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue({ id: movieId });
      mockPrismaService.comment.count.mockResolvedValue(totalComments);
      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);

      const result = await service.findCommentsForMovie(movieId, page, limit);

      expect(prisma.movie.findUnique).toHaveBeenCalledWith({ where: { id: movieId } });
      expect(prisma.comment.count).toHaveBeenCalledWith({ where: { movieId } });
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: { movieId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      expect(result.data.length).toBe(mockComments.length);
      expect(result.meta.total).toBe(totalComments);
      expect(result.meta.page).toBe(page);
      expect(result.meta.limit).toBe(limit);
      expect(result.meta.totalPages).toBe(Math.ceil(totalComments / limit));
      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('content');
      expect(result.data[0]).toHaveProperty('movieId');
    });

    it('should throw NotFoundException if the movie does not exist', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue(null);

      await expect(service.findCommentsForMovie(nonExistentMovieId, page, limit)).rejects.toThrow(
        new NotFoundException(`Movie with ID ${nonExistentMovieId} not found.`),
      );
      expect(prisma.movie.findUnique).toHaveBeenCalledWith({ where: { id: nonExistentMovieId } });
      expect(prisma.comment.count).not.toHaveBeenCalled();
      expect(prisma.comment.findMany).not.toHaveBeenCalled();
    });

    it('should return empty comments list if movie exists but has no comments', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue({ id: movieId });
      mockPrismaService.comment.count.mockResolvedValue(0);
      mockPrismaService.comment.findMany.mockResolvedValue([]);

      const result = await service.findCommentsForMovie(movieId, page, limit);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });
});