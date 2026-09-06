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

  async getWorkouts(
    id: string,
    category: string,
    authorization: string,
  ): Promise<WorkoutListItem[]> {
    const response = await firstValueFrom(
      this.httpService.get<WorkoutListItem[]>(
        `${this.workoutApiUrl}/list/${id}?category=${category}`,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async deleteWorkout(id: string, authorization: string): Promise<WorkoutListItem[]> {
    const response = await firstValueFrom(
      this.httpService.delete<WorkoutListItem[]>(`${this.workoutApiUrl}/${id}`, { headers: { authorization } }),
    );
    return response.data;
  }

  async getWorkout(id: string, authorization: string): Promise<Workout> {
    const response = await firstValueFrom(
      this.httpService.get<Workout>(`${this.workoutApiUrl}/${id}`, { headers: { authorization } }),
    );
    return response.data;
  }

  async createWorkout(id: string, workout: Workout, authorization: string): Promise<Workout> {
    const response = await firstValueFrom(
      this.httpService.post<Workout>(`${this.workoutApiUrl}/${id}`, workout, { headers: { authorization } }),
    );
    return response.data;
  }

  async editWorkout(id: string, workout: Workout, authorization: string): Promise<Workout> {
    const response = await firstValueFrom(
      this.httpService.put<Workout>(`${this.workoutApiUrl}/${id}`, workout, { headers: { authorization } }),
    );
    return response.data;
  }

  async getCalendar(authorization: string): Promise<Record<string, string[]>> {
    const response = await firstValueFrom(
      this.httpService.get<Record<string, string[]>>(`${this.workoutApiUrl}/calendar`, { headers: { authorization } }),
    );
    return response.data;
  }

  async addToCalendar(date: string, workoutId: string, authorization: string): Promise<Record<string, string[]>> {
    const response = await firstValueFrom(
      this.httpService.post<Record<string, string[]>>(
        `${this.workoutApiUrl}/calendar`, { date, workoutId }, { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async removeFromCalendar(date: string, workoutId: string, authorization: string): Promise<Record<string, string[]>> {
    const response = await firstValueFrom(
      this.httpService.delete<Record<string, string[]>>(
        `${this.workoutApiUrl}/calendar/${date}/${workoutId}`, { headers: { authorization } },
      ),
    );
    return response.data;
  }
}
