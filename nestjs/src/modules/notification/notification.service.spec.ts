import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let httpService: {
    get: jest.Mock;
    post: jest.Mock;
    patch: jest.Mock;
  };

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('fetches notifications with the authorization header', async () => {
    const notifications = [
      { id: 'notification-1', message: 'Trainer request' },
    ];
    httpService.get.mockReturnValue(of({ data: notifications }));

    await expect(
      notificationService.getNotifications('Bearer token'),
    ).resolves.toBe(notifications);
    expect(httpService.get).toHaveBeenCalledWith(
      'http://localhost:8080/notifications',
      { headers: { authorization: 'Bearer token' } },
    );
  });

  it('encodes recipient ids when sending trainer requests', async () => {
    const notification = { id: 'notification-1', message: 'Trainer request' };
    httpService.post.mockReturnValue(of({ data: notification }));

    await expect(
      notificationService.sendTrainerRequest('student/1', 'Bearer token'),
    ).resolves.toBe(notification);
    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/notifications/trainer-request/student%2F1',
      {},
      { headers: { authorization: 'Bearer token' } },
    );
  });

  it('encodes notification ids and forwards the response decision', async () => {
    const notification = { id: 'notification/1', message: 'Accepted' };
    httpService.patch.mockReturnValue(of({ data: notification }));

    await expect(
      notificationService.respondToTrainerRequest(
        'notification/1',
        'accept',
        'Bearer token',
      ),
    ).resolves.toBe(notification);
    expect(httpService.patch).toHaveBeenCalledWith(
      'http://localhost:8080/notifications/notification%2F1/accept',
      {},
      { headers: { authorization: 'Bearer token' } },
    );
  });
});
