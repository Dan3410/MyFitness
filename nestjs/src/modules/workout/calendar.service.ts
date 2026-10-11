import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import type { PlannedWorkouts } from 'src/models/plannedWorkout';

@Injectable()
export class CalendarService {
  private readonly calendarApiUrl = 'http://localhost:8080/workout/calendar';

  constructor(private readonly httpService: HttpService) {}

  async getCalendar(authorization: string, month?: string): Promise<PlannedWorkouts> {
    const monthQuery = month ? `?month=${encodeURIComponent(month)}` : '';
    const response = await firstValueFrom(
      this.httpService.get<PlannedWorkouts>(`${this.calendarApiUrl}${monthQuery}`, { headers: { authorization } }),
    );
    return response.data;
  }

  async addToCalendar(date: string, workoutId: string, authorization: string): Promise<PlannedWorkouts> {
    const response = await firstValueFrom(
      this.httpService.post<PlannedWorkouts>(
        this.calendarApiUrl,
        { date, workoutId },
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async removeFromCalendar(date: string, workoutId: string, authorization: string): Promise<PlannedWorkouts> {
    const response = await firstValueFrom(
      this.httpService.delete<PlannedWorkouts>(
        `${this.calendarApiUrl}/${date}/${workoutId}`,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }
}
