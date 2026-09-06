import { Body, Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('workout/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  getCalendar(@Headers('authorization') authorization: string): Promise<Record<string, string[]>> {
    return this.calendarService.getCalendar(authorization);
  }

  @Post()
  addToCalendar(
    @Body() request: { date: string; workoutId: string },
    @Headers('authorization') authorization: string,
  ): Promise<Record<string, string[]>> {
    return this.calendarService.addToCalendar(request.date, request.workoutId, authorization);
  }

  @Delete(':date/:workoutId')
  removeFromCalendar(
    @Param('date') date: string,
    @Param('workoutId') workoutId: string,
    @Headers('authorization') authorization: string,
  ): Promise<Record<string, string[]>> {
    return this.calendarService.removeFromCalendar(date, workoutId, authorization);
  }
}
