import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsUrl,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ description: 'The title of the movie', example: 'The Martian' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'A brief description of the movie', example: 'An astronaut is presumed dead after being stranded on Mars.' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The release year of the movie', example: 2015 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @Min(1888)
  @Max(new Date().getFullYear() + 5)
  releaseYear: number;

  @ApiProperty({
    description: 'An array of genres for the movie (max 10)',
    example: ['Drama', 'Adventure', 'Comedy'],
    type: [String],
    minItems: 1,
    maxItems: 10,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true, message: 'Each genre in the array must not be empty' })
  @ArrayMinSize(1, { message: 'At least one genre is required' })
  @ArrayMaxSize(10, { message: 'Maximum of 10 genres allowed' })
  @Type(() => String)
  genre: string[];

  @ApiProperty({ description: 'URL of the movie poster image', example: 'https://example.com/inception_poster.jpg' })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl: string;

  @ApiProperty({
    description: 'An array of cast members for the movie (max 20)',
    example: ['Matt Damon', 'Jessica Chastain', 'Kristen Wiig'],
    type: [String],
    minItems: 1,
    maxItems: 20,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true, message: 'Each cast member in the array must not be empty' })
  @ArrayMinSize(1, { message: 'At least one cast member is required' })
  @ArrayMaxSize(20, { message: 'Maximum of 20 cast members allowed' })
  @Type(() => String)
  cast: string[];

  @ApiProperty({ description: 'The director of the movie', example: 'Ridley Scott' })
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty({ description: 'The duration of the movie in minutes', example: 144 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  duration: number;  
}
