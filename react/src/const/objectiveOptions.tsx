import { OBJECTIVE } from "../models/objective";

export const CONST_OBJETIVE_OPTIONS: Array<{label: string, value: OBJECTIVE}> = [
    {label: "Bajar de peso", value: OBJECTIVE.REDUCE},
    {label: "Mantener el peso", value: OBJECTIVE.MAINTAIN},
    {label: "Aumentar de peso", value: OBJECTIVE.INCREASE}
]