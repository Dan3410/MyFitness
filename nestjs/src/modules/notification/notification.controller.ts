import { Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import type { TrainerRequestNotification } from 'src/models/notification';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotifications(@Headers('authorization') authorization: string): Promise<TrainerRequestNotification[]> {
    return this.notificationService.getNotifications(authorization);
  }

  @Post('trainer-request/:recipientId')
  sendTrainerRequest(
    @Param('recipientId') recipientId: string,
    @Headers('authorization') authorization: string,
  ): Promise<TrainerRequestNotification> {
    return this.notificationService.sendTrainerRequest(recipientId, authorization);
  }

  @Patch(':notificationId/:decision')
  respondToTrainerRequest(
    @Param('notificationId') notificationId: string,
    @Param('decision') decision: 'accept' | 'decline',
    @Headers('authorization') authorization: string,
  ): Promise<TrainerRequestNotification> {
    return this.notificationService.respondToTrainerRequest(notificationId, decision, authorization);
  }
}