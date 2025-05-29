import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TvShowsService } from './tv-shows.service';
import { CreateTvShowDto } from './dto/create-tv-show.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { TvShowResponseDto } from './dto/tv-show-response.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';


@ApiTags('TV Shows')
@Controller('tv-shows')
@ApiExtraModels(TvShowResponseDto, CommentResponseDto, PaginatedResponseDto)
export class TvShowsController {
  constructor(private readonly tvShowsService: TvShowsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of TV shows with their latest 5 comments' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved TV shows.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(TvShowResponseDto) },
            },
          },
        },
      ],
    },
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<TvShowResponseDto>> {
    return this.tvShowsService.findAll(paginationQuery.page!, paginationQuery.limit!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single TV show by ID with its latest 5 comments' })
  @ApiParam({ name: 'id', description: 'The ID of the TV show', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved TV show.', type: TvShowResponseDto })
  @ApiResponse({ status: 404, description: 'TV Show not found.' })
  async findOne(@Param('id') id: string): Promise<TvShowResponseDto> {
    return this.tvShowsService.findOne(id);
  }


  @Get(':id/comments')
  @ApiOperation({ summary: 'Get paginated comments for a specific TV show' })
  @ApiParam({ name: 'id', description: 'The ID of the TV show', type: String })
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
  async findTvShowComments(
    @Param('id') tvShowId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<CommentResponseDto>> {
    return this.tvShowsService.findCommentsForTvShow(tvShowId, paginationQuery.page!, paginationQuery.limit!);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new TV show' })
  @ApiResponse({ status: 201, description: 'The TV show has been successfully created.', type: TvShowResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request (validation error).' })
  @ApiResponse({ status: 409, description: 'Conflict (TV show with title already exists).' })
  async create(@Body() createTvShowDto: CreateTvShowDto): Promise<TvShowResponseDto> {
    return this.tvShowsService.create(createTvShowDto);
  }
}
