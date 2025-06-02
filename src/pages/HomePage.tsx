import { FC } from "react"

const HomePage: FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          Chào mừng đến với{" "}
          <span className="text-blue-600 dark:text-blue-400">EduConnect</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
          Nền tảng Trợ lý Ảo AI kết nối phụ huynh và giáo viên trong hệ thống
          trường học.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
          Bắt đầu ngay
        </button>
      </div>
    </div>
  )
}

export default HomePage 