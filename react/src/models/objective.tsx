export enum OBJECTIVE{
    REDUCE = "reduce",
    MAINTAIN = "maintain",
    INCREASE = "increase",
}

export interface objective {
    label: "Bajar de peso" | "Mantener el peso" | "Aumentar de peso"
    value: OBJECTIVE.REDUCE | OBJECTIVE.MAINTAIN | OBJECTIVE.INCREASE
}