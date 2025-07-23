import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  School,
  Shield,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import { ROUTES } from "../../config/routes";
import { useToast } from "../../contexts/ToastContext";
import { setLoggingOut } from "../../services/axiosInstance";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Lỗi khi parse thông tin người dùng:", error);
      }
    }
  }, []);

  const getNavigationItems = () => {
    const roleSpecificItems = {
      admin: [
        {
          to: ROUTES.Dashboard,
          icon: <LayoutDashboard size={20} />,
          label: "Dashboard",
          disabled: false,
        },
        {
          to: ROUTES.UserManagement,
          icon: <Shield size={20} />,
          label: "Quản lý người dùng",
          disabled: false,
        },
        {
          to: ROUTES.ClassManagement,
          icon: <School size={20} />,
          label: "Quản lý lớp học",
          disabled: false,
        },
        {
          to: ROUTES.TimeTable,
          icon: <CalendarDays size={20} />,
          label: "Thời khóa biểu",
          disabled: false,
        },
        {
          to: ROUTES.TeacherManagement,
          icon: <GraduationCap size={20} />,
          label: "Quản lý giáo viên",
          disabled: false,
        },
      ],
      teacher: [
        {
          to: ROUTES.TeacherSchedule,
          icon: <CalendarDays size={20} />,
          label: "Lịch giảng dạy",
          disabled: false,
        },
        // {
        //   to: ROUTES.TeacherClass,
        //   icon: <Users size={20} />,
        //   label: "Lớp chủ nhiệm",
        //   disabled: false,
        // },
        // {
        //   to: "",
        //   icon: <BookOpen size={20} />,
        //   label: "Sổ đầu bài",
        //   disabled: false,
        // },
      ],
    };

    const commonItems = [
      {
        to: ROUTES.Setting,
        icon: <Settings size={20} />,
        label: "Cài đặt",
        disabled: false,
      },
    ];

    // Sử dụng role từ thông tin người dùng thực tế
    const roleKey = user?.role;

    return [
      ...(roleKey &&
      roleSpecificItems[roleKey as keyof typeof roleSpecificItems]
        ? roleSpecificItems[roleKey as keyof typeof roleSpecificItems]
        : []),
      ...commonItems,
    ];
  };

  const SidebarLink: React.FC<SidebarLinkProps> = ({
    to,
    icon,
    label,
    disabled = false,
  }) => {
    if (!to || disabled) {
      return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed">
          <span className="text-xl">{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
      );
    }

    return (
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-700 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`
        }
      >
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </NavLink>
    );
  };

  const handleLogout = () => {
    // Đánh dấu đang trong quá trình đăng xuất
    setLoggingOut(true);

    // Hiển thị toast đăng xuất thành công
    showToast("success", "Đăng xuất thành công", "Hẹn gặp lại bạn!");

    // Xóa token và thông tin người dùng khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    // Delay một chút để cho các request đang pending kết thúc
    setTimeout(() => {
      setLoggingOut(false);
      // Chuyển hướng về trang login
      navigate(ROUTES.Login);
    }, 100);
  };

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="border-b border-gray-200 py-3 px-6 pt-3.5 pb-4">
        <div className="flex items-center gap-1">
          <img
            src="/logo.PNG"
            alt="logo"
            className="text-blue-700"
            width={35}
            height={35}
          />
          <h1 className="text-xl font-bold text-blue-800">EduConnect</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-2">
          {getNavigationItems().map((item) => (
            <SidebarLink
              key={item.label}
              to={item.to}
              icon={item.icon}
              label={item.label}
              disabled={item.disabled}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.avatar}
            alt={user?.name || "User"}
            status="online"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role === "admin"
                ? "Administrator"
                : user?.role === "teacher"
                ? "Teacher"
                : user?.role === "parent"
                ? "Parent"
                : "User"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
