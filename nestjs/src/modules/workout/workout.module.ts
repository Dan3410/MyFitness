import { Module } from '@nestjs/common';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WorkoutController],
  providers: [WorkoutService],
  exports: [WorkoutService]
})
export class WorkoutModule {}
