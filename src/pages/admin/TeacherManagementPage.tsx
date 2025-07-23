import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  Search,
  Users,
  GraduationCap,
  UserCheck,
  Download,
  Filter,
  Mail,
  Calendar,
} from "lucide-react";
import { User, Subject } from "../../types";
import { timetableApi, userApi } from "../../services/api";
import type { TimetableDay } from "../../services/api/timetableApi";
import type { TeacherFromApi } from "../../services/api/userApi";

const TeacherManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // State cho thời khóa biểu
  const [showTimetableModal, setShowTimetableModal] = useState<boolean>(false);
  const [selectedTeacherForTimetable, setSelectedTeacherForTimetable] =
    useState<User | null>(null);
  const [timetableData, setTimetableData] = useState<TimetableDay[]>([]);
  const [isLoadingTimetable, setIsLoadingTimetable] = useState<boolean>(false);

  // State cho teachers API
  const [teachersFromApi, setTeachersFromApi] = useState<TeacherFromApi[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(6); // 6 teachers per page để dễ xem và điều hướng

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

  // Effect riêng cho fetch teachers từ API lookup
  useEffect(() => {
    // Fetch teachers từ API lookup (không pagination)
    const fetchTeachers = async () => {
      setIsLoadingTeachers(true);
      try {
        const response = await userApi.getUsersByRole("teacher");
        setTeachersFromApi(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giáo viên:", error);
        setTeachersFromApi([]);
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []); // Chỉ gọi 1 lần khi component mount

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Convert teachers từ API thành format User và áp dụng filter
  const getFilteredTeachers = (): User[] => {
    // Chuyển đổi teachers từ API thành format User
    const convertedTeachers: User[] = teachersFromApi.map((teacher) => ({
      id: teacher.userId,
      name: teacher.fullName,
      email: teacher.email,
      role: "teacher" as const,
      avatar: `https://i.pravatar.cc/150?u=${teacher.userId}`,
      teacherInfo: {
        employeeId: `GV${teacher.userId.slice(-3)}`, // Tạo mã GV từ userId
        subjects: [], // TODO: Sẽ được load từ API khác nếu có
        teachingClasses: [], // TODO: Sẽ được load từ API khác nếu có
        homeroomClassId: undefined, // TODO: Sẽ được load từ API khác nếu có
      },
    }));

    let filteredTeachers = convertedTeachers;

    // Filter theo search term (name hoặc email)
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

    // Filter theo subject vì API chưa hỗ trợ filter subject
    if (selectedSubject !== "all") {
      filteredTeachers = filteredTeachers.filter((teacher) =>
        teacher.teacherInfo?.subjects.some(
          (subject) => subject.id === selectedSubject
        )
      );
    }

    return filteredTeachers;
  };

  // Get paginated teachers for display
  const getPaginatedTeachers = (): User[] => {
    const filtered = getFilteredTeachers();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  };

  // Function để xem thời khóa biểu của giáo viên
  const handleViewTimetable = async (teacher: User) => {
    setSelectedTeacherForTimetable(teacher);
    setShowTimetableModal(true);
    setIsLoadingTimetable(true);

    try {
      // Sử dụng teacher.id là userId từ API
      const response = await timetableApi.getTeacherTimetable(teacher.id);
      setTimetableData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thời khóa biểu:", error);
      setTimetableData([]);
    } finally {
      setIsLoadingTimetable(false);
    }
  };

  // Function để đóng modal thời khóa biểu
  const handleCloseTimetableModal = () => {
    setShowTimetableModal(false);
    setSelectedTeacherForTimetable(null);
    setTimetableData([]);
  };

  // Function để format thời gian tiết học
  const getPeriodTime = (periodNumber: number): string => {
    const periodTimes: { [key: number]: string } = {
      1: "7:00 - 7:45",
      2: "7:50 - 8:35",
      3: "8:40 - 9:25",
      4: "9:40 - 10:25",
      5: "10:30 - 11:15",
      6: "13:00 - 13:45",
      7: "13:50 - 14:35",
      8: "14:40 - 15:25",
      9: "15:40 - 16:25",
      10: "16:30 - 17:15",
    };
    return periodTimes[periodNumber] || "";
  };

  const filteredTeachers = getFilteredTeachers();
  const paginatedTeachers = getPaginatedTeachers();
  const totalTeachers = filteredTeachers.length;

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
                  {isLoadingTeachers ? "Đang tải..." : teachersFromApi.length}
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
                  {isLoadingTeachers ? "Đang tải..." : teachersFromApi.length}
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
                  {isLoadingTeachers ? "Đang tải..." : teachersFromApi.length}
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
                {isLoadingTeachers ? (
                  <div className="text-gray-500">Đang tải...</div>
                ) : (
                  <div className="text-gray-500">
                    Thống kê sẽ hiển thị khi có dữ liệu môn học từ API
                  </div>
                )}
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
                  {isLoadingTeachers
                    ? "Đang tải..."
                    : `${totalTeachers} giáo viên`}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTeachers ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2">Đang tải danh sách giáo viên...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginatedTeachers.map((teacher) => (
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
                                onClick={() => handleViewTimetable(teacher)}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                title="Xem thời khóa biểu"
                              >
                                <Calendar size={14} />
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
                              {teacher.teacherInfo?.subjects &&
                              teacher.teacherInfo.subjects.length > 0 ? (
                                teacher.teacherInfo.subjects.map(
                                  (subject, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                    >
                                      {subject.name}
                                    </span>
                                  )
                                )
                              ) : (
                                <span className="text-xs text-gray-500">
                                  Chưa có dữ liệu từ API
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              Lớp giảng dạy:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {teacher.teacherInfo?.teachingClasses &&
                              teacher.teacherInfo.teachingClasses.length > 0 ? (
                                teacher.teacherInfo.teachingClasses.map(
                                  (classId, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                    >
                                      {classId}
                                    </span>
                                  )
                                )
                              ) : (
                                <span className="text-xs text-gray-500">
                                  Chưa có dữ liệu từ API
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {!isLoadingTeachers && filteredTeachers.length === 0 && (
                    <div className="text-center py-8">
                      <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không tìm thấy giáo viên
                      </h3>
                      <p className="text-gray-500">
                        {teachersFromApi.length === 0
                          ? "Chưa có dữ liệu giáo viên từ API."
                          : "Không có giáo viên nào phù hợp với bộ lọc hiện tại."}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {!isLoadingTeachers && totalTeachers > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                {Math.min(currentPage * pageSize, totalTeachers)} trong tổng số{" "}
                {totalTeachers} giáo viên
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  ← Trước
                </Button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from(
                    {
                      length: Math.min(5, Math.ceil(totalTeachers / pageSize)),
                    },
                    (_, i) => {
                      const pageNum =
                        currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      const totalPages = Math.ceil(totalTeachers / pageSize);

                      if (pageNum > totalPages) return null;

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "primary" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(Math.ceil(totalTeachers / pageSize), prev + 1)
                    )
                  }
                  disabled={currentPage >= Math.ceil(totalTeachers / pageSize)}
                >
                  Sau →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timetable Modal */}
      {showTimetableModal && selectedTeacherForTimetable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Thời khóa biểu - {selectedTeacherForTimetable.name}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseTimetableModal}
              >
                ✕
              </Button>
            </div>

            {isLoadingTimetable ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Đang tải thời khóa biểu...</span>
              </div>
            ) : timetableData.length > 0 ? (
              <div className="space-y-6">
                {timetableData.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="text-lg font-medium text-gray-800 mb-3">
                      {day.dayOfWeek} -{" "}
                      {new Date(day.date).toLocaleDateString("vi-VN")}
                    </h4>

                    {day.periods.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {day.periods.map((period, periodIndex) => (
                          <div
                            key={periodIndex}
                            className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-blue-600">
                                Tiết {period.periodNumber}
                              </span>
                              <span className="text-xs text-gray-500">
                                {getPeriodTime(period.periodNumber)}
                              </span>
                            </div>

                            <div className="space-y-1 text-sm">
                              <div className="flex">
                                <span className="font-medium text-gray-700 w-16">
                                  Lớp:
                                </span>
                                <span className="text-gray-900">
                                  {period.className}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-700 w-16">
                                  Môn:
                                </span>
                                <span className="text-gray-900">
                                  {period.subjectName}
                                </span>
                              </div>
                              {period.lessonContent && (
                                <div className="flex">
                                  <span className="font-medium text-gray-700 w-16">
                                    Nội dung:
                                  </span>
                                  <span className="text-gray-900">
                                    {period.lessonContent}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Không có tiết học nào trong ngày này
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không có thời khóa biểu
                </h3>
                <p className="text-gray-500">
                  Hiện tại chưa có thời khóa biểu cho giáo viên này.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagementPage;
