import { FC } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"

const AppRoute: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoute 