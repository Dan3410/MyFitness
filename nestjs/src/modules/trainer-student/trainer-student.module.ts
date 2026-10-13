import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TrainerStudentController } from './trainer-student.controller';
import { TrainerStudentService } from './trainer-student.service';

@Module({
  imports: [HttpModule],
  controllers: [TrainerStudentController],
  providers: [TrainerStudentService],
})
export class TrainerStudentModule {}