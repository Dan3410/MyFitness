export enum PHYSICALACTIVITYLVL{
    NONE = "none",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export interface physicalActivityLvl {
    label: "Ninguno" | "Bajo" | "Medio" | "Alto"
    value: PHYSICALACTIVITYLVL.NONE | PHYSICALACTIVITYLVL.LOW | PHYSICALACTIVITYLVL.MEDIUM | PHYSICALACTIVITYLVL.HIGH
}