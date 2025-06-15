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
  UserCheck,
  Download,
  Filter,
  Mail,
} from "lucide-react";
import { User, Subject } from "../../types";

const TeacherManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [showAddTeacherModal, setShowAddTeacherModal] =
    useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);

  // Mock data for teachers
  const [teachers] = useState<User[]>([
    {
      id: "2",
      name: "Trần Thị Mai",
      email: "teacher1@educonnect.com",
      role: "teacher",
      avatar: "https://i.pravatar.cc/150?img=2",
      teacherInfo: {
        employeeId: "GV001",
        subjects: [
          { id: "math", name: "Toán học", code: "MATH", grade: 10 },
          { id: "physics", name: "Vật lý", code: "PHYS", grade: 10 },
        ],
        homeroomClassId: "10A",
        teachingClasses: ["10A", "10B", "11A"],
      },
    },
    {
      id: "3",
      name: "Lê Minh Hoàng",
      email: "teacher2@educonnect.com",
      role: "teacher",
      avatar: "https://i.pravatar.cc/150?img=3",
      teacherInfo: {
        employeeId: "GV002",
        subjects: [
          { id: "literature", name: "Ngữ văn", code: "LIT", grade: 11 },
          { id: "history", name: "Lịch sử", code: "HIST", grade: 11 },
        ],
        homeroomClassId: "11B",
        teachingClasses: ["11A", "11B", "12A"],
      },
    },
    {
      id: "4",
      name: "Phạm Văn Đức",
      email: "teacher3@educonnect.com",
      role: "teacher",
      avatar: "https://i.pravatar.cc/150?img=4",
      teacherInfo: {
        employeeId: "GV003",
        subjects: [
          { id: "english", name: "Tiếng Anh", code: "ENG", grade: 10 },
          { id: "english", name: "Tiếng Anh", code: "ENG", grade: 11 },
        ],
        teachingClasses: ["10A", "10B", "11A", "11B", "12A"],
      },
    },
    {
      id: "5",
      name: "Nguyễn Thị Lan",
      email: "teacher4@educonnect.com",
      role: "teacher",
      avatar: "https://i.pravatar.cc/150?img=5",
      teacherInfo: {
        employeeId: "GV004",
        subjects: [
          { id: "chemistry", name: "Hóa học", code: "CHEM", grade: 10 },
          { id: "chemistry", name: "Hóa học", code: "CHEM", grade: 11 },
        ],
        homeroomClassId: "10B",
        teachingClasses: ["10A", "10B", "11A", "11B"],
      },
    },
    {
      id: "6",
      name: "Hoàng Văn Minh",
      email: "teacher5@educonnect.com",
      role: "teacher",
      avatar: "https://i.pravatar.cc/150?img=6",
      teacherInfo: {
        employeeId: "GV005",
        subjects: [
          { id: "biology", name: "Sinh học", code: "BIO", grade: 10 },
          { id: "biology", name: "Sinh học", code: "BIO", grade: 11 },
        ],
        teachingClasses: ["10A", "10B", "11A"],
      },
    },
  ]);

  // Available subjects
  const availableSubjects: Subject[] = [
    { id: "math", name: "Toán học", code: "MATH", grade: 10 },
    { id: "physics", name: "Vật lý", code: "PHYS", grade: 10 },
    { id: "chemistry", name: "Hóa học", code: "CHEM", grade: 10 },
    { id: "biology", name: "Sinh học", code: "BIO", grade: 10 },
    { id: "literature", name: "Ngữ văn", code: "LIT", grade: 10 },
    { id: "history", name: "Lịch sử", code: "HIST", grade: 10 },
    { id: "geography", name: "Địa lý", code: "GEO", grade: 10 },
    { id: "english", name: "Tiếng Anh", code: "ENG", grade: 10 },
    { id: "pe", name: "Thể dục", code: "PE", grade: 10 },
    { id: "it", name: "Tin học", code: "IT", grade: 10 },
  ];

  // Filter teachers based on search term and subject
  const getFilteredTeachers = (): User[] => {
    let filteredTeachers = teachers;

    if (searchTerm) {
      filteredTeachers = filteredTeachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.teacherInfo?.employeeId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== "all") {
      filteredTeachers = filteredTeachers.filter((teacher) =>
        teacher.teacherInfo?.subjects.some(
          (subject) => subject.id === selectedSubject
        )
      );
    }

    return filteredTeachers;
  };

  const getTeacherStats = () => {
    const totalTeachers = teachers.length;
    const homeroomTeachers = teachers.filter(
      (t) => t.teacherInfo?.homeroomClassId
    ).length;
    const subjectTeachers = teachers.filter(
      (t) => !t.teacherInfo?.homeroomClassId
    ).length;

    return { totalTeachers, homeroomTeachers, subjectTeachers };
  };

  const handleEditTeacher = (teacher: User) => {
    setEditingTeacher(teacher);
    setShowAddTeacherModal(true);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
      console.log("Delete teacher:", teacherId);
    }
  };

  const stats = getTeacherStats();
  const filteredTeachers = getFilteredTeachers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý giáo viên
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin giáo viên và phân công giảng dạy
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Xuất danh sách
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowAddTeacherModal(true)}
            leftIcon={<Plus size={16} />}
          >
            Thêm giáo viên
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số giáo viên</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalTeachers}
                </p>
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
                <p className="text-sm text-gray-600">Giáo viên chủ nhiệm</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.homeroomTeachers}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <UserCheck className="text-green-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Giáo viên bộ môn</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.subjectTeachers}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Users className="text-purple-500" size={20} />
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
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tên, mã GV hoặc email..."
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
                Môn học
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả môn học</option>
                {availableSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Thống kê môn học
              </h4>
              <div className="space-y-2 text-xs">
                {availableSubjects.slice(0, 5).map((subject) => {
                  const count = teachers.filter((t) =>
                    t.teacherInfo?.subjects.some((s) => s.id === subject.id)
                  ).length;
                  return (
                    <div key={subject.id} className="flex justify-between">
                      <span className="text-gray-600">{subject.name}:</span>
                      <span className="font-medium">{count} GV</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách giáo viên</CardTitle>
                <span className="text-sm text-gray-500">
                  {filteredTeachers.length} giáo viên
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTeachers.map((teacher) => (
                  <Card
                    key={teacher.id}
                    className="border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold mr-3">
                            {teacher.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {teacher.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {teacher.teacherInfo?.employeeId}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={14} className="mr-2" />
                          {teacher.email}
                        </div>

                        {teacher.teacherInfo?.homeroomClassId && (
                          <div className="flex items-center">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              GVCN: {teacher.teacherInfo.homeroomClassId}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Môn giảng dạy:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.teacherInfo?.subjects.map(
                            (subject, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                              >
                                {subject.name}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Lớp giảng dạy:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.teacherInfo?.teachingClasses.map(
                            (classId, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {classId}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTeachers.length === 0 && (
                <div className="text-center py-8">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không tìm thấy giáo viên
                  </h3>
                  <p className="text-gray-500">
                    Không có giáo viên nào phù hợp với bộ lọc hiện tại.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingTeacher ? "Chỉnh sửa giáo viên" : "Thêm giáo viên mới"}
            </h3>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã giáo viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="GV001"
                    defaultValue={editingTeacher?.teacherInfo?.employeeId}
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
                    defaultValue={editingTeacher?.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="teacher@educonnect.com"
                    defaultValue={editingTeacher?.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lớp chủ nhiệm
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={
                      editingTeacher?.teacherInfo?.homeroomClassId || ""
                    }
                  >
                    <option value="">Không làm chủ nhiệm</option>
                    <option value="10A">Lớp 10A</option>
                    <option value="10B">Lớp 10B</option>
                    <option value="11A">Lớp 11A</option>
                    <option value="11B">Lớp 11B</option>
                    <option value="12A">Lớp 12A</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Môn giảng dạy <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
                  {availableSubjects.map((subject) => (
                    <label key={subject.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        defaultChecked={editingTeacher?.teacherInfo?.subjects.some(
                          (s) => s.id === subject.id
                        )}
                      />
                      <span className="text-sm">{subject.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lớp giảng dạy <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 border border-gray-300 rounded-md p-3">
                  {[
                    "10A",
                    "10B",
                    "10C",
                    "11A",
                    "11B",
                    "11C",
                    "12A",
                    "12B",
                    "12C",
                  ].map((classId) => (
                    <label key={classId} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        defaultChecked={editingTeacher?.teacherInfo?.teachingClasses.includes(
                          classId
                        )}
                      />
                      <span className="text-sm">{classId}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddTeacherModal(false);
                  setEditingTeacher(null);
                }}
              >
                Hủy
              </Button>
              <Button variant="primary">
                {editingTeacher ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagementPage;
