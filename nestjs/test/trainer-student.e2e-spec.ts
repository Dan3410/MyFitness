import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TrainerStudentController } from '../src/modules/trainer-student/trainer-student.controller';
import { TrainerStudentService } from '../src/modules/trainer-student/trainer-student.service';

describe('TrainerStudentController (e2e)', () => {
  let app: INestApplication;
  const trainerStudentService = {
    getRelationshipsForProfile: jest.fn().mockResolvedValue([
      { id: '0', name: 'John Swim', profileImage: null, isTrainer: false },
    ]),
  };

  beforeEach(async () => {
    trainerStudentService.getRelationshipsForProfile.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainerStudentController],
      providers: [{ provide: TrainerStudentService, useValue: trainerStudentService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('serves the profile relationships route through NestJS', async () => {
    await request(app.getHttpServer())
      .get('/trainer/students/profile/1')
      .set('authorization', 'Bearer test-token')
      .expect(200)
      .expect([{ id: '0', name: 'John Swim', profileImage: null, isTrainer: false }]);

    expect(trainerStudentService.getRelationshipsForProfile).toHaveBeenCalledWith(
      '1',
      'Bearer test-token',
    );
  });
});
