import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { WorkoutModule } from './modules/workout/workout.module';

@Module({
  imports: [UserModule, WorkoutModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
