import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import type { WorkoutListItem, Workout } from 'src/models/workout';
import type { WorkoutCategories } from 'src/models/workoutCategories';

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

  @Get("/:id")
  getWorkout(
    @Param('id') id: string
  ): any{
    return this.workoutService.getWorkout(id);
  }

  @Post('/:id')
  createWorkout(
    @Param('id') id: string,
    @Body() workout: Workout,
  ): Promise<Workout> {
    return this.workoutService.createWorkout(id, workout);
  }

  @Put('/:id')
  editWorkout(
    @Param('id') id: string,
    @Body() workout: Workout,
  ): Promise<Workout> {
    return this.workoutService.editWorkout(id, workout);
  }

  @Delete('/:id')
  deleteWorkouts(
    @Param('id') id: string): Promise<WorkoutListItem[]> {
    return this.workoutService.deleteWorkout(id);
  }
}
