import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TvShow, Comment } from '@prisma/client';
import { CreateTvShowDto } from './dto/create-tv-show.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { TvShowResponseDto } from './dto/tv-show-response.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';


@Injectable()
export class TvShowsService {
  constructor(private prisma: PrismaService) {}

  private async _transformTvShowToDto(tvShow: TvShow & { comments?: Comment[] }): Promise<TvShowResponseDto> {
    let parsedGenre: string[] = [];
    if (tvShow.genre) {
      try {
        parsedGenre = JSON.parse(tvShow.genre as string);
      } catch (e) {
        console.error(`Error parsing genre for TV show ID ${tvShow.id}:`, e);
        parsedGenre = [];
      }
    }

    let parsedCast: string[] = [];
    if (tvShow.cast) {
      try {
        parsedCast = JSON.parse(tvShow.cast as string);
      } catch (e) {
        console.error(`Error parsing cast for TV show ID ${tvShow.id}:`, e);
        parsedCast = [];
      }
    }

    const commentsAggregate = await this.prisma.comment.aggregate({
      _count: {
        id: true,
      },
      _avg: {
        rating: true,
      },
      where: {
        tvShowId: tvShow.id,
      },
    });

    const totalComments = commentsAggregate._count.id;
    const averageRating = commentsAggregate._avg.rating !== null
      ? parseFloat(commentsAggregate._avg.rating.toFixed(1))
      : null;

    return {
      id: tvShow.id,
      title: tvShow.title,
      description: tvShow.description,
      releaseYear: tvShow.releaseYear,
      genre: parsedGenre,
      imageUrl: tvShow.imageUrl,
      seasons: tvShow.seasons,
      cast: parsedCast,
      creator: tvShow.creator,
      episodes: tvShow.episodes,
      createdAt: tvShow.createdAt,
      updatedAt: tvShow.updatedAt,
      comments: tvShow.comments ? tvShow.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: comment.author,
        rating: comment.rating,
        avatar: comment.avatar,
        createdAt: comment.createdAt,
        movieId: comment.movieId,
        tvShowId: comment.tvShowId,
      })) : [],
      totalComments,
      averageRating,
    };
  }

  async findAll(page: number, limit: number): Promise<PaginatedResponseDto<TvShowResponseDto>> {
    const offset = (page - 1) * limit;
    const totalItems = await this.prisma.tvShow.count();

    const tvShows = await this.prisma.tvShow.findMany({
      skip: offset,
      take: limit,
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const tvShowsWithAggregates: TvShowResponseDto[] = await Promise.all(
      tvShows.map(tvShow => this._transformTvShowToDto(tvShow))
    );

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: tvShowsWithAggregates,
      meta: {
        total: totalItems,
        page: page,
        limit: limit,
        totalPages: totalPages,
      },
    };
  }

  async findOne(id: string): Promise<TvShowResponseDto> {
    const tvShow = await this.prisma.tvShow.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!tvShow) {
      throw new NotFoundException(`TV show with ID ${id} not found.`);
    }

    return this._transformTvShowToDto(tvShow);
  }

  async findCommentsForTvShow(
    tvShowId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<CommentResponseDto>> {
    const tvShowExists = await this.prisma.tvShow.findUnique({ where: { id: tvShowId } });
    if (!tvShowExists) {
      throw new NotFoundException(`TV Show with ID ${tvShowId} not found.`);
    }

    const offset = (page - 1) * limit;
    const totalCommentsCount = await this.prisma.comment.count({ where: { tvShowId } });

    const comments = await this.prisma.comment.findMany({
      where: { tvShowId },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalPages = Math.ceil(totalCommentsCount / limit);

    const transformedComments: CommentResponseDto[] = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: comment.author,
      rating: comment.rating,
      avatar: comment.avatar,
      createdAt: comment.createdAt,
      movieId: comment.movieId,
      tvShowId: comment.tvShowId,
    }));

    return {
      data: transformedComments,
      meta: {
        total: totalCommentsCount,
        page: page,
        limit: limit,
        totalPages: totalPages,
      },
    };
  }

  async create(createTvShowDto: CreateTvShowDto): Promise<TvShowResponseDto> {
    const existingTvShow = await this.prisma.tvShow.findUnique({
      where: { title: createTvShowDto.title },
    });

    if (existingTvShow) {
      throw new ConflictException(`TV show with title "${createTvShowDto.title}" already exists.`);
    }

    const { genre, cast, ...restOfTvShowData } = createTvShowDto;

    const genreJsonString = JSON.stringify(genre);
    const castJsonString = JSON.stringify(cast);

    const createdTvShow = await this.prisma.tvShow.create({
      data: {
        ...restOfTvShowData,
        genre: genreJsonString,
        cast: castJsonString,
      },
    });

    return this._transformTvShowToDto(createdTvShow)
  }
}
