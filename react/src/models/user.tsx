import { HEIGHTUNIT } from "./heightUnit"
import { OBJETIVE } from "./objetive"
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
  gender: "MALE" | "FEMALE"
  physicalActivityLvl: PHYSICALACTIVITYLVL.NONE | PHYSICALACTIVITYLVL.LOW | PHYSICALACTIVITYLVL.MEDIUM | PHYSICALACTIVITYLVL.HIGH
  objetive: OBJETIVE.REDUCE | OBJETIVE.MAINTAIN | OBJETIVE.INCREASE
}