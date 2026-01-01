import { GENDER } from "../models/gender"
import { HEIGHTUNIT } from "../models/heightUnit"
import { OBJETIVE } from "../models/objetive"
import { PHYSICALACTIVITYLVL } from "../models/physical-activity"
import { WEIGHTUNIT } from "../models/weightUnit"

const API_URL = ''

export const getUserData = (id: string) => {
    //It does nothing with the id for now
    return {
        name: 'Nombre',
        lastName: "Apellido",
        weight: 62,
        weightUnit: WEIGHTUNIT.KG,
        height: 150,
        heightUnit: HEIGHTUNIT.CM,
        gender: GENDER.MALE,
        birthDay: '10/12/1985',
        physicalActivityLvl: PHYSICALACTIVITYLVL.MEDIUM,
        objetive: OBJETIVE.MAINTAIN
      }
}