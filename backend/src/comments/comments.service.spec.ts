import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Comment } from '@prisma/client';

const mockPrismaService = {
  comment: {
    create: jest.fn(),
  },
  movie: {
    findUnique: jest.fn(),
  },
  tvShow: {
    findUnique: jest.fn(),
  },
};

describe('CommentsService', () => {
  let service: CommentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
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

  describe('createComment', () => {
    const createCommentDto = {
      content: 'Great content!',
      author: 'Test Author',
      rating: 8,
      avatar: 'http://example.com/avatar.jpg',
      movieId: 'movie-id-123',
      tvShowId: undefined,
    };

    const createdPrismaComment: Comment = {
      id: 'comment-id-1',
      content: 'Great content!',
      author: 'Test Author',
      rating: 8,
      avatar: 'http://example.com/avatar.jpg',
      createdAt: new Date('2025-05-29T10:00:00.000Z'),
      movieId: 'movie-id-123',
      tvShowId: null,
    };

    const expectedCommentResponseDto = {
      id: 'comment-id-1',
      content: 'Great content!',
      author: 'Test Author',
      rating: 8,
      avatar: 'http://example.com/avatar.jpg',
      createdAt: new Date('2025-05-29T10:00:00.000Z'),
      movieId: 'movie-id-123',
      tvShowId: null,
    };

    it('should successfully create a comment for a movie', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue({ id: createCommentDto.movieId });
      mockPrismaService.tvShow.findUnique.mockResolvedValue(null);
      mockPrismaService.comment.create.mockResolvedValue(createdPrismaComment);

      const result = await service.createComment(createCommentDto);

      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { id: createCommentDto.movieId },
      });
      expect(prisma.tvShow.findUnique).not.toHaveBeenCalled();
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: createCommentDto.content,
          author: createCommentDto.author,
          rating: createCommentDto.rating,
          avatar: createCommentDto.avatar,
          movie: { connect: { id: createCommentDto.movieId } },
        },
      });
      expect(result).toEqual(expectedCommentResponseDto);
    });

    it('should successfully create a comment for a TV show', async () => {
      const createCommentForTvShowDto = {
        ...createCommentDto,
        movieId: undefined,
        tvShowId: 'tvshow-id-456',
      };
      const createdPrismaCommentForTvShow: Comment = {
        ...createdPrismaComment,
        movieId: null,
        tvShowId: 'tvshow-id-456',
      };
      const expectedCommentResponseForTvShowDto = {
        ...expectedCommentResponseDto,
        movieId: null,
        tvShowId: 'tvshow-id-456',
      };

      mockPrismaService.movie.findUnique.mockResolvedValue(null);
      mockPrismaService.tvShow.findUnique.mockResolvedValue({ id: createCommentForTvShowDto.tvShowId });
      mockPrismaService.comment.create.mockResolvedValue(createdPrismaCommentForTvShow);

      const result = await service.createComment(createCommentForTvShowDto);

      expect(prisma.movie.findUnique).not.toHaveBeenCalled();
      expect(prisma.tvShow.findUnique).toHaveBeenCalledWith({
        where: { id: createCommentForTvShowDto.tvShowId },
      });
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: createCommentForTvShowDto.content,
          author: createCommentForTvShowDto.author,
          rating: createCommentForTvShowDto.rating,
          avatar: createCommentForTvShowDto.avatar,
          tvShow: { connect: { id: createCommentForTvShowDto.tvShowId } },
        },
      });
      expect(result).toEqual(expectedCommentResponseForTvShowDto);
    });

    it('should throw BadRequestException if neither movieId nor tvShowId is provided', async () => {
      const invalidDto = {
        ...createCommentDto,
        movieId: undefined,
        tvShowId: undefined,
      };

      await expect(service.createComment(invalidDto)).rejects.toThrow( 
        new BadRequestException('A comment must be associated with either a movie OR a TV show, but not both.'),
      );
      expect(prisma.movie.findUnique).not.toHaveBeenCalled();
      expect(prisma.tvShow.findUnique).not.toHaveBeenCalled();
      expect(prisma.comment.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if both movieId and tvShowId are provided', async () => {
      const invalidDto = {
        ...createCommentDto,
        tvShowId: 'tvshow-id-456',
      };

      await expect(service.createComment(invalidDto)).rejects.toThrow(
        new BadRequestException('A comment must be associated with either a movie OR a TV show, but not both.'),
      );
      expect(prisma.movie.findUnique).not.toHaveBeenCalled();
      expect(prisma.tvShow.findUnique).not.toHaveBeenCalled();
      expect(prisma.comment.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if movieId is provided but movie does not exist', async () => {
      mockPrismaService.movie.findUnique.mockResolvedValue(null); 

      await expect(service.createComment(createCommentDto)).rejects.toThrow( 
        new NotFoundException(`Movie with ID ${createCommentDto.movieId} not found.`),
      );
      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { id: createCommentDto.movieId },
      });
      expect(prisma.comment.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if tvShowId is provided but TV show does not exist', async () => {
      const createCommentForTvShowDto = {
        ...createCommentDto,
        movieId: undefined,
        tvShowId: 'tvshow-id-456',
      };
      mockPrismaService.tvShow.findUnique.mockResolvedValue(null);

      await expect(service.createComment(createCommentForTvShowDto)).rejects.toThrow(
        new NotFoundException(`TV Show with ID ${createCommentForTvShowDto.tvShowId} not found.`),
      );
      expect(prisma.tvShow.findUnique).toHaveBeenCalledWith({
        where: { id: createCommentForTvShowDto.tvShowId },
      });
      expect(prisma.comment.create).not.toHaveBeenCalled();
    });
  });
});