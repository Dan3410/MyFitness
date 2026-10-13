import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { WorkoutModule } from './modules/workout/workout.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TrainerStudentModule } from './modules/trainer-student/trainer-student.module';

@Module({
  imports: [AuthModule, UserModule, WorkoutModule, NotificationModule, TrainerStudentModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
