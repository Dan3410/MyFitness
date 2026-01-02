import { Injectable } from '@nestjs/common';
import { GENDER } from 'src/models/gender';
import { HEIGHTUNIT } from 'src/models/heightUnit';
import { OBJETIVE } from 'src/models/objetive';
import { PHYSICALACTIVITYLVL } from 'src/models/physical-activity';
import type { User } from 'src/models/user';
import { WEIGHTUNIT } from 'src/models/weightUnit';

@Injectable()
export class UserService {
  getUser(id: string): User {
    return {
        name: 'Nombre',
        lastName: "Apellido",
        weight: 62,
        weightUnit: WEIGHTUNIT.KG,
        height: 150,
        heightUnit: HEIGHTUNIT.CM,
        gender: GENDER.MALE,
        birthDay: '1985-12-10',
        physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
        objetive: OBJETIVE.MAINTAIN
      };
  }
  
  editUser(id: string, userData: User): User {
    return userData;
  }
}
