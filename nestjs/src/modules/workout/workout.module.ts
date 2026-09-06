import { Module } from '@nestjs/common';
import { WorkoutController } from './workout.controller';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { WorkoutService } from './workout.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WorkoutController, CalendarController],
  providers: [WorkoutService, CalendarService],
  exports: [WorkoutService]
})
export class WorkoutModule {}
