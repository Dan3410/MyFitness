import { Option } from "../models/option";
import { swimGear } from "../models/workoutSteps";

export const CONST_SWIMMING_GEAR_OPTIONS: Array<Option> = [
    { label: 'Ninguno', value: swimGear.NONE },
    { label: 'Aletas', value: swimGear.FINS },
    { label: 'Pull buoy', value: swimGear.PULLBUOY },
    { label: 'Tabla', value: swimGear.KICKBOARD },
    { label: 'Palas', value: swimGear.PADDLES },
    { label: 'Snorkel', value: swimGear.SNORKEL }
]