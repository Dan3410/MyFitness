import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import type { TrainerRequestNotification } from 'src/models/notification';

@Injectable()
export class NotificationService {
  private readonly notificationApiUrl = 'http://localhost:8080/notifications';

  constructor(private readonly httpService: HttpService) {}

  async getNotifications(authorization: string): Promise<TrainerRequestNotification[]> {
    const response = await firstValueFrom(
      this.httpService.get<TrainerRequestNotification[]>(this.notificationApiUrl, { headers: { authorization } }),
    );
    return response.data;
  }

  async sendTrainerRequest(recipientId: string, authorization: string): Promise<TrainerRequestNotification> {
    const response = await firstValueFrom(
      this.httpService.post<TrainerRequestNotification>(
        `${this.notificationApiUrl}/trainer-request/${encodeURIComponent(recipientId)}`,
        {},
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async respondToTrainerRequest(
    notificationId: string,
    decision: 'accept' | 'decline',
    authorization: string,
  ): Promise<TrainerRequestNotification> {
    const response = await firstValueFrom(
      this.httpService.patch<TrainerRequestNotification>(
        `${this.notificationApiUrl}/${encodeURIComponent(notificationId)}/${decision}`,
        {},
        { headers: { authorization } },
      ),
    );
    return response.data;
  }
}