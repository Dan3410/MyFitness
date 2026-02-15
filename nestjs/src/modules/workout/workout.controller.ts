import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutListItem } from 'src/models/workout';
import { WorkoutCategories } from 'src/models/workoutCategories';

@Controller("workout")
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) { }

  @Get('/categories')
  async getCategories(): Promise<WorkoutCategories[]> {
    let response = await this.workoutService.getCategories();
    return response
  }

  @Get('/list/:id')
  getWorkouts(
    @Param('id') id: string,
    @Query() query: Record<string, string>): Promise<WorkoutListItem[]> {
    return this.workoutService.getWorkouts(id, query.category);
  }

  @Delete('/:id')
  deleteWorkouts(
    @Param('id') id: string): Promise<WorkoutListItem[]> {
    return this.workoutService.deleteWorkout(id);
  }
}
