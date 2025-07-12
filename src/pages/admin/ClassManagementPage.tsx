import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

// CSS cho table cố định kích thước
const tableStyles = `
  .fixed-table {
    table-layout: fixed;
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
  }
  
  .fixed-table th,
  .fixed-table td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
  
  .fixed-table th {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    border-bottom: 2px solid #e5e7eb;
    overflow: visible;
    white-space: normal;
    word-wrap: break-word;
    min-height: 60px;
    display: table-cell;
    vertical-align: middle;
    padding: 12px 16px;
    font-weight: 600;
    color: #374151;
    text-align: left;
    line-height: 1.4;
  }
  
  .fixed-table th:hover {
    background-color: #f8fafc;
  }
  
  .table-container {
    max-height: 650px;
    overflow-y: auto;
    border: none;
    border-radius: 0;
  }
  
  .fixed-table tr {
    height: 64px;
    min-height: 64px;
  }
  
  .fixed-table tr:hover {
    background-color: #f9fafb;
  }
  
  .fixed-table td {
    border-bottom: 1px solid #f3f4f6;
  }
  
  @media (max-width: 1024px) {
    .table-container {
      max-height: 550px;
    }
  }
`;
import Button from "../../components/ui/Button";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Users,
  GraduationCap,
  UserPlus,
  Download,
  Filter,
} from "lucide-react";
import { Class, Student } from "../../types/index";
import { dashboardApi, classApi } from "../../services/api";

type StudentApi = {
  studentId: string;
  fullName: string;
  studentCode: string;
  gender: string;
  dateOfBirth: string;
  className: string;
  parentEmail: string;
  parentPhoneNumber: string;
  status : string;
  // Thêm các trường khác nếu cần
};

const ClassManagementPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddStudentModal, setShowAddStudentModal] =
    useState<boolean>(false);
  const [showAddClassModal, setShowAddClassModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState<{
    totalClasses: number;
    totalStudents: number;
    totalHomeroomTeachers: number;
    totalSubjectTeachers: number;
  } | null>(null);
  const [students, setStudents] = useState<StudentApi []>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Mock data for classes
  const [classes] = useState<Class[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getAllStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
      } 
    };
    const fetchStudents = async () => {
      try {
        const res = await classApi.getStudents({ pageNumber: page, pageSize });
        setStudents(res.data);
        setTotalCount(res.totalCount);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
      }
    };

    fetchStudents();
    fetchStats();
  }, [page]);

  const filteredStudents = students;

  return (
    <div className="space-y-6">
      <style>{tableStyles}</style>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý lớp học</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin lớp học và học sinh
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Xuất danh sách
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowAddClassModal(true)}
            leftIcon={<Plus size={16} />}
          >
            Thêm lớp
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowAddStudentModal(true)}
            leftIcon={<UserPlus size={16} />}
          >
            Thêm học sinh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số lớp</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalClasses !== null ? stats?.totalClasses : "Đang tải..."}
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
                <p className="text-sm text-gray-600">Tổng số học sinh</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalStudents !== null ? stats?.totalStudents : "Đang tải..."}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <GraduationCap className="text-green-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Học sinh đang học</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalStudents !== null ? stats?.totalStudents : "Đang tải..."}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-teal-100">
                <Users className="text-teal-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                Lớp học
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả lớp</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Lớp {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tên hoặc mã học sinh..."
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search
                  className="absolute left-2.5 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Thống kê lớp
              </h4>
              <div className="space-y-2">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">Lớp {cls.name}:</span>
                    <span className="font-medium">
                      {cls.students.length} HS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Danh sách học sinh
                    {selectedClass !== "all" && ` - Lớp ${selectedClass}`}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {filteredStudents.length} học sinh
                  </span>
                </div>
              </div>
              <div className="table-container overflow-x-auto">
                <table className="w-full table-fixed fixed-table">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-28">
                        Mã HS
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-56">
                        Họ và tên
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-24">
                        Lớp
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-24">
                        Giới tính
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-32">
                        Ngày sinh
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-36">
                        Liên hệ PH
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-28">
                        Trạng thái
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-24">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: pageSize }).map((_, idx) => {
                      const student = students[idx];
                      if (student) {
                        return (
                          <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50 h-16">
                           <td className="py-3 px-4 font-medium text-blue-600 truncate" title={student.studentCode}>
                          {student.studentCode}
                        </td>
                        <td className="py-3 px-4 truncate" title={student.fullName}>{student.fullName}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap" title={student.className}>
                            {student.className}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              student.gender === "Nam"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                            title={student.gender}
                          >
                            {student.gender}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                          {new Date(student.dateOfBirth).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 truncate" title={student.parentPhoneNumber}>
                          {student.parentPhoneNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              student.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : student.status === "Inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                            title={student.status === "Active" ? "Đang học" : student.status === "Inactive" ? "Tạm nghỉ" : "Tạm nghỉ"}
                          >
                            {student.status === "Active"
                              ? "Đang học"
                              : student.status === "Inactive"
                              ? "Tạm nghỉ"
                              : "Tạm nghỉ"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Chỉnh sửa"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                          </tr>
                        );
                      }
                      // Dòng trống
                      return (
                        <tr key={`empty-${idx}`} className="h-16 border-b border-gray-100">
                          <td colSpan={8} className="py-3 px-4 text-gray-400 text-center">
                            &nbsp;
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy học sinh
                    </h3>
                    <p className="text-gray-500">
                      Không có học sinh nào phù hợp với bộ lọc hiện tại.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end p-4 border-t border-gray-200">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Trang trước
                </Button>
                <span className="mx-2 flex items-center">Trang {page} / {Math.ceil(totalCount / pageSize)}</span>
                <Button
                  disabled={page >= Math.ceil(totalCount / pageSize)}
                  onClick={() => setPage(page + 1)}
                >
                  Trang sau
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingStudent ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}
            </h3>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã học sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="HS001"
                    defaultValue={editingStudent?.studentId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nguyễn Văn An"
                    defaultValue={editingStudent?.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lớp <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingStudent?.classId}
                  >
                    <option value="">Chọn lớp</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        Lớp {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingStudent?.gender}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingStudent?.dateOfBirth}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại phụ huynh
                  </label>
                  <input
                    type="tel"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0901234567"
                    defaultValue={editingStudent?.parentContact}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Nhập địa chỉ đầy đủ..."
                  defaultValue={editingStudent?.address}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={editingStudent?.status || "active"}
                >
                  <option value="active">Đang học</option>
                  <option value="inactive">Tạm nghỉ</option>
                  <option value="transferred">Chuyển trường</option>
                </select>
              </div>
            </form>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddStudentModal(false);
                  setEditingStudent(null);
                }}
              >
                Hủy
              </Button>
              <Button variant="primary">
                {editingStudent ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm lớp học mới</h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên lớp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10C"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khối <span className="text-red-500">*</span>
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Chọn khối</option>
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giáo viên chủ nhiệm
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Chọn giáo viên</option>
                  <option value="2">Trần Thị Mai</option>
                  <option value="3">Lê Minh Hoàng</option>
                  <option value="4">Phạm Văn Đức</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Năm học
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2024-2025"
                  defaultValue="2024-2025"
                />
              </div>
            </form>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddClassModal(false)}
              >
                Hủy
              </Button>
              <Button variant="primary">Thêm lớp</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagementPage;
