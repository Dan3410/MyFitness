import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import type { User } from 'src/models/user';

@Injectable()
export class UserService {

  private profileApiUrl = "http://localhost:8080/profile";
  constructor(private readonly httpService: HttpService){}

  async getUser(id: string): Promise<User> {
    const response = await firstValueFrom(this.httpService.get(this.profileApiUrl + `?id=${id}`));
    return response.data;
/*    return {
        name: 'Nombre',
        lastName: "Apellido",
        weight: 62,
        weightUnit: WEIGHTUNIT.KG,
        height: 150,
        heightUnit: HEIGHTUNIT.CM,
        gender: GENDER.MALE,
        birthDay: '1985-12-10',
        physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
        objective: OBJECTIVE.MAINTAIN
      };*/
  }
  
  editUser(id: string, userData: User): User {
    return userData;
  }
}
