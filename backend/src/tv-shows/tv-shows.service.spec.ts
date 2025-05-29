import { Test, TestingModule } from '@nestjs/testing';
import { TvShowsService } from './tv-shows.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { TvShow } from '@prisma/client';
import { Comment } from '@prisma/client';

const mockPrismaService = {
  tvShow: {
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

describe('TvShowsService', () => {
  let service: TvShowsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TvShowsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TvShowsService>(TvShowsService);
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
    const createTvShowDto = {
      title: 'New TV Show Title',
      description: 'A description for a new show',
      releaseYear: 2024,
      genre: ['Drama', 'Mystery'],
      imageUrl: 'http://example.com/new_show.jpg',
      seasons: 1,
      cast: ['Actor X', 'Actor Y'],
      creator: 'Creator Z',
      episodes: 10,
    };

    const createdPrismaTvShow: TvShow = {
      id: 'tvshow-id-1',
      title: 'New TV Show Title',
      description: 'A description for a new show',
      releaseYear: 2024,
      genre: '["Drama","Mystery"]',
      imageUrl: 'http://example.com/new_show.jpg',
      seasons: 1,
      cast: '["Actor X","Actor Y"]',
      creator: 'Creator Z',
      episodes: 10,
      createdAt: new Date('2025-05-29T10:00:00.000Z'),
      updatedAt: new Date('2025-05-29T10:00:00.000Z'),
    };

    const expectedTvShowResponseDto = {
      id: 'tvshow-id-1',
      title: 'New TV Show Title',
      description: 'A description for a new show',
      releaseYear: 2024,
      genre: ['Drama', 'Mystery'],
      imageUrl: 'http://example.com/new_show.jpg',
      seasons: 1,
      cast: ['Actor X', 'Actor Y'],
      creator: 'Creator Z',
      episodes: 10,
      createdAt: new Date('2025-05-29T10:00:00.000Z'),
      updatedAt: new Date('2025-05-29T10:00:00.000Z'),
      comments: [],
      totalComments: 0,
      averageRating: null,
    };

    it('should successfully create a new TV show', async () => {
      mockPrismaService.tvShow.findUnique.mockResolvedValue(null);
      mockPrismaService.tvShow.create.mockResolvedValue(createdPrismaTvShow);
      mockPrismaService.comment.aggregate.mockResolvedValue({
        _count: { id: 0 },
        _avg: { rating: null },
      });

      const result = await service.create(createTvShowDto);

      expect(prisma.tvShow.findUnique).toHaveBeenCalledWith({
        where: { title: createTvShowDto.title },
      });
      expect(prisma.tvShow.create).toHaveBeenCalledWith({
        data: {
          ...createTvShowDto,
          genre: JSON.stringify(createTvShowDto.genre),
          cast: JSON.stringify(createTvShowDto.cast),
        },
      });
      expect(prisma.comment.aggregate).toHaveBeenCalledWith({
        _count: { id: true },
        _avg: { rating: true },
        where: { tvShowId: createdPrismaTvShow.id },
      });
      expect(result).toEqual(expectedTvShowResponseDto);
    });

    it('should throw ConflictException if TV show with title already exists', async () => {
      mockPrismaService.tvShow.findUnique.mockResolvedValue(createdPrismaTvShow);

      await expect(service.create(createTvShowDto)).rejects.toThrow(
        new ConflictException(`TV show with title "${createTvShowDto.title}" already exists.`),
      );
      expect(prisma.tvShow.findUnique).toHaveBeenCalledWith({
        where: { title: createTvShowDto.title },
      });
      expect(prisma.tvShow.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const tvShowId = 'test-tvshow-id';
    const existingPrismaTvShow: TvShow & { comments: Comment[] } = {
      id: tvShowId,
      title: 'Existing TV Show',
      description: 'An existing TV show description',
      releaseYear: 2018,
      genre: '["Sci-Fi"]',
      imageUrl: 'http://example.com/existing_show.jpg',
      seasons: 5,
      cast: '["Actor A", "Actor B"]',
      creator: 'Creator A',
      episodes: 50,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      comments: [
        {
          id: 'comment-ts-1',
          content: 'Amazing series!',
          author: 'Fanatic',
          rating: 10,
          avatar: null,
          createdAt: new Date(),
          movieId: null,
          tvShowId: tvShowId,
        },
        {
          id: 'comment-ts-2',
          content: 'Highly recommend!',
          author: 'Viewer',
          rating: 9,
          avatar: null,
          createdAt: new Date(),
          movieId: null,
          tvShowId: tvShowId,
        },
      ],
    };

    const expectedTvShowResponseDto = {
      id: tvShowId,
      title: 'Existing TV Show',
      description: 'An existing TV show description',
      releaseYear: 2018,
      genre: ['Sci-Fi'],
      imageUrl: 'http://example.com/existing_show.jpg',
      seasons: 5,
      cast: ['Actor A', 'Actor B'],
      creator: 'Creator A',
      episodes: 50,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      comments: [
        {
          id: 'comment-ts-1',
          content: 'Amazing series!',
          author: 'Fanatic',
          rating: 10,
          avatar: null,
          createdAt: expect.any(Date),
          movieId: null,
          tvShowId: tvShowId,
        },
        {
          id: 'comment-ts-2',
          content: 'Highly recommend!',
          author: 'Viewer',
          rating: 9,
          avatar: null,
          createdAt: expect.any(Date),
          movieId: null,
          tvShowId: tvShowId,
        },
      ],
      totalComments: 2,
      averageRating: 9.5,
    };

    it('should return a TV show if found', async () => {
      mockPrismaService.tvShow.findUnique.mockResolvedValue(existingPrismaTvShow);
      mockPrismaService.comment.aggregate.mockResolvedValue({
        _count: { id: 2 },
        _avg: { rating: 9.5 },
      });

      const result = await service.findOne(tvShowId);

      expect(prisma.tvShow.findUnique).toHaveBeenCalledWith({
        where: { id: tvShowId },
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
        where: { tvShowId: tvShowId },
      });
      expect(result).toEqual(expectedTvShowResponseDto);
    });

    it('should throw NotFoundException if TV show is not found', async () => {
      mockPrismaService.tvShow.findUnique.mockResolvedValue(null);

      await expect(service.findOne(tvShowId)).rejects.toThrow(
        new NotFoundException(`TV show with ID ${tvShowId} not found.`),
      );
      expect(prisma.tvShow.findUnique).toHaveBeenCalledWith({
        where: { id: tvShowId },
        include: {
          comments: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
      expect(prisma.comment.aggregate).not.toHaveBeenCalled();
    });

    it('should handle TV show with no comments gracefully', async () => {
      const tvShowWithoutComments: TvShow & { comments: Comment[] } = {
        ...existingPrismaTvShow,
        comments: [],
      };
      mockPrismaService.tvShow.findUnique.mockResolvedValue(tvShowWithoutComments);
      mockPrismaService.comment.aggregate.mockResolvedValue({
        _count: { id: 0 },
        _avg: { rating: null },
      });

      const result = await service.findOne(tvShowId);

      expect(result.comments).toEqual([]);
      expect(result.totalComments).toBe(0);
      expect(result.averageRating).toBeNull();
    });

    it('should handle genre/cast parsing errors gracefully', async () => {
        const tvShowWithBadJson: TvShow & { comments: Comment[] } = {
            ...existingPrismaTvShow,
            genre: '{invalid-json',
            cast: '["missing-quote]',
        };
        mockPrismaService.tvShow.findUnique.mockResolvedValue(tvShowWithBadJson);
        mockPrismaService.comment.aggregate.mockResolvedValue({
          _count: { id: 0 },
          _avg: { rating: null },
        });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const result = await service.findOne(tvShowId);

        expect(result.genre).toEqual([]);
        expect(result.cast).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
        consoleErrorSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    const page = 1;
    const limit = 10;
    const totalTvShows = 25;
    const mockPrismaTvShows: (TvShow & { comments: Comment[] })[] = [
      {
        id: 'tvshow-1', title: 'Show 1', description: 'desc1', releaseYear: 2020, genre: '["Action"]', imageUrl: 'url1', seasons: 1, cast: '["A1"]', creator: 'C1', episodes: 10, createdAt: new Date(), updatedAt: new Date(), comments: []
      },
      {
        id: 'tvshow-2', title: 'Show 2', description: 'desc2', releaseYear: 2021, genre: '["Comedy"]', imageUrl: 'url2', seasons: 2, cast: '["A2"]', creator: 'C2', episodes: 20, createdAt: new Date(), updatedAt: new Date(), comments: []
      },
    ];

    it('should return a paginated list of TV shows', async () => {
      mockPrismaService.tvShow.count.mockResolvedValue(totalTvShows);
      mockPrismaService.tvShow.findMany.mockResolvedValue(mockPrismaTvShows);
      mockPrismaService.comment.aggregate.mockImplementation((params) => {
        return Promise.resolve({
          _count: { id: 0 },
          _avg: { rating: null },
        });
      });

      const result = await service.findAll(page, limit);

      expect(prisma.tvShow.count).toHaveBeenCalledTimes(1);
      expect(prisma.tvShow.findMany).toHaveBeenCalledWith({
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
      expect(prisma.comment.aggregate).toHaveBeenCalledTimes(mockPrismaTvShows.length);

      expect(result.data.length).toBe(mockPrismaTvShows.length);
      expect(result.meta.total).toBe(totalTvShows);
      expect(result.meta.page).toBe(page);
      expect(result.meta.limit).toBe(limit);
      expect(result.meta.totalPages).toBe(Math.ceil(totalTvShows / limit));
    });

    it('should return empty data for an empty list of TV shows', async () => {
      mockPrismaService.tvShow.count.mockResolvedValue(0);
      mockPrismaService.tvShow.findMany.mockResolvedValue([]);
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

  describe('findCommentsForTvShow', () => {
    const tvShowId = 'tvshow-id-with-comments';
    const nonExistentTvShowId = 'non-existent-tvshow-id';
    const page = 1;
    const limit = 5;
    const totalComments = 12;

    const mockComments: Comment[] = [
      { id: 'ct1', content: 'TS C1', author: 'TS A1', rating: 10, avatar: null, createdAt: new Date(), movieId: null, tvShowId: tvShowId },
      { id: 'ct2', content: 'TS C2', author: 'TS A2', rating: 9, avatar: null, createdAt: new Date(), movieId: null, tvShowId: tvShowId },
      { id: 'ct3', content: 'TS C3', author: 'TS A3', rating: 8, avatar: null, createdAt: new Date(), movieId: null, tvShowId: tvShowId },
      { id: 'ct4', content: 'TS C4', author: 'TS A4', rating: 7, avatar: null, createdAt: new Date(), movieId: null, tvShowId: tvShowId },
      { id: 'ct5', content: 'TS C5', author: 'TS A5', rating: 6, avatar: null, createdAt: new Date(), movieId: null, tvShowId: tvShowId },
    ];

    it('should return paginated comments for a TV show', async () => {
      mockPrismaService.tvShow.findUnique.mockResolvedValue({ id: tvShowId });
      mockPrismaService.comment.count.mockResolvedValue(totalComments);
      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);

      const result = await service.findCommentsForTvShow(tvShowId, page, limit);

      expect(prisma.tvShow.findUnique).toHaveBeenCalledWith({ where: { id: tvShowId } });
      expect(prisma.comment.count).toHaveBeenCalledWith({ where: { tvShowId } });
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: { tvShowId },
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
      expect(result.data[0]).toHaveProperty('tvShowId');
    });

    it('should throw NotFoundException if the TV show does not exist', async () => {
      mockPrismaService.tvShow.findUnique.mockResolvedValue(null);

      await expect(service.findCommentsForTvShow(nonExistentTvShowId, page, limit)).rejects.toThrow(
        new NotFoundException(`TV Show with ID ${nonExistentTvShowId} not found.`),
      );
      expect(prisma.tvShow.findUnique).toHaveBeenCalledWith({ where: { id: nonExistentTvShowId } });
      expect(prisma.comment.count).not.toHaveBeenCalled();
      expect(prisma.comment.findMany).not.toHaveBeenCalled();
    });

    it('should return empty comments list if TV show exists but has no comments', async () => {
      mockPrismaService.tvShow.findUnique.mockResolvedValue({ id: tvShowId });
      mockPrismaService.comment.count.mockResolvedValue(0);
      mockPrismaService.comment.findMany.mockResolvedValue([]);

      const result = await service.findCommentsForTvShow(tvShowId, page, limit);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });
});