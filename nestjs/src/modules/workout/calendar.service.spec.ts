import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  let calendarService: CalendarService;
  let httpService: {
    get: jest.Mock;
    post: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    calendarService = module.get<CalendarService>(CalendarService);
  });

  it('URL-encodes an optional month filter and forwards the authorization header', async () => {
    const events = [{ id: 'event-1', date: '2025-02-01' }];
    httpService.get.mockReturnValue(of({ data: events }));

    await expect(
      calendarService.getEvents('Bearer token', '2025/02'),
    ).resolves.toBe(events);
    expect(httpService.get).toHaveBeenCalledWith(
      'http://localhost:8080/workout/calendar/events?month=2025%2F02',
      { headers: { authorization: 'Bearer token' } },
    );
  });

  it('sends event creation fields and returns the Java API response', async () => {
    const event = { id: 'event-1', date: '2025-02-01', studentId: '0' };
    httpService.post.mockReturnValue(of({ data: event }));

    await expect(
      calendarService.createEvent(
        '2025-02-01',
        '0',
        'Bearer token',
        '09:30',
        'workout-1',
      ),
    ).resolves.toBe(event);
    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/workout/calendar/events',
      {
        date: '2025-02-01',
        studentId: '0',
        time: '09:30',
        workoutId: 'workout-1',
      },
      { headers: { authorization: 'Bearer token' } },
    );
  });

  it('forwards a group id when creating a group event', async () => {
    const event = {
      id: 'event-1',
      date: '2025-02-01',
      studentId: null,
      groupId: 'group-1',
      groupName: 'Grupo',
    };
    httpService.post.mockReturnValue(of({ data: event }));

    await expect(
      calendarService.createEvent(
        '2025-02-01',
        undefined,
        '******',
        undefined,
        undefined,
        'group-1',
      ),
    ).resolves.toBe(event);
    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/workout/calendar/events',
      {
        date: '2025-02-01',
        studentId: undefined,
        time: undefined,
        workoutId: undefined,
        groupId: 'group-1',
      },
      { headers: { authorization: '******' } },
    );
  });

  it('URL-encodes event ids when cancelling an event', async () => {
    httpService.delete.mockReturnValue(of({ data: undefined }));

    await expect(
      calendarService.cancelEvent('event/1', 'Bearer token'),
    ).resolves.toBeUndefined();
    expect(httpService.delete).toHaveBeenCalledWith(
      'http://localhost:8080/workout/calendar/events/event%2F1',
      { headers: { authorization: 'Bearer token' } },
    );
  });
});
