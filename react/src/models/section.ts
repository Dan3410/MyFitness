import type { ColorVariant } from "./colorVariant";

export interface SectionButton {
    name: string,
    description: string,
    disabled: boolean,
    buttonTheme: ColorVariant,
    redirectFunction: () => void
}