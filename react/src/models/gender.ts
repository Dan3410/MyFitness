export enum GENDER{
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export interface Gender {
    label: "Hombre" | "Mujer"
    value: GENDER.MALE | GENDER.FEMALE
}