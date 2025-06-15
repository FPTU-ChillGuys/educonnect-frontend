import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import {
  Users,
  Calendar,
  BookOpen,
  ChevronRight,
  School,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import Button from "../components/ui/Button";

// TODO: Thay thế mock userRole này bằng dữ liệu thực tế từ API khi có

const Dashboard: React.FC = () => {
  const getStats = () => {
    return [
      {
        title: "Tổng số lớp",
        value: "24",
        icon: <School className="text-blue-500" />,
        change: "+2",
      },
      {
        title: "Tổng số giáo viên",
        value: "45",
        icon: <GraduationCap className="text-purple-500" />,
        change: "+3",
      },
      {
        title: "Tổng số học sinh",
        value: "856",
        icon: <Users className="text-teal-500" />,
        change: "+12",
      },
      {
        title: "Bản ghi hôm nay",
        value: "127",
        icon: <BookOpen className="text-amber-500" />,
        change: "+15",
      },
    ];
  };

  const getRecentActivity = () => {
    return [
      {
        text: "Giáo viên Trần Thị Mai đã cập nhật sổ đầu bài lớp 10A",
        time: "15 phút trước",
      },
      {
        text: "Thêm mới giáo viên Nguyễn Văn Bình vào hệ thống",
        time: "1 giờ trước",
      },
      {
        text: "Cập nhật thời khóa biểu học kỳ 2 cho tất cả các lớp",
        time: "2 giờ trước",
      },
      {
        text: "Lớp 12B đã hoàn thành 95% bản ghi trong tuần",
        time: "3 giờ trước",
      },
    ];
  };

  const getQuickActions = () => {
    return [
      {
        text: "Thêm lớp học mới",
        icon: <School size={16} />,
        link: "#",
      },
      {
        text: "Quản lý giáo viên",
        icon: <GraduationCap size={16} />,
        link: "#",
      },
      {
        text: "Cập nhật thời khóa biểu",
        icon: <Calendar size={16} />,
        link: "#",
      },
      {
        text: "Xem thống kê tổng quan",
        icon: <ClipboardList size={16} />,
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {getWelcomeMessage()}
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Năm học 2024-2025</p>
          <p className="text-sm font-medium text-blue-600">Học kỳ 1</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getStats().map((stat, index) => (
          <Card
            key={index}
            className="border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className="text-xs text-green-600 mt-1">
                      +{stat.change} từ tuần trước
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-gray-100">{stat.icon}</div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800">Thống kê tuần này</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Tỷ lệ hoàn thành sổ đầu bài
                </span>
                <span className="font-semibold text-green-600">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Giáo viên hoạt động
                </span>
                <span className="font-semibold">42/45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Lớp có đầy đủ ghi chú
                </span>
                <span className="font-semibold">23/24</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-800">Cần chú ý</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                <p className="text-sm font-medium text-red-800">
                  Lớp 11C chưa có sổ đầu bài hôm nay
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Cần liên hệ giáo viên chủ nhiệm
                </p>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm font-medium text-yellow-800">
                  3 giáo viên chưa cập nhật lịch dạy
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Hạn chót: Cuối ngày hôm nay
                </p>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-sm font-medium text-blue-800">
                  Họp phụ huynh lớp 12 vào thứ 7
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Cần chuẩn bị báo cáo tổng kết
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
