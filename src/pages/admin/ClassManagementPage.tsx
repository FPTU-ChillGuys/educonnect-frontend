import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
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

const ClassManagementPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddStudentModal, setShowAddStudentModal] =
    useState<boolean>(false);
  const [showAddClassModal, setShowAddClassModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Mock data for classes
  const [classes] = useState<Class[]>([
    {
      id: "10A",
      name: "10A",
      grade: 10,
      homeroomTeacherId: "2",
      academicYear: "2024-2025",
      students: [
        {
          id: "1",
          name: "Nguyễn Văn An",
          studentId: "HS001",
          classId: "10A",
          dateOfBirth: "2009-03-15",
          gender: "male",
          address: "123 Đường ABC, Quận 1, TP.HCM",
          parentContact: "0901234567",
          enrollmentDate: "2024-09-01",
          status: "active",
        },
        {
          id: "2",
          name: "Trần Thị Bình",
          studentId: "HS002",
          classId: "10A",
          dateOfBirth: "2009-05-20",
          gender: "female",
          address: "456 Đường DEF, Quận 2, TP.HCM",
          parentContact: "0912345678",
          enrollmentDate: "2024-09-01",
          status: "active",
        },
        {
          id: "3",
          name: "Lê Minh Cường",
          studentId: "HS003",
          classId: "10A",
          dateOfBirth: "2009-01-10",
          gender: "male",
          address: "789 Đường GHI, Quận 3, TP.HCM",
          parentContact: "0923456789",
          enrollmentDate: "2024-09-01",
          status: "active",
        },
      ],
      createdAt: "2024-08-15T00:00:00Z",
      updatedAt: "2024-08-15T00:00:00Z",
    },
    {
      id: "10B",
      name: "10B",
      grade: 10,
      homeroomTeacherId: "3",
      academicYear: "2024-2025",
      students: [
        {
          id: "4",
          name: "Phạm Thị Dung",
          studentId: "HS004",
          classId: "10B",
          dateOfBirth: "2009-07-25",
          gender: "female",
          address: "321 Đường JKL, Quận 4, TP.HCM",
          parentContact: "0934567890",
          enrollmentDate: "2024-09-01",
          status: "active",
        },
        {
          id: "5",
          name: "Hoàng Văn Em",
          studentId: "HS005",
          classId: "10B",
          dateOfBirth: "2009-04-12",
          gender: "male",
          address: "654 Đường MNO, Quận 5, TP.HCM",
          parentContact: "0945678901",
          enrollmentDate: "2024-09-01",
          status: "active",
        },
      ],
      createdAt: "2024-08-15T00:00:00Z",
      updatedAt: "2024-08-15T00:00:00Z",
    },
    {
      id: "11A",
      name: "11A",
      grade: 11,
      homeroomTeacherId: "2",
      academicYear: "2024-2025",
      students: [
        {
          id: "6",
          name: "Vũ Thị Giang",
          studentId: "HS006",
          classId: "11A",
          dateOfBirth: "2008-09-30",
          gender: "female",
          address: "987 Đường PQR, Quận 6, TP.HCM",
          parentContact: "0956789012",
          enrollmentDate: "2023-09-01",
          status: "active",
        },
      ],
      createdAt: "2024-08-15T00:00:00Z",
      updatedAt: "2024-08-15T00:00:00Z",
    },
  ]);

  // Get all students from all classes
  const getAllStudents = (): Student[] => {
    return classes.flatMap((cls) => cls.students);
  };

  // Filter students based on selected class and search term
  const getFilteredStudents = (): Student[] => {
    let students = getAllStudents();

    if (selectedClass !== "all") {
      students = students.filter(
        (student) => student.classId === selectedClass
      );
    }

    if (searchTerm) {
      students = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return students;
  };

  const getClassStats = () => {
    const totalStudents = getAllStudents().length;
    const activeStudents = getAllStudents().filter(
      (s) => s.status === "active"
    ).length;
    const totalClasses = classes.length;

    return { totalStudents, activeStudents, totalClasses };
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowAddStudentModal(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      // Implementation would go here
      console.log("Delete student:", studentId);
    }
  };

  const stats = getClassStats();
  const filteredStudents = getFilteredStudents();

  return (
    <div className="space-y-6">
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
                  {stats.totalClasses}
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
                  {stats.totalStudents}
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
                  {stats.activeStudents}
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
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Danh sách học sinh
                  {selectedClass !== "all" && ` - Lớp ${selectedClass}`}
                </CardTitle>
                <span className="text-sm text-gray-500">
                  {filteredStudents.length} học sinh
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Mã HS
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Họ và tên
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Lớp
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Giới tính
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Ngày sinh
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Liên hệ PH
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Trạng thái
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium text-blue-600">
                          {student.studentId}
                        </td>
                        <td className="py-3 px-4">{student.name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {student.classId}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.gender === "male"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {student.gender === "male" ? "Nam" : "Nữ"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(student.dateOfBirth).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {student.parentContact}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === "active"
                                ? "bg-green-100 text-green-800"
                                : student.status === "inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {student.status === "active"
                              ? "Đang học"
                              : student.status === "inactive"
                              ? "Tạm nghỉ"
                              : "Chuyển trường"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
