import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: {
    login: jest.Mock;
    register: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      register: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('forwards login credentials to the service', async () => {
    const credentials = { email: 'user@example.com', password: 'secret' };
    const response = { token: 'jwt', userId: '1' };
    authService.login.mockResolvedValue(response);

    await expect(authController.login(credentials)).resolves.toBe(response);
    expect(authService.login).toHaveBeenCalledWith(credentials);
  });

  it('forwards registration credentials to the service', async () => {
    const credentials = { email: 'new@example.com', password: 'secret' };
    const response = { token: 'jwt', userId: '2' };
    authService.register.mockResolvedValue(response);

    await expect(authController.register(credentials)).resolves.toBe(response);
    expect(authService.register).toHaveBeenCalledWith(credentials);
  });
});
