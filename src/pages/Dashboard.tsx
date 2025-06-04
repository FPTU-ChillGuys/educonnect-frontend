import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Users, Calendar, BookOpen, Bell, ChevronRight } from "lucide-react";
import Button from "../components/ui/Button";

// TODO: Thay thế mock userRole này bằng dữ liệu thực tế từ API khi có

const Dashboard: React.FC = () => {
  const getStats = () => {
    return [
      {
        title: "Tổng số giáo viên",
        value: "42",
        icon: <Users className="text-blue-500" />,
      },
      {
        title: "Tổng số lớp",
        value: "18",
        icon: <BookOpen className="text-purple-500" />,
      },
      {
        title: "Sự kiện tháng này",
        value: "8",
        icon: <Calendar className="text-teal-500" />,
      },
      {
        title: "Thông báo mới",
        value: "12",
        icon: <Bell className="text-amber-500" />,
      },
    ];
  };

  const getRecentActivity = () => {
    return [
      {
        text: "Thời khóa biểu học kỳ 2 đã được cập nhật",
        time: "2 giờ trước",
      },
      {
        text: "Nguyễn Văn Anh đã thêm ghi chú mới cho lớp 10A",
        time: "3 giờ trước",
      },
      { text: "Lịch họp phụ huynh đã được gửi đi", time: "1 ngày trước" },
    ];
  };

  const getQuickActions = () => {
    return [
      {
        text: "Quản lý thời khóa biểu",
        icon: <Calendar size={16} />,
        link: "#",
      },
      {
        text: "Thêm lớp học mới",
        icon: <Users size={16} />,
        link: "#",
      },
      {
        text: "Gửi thông báo toàn trường",
        icon: <Bell size={16} />,
        link: "#",
      },
    ];
  };

  const getWelcomeMessage = () => {
    const hours = new Date().getHours();
    let greeting = "Xin chào";

    if (hours < 12) {
      greeting = "Chào buổi sáng";
    } else if (hours < 18) {
      greeting = "Chào buổi chiều";
    } else {
      greeting = "Chào buổi tối";
    }

    return `${greeting}, Quản trị viên!`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {getWelcomeMessage()}
        </h1>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getStats().map((stat, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gray-100">{stat.icon}</div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getQuickActions().map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  fullWidth
                  leftIcon={action.icon}
                  rightIcon={<ChevronRight size={16} />}
                  className="justify-between"
                >
                  {action.text}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getRecentActivity().map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                  <div>
                    <p className="text-gray-800">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific content */}
      {/* {userRole === "classTeacher" && (
        <Card className="border border-gray-200">
          <CardHeader className="bg-blue-50">
            <CardTitle>Lời dặn dò hôm nay</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md min-h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập lời dặn dò cho học sinh..."
              defaultValue="Các em nhớ hoàn thành bài tập Toán trang 45-46 và chuẩn bị cho bài kiểm tra Vật lý vào thứ Năm. Lớp trưởng nhắc các bạn dọn vệ sinh lớp học vào cuối giờ."
            />
            <div className="mt-4 flex justify-end">
              <Button variant="primary">Lưu lời dặn dò</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === "parent" && (
        <Card className="border border-gray-200">
          <CardHeader className="bg-blue-50">
            <CardTitle>Trợ lý ảo EduConnect</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-4">
              Bạn có thể hỏi trợ lý ảo về tình hình học tập của con em mình,
              thời khóa biểu, các sự kiện sắp tới hoặc bất kỳ thông tin nào liên
              quan đến trường học.
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Hỏi trợ lý ảo EduConnect..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button variant="primary">Gửi</Button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p>
                Gợi ý: "Con tôi học thế nào hôm nay?", "Có bài tập về nhà
                không?", "Tuần này có sự kiện gì?"
              </p>
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
};

export default Dashboard;
