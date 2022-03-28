import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FipeService } from './fipe.service';
import { FipeController } from './fipe.controller';

@Module({
  imports: [HttpModule],
  providers: [FipeService],
  controllers: [FipeController],
})
export class FipeModule {}
