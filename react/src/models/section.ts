import { ComponentTheme } from "../themes/enums";

export interface SectionButton {
    name: string,
    description: string,
    disabled: boolean,
    buttonTheme: ComponentTheme,
    redirectFunction: () => void
}