import { GENDER } from "./gender"
import { HEIGHTUNIT } from "./heightUnit"
import { OBJECTIVE } from "./objective"
import { PHYSICALACTIVITYLVL } from "./physical-activity"
import { WEIGHTUNIT } from "./weightUnit"

export interface User {
  name: string
  lastName: string
  weight: number
  weightUnit: WEIGHTUNIT
  height: number
  heightUnit: HEIGHTUNIT
  birthDay: string
  gender: GENDER
  physicalActivityLvl: PHYSICALACTIVITYLVL
  objective: OBJECTIVE
}