import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Movie, Comment } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';


@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  private async _transformMovieToDto(movie: Movie & { comments?: Comment[] }): Promise<MovieResponseDto> {
    let parsedGenre: string[] = [];
    if (movie.genre) {
      try {
        parsedGenre = JSON.parse(movie.genre as string);
      } catch (e) {
        console.error(`Error parsing genre for movie ID ${movie.id}:`, e);
        parsedGenre = [];
      }
    }

    let parsedCast: string[] = [];
    if (movie.cast) {
      try {
        parsedCast = JSON.parse(movie.cast as string);
      } catch (e) {
        console.error(`Error parsing cast for movie ID ${movie.id}:`, e);
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
        movieId: movie.id,
      },
    });

    const totalComments = commentsAggregate._count.id;
    const averageRating = commentsAggregate._avg.rating !== null
      ? parseFloat(commentsAggregate._avg.rating.toFixed(1))
      : null;
    return {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      releaseYear: movie.releaseYear,
      genre: parsedGenre,
      imageUrl: movie.imageUrl,
      cast: parsedCast,
      director: movie.director,
      duration: movie.duration,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
      comments: movie.comments ? movie.comments.map(comment => ({
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

  async findAll(page: number, limit: number): Promise<PaginatedResponseDto<MovieResponseDto>> {
    const offset = (page - 1) * limit;
    const totalItems = await this.prisma.movie.count();

    const movies = await this.prisma.movie.findMany({
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

    const moviesWithAggregates: MovieResponseDto[] = await Promise.all(
      movies.map(movie => this._transformMovieToDto(movie))
    );

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: moviesWithAggregates,
      meta: {
        total: totalItems,
        page: page,
        limit: limit,
        totalPages: totalPages,
      },
    };
  }

  async findOne(id: string): Promise<MovieResponseDto> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }

    return this._transformMovieToDto(movie);
  }

  async findCommentsForMovie(
    movieId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<CommentResponseDto>> { 
    const movieExists = await this.prisma.movie.findUnique({ where: { id: movieId } });
    if (!movieExists) {
      throw new NotFoundException(`Movie with ID ${movieId} not found.`);
    }

    const offset = (page - 1) * limit;
    const totalCommentsCount = await this.prisma.comment.count({ where: { movieId } });

    const comments = await this.prisma.comment.findMany({
      where: { movieId },
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

  async create(createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    const existingMovie = await this.prisma.movie.findUnique({
      where: { title: createMovieDto.title },
    });

    if (existingMovie) {
      throw new ConflictException(`Movie with title "${createMovieDto.title}" already exists.`);
    }

    const { genre, cast, ...restOfMovieData } = createMovieDto;

    const genreJsonString = JSON.stringify(genre);
    const castJsonString = JSON.stringify(cast);

    const createdMovie = await this.prisma.movie.create({
      data: {
        ...restOfMovieData,
        genre: genreJsonString,
        cast: castJsonString,
      },
    });
    return this._transformMovieToDto(createdMovie);
  }
}
