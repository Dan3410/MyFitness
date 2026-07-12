import { Option } from "../models/option";
import { SwimStroke } from "../models/workoutSteps";

export const CONST_SWIM_STROKE_OPTIONS: Array<Option> = [
    { label: 'Estilo libre', value: SwimStroke.FREESTYLE },
    { label: 'Espalda', value: SwimStroke.BACKSTROKE },
    { label: 'Pecho', value: SwimStroke.BREASTSTROKE },
    { label: 'Mariposa', value: SwimStroke.BUTTERFLY },
    { label: 'Combinado', value: SwimStroke.IM },
]