import { ButtonTheme } from "../themes/interfaces";

export interface SectionButton {
    name: string,
    description: string,
    disabled: boolean,
    buttonTheme: ButtonTheme,
    redirectFunction: () => void
}