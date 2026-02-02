import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import type { User } from 'src/models/user';

@Injectable()
export class UserService {

  private profileApiUrl = "http://localhost:8080/profile";
  constructor(private readonly httpService: HttpService) { }

  async getUser(id: string): Promise<User> {
    const response = await firstValueFrom(this.httpService.get(this.profileApiUrl + `?id=${id}`));
    return response.data;
  }

  async editUser(id: string, userData: User): Promise<User> {
    const response = await firstValueFrom(this.httpService.put(this.profileApiUrl + `?id=${id}`, userData));
    return response.data;
  }
}
