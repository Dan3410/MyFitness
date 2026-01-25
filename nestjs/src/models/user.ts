import { GENDER } from "./gender"
import { HEIGHTUNIT } from "./heightUnit"
import { OBJECTIVE } from "./objective"
import { PHYSICALACTIVITYLVL } from "./physical-activity"
import { WEIGHTUNIT } from "./weightUnit"

export interface User {
  name: string
  lastName: string
  weight: number
  weightUnit: WEIGHTUNIT.KG | WEIGHTUNIT.LB
  height: number
  heightUnit: HEIGHTUNIT.CM | HEIGHTUNIT.FEET
  birthDay: string
  gender: GENDER.MALE | GENDER.FEMALE
  physicalActivityLvl: PHYSICALACTIVITYLVL.NONE | PHYSICALACTIVITYLVL.LOW | PHYSICALACTIVITYLVL.MEDIUM | PHYSICALACTIVITYLVL.HIGH
  objective: OBJECTIVE.REDUCE | OBJECTIVE.MAINTAIN | OBJECTIVE.INCREASE
}