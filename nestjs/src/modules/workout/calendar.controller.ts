import { Body, Controller, Delete, Get, Headers, Param, Post, Query } from '@nestjs/common';
import type { PlannedWorkouts } from 'src/models/plannedWorkout';
import { CalendarService } from './calendar.service';

@Controller('workout/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  getCalendar(
    @Headers('authorization') authorization: string,
    @Query('month') month?: string,
  ): Promise<PlannedWorkouts> {
    return this.calendarService.getCalendar(authorization, month);
  }

  @Post()
  addToCalendar(
    @Body() request: { date: string; workoutId: string },
    @Headers('authorization') authorization: string,
  ): Promise<PlannedWorkouts> {
    return this.calendarService.addToCalendar(request.date, request.workoutId, authorization);
  }

  @Delete(':date/:workoutId')
  removeFromCalendar(
    @Param('date') date: string,
    @Param('workoutId') workoutId: string,
    @Headers('authorization') authorization: string,
  ): Promise<PlannedWorkouts> {
    return this.calendarService.removeFromCalendar(date, workoutId, authorization);
  }
}
