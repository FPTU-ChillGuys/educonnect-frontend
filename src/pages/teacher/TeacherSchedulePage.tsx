import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Download, Filter, Info, X, Edit } from "lucide-react";
import Button from "../../components/ui/Button";
import {
  timetableApi,
  type TimetableDay,
  type TimetablePeriod,
} from "../../services/api/timetableApi";
import axios from "axios";
import { useToast } from "../../contexts/ToastContext";

// Type aliases để tương thích với code cũ
type TeacherPeriod = TimetablePeriod;
type TeacherDay = TimetableDay;
type ClassDay = TimetableDay;

const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const periods = Array.from({ length: 10 }, (_, i) => i + 1); // 10 tiết

const TeacherSchedulePage: React.FC = () => {
  const { showToast } = useToast();

  const [data, setData] = useState<TeacherDay[]>([]);
  const [classData, setClassData] = useState<ClassDay[]>([]);
  const [homeroomClass, setHomeroomClass] = useState<{
    classId: string;
    className: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"teacher" | "class">("teacher");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Period detail modal states
  const [selectedPeriod, setSelectedPeriod] = useState<TimetablePeriod | null>(
    null
  );
  const [showPeriodDetail, setShowPeriodDetail] = useState(false);

  // Period edit modal states
  const [editingPeriod, setEditingPeriod] = useState<TimetablePeriod | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    lessonContent: "",
    totalAbsentStudents: 0,
    generalBehaviorNote: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Week filtering states
  const [selectedWeek, setSelectedWeek] = useState<{
    fromDate: string;
    toDate: string;
    label: string;
  } | null>(null);

  // Helper functions cho week management
  const getWeekOptions = () => {
    const weeks = [];
    const today = new Date();

    // Tạo 8 tuần: 4 tuần trước, tuần hiện tại, 3 tuần sau
    for (let i = -4; i <= 3; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1 + i * 7); // Thứ 2 của tuần

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 5); // Thứ 7 của tuần

      const fromDate = weekStart.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      const toDate = weekEnd.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      weeks.push({
        fromDate: weekStart.toISOString().split("T")[0],
        toDate: weekEnd.toISOString().split("T")[0],
        label: `${fromDate} - ${toDate}`,
        value: `${weekStart.toISOString().split("T")[0]}_${
          weekEnd.toISOString().split("T")[0]
        }`,
      });
    }

    return weeks;
  };

  // Khởi tạo tuần hiện tại
  useEffect(() => {
    const weeks = getWeekOptions();
    const currentWeek = weeks[4]; // Tuần hiện tại ở vị trí 4
    if (currentWeek) {
      setSelectedWeek({
        fromDate: currentWeek.fromDate,
        toDate: currentWeek.toDate,
        label: currentWeek.label,
      });
    }
  }, []);

  // Handle week change
  const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [fromDate, toDate] = event.target.value.split("_");
    const weeks = getWeekOptions();
    const selectedWeekOption = weeks.find(
      (w) => w.value === event.target.value
    );

    if (selectedWeekOption) {
      setSelectedWeek({
        fromDate,
        toDate,
        label: selectedWeekOption.label,
      });
    }
  };

  // Handle period detail modal
  const handleShowPeriodDetail = (period: TimetablePeriod) => {
    setSelectedPeriod(period);
    setShowPeriodDetail(true);
  };

  const handleClosePeriodDetail = () => {
    setSelectedPeriod(null);
    setShowPeriodDetail(false);
  };

  // Handle period edit modal
  const handleShowEditModal = (period: TimetablePeriod) => {
    setEditingPeriod(period);
    setEditFormData({
      lessonContent: period.lessonContent || "",
      totalAbsentStudents: period.totalAbsentStudents || 0,
      generalBehaviorNote: period.generalBehaviorNote || "",
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditingPeriod(null);
    setShowEditModal(false);
    setEditFormData({
      lessonContent: "",
      totalAbsentStudents: 0,
      generalBehaviorNote: "",
    });
  };

  const handleUpdateClassSession = async () => {
    if (!editingPeriod) return;

    setIsUpdating(true);
    try {
      const response = await timetableApi.updateClassSession(
        editingPeriod.classSessionId,
        editFormData
      );

      if (response.success) {
        // Show success toast
        showToast(
          "success",
          "Cập nhật thành công",
          "Thông tin tiết học đã được cập nhật thành công!"
        );

        // Update local data instead of full reload
        if (activeTab === "teacher") {
          setData((prevData) =>
            prevData.map((day) => ({
              ...day,
              periods: day.periods.map((period) =>
                period.classSessionId === editingPeriod.classSessionId
                  ? { ...period, ...editFormData }
                  : period
              ),
            }))
          );
        }

        handleCloseEditModal();
      } else {
        showToast(
          "error",
          "Cập nhật thất bại",
          response.message || "Có lỗi xảy ra khi cập nhật thông tin tiết học"
        );
      }
    } catch (error) {
      console.error("Error updating class session:", error);
      showToast(
        "error",
        "Lỗi hệ thống",
        "Có lỗi xảy ra khi cập nhật thông tin tiết học"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Lấy role của user để hiển thị giao diện phù hợp
  const getUserRole = () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    try {
      const userData = JSON.parse(user || "{}");
      return userData.role;
    } catch {
      // Fallback: lấy role từ token
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      }
      return null;
    }
  };

  // Fetch data when selectedWeek changes
  useEffect(() => {
    if (!selectedWeek) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const teacherId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        let userRole = null;

        try {
          const userData = JSON.parse(user || "{}");
          userRole = userData.role;
        } catch {
          // Fallback: lấy role từ token
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            userRole =
              payload[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ];
          }
        }

        if (!teacherId) {
          setError(
            userRole === "admin"
              ? "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
              : "Không tìm thấy thông tin giáo viên. Vui lòng đăng nhập lại."
          );
          setLoading(false);
          return;
        }

        if (!token) {
          setError("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }

        // 1. Lấy thời khóa biểu của giáo viên với week filter
        try {
          const teacherTimetableRes = await timetableApi.getTeacherTimetable(
            teacherId,
            selectedWeek.fromDate,
            selectedWeek.toDate
          );

          if (teacherTimetableRes && teacherTimetableRes.success) {
            setData(teacherTimetableRes.data || []);
          } else {
            setData([]);
          }
        } catch (teacherError) {
          console.error("Error fetching teacher timetable:", teacherError);
          setData([]);
        }

        // 2. Lấy thông tin lớp chủ nhiệm của giáo viên (độc lập với thời khóa biểu cá nhân)
        try {
          const classRes = await timetableApi.getHomeroomClasses(teacherId, 10);

          if (
            classRes &&
            classRes.success &&
            classRes.data &&
            classRes.data.length > 0
          ) {
            const homeroomClassInfo = classRes.data[0];

            setHomeroomClass({
              classId: homeroomClassInfo.classId,
              className: homeroomClassInfo.className,
            });

            // 3. Lấy thời khóa biểu của lớp chủ nhiệm với week filter
            try {
              const classTimetableRes = await timetableApi.getStudentTimetable(
                homeroomClassInfo.classId,
                selectedWeek.fromDate,
                selectedWeek.toDate
              );

              if (classTimetableRes && classTimetableRes.success) {
                setClassData(classTimetableRes.data || []);
              } else {
                setClassData([]);
              }
            } catch (classTimetableError) {
              console.error(
                "Error fetching class timetable:",
                classTimetableError
              );
              setClassData([]);
            }
          } else {
            setHomeroomClass(null);
            setClassData([]);
          }
        } catch (classError) {
          console.error("Error fetching homeroom class:", classError);
          setHomeroomClass(null);
          setClassData([]);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            // Nếu 404, không hiển thị lỗi mà chỉ set dữ liệu rỗng
            setData([]);
            setClassData([]);
          } else if (err.response?.status === 401) {
            setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
          } else {
            setError(
              err.response?.data?.message ||
                "Đã xảy ra lỗi khi tải thời khóa biểu"
            );
          }
        } else {
          setError("Đã xảy ra lỗi khi tải thời khóa biểu");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedWeek]);

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

  // Map dữ liệu: { [dayOfWeek]: { [periodNumber]: TeacherPeriod[] } }
  const timetableMap: Record<string, Record<number, TeacherPeriod[]>> = {};
  const currentData = activeTab === "teacher" ? data : classData;

  currentData.forEach((day) => {
    if (!timetableMap[day.dayOfWeek]) timetableMap[day.dayOfWeek] = {};
    day.periods.forEach((period) => {
      if (!timetableMap[day.dayOfWeek][period.periodNumber])
        timetableMap[day.dayOfWeek][period.periodNumber] = [];
      timetableMap[day.dayOfWeek][period.periodNumber].push(period);
    });
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Đang tải thời khóa biểu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getUserRole() === "admin"
                ? "Quản lý thời khóa biểu"
                : "Lịch giảng dạy"}
            </h1>
            <p className="text-gray-600 mt-1">
              {getUserRole() === "admin"
                ? "Xem và quản lý thời khóa biểu của giáo viên"
                : "Thời khóa biểu cá nhân của giáo viên"}
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-red-500 text-lg font-medium mb-2">
                Không thể tải thời khóa biểu
              </div>
              <div className="text-gray-600 mb-4">{error}</div>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Nếu không có dữ liệu thì vẫn hiển thị bảng trống
  if (!loading && !error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getUserRole() === "admin"
                ? "Quản lý thời khóa biểu"
                : "Lịch giảng dạy"}
            </h1>
            <p className="text-gray-600 mt-1">
              {getUserRole() === "admin"
                ? "Xem và quản lý thời khóa biểu của giáo viên"
                : "Thời khóa biểu cá nhân của giáo viên"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download size={16} />}>
              Xuất PDF
            </Button>
          </div>
        </div>

        {/* Week Filter */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-500" size={16} />
                  <span className="text-sm font-medium text-gray-700">
                    Tuần học:
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={
                      selectedWeek
                        ? `${selectedWeek.fromDate}_${selectedWeek.toDate}`
                        : ""
                    }
                    onChange={handleWeekChange}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[200px]"
                  >
                    {getWeekOptions().map((week) => (
                      <option key={week.value} value={week.value}>
                        {week.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {selectedWeek && (
                  <span>
                    {new Date(selectedWeek.fromDate).toLocaleDateString(
                      "vi-VN"
                    )}{" "}
                    -{" "}
                    {new Date(selectedWeek.toDate).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông báo nếu không có dữ liệu */}
        {activeTab === "teacher" && data.length === 0 && (
          <Card className="border border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-yellow-700 text-sm font-medium mb-1">
                  Không có lịch giảng dạy cho tuần này
                </div>
                <div className="text-yellow-600 text-sm">
                  Vui lòng chọn tuần khác hoặc liên hệ quản trị viên nếu có thắc
                  mắc.
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "class" && homeroomClass && classData.length === 0 && (
          <Card className="border border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-yellow-700 text-sm font-medium mb-1">
                  Không có thời khóa biểu lớp {homeroomClass.className} cho tuần
                  này
                </div>
                <div className="text-yellow-600 text-sm">
                  Lớp {homeroomClass.className} chưa có lịch học trong tuần này.
                  Vui lòng chọn tuần khác.
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("teacher")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "teacher"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Lịch giảng dạy cá nhân
          </button>
          {homeroomClass && (
            <button
              onClick={() => setActiveTab("class")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "class"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Lịch lớp {homeroomClass.className} (Chủ nhiệm)
            </button>
          )}
        </div>

        <Card>
          <CardHeader className="bg-blue-50">
            <div className="flex justify-between items-center">
              <CardTitle>
                {activeTab === "teacher"
                  ? "Lịch dạy trong tuần"
                  : `Thời khóa biểu lớp ${homeroomClass?.className || ""}`}
              </CardTitle>
              <span className="text-sm text-gray-500">
                Học kỳ 1 - Năm học 2024-2025
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">
                      Tiết học
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className="border border-gray-300 p-3 text-center font-medium text-gray-700 min-w-[150px]"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((periodNumber) => (
                    <tr key={periodNumber} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 bg-gray-50">
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">
                            Tiết {periodNumber}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {getPeriodTime(periodNumber)}
                          </div>
                        </div>
                      </td>
                      {days.map((day) => {
                        const slots = timetableMap[day]?.[periodNumber] || [];
                        return (
                          <td
                            key={day + periodNumber}
                            className="border border-gray-300 p-2 align-top min-h-[100px]"
                          >
                            {slots.length > 0 ? (
                              <div className="space-y-1">
                                {slots.map((slot, idx) => (
                                  <div
                                    key={slot.classId + slot.subjectId + idx}
                                    className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-r-md relative"
                                  >
                                    <div className="font-semibold text-blue-800 text-sm">
                                      {slot.className}
                                    </div>
                                    <div className="text-sm text-gray-700 mt-1">
                                      <span className="font-medium">Môn:</span>{" "}
                                      {slot.subjectName}
                                    </div>
                                    {slot.lessonContent && (
                                      <div className="text-xs text-gray-600 mt-1">
                                        <span className="font-medium">
                                          Nội dung:
                                        </span>{" "}
                                        {slot.lessonContent}
                                      </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-1">
                                      GV: {slot.teacherName}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="absolute top-1 right-1 flex gap-1">
                                      {/* Edit button - only show for teacher's own classes */}
                                      {activeTab === "teacher" && (
                                        <button
                                          onClick={() =>
                                            handleShowEditModal(slot)
                                          }
                                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                                          title="Chỉnh sửa tiết học"
                                        >
                                          <Edit size={14} />
                                        </button>
                                      )}

                                      {/* Detail button */}
                                      <button
                                        onClick={() =>
                                          handleShowPeriodDetail(slot)
                                        }
                                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                        title="Xem chi tiết"
                                      >
                                        <Info size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-gray-400 text-center py-8">
                                <div className="text-sm">Không có tiết học</div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Period Detail Modal */}
        {showPeriodDetail && selectedPeriod && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Chi tiết tiết học
                </h3>
                <button
                  onClick={handleClosePeriodDetail}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Tiết học
                    </label>
                    <p className="text-sm text-gray-800">
                      Tiết {selectedPeriod.periodNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Lớp
                    </label>
                    <p className="text-sm text-gray-800">
                      {selectedPeriod.className}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Môn học
                  </label>
                  <p className="text-sm text-gray-800">
                    {selectedPeriod.subjectName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Giáo viên
                  </label>
                  <p className="text-sm text-gray-800">
                    {selectedPeriod.teacherName}
                  </p>
                </div>

                {selectedPeriod.lessonContent && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nội dung bài học
                    </label>
                    <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                      {selectedPeriod.lessonContent}
                    </p>
                  </div>
                )}

                {selectedPeriod.generalBehaviorNote && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Ghi chú hành vi chung
                    </label>
                    <p className="text-sm text-gray-800 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                      {selectedPeriod.generalBehaviorNote}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Số học sinh vắng mặt
                  </label>
                  <p
                    className={`text-sm font-medium ${
                      selectedPeriod.totalAbsentStudents > 0
                        ? "text-red-600 bg-red-50"
                        : "text-green-600 bg-green-50"
                    } p-2 rounded`}
                  >
                    {selectedPeriod.totalAbsentStudents > 0
                      ? `${selectedPeriod.totalAbsentStudents} học sinh vắng mặt`
                      : "Không có học sinh vắng mặt"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={handleClosePeriodDetail}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Period Edit Modal */}
        {showEditModal && editingPeriod && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Chỉnh sửa tiết học
                </h3>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Basic info */}
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600 mb-2">
                    Thông tin tiết học:
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Tiết:</strong> {editingPeriod.periodNumber}
                    </div>
                    <div>
                      <strong>Lớp:</strong> {editingPeriod.className}
                    </div>
                    <div>
                      <strong>Môn:</strong> {editingPeriod.subjectName}
                    </div>
                    <div>
                      <strong>GV:</strong> {editingPeriod.teacherName}
                    </div>
                  </div>
                </div>

                {/* Lesson Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung bài học
                  </label>
                  <textarea
                    value={editFormData.lessonContent}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        lessonContent: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Nhập nội dung bài học..."
                  />
                </div>

                {/* Total Absent Students */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số học sinh vắng mặt
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.totalAbsentStudents}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        totalAbsentStudents: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                {/* General Behavior Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú hành vi chung
                  </label>
                  <textarea
                    value={editFormData.generalBehaviorNote}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        generalBehaviorNote: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Ghi chú về hành vi chung của lớp..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCloseEditModal}
                  disabled={isUpdating}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdateClassSession}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default fallback - should not reach here
  return null;
};

export default TeacherSchedulePage;
