import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";

const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoute;
