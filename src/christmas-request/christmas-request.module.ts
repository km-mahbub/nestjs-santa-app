import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChristmasRequestController } from './christmas-request.controller';
import { ChristmasRequestService } from './christmas-request.service';

@Module({
  imports: [HttpModule],
  controllers: [ChristmasRequestController],
  providers: [ChristmasRequestService],
})
export class ChristmasRequestModule {}
