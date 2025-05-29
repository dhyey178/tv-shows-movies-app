import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';


@ApiTags('Movies')
@Controller('movies')
@ApiExtraModels(MovieResponseDto, CommentResponseDto, PaginatedResponseDto)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of movies with their latest 5 comments' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved movies.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(MovieResponseDto) },
            },
          },
        },
      ],
    },
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<MovieResponseDto>> {
    return this.moviesService.findAll(paginationQuery.page!, paginationQuery.limit!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single movie by ID with its latest 5 comments' })
  @ApiParam({ name: 'id', description: 'The ID of the movie', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved movie.', type: MovieResponseDto })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async findOne(@Param('id') id: string): Promise<MovieResponseDto> {
    const movie = await this.moviesService.findOne(id);
    return movie;
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get paginated comments for a specific movie' })
  @ApiParam({ name: 'id', description: 'The ID of the movie', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved comments.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CommentResponseDto) },
            },
          },
        },
      ],
    },
  })
  async findMovieComments(
    @Param('id') movieId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<CommentResponseDto>> {
    return this.moviesService.findCommentsForMovie(movieId, paginationQuery.page!, paginationQuery.limit!);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'The movie has been successfully created.', type: MovieResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request (validation error).' })
  @ApiResponse({ status: 409, description: 'Conflict (movie with title already exists).' })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    return this.moviesService.create(createMovieDto);
  }
}
