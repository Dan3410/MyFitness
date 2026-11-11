import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';

describe('WorkoutController', () => {
  let workoutController: WorkoutController;
  let workoutService: {
    getWorkouts: jest.Mock;
    shareWorkout: jest.Mock;
    getSharedStudentIds: jest.Mock;
    getSharedGroupIds: jest.Mock;
  };

  beforeEach(async () => {
    workoutService = {
      getWorkouts: jest.fn(),
      shareWorkout: jest.fn(),
      getSharedStudentIds: jest.fn(),
      getSharedGroupIds: jest.fn(),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutController],
      providers: [{ provide: WorkoutService, useValue: workoutService }],
    }).compile();

    workoutController = app.get<WorkoutController>(WorkoutController);
  });

  it('forwards workout list filters and authorization to the service', async () => {
    const workouts = [{ id: '1', name: 'Strength', category: 'gym' }];
    workoutService.getWorkouts.mockResolvedValue(workouts);

    await expect(
      workoutController.getWorkouts('1', { category: 'gym' }, 'Bearer token'),
    ).resolves.toBe(workouts);
    expect(workoutService.getWorkouts).toHaveBeenCalledWith(
      '1',
      'gym',
      'Bearer token',
    );
  });

  it('forwards the selected students when sharing a workout', async () => {
    const studentIds = ['0', '2'];
    workoutService.shareWorkout.mockResolvedValue(studentIds);

    await expect(
      workoutController.shareWorkout('workout-1', studentIds, 'Bearer token'),
    ).resolves.toBe(studentIds);
    expect(workoutService.shareWorkout).toHaveBeenCalledWith(
      'workout-1',
      studentIds,
      'Bearer token',
    );
  });

  it('forwards selected group ids when sharing a workout', async () => {
    const studentIds: string[] = [];
    const groupIds = ['group-1'];
    workoutService.shareWorkout.mockResolvedValue(studentIds);

    await expect(
      workoutController.shareWorkout('workout-1', studentIds, '******', groupIds),
    ).resolves.toBe(studentIds);
    expect(workoutService.shareWorkout).toHaveBeenCalledWith(
      'workout-1',
      studentIds,
      '******',
      groupIds,
    );
  });

  it('forwards the workout id and authorization when listing shared students', async () => {
    const studentIds = ['0'];
    workoutService.getSharedStudentIds.mockResolvedValue(studentIds);

    await expect(
      workoutController.getSharedStudentIds('workout-1', 'Bearer token'),
    ).resolves.toBe(studentIds);
    expect(workoutService.getSharedStudentIds).toHaveBeenCalledWith(
      'workout-1',
      'Bearer token',
    );
  });

  it('forwards the workout id and authorization when listing shared groups', async () => {
    const groupIds = ['group-1'];
    workoutService.getSharedGroupIds.mockResolvedValue(groupIds);

    await expect(
      workoutController.getSharedGroupIds('workout-1', '******'),
    ).resolves.toBe(groupIds);
    expect(workoutService.getSharedGroupIds).toHaveBeenCalledWith(
      'workout-1',
      '******',
    );
  });
});
