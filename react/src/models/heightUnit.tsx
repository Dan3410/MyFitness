export enum HEIGHTUNIT{
    CM = "cm",
    FEET = "feet"
}

export interface HeightUnit {
    label: "Centímetros (cms)" | "Pies (feets)"
    value: HEIGHTUNIT.CM | HEIGHTUNIT.FEET
}