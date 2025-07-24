import React from "react";
import {
  Smartphone,
  Download,
  Users,
  MessageCircle,
  Calendar,
  LogOut,
} from "lucide-react";
import Button from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

const ParentMobileAppPage: React.FC = () => {
  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    // Chuyển hướng về trang đăng nhập
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header với logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/logo.PNG"
              alt="EduConnect Logo"
              className="w-10 h-10 mr-3"
            />
            <h1 className="text-xl font-bold text-blue-800">EduConnect</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            leftIcon={<LogOut size={16} />}
            className="text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300"
          >
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <Smartphone className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chào mừng phụ huynh đến với EduConnect!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Để có trải nghiệm tốt nhất và theo dõi con em một cách thuận tiện,
              vui lòng tải ứng dụng EduConnect trên điện thoại di động.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Features */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Tính năng chính
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Theo dõi lịch học
                    </h4>
                    <p className="text-sm text-gray-600">
                      Xem thời khóa biểu và lịch học của con
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Liên lạc với AI trợ lý ảo
                    </h4>
                    <p className="text-sm text-gray-600">
                      Nhắn tin trực tiếp với AI trợ lý ảo
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Thông báo real-time
                    </h4>
                    <p className="text-sm text-gray-600">
                      Nhận thông báo quan trọng ngay lập tức
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download section */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  Tải ứng dụng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700">
                  Ứng dụng EduConnect đang được phát triển và sẽ sớm có mặt
                  trên:
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">
                        A
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Google Play Store
                      </p>
                      <p className="text-xs text-gray-500">Dành cho Android</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        🍎
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">App Store</p>
                      <p className="text-xs text-gray-500">Dành cho iOS</p>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">
                    📱 Ứng dụng sắp ra mắt!
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Chúng tôi sẽ thông báo khi ứng dụng sẵn sàng tải về
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support info */}
          <div className="text-center">
            <Card className="inline-block bg-gray-50 border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-2">Cần hỗ trợ?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Liên hệ với chúng tôi để được hỗ trợ sử dụng ứng dụng
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="text-blue-600">
                    📧 support@educonnect.vn
                  </span>
                  <span className="text-blue-600">📞 (+84) 792-515-292</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          EduConnect © 2025 - AI Virtual Assistant for Parent-Teacher
          Communication
        </div>
      </div>
    </div>
  );
};

export default ParentMobileAppPage;
