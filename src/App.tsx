import { createGlobalStyle, ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import Router from "./Router";
import { useRecoilValue } from "recoil";
import { isDark } from "./atom";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
    margin: 0 auto;
    padding-left: 80px;
    padding-right: 80px;
    max-width: 1920px;
    @media (max-width: 600px) {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
`;

function App() {
  const dark = useRecoilValue(isDark);
  return (
    <>
      <ThemeProvider theme={dark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <Router />
      </ThemeProvider>
    </>
  );
}

export default App;
