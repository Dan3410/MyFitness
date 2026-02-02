import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';

describe('WorkoutController', () => {
  let appController: WorkoutController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutController],
      providers: [WorkoutService],
    }).compile();

    appController = app.get<WorkoutController>(WorkoutController);
  });

  describe('root', () => {
/*    it('should return "Hello World!"', () => {
      expect(userController.getHello()).toBe('Hello World!');
    });*/
  });
});
