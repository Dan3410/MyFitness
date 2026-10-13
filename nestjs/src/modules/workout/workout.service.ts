import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Workout, WorkoutListItem } from 'src/models/workout';
import { WorkoutCategories } from 'src/models/workoutCategories';
import type { PlannedWorkouts } from 'src/models/plannedWorkout';

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

  async shareWorkout(id: string, studentIds: string[], authorization: string): Promise<string[]> {
    const response = await firstValueFrom(
      this.httpService.post<string[]>(
        `${this.workoutApiUrl}/${encodeURIComponent(id)}/share`,
        { studentIds },
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async getSharedStudentIds(id: string, authorization: string): Promise<string[]> {
    const response = await firstValueFrom(
      this.httpService.get<string[]>(
        `${this.workoutApiUrl}/${encodeURIComponent(id)}/shared-students`,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async editWorkout(id: string, workout: Workout, authorization: string): Promise<Workout> {
    const response = await firstValueFrom(
      this.httpService.put<Workout>(`${this.workoutApiUrl}/${id}`, workout, { headers: { authorization } }),
    );
    return response.data;
  }

  async getCalendar(authorization: string): Promise<PlannedWorkouts> {
    const response = await firstValueFrom(
      this.httpService.get<PlannedWorkouts>(`${this.workoutApiUrl}/calendar`, { headers: { authorization } }),
    );
    return response.data;
  }

  async addToCalendar(date: string, workoutId: string, authorization: string): Promise<PlannedWorkouts> {
    const response = await firstValueFrom(
      this.httpService.post<PlannedWorkouts>(
        `${this.workoutApiUrl}/calendar`, { date, workoutId }, { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async removeFromCalendar(date: string, workoutId: string, authorization: string): Promise<PlannedWorkouts> {
    const response = await firstValueFrom(
      this.httpService.delete<PlannedWorkouts>(
        `${this.workoutApiUrl}/calendar/${date}/${workoutId}`, { headers: { authorization } },
      ),
    );
    return response.data;
  }
}
