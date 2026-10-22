import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { TrainerStudentService } from './trainer-student.service';

describe('TrainerStudentService', () => {
  let trainerStudentService: TrainerStudentService;
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
        TrainerStudentService,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    trainerStudentService = module.get<TrainerStudentService>(
      TrainerStudentService,
    );
  });

  it('fetches trainer and student lists with authorization', async () => {
    const users = [{ id: '1', name: 'John Gym' }];
    httpService.get
      .mockReturnValueOnce(of({ data: users }))
      .mockReturnValueOnce(of({ data: users }));

    await expect(
      trainerStudentService.getStudents('Bearer token'),
    ).resolves.toBe(users);
    await expect(
      trainerStudentService.getTrainers('Bearer token'),
    ).resolves.toBe(users);

    expect(httpService.get.mock.calls).toEqual([
      [
        'http://localhost:8080/trainer/students',
        { headers: { authorization: 'Bearer token' } },
      ],
      [
        'http://localhost:8080/trainer/students/trainers',
        { headers: { authorization: 'Bearer token' } },
      ],
    ]);
  });

  it('encodes user ids when fetching profile relationships', async () => {
    const relationships = [{ id: '2', relationshipType: 'TRAINER' }];
    httpService.get.mockReturnValue(of({ data: relationships }));

    await expect(
      trainerStudentService.getRelationshipsForProfile(
        'user/1',
        'Bearer token',
      ),
    ).resolves.toBe(relationships);
    expect(httpService.get).toHaveBeenCalledWith(
      'http://localhost:8080/trainer/students/profile/user%2F1',
      { headers: { authorization: 'Bearer token' } },
    );
  });

  it('links a student using the authorization header', async () => {
    const student = { id: 'student/1', name: 'Jane Run' };
    httpService.post.mockReturnValue(of({ data: student }));

    await expect(
      trainerStudentService.linkStudent('student/1', 'Bearer token'),
    ).resolves.toBe(student);
    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/trainer/students/student%2F1',
      {},
      { headers: { authorization: 'Bearer token' } },
    );
  });

  it('encodes student and trainer ids when unlinking relationships', async () => {
    const users = [{ id: '1', name: 'John Gym' }];
    httpService.delete
      .mockReturnValueOnce(of({ data: users }))
      .mockReturnValueOnce(of({ data: users }));

    await expect(
      trainerStudentService.unlinkStudent('student/1', 'Bearer token'),
    ).resolves.toBe(users);
    await expect(
      trainerStudentService.unlinkTrainer('trainer/1', 'Bearer token'),
    ).resolves.toBe(users);

    expect(httpService.delete.mock.calls).toEqual([
      [
        'http://localhost:8080/trainer/students/student%2F1',
        { headers: { authorization: 'Bearer token' } },
      ],
      [
        'http://localhost:8080/trainer/students/trainers/trainer%2F1',
        { headers: { authorization: 'Bearer token' } },
      ],
    ]);
  });
});
