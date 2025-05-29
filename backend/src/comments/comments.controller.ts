import { Controller, Post, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment for a movie or TV show' })
  @ApiBody({ type: CreateCommentDto, description: 'Comment object (must link to either movieId or tvShowId, but not both)' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.', type: CommentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request (validation error, e.g., missing fields, both IDs, or no IDs).' })
  @ApiResponse({ status: 404, description: 'Not Found (movie or TV show with given ID not found).' })
  async create(@Body() createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    return this.commentsService.createComment(createCommentDto);
  }
}
