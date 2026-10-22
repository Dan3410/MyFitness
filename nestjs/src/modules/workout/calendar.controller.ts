import { Body, Controller, Delete, Get, Headers, Param, Post, Query } from '@nestjs/common';
import type { CalendarEvent, PlannedWorkouts } from 'src/models/plannedWorkout';
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
    @Body() request: { date: string; workoutId: string; time?: string },
    @Headers('authorization') authorization: string,
  ): Promise<PlannedWorkouts> {
    return this.calendarService.addToCalendar(request.date, request.workoutId, authorization, request.time);
  }

  @Delete(':date/:workoutId')
  removeFromCalendar(
    @Param('date') date: string,
    @Param('workoutId') workoutId: string,
    @Headers('authorization') authorization: string,
  ): Promise<PlannedWorkouts> {
    return this.calendarService.removeFromCalendar(date, workoutId, authorization);
  }

  @Get('events')
  getEvents(
    @Headers('authorization') authorization: string,
    @Query('month') month?: string,
  ): Promise<CalendarEvent[]> {
    return this.calendarService.getEvents(authorization, month);
  }

  @Post('events')
  createEvent(
    @Body() request: { date: string; studentId: string; time?: string; workoutId?: string },
    @Headers('authorization') authorization: string,
  ): Promise<CalendarEvent> {
    return this.calendarService.createEvent(
      request.date,
      request.studentId,
      authorization,
      request.time,
      request.workoutId,
    );
  }

  @Delete('events/:eventId')
  cancelEvent(
    @Param('eventId') eventId: string,
    @Headers('authorization') authorization: string,
  ): Promise<void> {
    return this.calendarService.cancelEvent(eventId, authorization);
  }
}
