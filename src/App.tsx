import { createGlobalStyle } from "styled-components";
import Router from "./Router";

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
  return (
    <>
      <GlobalStyle />
      <Router />
    </>
  );
}

export default App;
