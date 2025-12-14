import { ButtonTheme } from "../themes/theme.interfaces";

export interface SectionButton {
    name: string,
    description: string,
    disabled: boolean,
    buttonTheme: ButtonTheme,
    redirectFunction: () => void
}