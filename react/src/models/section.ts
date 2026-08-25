import { ComponentTheme } from "./componentTheme";

export interface SectionButton {
    name: string,
    description: string,
    disabled: boolean,
    buttonTheme: ComponentTheme,
    redirectFunction: () => void
}