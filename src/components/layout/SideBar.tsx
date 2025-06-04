import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import Avatar from "../ui/Avatar";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "parent";
  avatar?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  active,
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? "bg-blue-700 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Thêm dòng này

  // TODO: Replace with actual API call
  const name = "Nguyễn Admin";
  const mockUser: User = {
    id: "1",
    name,
    email: "admin@admin.com",
    role: "admin",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        to: "/dashboard",
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
      },
    ];

    const roleSpecificItems = {
      admin: [
        {
          to: "#",
          icon: <CalendarDays size={20} />,
          label: "Timetable",
        },
        { to: "#", icon: <Users size={20} />, label: "Classes" },
      ],
      teacher: [
        {
          to: "#",
          icon: <Bell size={20} />,
          label: "Notifications",
        },
        {
          to: "#",
          icon: <Users size={20} />,
          label: "Classes",
        },
        {
          to: "#",
          icon: <BookOpen size={20} />,
          label: "Record Book",
        },
        {
          to: "#",
          icon: <Users size={20} />,
          label: "Students",
        },
        {
          to: "#",
          icon: <MessageSquare size={20} />,
          label: "Chat",
        },
      ],
      parent: [
        { to: "#", icon: <BookOpen size={20} />, label: "Progress" },
        {
          to: "#",
          icon: <Bell size={20} />,
          label: "Notifications",
        },
        {
          to: "#",
          icon: <MessageSquare size={20} />,
          label: "Chat",
        },
      ],
    };

    const commonItems = [
      { to: "#", icon: <Settings size={20} />, label: "Settings" },
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

  const handleLogout = () => {
    // TODO: Implement logout functionality when API is available
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <img
            src="/logo.PNG"
            alt="logo"
            className="text-blue-700 "
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
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={isActive(item.to)}
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
