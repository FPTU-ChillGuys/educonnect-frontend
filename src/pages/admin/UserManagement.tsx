import React, { useEffect, useState } from "react";
import { userApi } from "../../services/api/userApi";
import { authApi } from "../../services/api/authApi";
import { useToast } from "../../contexts/ToastContext";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import {
  Download,
  Edit2,
  Filter,
  GraduationCap,
  Plus,
  Search,
  Shield,
  UserCheck,
  Users,
  Lock,
  Unlock, // Thêm icon Unlock
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { AxiosError } from "axios";

type User = {
  userId: string;
  roleName: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  isHomeroomTeacher: boolean;
  isSubjectTeacher: boolean;
  isActive: boolean;
};

type FormErrors = {
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
  role?: string;
  general?: string;
};

type ErrorResponse = {
  message?: string;
  error?: string;
  status?: number;
  statusText?: string;
};

const pageSize = 6;

const UserManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  // Thêm state cho status filter
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "teacher",
  });
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [editFormErrors, setEditFormErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    general?: string;
  }>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateFormData = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.username.trim()) {
      errors.username = "Tên đăng nhập không được để trống";
    }

    if (!formData.fullName.trim()) {
      errors.fullName = "Họ và tên không được để trống";
    } else {
      // Kiểm tra fullName theo yêu cầu server
      const fullNameRegex = /^[\p{L}\s]+$/u;

      if (!formData.fullName.trim()) {
        errors.fullName = "Họ và tên không được để trống";
      } else if (!fullNameRegex.test(formData.fullName.trim())) {
        errors.fullName =
          "Họ và tên chỉ được chứa chữ cái và dấu cách, không chứa số hoặc ký tự đặc biệt";
      }
    }

    if (!formData.email.trim()) {
      errors.email = "Email không được để trống";
    } else {
      // Kiểm tra format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Email không đúng định dạng";
      }
    }

    if (!formData.password.trim()) {
      errors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const params: {
        pageNumber: number;
        pageSize: number;
        Role?: string;
        Keyword?: string;
        IsActive?: boolean; // Thêm IsActive parameter
      } = { pageNumber: page, pageSize };

      if (roleFilter !== "all") params.Role = roleFilter;
      if (search.trim() !== "") params.Keyword = search.trim();

      // Thêm filter theo status
      if (statusFilter === "active") {
        params.IsActive = true;
      } else if (statusFilter === "inactive") {
        params.IsActive = false;
      }
      // Nếu statusFilter === "all" thì không thêm IsActive parameter

      try {
        const res = await userApi.getUsers(params);
        setUsers(res.data);
        setTotalCount(res.totalCount);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        setTotalCount(0);
      }
    };
    fetchUsers();
  }, [page, roleFilter, search, statusFilter]); // Thêm statusFilter vào dependency array

  // Update các function khác để include statusFilter khi refresh data
  const refreshUserList = async () => {
    const params: {
      pageNumber: number;
      pageSize: number;
      Role?: string;
      Keyword?: string;
      IsActive?: boolean;
    } = { pageNumber: page, pageSize };

    if (roleFilter !== "all") params.Role = roleFilter;
    if (search.trim() !== "") params.Keyword = search.trim();
    if (statusFilter === "active") {
      params.IsActive = true;
    } else if (statusFilter === "inactive") {
      params.IsActive = false;
    }

    const res = await userApi.getUsers(params);
    setUsers(res.data);
    setTotalCount(res.totalCount);
  };

  // Tạo function refresh thông minh
  const smartRefreshUserList = async (
    userJustToggled?: User,
    newStatus?: boolean
  ) => {
    let finalStatusFilter = statusFilter;

    // Nếu có user vừa được toggle và filter hiện tại sẽ không hiển thị user đó
    if (userJustToggled && newStatus !== undefined) {
      if (statusFilter === "active" && newStatus === false) {
        finalStatusFilter = "all"; // Reset filter để hiển thị user vừa bị khóa
        setStatusFilter("all");
      } else if (statusFilter === "inactive" && newStatus === true) {
        finalStatusFilter = "all"; // Reset filter để hiển thị user vừa được mở khóa
        setStatusFilter("all");
      }
    }

    const params: {
      pageNumber: number;
      pageSize: number;
      Role?: string;
      Keyword?: string;
      IsActive?: boolean;
    } = { pageNumber: page, pageSize };

    if (roleFilter !== "all") params.Role = roleFilter;
    if (search.trim() !== "") params.Keyword = search.trim();

    // Sử dụng finalStatusFilter thay vì statusFilter
    if (finalStatusFilter === "active") {
      params.IsActive = true;
    } else if (finalStatusFilter === "inactive") {
      params.IsActive = false;
    }

    try {
      const res = await userApi.getUsers(params);
      setUsers(res.data);
      setTotalCount(res.totalCount);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setTotalCount(0);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset general error
    setFormErrors((prev) => ({ ...prev, general: undefined }));

    if (!validateFormData()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        // Sử dụng environment variable thay vì hardcode URL
        clientUri: `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
      };

      await authApi.register(userData);

      // Reset form và errors
      setFormData({
        username: "",
        fullName: "",
        email: "",
        password: "",
        role: "teacher",
      });
      setFormErrors({});

      // Close modal
      setIsAddModalOpen(false);

      // Refresh user list với filter hiện tại
      await refreshUserList();

      showToast(
        "success",
        "Thêm người dùng thành công!",
        `Người dùng ${formData.fullName} đã được thêm vào hệ thống.`
      );
    } catch (error) {
      console.error("Error adding user:", error);

      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ErrorResponse;

        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          `Lỗi ${error.response.status}: ${error.response.statusText}`;

        setFormErrors((prev) => ({
          ...prev,
          general: errorMessage,
        }));

        // Hiển thị toast error
        showToast("error", "Không thể thêm người dùng", errorMessage);
      } else {
        setFormErrors((prev) => ({
          ...prev,
          general: "Có lỗi xảy ra khi thêm người dùng!",
        }));

        showToast(
          "error",
          "Lỗi hệ thống",
          "Có lỗi xảy ra khi thêm người dùng!"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error khi user bắt đầu nhập
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    // Reset form và errors khi đóng modal
    setFormData({
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "teacher",
    });
    setFormErrors({});
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
    });
    setEditFormErrors({});
    setIsEditModalOpen(true);
  };

  const validateEditFormData = (): boolean => {
    const errors: typeof editFormErrors = {};

    if (!editFormData.fullName.trim()) {
      errors.fullName = "Họ và tên không được để trống";
    } else if (editFormData.fullName.trim().length < 2) {
      errors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    }

    // Phone number validation (optional)
    if (editFormData.phoneNumber.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(editFormData.phoneNumber.replace(/\s/g, ""))) {
        errors.phoneNumber = "Số điện thoại không hợp lệ (10-11 số)";
      }
    }

    // Address validation (optional)
    if (editFormData.address.trim() && editFormData.address.trim().length < 5) {
      errors.address = "Địa chỉ phải có ít nhất 5 ký tự";
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    // Reset general error
    setEditFormErrors((prev) => ({ ...prev, general: undefined }));

    if (!validateEditFormData()) {
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        fullName: editFormData.fullName.trim(),
        phoneNumber: editFormData.phoneNumber.trim(),
        address: editFormData.address.trim(),
      };

      await userApi.updateUser(editingUser.userId, updateData);

      // Close modal
      setIsEditModalOpen(false);
      setEditingUser(null);

      // Refresh user list với filter hiện tại
      await refreshUserList();

      showToast(
        "success",
        "Cập nhật thành công!",
        `Thông tin của ${editFormData.fullName} đã được cập nhật.`
      );
    } catch (error) {
      console.error("Error updating user:", error);

      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ErrorResponse;

        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          `Lỗi ${error.response.status}: ${error.response.statusText}`;

        setEditFormErrors((prev) => ({
          ...prev,
          general: errorMessage,
        }));

        // Hiển thị toast error
        showToast("error", "Không thể cập nhật", errorMessage);
      } else {
        setEditFormErrors((prev) => ({
          ...prev,
          general: "Có lỗi xảy ra khi cập nhật người dùng!",
        }));

        showToast(
          "error",
          "Lỗi hệ thống",
          "Có lỗi xảy ra khi cập nhật người dùng!"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error khi user bắt đầu nhập
    if (editFormErrors[name as keyof typeof editFormErrors]) {
      setEditFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditFormData({
      fullName: "",
      phoneNumber: "",
      address: "",
    });
    setEditFormErrors({});
  };

  const handleToggleUserStatus = async (user: User) => {
    const action = user.isActive ? "khóa" : "mở khóa";
    const newStatus = !user.isActive;

    // Hiển thị confirm dialog
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn ${action} tài khoản "${user.fullName}"?`
    );

    if (!confirmed) return;

    setIsLoading(true);

    try {
      await userApi.toggleUserStatus(user.userId, newStatus);

      // Sử dụng smart refresh
      await smartRefreshUserList(user, newStatus);

      const filterResetMessage =
        (statusFilter === "active" && newStatus === false) ||
        (statusFilter === "inactive" && newStatus === true)
          ? " Bộ lọc đã được reset để hiển thị tất cả người dùng."
          : "";

      showToast(
        "success",
        `${action.charAt(0).toUpperCase() + action.slice(1)} thành công!`,
        `Tài khoản "${user.fullName}" đã được ${action}.${filterResetMessage}`
      );
    } catch (error) {
      console.error("Error toggling user status:", error);

      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ErrorResponse;

        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          `Lỗi ${error.response.status}: ${error.response.statusText}`;

        showToast("error", `Không thể ${action}`, errorMessage);
      } else {
        showToast(
          "error",
          "Lỗi hệ thống",
          `Có lỗi xảy ra khi ${action} tài khoản!`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - giữ nguyên */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Xuất danh sách
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Statistics Cards - giữ nguyên */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalCount}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="text-blue-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quản trị viên</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <Shield className="text-red-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Giáo viên</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">10</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <GraduationCap className="text-blue-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Phụ huynh</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">10</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Users className="text-green-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">22</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <UserCheck className="text-green-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - cập nhật layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter size={18} />
              Bộ lọc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Tên hoặc email..."
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search
                  className="absolute left-2.5 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="Admin">Quản trị viên</option>
                <option value="Teacher">Giáo viên</option>
                <option value="Parent">Phụ huynh</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm khóa</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Thống kê nhanh
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng:</span>
                  <span className="font-medium text-gray-900">
                    {totalCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hoạt động:</span>
                  <span className="font-medium text-green-600">
                    {users.filter((u) => u.isActive).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm khóa:</span>
                  <span className="font-medium text-red-600">
                    {users.filter((u) => !u.isActive).length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User List - cập nhật theo style ClassManagement */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách người dùng</CardTitle>
                <span className="text-sm text-gray-500">
                  {totalCount} người dùng
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-56">
                        Người dùng
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">
                        Vai trò
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">
                        Liên hệ
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">
                        Địa chỉ
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">
                        Trạng thái
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  {users.length > 0 ? (
                    <tbody>
                      {Array.from({ length: pageSize }).map((_, idx) => {
                        const user = users[idx];
                        if (user) {
                          return (
                            <tr
                              key={user.userId}
                              className={`border-b border-gray-100 hover:bg-gray-50 h-16 ${
                                !user.isActive ? "opacity-75 bg-gray-25" : ""
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div
                                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold mr-3 ${
                                      user.isActive
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                                  >
                                    {user.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <div
                                      className={`font-medium truncate ${
                                        user.isActive
                                          ? "text-gray-900"
                                          : "text-gray-500"
                                      }`}
                                      title={user.fullName}
                                    >
                                      {user.fullName}
                                    </div>
                                    <div
                                      className={`text-sm truncate ${
                                        user.isActive
                                          ? "text-gray-500"
                                          : "text-gray-400"
                                      }`}
                                      title={user.email}
                                    >
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td
                                className={`py-3 px-4 truncate ${
                                  user.isActive
                                    ? "text-gray-700"
                                    : "text-gray-400"
                                }`}
                              >
                                {user.roleName.toUpperCase()}
                              </td>
                              <td
                                className={`py-3 px-4 truncate ${
                                  user.isActive
                                    ? "text-gray-700"
                                    : "text-gray-400"
                                }`}
                              >
                                {user.phoneNumber || "--"}
                              </td>
                              <td
                                className={`py-3 px-4 truncate ${
                                  user.isActive
                                    ? "text-gray-700"
                                    : "text-gray-400"
                                }`}
                                title={user.address || "--"}
                              >
                                {user.address || "--"}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    user.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {user.isActive ? "Hoạt động" : "Tạm khóa"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className={`p-1 rounded transition-colors ${
                                      user.isActive
                                        ? "text-blue-600 hover:bg-blue-100"
                                        : "text-gray-400 hover:bg-gray-100"
                                    }`}
                                    title="Chỉnh sửa"
                                    disabled={isLoading}
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleUserStatus(user)}
                                    className={`p-1 rounded transition-colors ${
                                      user.isActive
                                        ? "text-red-600 hover:bg-red-100"
                                        : "text-green-600 hover:bg-green-100"
                                    }`}
                                    title={
                                      user.isActive
                                        ? "Khóa người dùng"
                                        : "Mở khóa người dùng"
                                    }
                                    disabled={isLoading}
                                  >
                                    {user.isActive ? (
                                      <Lock size={14} />
                                    ) : (
                                      <Unlock size={14} />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        // Dòng trống cho đủ pageSize
                        return (
                          <tr
                            key={`empty-${idx}`}
                            className="h-16 border-b border-gray-100"
                          >
                            <td
                              colSpan={6}
                              className="py-3 px-4 text-gray-400 text-center"
                            >
                              &nbsp;
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={6}>
                          <div className="text-center py-8">
                            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              Không tìm thấy người dùng
                            </h3>
                            <p className="text-gray-500">
                              Không có người dùng nào phù hợp với từ khóa hoặc
                              bộ lọc hiện tại.
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>

              {/* Pagination - cập nhật theo style ClassManagement */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Hiển thị {Math.min((page - 1) * pageSize + 1, totalCount)} -{" "}
                  {Math.min(page * pageSize, totalCount)} của {totalCount} người
                  dùng
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Trang trước
                  </Button>
                  <span className="flex items-center px-3 py-1 text-sm">
                    Trang {page} / {Math.ceil(totalCount / pageSize)}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= Math.ceil(totalCount / pageSize)}
                    onClick={() => setPage(page + 1)}
                  >
                    Trang sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals - giữ nguyên */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        title="Thêm người dùng mới"
      >
        {/* Form content giữ nguyên */}
        <form onSubmit={handleAddUser} className="space-y-4">
          {/* General Error */}
          {formErrors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {formErrors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.username ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập tên đăng nhập"
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *{" "}
              <span className="text-xs text-gray-500">
                (5-50 ký tự, không có ký tự đặc biệt hay số)
              </span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.fullName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="VD: Nguyễn Văn A hoặc Nguyen Van A"
            />
            {formErrors.fullName && (
              <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập địa chỉ email"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.password ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.role ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="admin">Quản trị viên</option>
              <option value="teacher">Giáo viên</option>
              <option value="parent">Phụ huynh</option>
            </select>
            {formErrors.role && (
              <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              className="flex-1"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Đang thêm..." : "Thêm người dùng"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal - giữ nguyên */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        title={`Chỉnh sửa thông tin: ${editingUser?.fullName || ""}`}
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          {/* General Error */}
          {editFormErrors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {editFormErrors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              name="fullName"
              value={editFormData.fullName}
              onChange={handleEditInputChange}
              required
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                editFormErrors.fullName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập họ và tên"
            />
            {editFormErrors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {editFormErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={editFormData.phoneNumber}
              onChange={handleEditInputChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                editFormErrors.phoneNumber
                  ? "border-red-300"
                  : "border-gray-300"
              }`}
              placeholder="Nhập số điện thoại (tùy chọn)"
            />
            {editFormErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">
                {editFormErrors.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
              name="address"
              value={editFormData.address}
              onChange={handleEditInputChange}
              rows={3}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                editFormErrors.address ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập địa chỉ (tùy chọn)"
            />
            {editFormErrors.address && (
              <p className="mt-1 text-sm text-red-600">
                {editFormErrors.address}
              </p>
            )}
          </div>

          {/* Current info display */}
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Thông tin hiện tại:
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Email:</span> {editingUser?.email}
              </p>
              <p>
                <span className="font-medium">Vai trò:</span>{" "}
                {editingUser?.roleName}
              </p>
              <p>
                <span className="font-medium">Trạng thái:</span>{" "}
                {editingUser?.isActive ? "Hoạt động" : "Không hoạt động"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleEditModalClose}
              className="flex-1"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
