import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let notificationController: NotificationController;
  let notificationService: {
    getNotifications: jest.Mock;
    sendTrainerRequest: jest.Mock;
    respondToTrainerRequest: jest.Mock;
  };

  beforeEach(async () => {
    notificationService = {
      getNotifications: jest.fn(),
      sendTrainerRequest: jest.fn(),
      respondToTrainerRequest: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compile();

    notificationController = module.get<NotificationController>(
      NotificationController,
    );
  });

  it('forwards the authorization header when fetching notifications', async () => {
    const notifications = [
      { id: 'notification-1', message: 'Trainer request' },
    ];
    notificationService.getNotifications.mockResolvedValue(notifications);

    await expect(
      notificationController.getNotifications('Bearer token'),
    ).resolves.toBe(notifications);
    expect(notificationService.getNotifications).toHaveBeenCalledWith(
      'Bearer token',
    );
  });

  it('forwards the recipient id and authorization when sending a trainer request', async () => {
    const notification = { id: 'notification-1', message: 'Trainer request' };
    notificationService.sendTrainerRequest.mockResolvedValue(notification);

    await expect(
      notificationController.sendTrainerRequest('2', 'Bearer token'),
    ).resolves.toBe(notification);
    expect(notificationService.sendTrainerRequest).toHaveBeenCalledWith(
      '2',
      'Bearer token',
    );
  });

  it('forwards the response decision, notification id, and authorization', async () => {
    const notification = { id: 'notification-1', message: 'Accepted' };
    notificationService.respondToTrainerRequest.mockResolvedValue(notification);

    await expect(
      notificationController.respondToTrainerRequest(
        'notification-1',
        'accept',
        'Bearer token',
      ),
    ).resolves.toBe(notification);
    expect(notificationService.respondToTrainerRequest).toHaveBeenCalledWith(
      'notification-1',
      'accept',
      'Bearer token',
    );
  });
});
