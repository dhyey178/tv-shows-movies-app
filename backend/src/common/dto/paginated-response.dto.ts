import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class PaginationMetaData {
  @ApiProperty({ description: 'Total number of items available', example: 120 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages available', example: 12 })
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ type: 'array', description: 'Array of data items for the current page' })
  @Type(() => Object)
  data: T[];

  @ApiProperty({ type: () => PaginationMetaData, description: 'Pagination metadata' })
  @Type(() => PaginationMetaData)
  meta: PaginationMetaData;
}