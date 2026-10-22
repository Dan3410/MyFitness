import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpService: { post: jest.Mock };

  beforeEach(async () => {
    httpService = { post: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: HttpService, useValue: httpService }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('posts login credentials to the Java auth API and returns its response', async () => {
    const credentials = { email: 'user@example.com', password: 'secret' };
    const authResponse = { token: 'jwt', userId: '7' };
    httpService.post.mockReturnValue(of({ data: authResponse }));

    await expect(authService.login(credentials)).resolves.toBe(authResponse);
    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/auth/login',
      credentials,
    );
  });

  it('posts registration credentials to the Java auth API', async () => {
    const credentials = { email: 'new@example.com', password: 'secret' };
    const authResponse = { token: 'jwt', userId: '8' };
    httpService.post.mockReturnValue(of({ data: authResponse }));

    await expect(authService.register(credentials)).resolves.toBe(authResponse);
    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/auth/register',
      credentials,
    );
  });

  it('translates an upstream unauthorized response to the localized login error', async () => {
    const axiosError = Object.assign(new Error('Unauthorized'), {
      isAxiosError: true,
      response: { status: 401, data: { message: 'upstream detail' } },
    });
    httpService.post.mockReturnValue(throwError(() => axiosError));

    await expect(
      authService.login({ email: 'user@example.com', password: 'wrong' }),
    ).rejects.toMatchObject({
      message: 'El email o la contraseña son incorrectos',
      status: 401,
    });
  });
});
