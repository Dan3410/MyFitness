import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

describe('CalendarController', () => {
  let calendarController: CalendarController;
  let calendarService: {
    getCalendar: jest.Mock;
    addToCalendar: jest.Mock;
    removeFromCalendar: jest.Mock;
    getEvents: jest.Mock;
    createEvent: jest.Mock;
    cancelEvent: jest.Mock;
  };

  beforeEach(async () => {
    calendarService = {
      getCalendar: jest.fn(),
      addToCalendar: jest.fn(),
      removeFromCalendar: jest.fn(),
      getEvents: jest.fn(),
      createEvent: jest.fn(),
      cancelEvent: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [{ provide: CalendarService, useValue: calendarService }],
    }).compile();

    calendarController = module.get<CalendarController>(CalendarController);
  });

  it('forwards month and authorization when fetching the calendar and events', async () => {
    const calendar = { '2025-01-01': ['workout-1'] };
    const events = [{ id: 'event-1', date: '2025-01-01' }];
    calendarService.getCalendar.mockResolvedValue(calendar);
    calendarService.getEvents.mockResolvedValue(events);

    await expect(
      calendarController.getCalendar('Bearer token', '2025-01'),
    ).resolves.toBe(calendar);
    await expect(
      calendarController.getEvents('Bearer token', '2025-01'),
    ).resolves.toBe(events);
    expect(calendarService.getCalendar).toHaveBeenCalledWith(
      'Bearer token',
      '2025-01',
    );
    expect(calendarService.getEvents).toHaveBeenCalledWith(
      'Bearer token',
      '2025-01',
    );
  });

  it('forwards calendar workout payload fields to the service', async () => {
    const request = {
      date: '2025-01-01',
      workoutId: 'workout-1',
      time: '09:30',
    };
    const calendar = { '2025-01-01': ['workout-1'] };
    calendarService.addToCalendar.mockResolvedValue(calendar);

    await expect(
      calendarController.addToCalendar(request, 'Bearer token'),
    ).resolves.toBe(calendar);
    expect(calendarService.addToCalendar).toHaveBeenCalledWith(
      '2025-01-01',
      'workout-1',
      'Bearer token',
      '09:30',
    );
  });

  it('forwards date, workout id, and authorization when removing a calendar workout', async () => {
    const calendar = { '2025-01-01': [] };
    calendarService.removeFromCalendar.mockResolvedValue(calendar);

    await expect(
      calendarController.removeFromCalendar(
        '2025-01-01',
        'workout-1',
        'Bearer token',
      ),
    ).resolves.toBe(calendar);
    expect(calendarService.removeFromCalendar).toHaveBeenCalledWith(
      '2025-01-01',
      'workout-1',
      'Bearer token',
    );
  });

  it('forwards event fields and authorization when creating events', async () => {
    const request = {
      date: '2025-01-01',
      studentId: '2',
      time: '09:30',
      workoutId: 'workout-1',
    };
    const event = { id: 'event-1', date: '2025-01-01' };
    calendarService.createEvent.mockResolvedValue(event);

    await expect(
      calendarController.createEvent(request, 'Bearer token'),
    ).resolves.toBe(event);
    expect(calendarService.createEvent).toHaveBeenCalledWith(
      '2025-01-01',
      '2',
      'Bearer token',
      '09:30',
      'workout-1',
    );
  });

  it('forwards event id and authorization when cancelling', async () => {
    calendarService.cancelEvent.mockResolvedValue(undefined);

    await expect(
      calendarController.cancelEvent('event-1', 'Bearer token'),
    ).resolves.toBeUndefined();
    expect(calendarService.cancelEvent).toHaveBeenCalledWith(
      'event-1',
      'Bearer token',
    );
  });
});
