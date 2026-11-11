import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
  let workoutService: WorkoutService;
  let httpService: {
    get: jest.Mock;
    post: jest.Mock;
    put: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    workoutService = module.get<WorkoutService>(WorkoutService);
  });

  it('fetches categories, workout lists, and workout details', async () => {
    const categories = [{ id: 'gym', name: 'Gym' }];
    const workouts = [{ id: 'workout-1', name: 'Strength' }];
    const workout = { id: 'workout-1', name: 'Strength' };
    httpService.get
      .mockReturnValueOnce(of({ data: categories }))
      .mockReturnValueOnce(of({ data: workouts }))
      .mockReturnValueOnce(of({ data: workout }));

    await expect(workoutService.getCategories()).resolves.toBe(categories);
    await expect(
      workoutService.getWorkouts('1', 'gym', 'Bearer token'),
    ).resolves.toBe(workouts);
    await expect(
      workoutService.getWorkout('workout-1', 'Bearer token'),
    ).resolves.toBe(workout);

    expect(httpService.get.mock.calls).toEqual([
      ['http://localhost:8080/workout/categories'],
      [
        'http://localhost:8080/workout/list/1?category=gym',
        { headers: { authorization: 'Bearer token' } },
      ],
      [
        'http://localhost:8080/workout/workout-1',
        { headers: { authorization: 'Bearer token' } },
      ],
    ]);
  });

  it('creates and edits workouts, and deletes workouts with authorization', async () => {
    const workout = { id: 'workout-1', name: 'Strength' };
    const workouts = [{ id: 'workout-1', name: 'Strength' }];
    httpService.post.mockReturnValueOnce(of({ data: workout }));
    httpService.put.mockReturnValue(of({ data: workout }));
    httpService.delete.mockReturnValue(of({ data: workouts }));

    await expect(
      workoutService.createWorkout('1', workout, 'Bearer token'),
    ).resolves.toBe(workout);
    await expect(
      workoutService.editWorkout('workout-1', workout, 'Bearer token'),
    ).resolves.toBe(workout);
    await expect(
      workoutService.deleteWorkout('workout-1', 'Bearer token'),
    ).resolves.toBe(workouts);

    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/workout/1',
      workout,
      { headers: { authorization: 'Bearer token' } },
    );
    expect(httpService.put).toHaveBeenCalledWith(
      'http://localhost:8080/workout/workout-1',
      workout,
      { headers: { authorization: 'Bearer token' } },
    );
    expect(httpService.delete).toHaveBeenCalledWith(
      'http://localhost:8080/workout/workout-1',
      { headers: { authorization: 'Bearer token' } },
    );
  });

  it('forwards selected group ids when sharing a workout', async () => {
    const sharedStudentIds = ['0'];
    httpService.post.mockReturnValue(of({ data: sharedStudentIds }));

    await expect(
      workoutService.shareWorkout('workout-1', [], '******', ['group-1']),
    ).resolves.toBe(sharedStudentIds);
    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/workout/workout-1/share',
      { studentIds: [], groupIds: ['group-1'] },
      { headers: { authorization: '******' } },
    );
  });

  it('encodes workout ids when sharing and retrieving shared students', async () => {
    const studentIds = ['0', '2'];
    httpService.post.mockReturnValue(of({ data: studentIds }));
    httpService.get.mockReturnValue(of({ data: studentIds }));

    await expect(
      workoutService.shareWorkout('workout/1', studentIds, 'Bearer token'),
    ).resolves.toBe(studentIds);
    await expect(
      workoutService.getSharedStudentIds('workout/1', 'Bearer token'),
    ).resolves.toBe(studentIds);

    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/workout/workout%2F1/share',
      { studentIds },
      { headers: { authorization: 'Bearer token' } },
    );
    expect(httpService.get).toHaveBeenCalledWith(
      'http://localhost:8080/workout/workout%2F1/shared-students',
      { headers: { authorization: 'Bearer token' } },
    );
  });

  it('retrieves shared group ids with authorization', async () => {
    const groupIds = ['group-1'];
    httpService.get.mockReturnValue(of({ data: groupIds }));

    await expect(
      workoutService.getSharedGroupIds('workout/1', '******'),
    ).resolves.toBe(groupIds);
    expect(httpService.get).toHaveBeenCalledWith(
      'http://localhost:8080/workout/workout%2F1/shared-groups',
      { headers: { authorization: '******' } },
    );
  });

  it('reads, adds, and removes calendar workouts', async () => {
    const calendar = { '2025-01-01': ['workout-1'] };
    httpService.get.mockReturnValue(of({ data: calendar }));
    httpService.post.mockReturnValue(of({ data: calendar }));
    httpService.delete.mockReturnValue(of({ data: calendar }));

    await expect(workoutService.getCalendar('Bearer token')).resolves.toBe(
      calendar,
    );
    await expect(
      workoutService.addToCalendar('2025-01-01', 'workout-1', 'Bearer token'),
    ).resolves.toBe(calendar);
    await expect(
      workoutService.removeFromCalendar(
        '2025-01-01',
        'workout-1',
        'Bearer token',
      ),
    ).resolves.toBe(calendar);

    expect(httpService.get).toHaveBeenCalledWith(
      'http://localhost:8080/workout/calendar',
      { headers: { authorization: 'Bearer token' } },
    );
    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/workout/calendar',
      { date: '2025-01-01', workoutId: 'workout-1' },
      { headers: { authorization: 'Bearer token' } },
    );
    expect(httpService.delete).toHaveBeenCalledWith(
      'http://localhost:8080/workout/calendar/2025-01-01/workout-1',
      { headers: { authorization: 'Bearer token' } },
    );
  });
});
