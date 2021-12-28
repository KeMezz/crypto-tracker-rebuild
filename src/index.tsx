import React from "react";
import ReactDOM from "react-dom";
import "./reset.css";
import App from "./App";
import { RecoilRoot } from "recoil";
import { darkTheme } from "./theme";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={darkTheme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
