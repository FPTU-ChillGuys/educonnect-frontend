import { FC } from "react"
import Header from "../components/Header"

const HomePage: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-700 to-indigo-400">
      <Header />
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center pt-16">
        <div className="text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-white">
            Chào mừng đến với{" "}
            <span className="text-blue-300">EduConnect</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Nền tảng Trợ lý Ảo AI kết nối phụ huynh và giáo viên trong hệ thống
            trường học.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage 