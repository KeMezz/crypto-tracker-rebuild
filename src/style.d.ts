import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    accentColor: string;
    bgColor: string;
    cardColor: string;
    toolbarColor: string;
  }
}
