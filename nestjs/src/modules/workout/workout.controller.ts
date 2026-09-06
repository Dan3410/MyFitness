import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
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
    @Query() query: Record<string, string>,
    @Headers('authorization') authorization: string): Promise<WorkoutListItem[]> {
    return this.workoutService.getWorkouts(id, query.category, authorization);
  }

  @Post('/:id')
  createWorkout(
    @Param('id') id: string,
    @Body() workout: Workout,
    @Headers('authorization') authorization: string,
  ): Promise<Workout> {
    return this.workoutService.createWorkout(id, workout, authorization);
  }

  @Put('/:id')
  editWorkout(
    @Param('id') id: string,
    @Body() workout: Workout,
    @Headers('authorization') authorization: string,
  ): Promise<Workout> {
    return this.workoutService.editWorkout(id, workout, authorization);
  }

  @Get("/:id")
  getWorkout(
    @Param('id') id: string,
    @Headers('authorization') authorization: string
  ): any{
    return this.workoutService.getWorkout(id, authorization);
  }

  @Delete('/:id')
  deleteWorkouts(
    @Param('id') id: string,
    @Headers('authorization') authorization: string): Promise<WorkoutListItem[]> {
    return this.workoutService.deleteWorkout(id, authorization);
  }
}
