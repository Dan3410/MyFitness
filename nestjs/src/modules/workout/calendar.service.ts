import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CalendarService {
  private readonly calendarApiUrl = 'http://localhost:8080/workout/calendar';

  constructor(private readonly httpService: HttpService) {}

  async getCalendar(authorization: string): Promise<Record<string, string[]>> {
    const response = await firstValueFrom(
      this.httpService.get<Record<string, string[]>>(this.calendarApiUrl, { headers: { authorization } }),
    );
    return response.data;
  }

  async addToCalendar(date: string, workoutId: string, authorization: string): Promise<Record<string, string[]>> {
    const response = await firstValueFrom(
      this.httpService.post<Record<string, string[]>>(
        this.calendarApiUrl,
        { date, workoutId },
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async removeFromCalendar(date: string, workoutId: string, authorization: string): Promise<Record<string, string[]>> {
    const response = await firstValueFrom(
      this.httpService.delete<Record<string, string[]>>(
        `${this.calendarApiUrl}/${date}/${workoutId}`,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }
}
