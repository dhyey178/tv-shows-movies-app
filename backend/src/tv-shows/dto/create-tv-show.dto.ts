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

export class CreateTvShowDto {
  @ApiProperty({ description: 'The title of the TV show', example: 'The Witcher' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'A brief description of the TV show', example: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The release year of the TV show', example: 2019 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @Min(1888)
  @Max(new Date().getFullYear() + 5)
  releaseYear: number;
  
  @ApiProperty({
    description: 'An array of genres for the TV show (max 10)',
    example: ['Fantasy', 'Adventure'],
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

  @ApiPropertyOptional({ description: 'URL of the TV show poster image', example: 'https://example.com/witcher_poster.jpg' })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl: string;

  @ApiProperty({ description: 'No of Seasons of the TV Show', example: 6 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  seasons: number;

  @ApiProperty({
    description: 'An array of cast members for the TV show (max 20)',
    example: ['Henry Cavill', 'Freya Allan', 'Anya Chalotra'],
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

  @ApiProperty({ description: 'The creator(s) of the TV show', example: 'Lauren Schmidt Hissrich' })
  @IsString()
  @IsNotEmpty()
  creator: string;

  @ApiProperty({ description: 'The total number of episodes in the TV show', example: 24 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  episodes: number;
}
