import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get API status and current server time' })
  @ApiOkResponse({
    description: 'Returns the current API status and the server\'s current date and time.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'API is running' },
        timestamp: { type: 'string', format: 'date-time', example: '2025-05-29T10:30:00.000Z' },
      },
    },
  })
  getApiStatus(): { status: string; timestamp: string } {
    return {
      status: 'API is running',
      timestamp: new Date().toISOString(),
    };
  }
}