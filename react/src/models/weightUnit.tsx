export enum WEIGHTUNIT{
    KG = "kg",
    LB = "lb"
}

export interface WeightUnit {
    label: "Kilogramos" | "Libras"
    value: WEIGHTUNIT.KG | WEIGHTUNIT.LB
}