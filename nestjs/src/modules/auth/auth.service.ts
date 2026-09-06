import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

interface AuthRequest {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private readonly authApiUrl = 'http://localhost:8080/auth';

  constructor(private readonly httpService: HttpService) { }

  async login(request: AuthRequest) {
    return this.request('/login', request);
  }

  async register(request: AuthRequest) {
    return this.request('/register', request);
  }

  private async request(path: string, request: AuthRequest) {
    try {
      const response = await firstValueFrom(this.httpService.post(`${this.authApiUrl}${path}`, request));
      return response.data;
    } catch (error) {
      if (!isAxiosError(error)) {
        throw error;
      }

      const responseData = error.response?.data;
      let message
      if (error.response?.status === 401) {
        message = 'El email o la contraseña son incorrectos'
      } else {
        message = typeof responseData === 'object' && responseData !== null && 'message' in responseData
          ? responseData.message
          : 'No se pudo completar la operación';
      }

      const status = error.response?.status ?? 502;
      throw new HttpException(message, status);
    }
  }
}