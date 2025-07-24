import React, { useState, useEffect } from "react";
import { Bell, Search, Menu } from "lucide-react";

const Header: React.FC = () => {
  const [notifications, setNotifications] = useState<
    { id: string; title: string; time: string }[]
  >([
    { id: "1", title: "New message from AI Assistant", time: "5 min ago" },
    { id: "2", title: "Weekly report ready for review", time: "3 hours ago" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="md:hidden mr-4 text-gray-500 hover:text-gray-700">
            <Menu size={24} />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <ul className="py-1">
                      {notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.title}
                            </p>
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Mark as read
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm text-gray-500">
                        No new notifications
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200 bg-gray-50 text-center">
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline-block">
              {user?.name || "User"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
