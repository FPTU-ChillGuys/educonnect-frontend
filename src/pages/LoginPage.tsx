import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Key, ArrowLeft, LogIn } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { ROUTES } from "../config/routes";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center px-4 py-8 relative">
      <Link
        to={ROUTES.HomePage}
        className="absolute top-4 left-4 inline-flex items-center text-blue-700 hover:text-blue-500 transition-colors duration-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại trang chủ
      </Link>

      <div className="w-full max-w-md mt-16">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/logo.PNG"
            alt="logo"
            className="text-blue-700 mr-3"
            width={60}
            height={60}
          />
          <h1 className="text-3xl font-bold text-blue-800">EduConnect</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Đăng nhập
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                leftIcon={<User size={18} />}
              />

              <Input
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                required
                leftIcon={<Key size={18} />}
                showPasswordToggle
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                leftIcon={<LogIn size={18} />}
              >
                Đăng nhập
              </Button>
            </form>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          EduConnect © 2025 - AI Virtual Assistant for Parent-Teacher
          Communication
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
