import { Routes, Route, BrowserRouter } from "react-router-dom";
import Toolbar from "./Components/Toolbar";
import Coin from "./Router/Coin";
import Home from "./Router/Home";

function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:coinId/*" element={<Coin />}></Route>
        </Routes>
        <Toolbar />
      </BrowserRouter>
    </>
  );
}

export default Router;
