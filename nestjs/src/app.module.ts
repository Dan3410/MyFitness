import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { WorkoutModule } from './modules/workout/workout.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TrainerStudentModule } from './modules/trainer-student/trainer-student.module';
import { StudentGroupsModule } from './modules/student-groups/student-groups.module';

@Module({
  imports: [AuthModule, UserModule, WorkoutModule, NotificationModule, TrainerStudentModule, StudentGroupsModule, HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
