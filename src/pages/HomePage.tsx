import { FC } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, MessageSquare, Calendar } from "lucide-react";
import Button from "../components/ui/Button";

const HomePage: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-2">
              <BookOpen className="text-blue-700" size={24} />
            </div>
            <span className="text-xl font-bold text-blue-800">EduConnect</span>
          </div>
          <Link to="/login">
            <Button variant="primary">Đăng nhập</Button>
          </Link>
        </div>
      </nav>

      {/* Main content with proper spacing from fixed header */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">
            Kết nối thông minh giữa gia đình và nhà trường
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nền tảng kết nối thông minh giữa phụ huynh và giáo viên thông qua
            trợ lý ảo AI
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <MessageSquare className="text-blue-700" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Giao tiếp thông minh</h3>
            <p className="text-gray-600">
              Trợ lý ảo AI hỗ trợ trao đổi thông tin nhanh chóng và chính xác
              giữa phụ huynh và giáo viên
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Calendar className="text-blue-700" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quản lý hiệu quả</h3>
            <p className="text-gray-600">
              Theo dõi thời khóa biểu, sổ đầu bài và hoạt động học tập một cách
              dễ dàng
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Users className="text-blue-700" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Kết nối liên tục</h3>
            <p className="text-gray-600">
              Cập nhật tình hình học tập và rèn luyện của học sinh theo thời
              gian thực
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-blue-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Tại sao chọn EduConnect?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="text-blue-700" size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Giao tiếp hiệu quả</h3>
                <p className="text-gray-600">
                  Trao đổi thông tin nhanh chóng, chính xác và tiện lợi
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-700" size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Theo dõi tiến độ</h3>
                <p className="text-gray-600">
                  Cập nhật liên tục về tình hình học tập của học sinh
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-8">
            Đã có hơn 1000+ phụ huynh và giáo viên sử dụng EduConnect
          </p>
          <Link to="/login">
            <Button variant="primary" size="lg">
              Bắt đầu sử dụng ngay
            </Button>
          </Link>
        </div>
      </div>

      <footer className="bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>
            EduConnect © 2025 - AI Virtual Assistant for Parent-Teacher
            Communication
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
