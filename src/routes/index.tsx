import { FC } from 'react'
import { BrowserRouter, Routes, Route } from "react-router"
import { ROUTES } from "../config/routes"
import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"

const AppRoute: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoute 
