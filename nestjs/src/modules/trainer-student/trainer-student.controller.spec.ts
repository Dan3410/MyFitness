import { Test, TestingModule } from '@nestjs/testing';
import { TrainerStudentController } from './trainer-student.controller';
import { TrainerStudentService } from './trainer-student.service';

describe('TrainerStudentController', () => {
  let trainerStudentController: TrainerStudentController;
  let trainerStudentService: {
    getStudents: jest.Mock;
    getTrainers: jest.Mock;
    getRelationshipsForProfile: jest.Mock;
    linkStudent: jest.Mock;
    unlinkStudent: jest.Mock;
    unlinkTrainer: jest.Mock;
  };

  beforeEach(async () => {
    trainerStudentService = {
      getStudents: jest.fn(),
      getTrainers: jest.fn(),
      getRelationshipsForProfile: jest.fn(),
      linkStudent: jest.fn(),
      unlinkStudent: jest.fn(),
      unlinkTrainer: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainerStudentController],
      providers: [
        { provide: TrainerStudentService, useValue: trainerStudentService },
      ],
    }).compile();

    trainerStudentController = module.get<TrainerStudentController>(
      TrainerStudentController,
    );
  });

  it('forwards authorization when fetching students and trainers', async () => {
    const users = [{ id: '1', name: 'John Gym' }];
    trainerStudentService.getStudents.mockResolvedValue(users);
    trainerStudentService.getTrainers.mockResolvedValue(users);

    await expect(
      trainerStudentController.getStudents('Bearer token'),
    ).resolves.toBe(users);
    await expect(
      trainerStudentController.getTrainers('Bearer token'),
    ).resolves.toBe(users);
    expect(trainerStudentService.getStudents).toHaveBeenCalledWith(
      'Bearer token',
    );
    expect(trainerStudentService.getTrainers).toHaveBeenCalledWith(
      'Bearer token',
    );
  });

  it('forwards user id and authorization when fetching profile relationships', async () => {
    const relationships = [{ id: '1', relationshipType: 'TRAINER' }];
    trainerStudentService.getRelationshipsForProfile.mockResolvedValue(
      relationships,
    );

    await expect(
      trainerStudentController.getRelationshipsForProfile('2', 'Bearer token'),
    ).resolves.toBe(relationships);
    expect(
      trainerStudentService.getRelationshipsForProfile,
    ).toHaveBeenCalledWith('2', 'Bearer token');
  });

  it('forwards student id and authorization when linking a student', async () => {
    const student = { id: '2', name: 'Jane Run' };
    trainerStudentService.linkStudent.mockResolvedValue(student);

    await expect(
      trainerStudentController.linkStudent('2', 'Bearer token'),
    ).resolves.toBe(student);
    expect(trainerStudentService.linkStudent).toHaveBeenCalledWith(
      '2',
      'Bearer token',
    );
  });

  it('forwards student or trainer id and authorization when unlinking', async () => {
    const users = [{ id: '1', name: 'John Gym' }];
    trainerStudentService.unlinkStudent.mockResolvedValue(users);
    trainerStudentService.unlinkTrainer.mockResolvedValue(users);

    await expect(
      trainerStudentController.unlinkStudent('2', 'Bearer token'),
    ).resolves.toBe(users);
    await expect(
      trainerStudentController.unlinkTrainer('1', 'Bearer token'),
    ).resolves.toBe(users);
    expect(trainerStudentService.unlinkStudent).toHaveBeenCalledWith(
      '2',
      'Bearer token',
    );
    expect(trainerStudentService.unlinkTrainer).toHaveBeenCalledWith(
      '1',
      'Bearer token',
    );
  });
});
