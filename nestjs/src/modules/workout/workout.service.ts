import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Workout, WorkoutListItem } from 'src/models/workout';
import { WorkoutCategories } from 'src/models/workoutCategories';

@Injectable()
export class WorkoutService {
  private workoutApiUrl = 'http://localhost:8080/workout';

  constructor(private readonly httpService: HttpService) {}

  async getCategories(): Promise<WorkoutCategories[]> {
    const response = await firstValueFrom(
      this.httpService.get<WorkoutCategories[]>(`${this.workoutApiUrl}/categories`),
    );
    return response.data;
  }

  async getWorkoutSteps(id: string): Promise<WorkoutListItem[]> {
    const response = await firstValueFrom(
      this.httpService.get<WorkoutListItem[]>(`${this.workoutApiUrl}/steps/${id}`),
    );
    return response.data;
  }

  async getWorkouts(
    id: string,
    category: string,
  ): Promise<WorkoutListItem[]> {
    const response = await firstValueFrom(
      this.httpService.get<WorkoutListItem[]>(
        `${this.workoutApiUrl}/list/${id}?category=${category}`,
      ),
    );
    return response.data;
  }

  async deleteWorkout(id: string): Promise<WorkoutListItem[]> {
    const response = await firstValueFrom(
      this.httpService.delete<WorkoutListItem[]>(`${this.workoutApiUrl}/${id}`),
    );
    return response.data;
  }

  async getWorkout(id: string): Promise<Workout> {
    const response = await firstValueFrom(
      this.httpService.get<Workout>(`${this.workoutApiUrl}/${id}`),
    );
    return response.data;
  }

  async editWorkout(id: string, workout: Workout): Promise<Workout> {
    const response = await firstValueFrom(
      this.httpService.put<Workout>(`${this.workoutApiUrl}/${id}`, workout),
    );
    return response.data;
  }
}
