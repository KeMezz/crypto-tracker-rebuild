import { Routes, Route, BrowserRouter } from "react-router-dom";
import Coin from "./Router/Coin";
import Home from "./Router/Home";

function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:coinId" element={<Coin />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Router;
