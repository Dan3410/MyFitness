import { Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import type { UserSearchResult } from 'src/models/user';
import { TrainerStudentService } from './trainer-student.service';

@Controller('trainer/students')
export class TrainerStudentController {
  constructor(private readonly trainerStudentService: TrainerStudentService) {}

  @Get()
  getStudents(@Headers('authorization') authorization: string): Promise<UserSearchResult[]> {
    return this.trainerStudentService.getStudents(authorization);
  }

  @Get('trainers')
  getTrainers(@Headers('authorization') authorization: string): Promise<UserSearchResult[]> {
    return this.trainerStudentService.getTrainers(authorization);
  }

  @Get('profile/:userId')
  getRelationshipsForProfile(
    @Param('userId') userId: string,
    @Headers('authorization') authorization: string,
  ): Promise<UserSearchResult[]> {
    return this.trainerStudentService.getRelationshipsForProfile(userId, authorization);
  }

  @Post(':studentId')
  linkStudent(
    @Param('studentId') studentId: string,
    @Headers('authorization') authorization: string,
  ): Promise<UserSearchResult> {
    return this.trainerStudentService.linkStudent(studentId, authorization);
  }

  @Delete(':studentId')
  unlinkStudent(
    @Param('studentId') studentId: string,
    @Headers('authorization') authorization: string,
  ): Promise<UserSearchResult[]> {
    return this.trainerStudentService.unlinkStudent(studentId, authorization);
  }

  @Delete('trainers/:trainerId')
  unlinkTrainer(
    @Param('trainerId') trainerId: string,
    @Headers('authorization') authorization: string,
  ): Promise<UserSearchResult[]> {
    return this.trainerStudentService.unlinkTrainer(trainerId, authorization);
  }
}