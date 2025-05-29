import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max,
  ValidateIf,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment', example: 'This show is amazing!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The author of the comment', example: 'AnonymousReviewer' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'The rating given to the movie/TV show (0-10)', example: 8 })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(0, { message: 'Rating cannot be less than 0' })
  @Max(10, { message: 'Rating cannot be more than 10' })
  rating: number;

  @ApiPropertyOptional({ description: 'URL of the authors avatar image', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  avatar: string;

  @ApiPropertyOptional({
    description: 'The ID of the movie this comment belongs to. Required if tvShowId is not provided.',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf((object, value) => object.tvShowId === undefined || object.tvShowId === null)
  movieId?: string;

  @ApiPropertyOptional({
    description: 'The ID of the TV show this comment belongs to. Required if movieId is not provided.',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf((object, value) => object.movieId === undefined || object.movieId === null)
  tvShowId?: string;
}
