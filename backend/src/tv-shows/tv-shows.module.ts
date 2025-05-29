import { Module } from '@nestjs/common';
import { TvShowsController } from './tv-shows.controller';
import { TvShowsService } from './tv-shows.service';

@Module({
  controllers: [TvShowsController],
  providers: [TvShowsService],
})
export class TvShowsModule {}
