import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let httpService: {
    get: jest.Mock;
    put: jest.Mock;
  };

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
      put: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: HttpService, useValue: httpService }],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('fetches the current profile with the authorization header', async () => {
    const profile = { id: '1', name: 'John Gym' };
    httpService.get.mockReturnValue(of({ data: profile }));

    await expect(userService.getUser('1', 'Bearer token')).resolves.toBe(
      profile,
    );
    expect(httpService.get).toHaveBeenCalledWith(
      'http://localhost:8080/profile',
      {
        headers: { authorization: 'Bearer token' },
      },
    );
  });

  it('searches users with a name query and authorization header', async () => {
    const results = [{ id: '2', name: 'Jane Run' }];
    httpService.get.mockReturnValue(of({ data: results }));

    await expect(userService.searchUsers('Jane', 'Bearer token')).resolves.toBe(
      results,
    );
    expect(httpService.get).toHaveBeenCalledWith(
      'http://localhost:8080/profile/users',
      {
        params: { name: 'Jane' },
        headers: { authorization: 'Bearer token' },
      },
    );
  });

  it('fetches profiles and weight histories by user id', async () => {
    const profile = { id: '2', name: 'Jane Run' };
    const history = [{ date: '2025-01-01', weight: 60 }];
    httpService.get
      .mockReturnValueOnce(of({ data: profile }))
      .mockReturnValueOnce(of({ data: history }))
      .mockReturnValueOnce(of({ data: history }));

    await expect(userService.getUserById('2', 'Bearer token')).resolves.toBe(
      profile,
    );
    await expect(userService.getWeightHistory('Bearer token')).resolves.toBe(
      history,
    );
    await expect(
      userService.getWeightHistoryById('2', 'Bearer token'),
    ).resolves.toBe(history);

    expect(httpService.get.mock.calls).toEqual([
      [
        'http://localhost:8080/profile/userById/2',
        { headers: { authorization: 'Bearer token' } },
      ],
      [
        'http://localhost:8080/profile/weight-history',
        { headers: { authorization: 'Bearer token' } },
      ],
      [
        'http://localhost:8080/profile/weight-history/2',
        { headers: { authorization: 'Bearer token' } },
      ],
    ]);
  });

  it('updates the profile and returns the API response', async () => {
    const updatedProfile = { id: '2', name: 'Jane Run' };
    httpService.put.mockReturnValue(of({ data: updatedProfile }));

    await expect(
      userService.editUser('2', updatedProfile, 'Bearer token'),
    ).resolves.toBe(updatedProfile);
    expect(httpService.put).toHaveBeenCalledWith(
      'http://localhost:8080/profile',
      updatedProfile,
      { headers: { authorization: 'Bearer token' } },
    );
  });
});
