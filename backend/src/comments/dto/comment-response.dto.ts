import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ description: 'The unique ID of the comment', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ description: 'The content of the comment', example: 'This movie was captivating!' })
  content: string;

  @ApiProperty({ description: 'The author of the comment', example: 'MovieLover123' })
  author: string;

  @ApiProperty({ description: 'The rating given to the media (0-10)', example: 9 })
  rating: number;

  @ApiProperty({ description: 'URL of the author\'s avatar image', example: 'https://example.com/avatar_reviewer.jpg', nullable: true })
  avatar: string | null;

  @ApiProperty({ description: 'The date and time the comment was created', format: 'date-time', example: '2025-05-29T09:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'The ID of the movie this comment belongs to (if applicable)', format: 'uuid', example: 'b1c2d3e4-f5g6-7890-1234-567890abcdef', nullable: true })
  movieId: string | null;

  @ApiProperty({ description: 'The ID of the TV show this comment belongs to (if applicable)', format: 'uuid', example: 'c1d2e3f4-g5h6-7890-1234-567890abcdef', nullable: true })
  tvShowId: string | null;
}