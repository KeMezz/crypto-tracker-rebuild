import { Routes, Route, BrowserRouter } from "react-router-dom";
import Toolbar from "./Components/Toolbar";
import Coin from "./Router/Coin";
import Home from "./Router/Home";
import Search from "./Router/Search";

function Router() {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:coinId/*" element={<Coin />}></Route>
          <Route path="/search/*" element={<Search />}></Route>
        </Routes>
        <Toolbar />
      </BrowserRouter>
    </>
  );
}

export default Router;
