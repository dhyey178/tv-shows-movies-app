import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '@prisma/client';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    const { content, author, rating, avatar, movieId, tvShowId } = createCommentDto;
    if ((movieId && tvShowId) || (!movieId && !tvShowId)) {
      throw new BadRequestException('A comment must be associated with either a movie OR a TV show, but not both.');
    }

    let createdComment: Comment;
    
    if (movieId) {
      const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${movieId} not found.`);
      }
      createdComment = await this.prisma.comment.create({
        data: {
          content,
          author,
          rating,
          avatar,
          movie: { connect: { id: movieId } },
        },
      });
    }
    else if (tvShowId) {
      const tvShow = await this.prisma.tvShow.findUnique({ where: { id: tvShowId } });
      if (!tvShow) {
        throw new NotFoundException(`TV Show with ID ${tvShowId} not found.`);
      }
      createdComment = await this.prisma.comment.create({
        data: {
          content,
          author,
          rating,
          avatar,
          tvShow: { connect: { id: tvShowId } },
        },
      });
    } else {
      throw new BadRequestException('Invalid comment association provided.');
    }
    return {
      id: createdComment.id,
      content: createdComment.content,
      author: createdComment.author,
      rating: createdComment.rating,
      avatar: createdComment.avatar,
      createdAt: createdComment.createdAt,
      movieId: createdComment.movieId,
      tvShowId: createdComment.tvShowId,
    };
  }
}
