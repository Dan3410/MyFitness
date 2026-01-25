import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [UserModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
