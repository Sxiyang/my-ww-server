import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { EventService } from '../common/services/event.service';

@Module({
  controllers: [InterviewController],
  providers: [EventService],
})
export class InterviewModule {}
