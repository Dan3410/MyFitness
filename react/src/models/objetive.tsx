export enum OBJETIVE{
    REDUCE = "reduce weight",
    MAINTAIN = "maintain",
    INCREASE = "increase weight",
}

export interface objetive {
    label: "Bajar de peso" | "Mantener el peso" | "Aumentar de peso"
    value: OBJETIVE.REDUCE | OBJETIVE.MAINTAIN | OBJETIVE.INCREASE
}