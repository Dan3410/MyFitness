import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: {
    searchUsers: jest.Mock;
    getUserById: jest.Mock;
    editUser: jest.Mock;
  };

  beforeEach(async () => {
    userService = {
      searchUsers: jest.fn(),
      getUserById: jest.fn(),
      editUser: jest.fn(),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  it('forwards the search term and authorization header to the service', async () => {
    const results = [{ id: '2', name: 'Jane Run' }];
    userService.searchUsers.mockResolvedValue(results);

    await expect(
      userController.searchUsers('Bearer token', 'Jane'),
    ).resolves.toBe(results);
    expect(userService.searchUsers).toHaveBeenCalledWith(
      'Jane',
      'Bearer token',
    );
  });

  it('forwards the user id and authorization header when fetching a profile', async () => {
    const profile = { id: '2', name: 'Jane Run' };
    userService.getUserById.mockResolvedValue(profile);

    await expect(userController.getUserById('Bearer token', '2')).resolves.toBe(
      profile,
    );
    expect(userService.getUserById).toHaveBeenCalledWith('2', 'Bearer token');
  });

  it('forwards profile updates with the route id and authorization header', async () => {
    const profile = { id: '2', name: 'Jane Run' };
    userService.editUser.mockResolvedValue(profile);

    await expect(
      userController.editUser('2', profile, 'Bearer token'),
    ).resolves.toBe(profile);
    expect(userService.editUser).toHaveBeenCalledWith(
      '2',
      profile,
      'Bearer token',
    );
  });
});
