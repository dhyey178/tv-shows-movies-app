import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';

export class MovieResponseDto {
  @ApiProperty({ description: 'The unique ID of the movie', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ description: 'The title of the movie', example: 'The Martian' })
  title: string;

  @ApiPropertyOptional({ description: 'A brief description of the movie', example: 'An astronaut is presumed dead after being stranded on Mars.' })
  description: string;

  @ApiProperty({ description: 'The release year of the movie', example: 2015 })
  releaseYear: number;

  @ApiProperty({
    description: 'An array of genres for the movie',
    example: ['Drama', 'Adventure'],
    type: [String],
  })
  genre: string[];

  @ApiProperty({ description: 'URL of the movie poster image', example: 'https://example.com/the_martian_poster.jpg' })
  imageUrl: string;

  @ApiProperty({
    description: 'An array of cast members for the movie',
    example: ['Matt Damon', 'Jessica Chastain'],
    type: [String],
  })
  cast: string[];

  @ApiProperty({ description: 'The director of the movie', example: 'Ridley Scott' })
  director: string;

  @ApiProperty({ description: 'The duration of the movie in minutes', example: 144 })
  duration: number;

  @ApiProperty({ description: 'The date and time the movie record was created', format: 'date-time', example: '2025-05-29T09:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'The date and time the movie record was last updated', format: 'date-time', example: '2025-05-29T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Latest comments for the movie (up to 5)',
    type: [CommentResponseDto],
  })
  comments: CommentResponseDto[];

  @ApiProperty({ description: 'Total number of comments for this movie', example: 42, nullable: true })
  totalComments: number;

  @ApiPropertyOptional({ description: 'Average rating of the movie based on comments (null if no ratings)', example: 8.5, nullable: true })
  averageRating: number | null;
}