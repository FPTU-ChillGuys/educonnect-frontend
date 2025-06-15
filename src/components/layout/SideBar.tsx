import React from "react";
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
} from "lucide-react";
import Avatar from "../ui/Avatar";
import { ROUTES } from "../../config/routes";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher";
  avatar?: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // TODO: Replace with actual API call
  const name = "Nguyễn Admin";
  const mockUser: User = {
    id: "1",
    name,
    email: "admin@admin.com",
    role: "admin",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        to: ROUTES.Dashboard,
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
        disabled: false,
      },
    ];

    const roleSpecificItems = {
      admin: [
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
          to: "",
          icon: <CalendarDays size={20} />,
          label: "Lịch giảng dạy",
          disabled: false,
        },
        {
          to: "",
          icon: <Users size={20} />,
          label: "Lớp chủ nhiệm",
          disabled: false,
        },

        {
          to: "",
          icon: <BookOpen size={20} />,
          label: "Sổ đầu bài",
          disabled: false,
        },
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

    // Map user role to the correct key in roleSpecificItems
    const roleKey = mockUser.role;

    return [
      ...baseItems,
      ...(roleKey && roleSpecificItems[roleKey]
        ? roleSpecificItems[roleKey]
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
    // TODO: Implement logout functionality when API is available
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="border-b border-gray-200 p-4">
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
          <Avatar src={mockUser.avatar} alt={mockUser.name} status="online" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {mockUser.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {mockUser.role === "admin"
                ? "Administrator"
                : mockUser.role === "teacher"
                ? "Teacher"
                : "Parent"}
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
