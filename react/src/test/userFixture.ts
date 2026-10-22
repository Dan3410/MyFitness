import { GENDER } from '../models/gender'
import { HEIGHTUNIT } from '../models/heightUnit'
import { OBJECTIVE } from '../models/objective'
import { PHYSICALACTIVITYLVL } from '../models/physical-activity'
import { WEIGHTUNIT } from '../models/weightUnit'
import type { User } from '../models/user'

export const userFixture: User = {
  id: 'user-1',
  username: 'fitness-user',
  email: 'fitness@example.com',
  name: 'Fitness',
  lastName: 'User',
  weight: 70,
  weightUnit: WEIGHTUNIT.KG,
  height: 175,
  heightUnit: HEIGHTUNIT.CM,
  birthDay: '1990-01-01',
  gender: GENDER.MALE,
  physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
  objective: OBJECTIVE.MAINTAIN,
  isProfilePrivate: false,
}
