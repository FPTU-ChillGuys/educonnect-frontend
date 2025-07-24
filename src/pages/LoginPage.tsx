import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { ROUTES } from "../config/routes";
import axiosInstance from "../services/axiosInstance";
import { AxiosError } from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "../contexts/ToastContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.data.accessToken);

      // Giải mã JWT token để lấy thông tin người dùng
      const token = response.data.data.accessToken;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const payload = JSON.parse(jsonPayload);

      // Lưu thông tin người dùng vào localStorage
      const userId =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      localStorage.setItem("userId", userId);
      const userData = {
        id: userId,
        name: payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ].split("@")[0],
        email:
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ],
        role: payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ].split("@")[0]
        )}`,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // Hiển thị toast thành công
      showToast(
        "success",
        "Đăng nhập thành công",
        `Chào mừng ${userData.name}!`
      );

      // Chuyển hướng dựa trên role của người dùng
      if (userData.role === "admin") {
        navigate(ROUTES.Dashboard);
      } else if (userData.role === "parent") {
        navigate(ROUTES.ParentMobileApp);
      } else {
        navigate(`${ROUTES.Dashboard}/${ROUTES.TeacherSchedule}`);
      }
    } catch (error) {
      // console.error("Login Error:", error);
      if (error instanceof AxiosError) {
        setError(
          error.response?.data?.message ||
            "Đăng nhập thất bại. Vui lòng thử lại."
        );
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-8 relative">
      <Link
        to={ROUTES.HomePage}
        className="absolute top-4 left-4 inline-flex items-center text-blue-700 hover:text-blue-500 transition-colors duration-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại trang chủ
      </Link>

      <div className="w-full max-w-md">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                // leftIcon={<User size={18} />}
              />

              <Input
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                required
                // leftIcon={<Key size={18} />}
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
            <div className="my-6 flex items-center justify-center">
              <span className="text-gray-400 text-xs mx-2">Hoặc</span>
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setError("");
                  setIsLoading(true);
                  try {
                    const response = await axiosInstance.post(
                      "/api/auth/google-login",
                      {
                        idToken: credentialResponse.credential,
                      }
                    );
                    //luu vao storage
                    localStorage.setItem(
                      "token",
                      response.data.data.accessToken
                    );
                    const token = response.data.data.accessToken;
                    const base64Url = token.split(".")[1];
                    const base64 = base64Url
                      .replace(/-/g, "+")
                      .replace(/_/g, "/");
                    const jsonPayload = decodeURIComponent(
                      atob(base64)
                        .split("")
                        .map(function (c) {
                          return (
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                          );
                        })
                        .join("")
                    );
                    const payload = JSON.parse(jsonPayload);
                    //luu thong tin nguoi dung vao storage
                    const userId =
                      payload[
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                      ];
                    localStorage.setItem("userId", userId);
                    const userData = {
                      id: userId,
                      name: payload[
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                      ].split("@")[0],
                      email:
                        payload[
                          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                        ],
                      role: payload[
                        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                      ],
                      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        payload[
                          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                        ].split("@")[0]
                      )}`,
                    };
                    localStorage.setItem("user", JSON.stringify(userData));

                    // Hiển thị toast thành công
                    showToast(
                      "success",
                      "Đăng nhập thành công",
                      `Chào mừng ${userData.name}!`
                    );

                    // Chuyển hướng dựa trên role của người dùng
                    if (userData.role === "admin") {
                      navigate(ROUTES.Dashboard);
                    } else if (userData.role === "parent") {
                      navigate(ROUTES.ParentMobileApp);
                    } else {
                      navigate(`${ROUTES.Dashboard}/${ROUTES.TeacherSchedule}`);
                    }
                  } catch (error) {
                    if (error instanceof AxiosError) {
                      setError(
                        error.response?.data?.message ||
                          "Đăng nhập Google thất bại. Vui lòng thử lại."
                      );
                    } else {
                      setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
                    }
                  } finally {
                    setIsLoading(false);
                  }
                }}
                onError={() => {
                  setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
                }}
                width="100%"
                size="large"
                text="signin_with"
                shape="rectangular"
                theme="outline"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          EduConnect © 2025 - AI Virtual Assistant for Parent-Teacher
          Communication
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          EduConnect © 2025 - AI Virtual Assistant for Parent-Teacher
          Communication
        </p>
      </div>
    </div>
  );
};
  );
};

export default LoginPage;

export default LoginPage;
