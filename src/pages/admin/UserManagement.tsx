import React, { useEffect, useState } from "react";
import { userApi } from "../../services/api/userApi";
import Button from "../../components/ui/Button";
import { Download, Edit2, Filter, GraduationCap, Plus, Search, Shield, Trash2, UserCheck, Users, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";


type User = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  isHomeroomTeacher: boolean;
  isSubjectTeacher: boolean;
  // Role, Status, CreatedAt sẽ để trống
};

const pageSize = 6;

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const params: { pageNumber: number; pageSize: number; Role?: string; Keyword?: string } = { pageNumber: page, pageSize };
      if (roleFilter !== "all") params.Role = roleFilter;
      if (search.trim() !== "") params.Keyword = search.trim();
      const res = await userApi.getUsers(params);
      setUsers(res.data);
      setTotalCount(res.totalCount);
    };
    fetchUsers();
  }, [page, roleFilter, search]);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
          >
            Xuất danh sách
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
          >
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">20</p>
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
    
    {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                  onChange={e => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Tên hoặc email..."
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <select
                value={roleFilter}
                onChange={e => {
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="suspended">Tạm khóa</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Thống kê nhanh</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hoạt động:</span>
                  <span className="font-medium text-green-600">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Không hoạt động:</span>
                  <span className="font-medium text-gray-600">
                    12
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm khóa:</span>
                  <span className="font-medium text-red-600">
                    0
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
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
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-56">Người dùng</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">Vai trò</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">Liên hệ</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">Ngày tạo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">Thao tác</th>
                    </tr>
                  </thead>
                  {users.length > 0 ? (
                    <tbody>
                      {Array.from({ length: pageSize }).map((_, idx) => {
                        const user = users[idx];
                        if (user) {
                          return (
                            <tr key={user.userId} className="border-b border-gray-100 hover:bg-gray-50 h-16">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold mr-3">
                                    {user.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-medium text-gray-900 truncate" title={user.fullName}>{user.fullName}</div>
                                    <div className="text-sm text-gray-500 truncate" title={user.email}>{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 truncate text-gray-700">--</td>
                              <td className="py-3 px-4 truncate" title={user.phoneNumber || '--'}>{user.phoneNumber || '--'}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">Hoạt động</span>
                              </td>
                              <td className="py-3 px-4 truncate">--</td>
                              <td className="py-3 px-4">
                                <div className="flex gap-1">
                                  <button
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    className="p-1 text-amber-600 hover:bg-amber-100 rounded"
                                    title="Đặt lại mật khẩu"
                                  >
                                    <Lock size={14} />
                                  </button>
                                  <button
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    title="Xóa"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        // Dòng trống cho đủ pageSize
                        return (
                          <tr key={`empty-${idx}`} className="h-16 border-b border-gray-100">
                            <td colSpan={6} className="py-3 px-4 text-gray-400 text-center">&nbsp;</td>
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
                              Không có người dùng nào phù hợp với từ khóa hoặc bộ lọc hiện tại.
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
              <div className="flex justify-end p-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Trang trước
                </Button>
                <span className="mx-2 flex items-center">Trang {page} / {Math.ceil(totalCount / pageSize)}</span>
                <Button
                  variant="primary"
                  disabled={page >= Math.ceil(totalCount / pageSize)}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Trang sau
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;