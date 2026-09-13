import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import type { User } from 'src/models/user';
import type { WeightHistoryPoint } from 'src/models/weightHistory';

@Injectable()
export class UserService {

  private profileApiUrl = "http://localhost:8080/profile";
  constructor(private readonly httpService: HttpService) { }

  async getUser(id: string, authorization: string): Promise<User> {
    const response = await firstValueFrom(this.httpService.get(this.profileApiUrl, { headers: { authorization } }));
    return response.data;
  }

  async editUser(id: string, userData: User, authorization: string): Promise<User> {
    const response = await firstValueFrom(this.httpService.put(this.profileApiUrl, userData, { headers: { authorization } }));
    return response.data;
  }

  async getWeightHistory(authorization: string): Promise<WeightHistoryPoint[]> {
    const response = await firstValueFrom(
      this.httpService.get<WeightHistoryPoint[]>(`${this.profileApiUrl}/weight-history`, { headers: { authorization } }),
    );
    return response.data;
  }
}
