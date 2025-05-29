import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';

export class TvShowResponseDto {
  @ApiProperty({ description: 'The unique ID of the TV show', format: 'uuid', example: 'd1e2f3g4-h5i6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ description: 'The title of the TV show', example: 'The Witcher' })
  title: string;

  @ApiPropertyOptional({ description: 'A brief description of the TV show', example: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.' })
  description: string;

  @ApiProperty({ description: 'The release year of the TV show', example: 2019 })
  releaseYear: number;

  @ApiProperty({
    description: 'An array of genres for the TV show',
    example: ['Fantasy', 'Adventure'],
    type: [String],
  })
  genre: string[];

  @ApiProperty({ description: 'URL of the TV show poster image', example: 'https://example.com/witcher_poster.jpg' })
  imageUrl: string;

  @ApiProperty({ description: 'Number of seasons of the TV Show', example: 3 })
  seasons: number;

  @ApiProperty({
    description: 'An array of cast members for the TV show',
    example: ['Henry Cavill', 'Freya Allan'],
    type: [String],
  })
  cast: string[];

  @ApiProperty({ description: 'The creator(s) of the TV show', example: 'Lauren Schmidt Hissrich' })
  creator: string;

  @ApiProperty({ description: 'The total number of episodes in the TV show', example: 24 })
  episodes: number;

  @ApiProperty({ description: 'The date and time the TV show record was created', format: 'date-time', example: '2025-05-29T09:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'The date and time the TV show record was last updated', format: 'date-time', example: '2025-05-29T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Latest comments for the TV show (up to 5)',
    type: [CommentResponseDto],
  })
  comments: CommentResponseDto[];

  @ApiProperty({ description: 'Total number of comments for this TV show', example: 30, nullable: true })
  totalComments: number;

  @ApiPropertyOptional({ description: 'Average rating of the TV show based on comments (null if no ratings)', example: 7.8, nullable: true })
  averageRating: number | null;
}