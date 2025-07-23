import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Download } from "lucide-react";
import Button from "../../components/ui/Button";
import axiosInstance from "../../services/axiosInstance";
import axios from "axios";

interface TeacherPeriod {
  periodNumber: number;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  lessonContent: string;
}

interface TeacherDay {
  date: string;
  dayOfWeek: string;
  periods: TeacherPeriod[];
}

interface ClassDay {
  date: string;
  dayOfWeek: string;
  periods: ClassPeriod[];
}

interface ClassPeriod {
  periodNumber: number;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  lessonContent: string;
}

const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const periods = Array.from({ length: 10 }, (_, i) => i + 1); // 10 tiết

const TeacherSchedulePage: React.FC = () => {
  const [data, setData] = useState<TeacherDay[]>([]);
  const [classData, setClassData] = useState<ClassDay[]>([]);
  const [homeroomClass, setHomeroomClass] = useState<{
    classId: string;
    className: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"teacher" | "class">("teacher");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const userRole = getUserRole();

  useEffect(() => {
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

        // 1. Lấy thời khóa biểu của giáo viên
        const teacherTimetableRes = await axiosInstance.get(
          "/api/classsession/timetable",
          {
            params: {
              TargetId: teacherId,
              Mode: "Teacher",
            },
          }
        );

        if (
          teacherTimetableRes.data &&
          teacherTimetableRes.data.success &&
          Array.isArray(teacherTimetableRes.data.data)
        ) {
          setData(teacherTimetableRes.data.data);
        }

        // 2. Lấy thông tin lớp chủ nhiệm của giáo viên
        try {
          const classRes = await axiosInstance.get("/api/class", {
            params: {
              TeacherId: teacherId,
              PageSize: 1, // Chỉ cần 1 lớp chủ nhiệm
            },
          });

          if (
            classRes.data &&
            classRes.data.success &&
            classRes.data.data &&
            classRes.data.data.length > 0
          ) {
            const homeroomClassInfo = classRes.data.data[0];
            setHomeroomClass({
              classId: homeroomClassInfo.classId,
              className: homeroomClassInfo.className || homeroomClassInfo.name,
            });

            // 3. Lấy thời khóa biểu của lớp chủ nhiệm
            const classTimetableRes = await axiosInstance.get(
              "/api/classsession/timetable",
              {
                params: {
                  TargetId: homeroomClassInfo.classId,
                  Mode: "Class",
                },
              }
            );

            if (
              classTimetableRes.data &&
              classTimetableRes.data.success &&
              Array.isArray(classTimetableRes.data.data)
            ) {
              setClassData(classTimetableRes.data.data);
            }
          }
        } catch (classError) {
          // Không hiển thị lỗi nếu không có lớp chủ nhiệm
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError("Không tìm thấy thời khóa biểu cho giáo viên này");
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
  }, []);

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

  // Nếu không có dữ liệu thì hiển thị thông báo
  if (!loading && data.length === 0 && classData.length === 0) {
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
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-gray-500 text-lg font-medium mb-2">
                {getUserRole() === "admin"
                  ? "Chưa có thời khóa biểu"
                  : "Chưa có lịch giảng dạy"}
              </div>
              <div className="text-gray-600">
                {getUserRole() === "admin"
                  ? "Hiện tại chưa có thời khóa biểu được tạo."
                  : "Hiện tại chưa có thời khóa biểu được phân công cho bạn."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">
            Tổng số tiết trong tuần
          </div>
          <div className="text-2xl font-bold text-blue-800 mt-1">
            {currentData.reduce((total, day) => total + day.periods.length, 0)}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">
            Số lớp giảng dạy
          </div>
          <div className="text-2xl font-bold text-green-800 mt-1">
            {
              new Set(
                currentData.flatMap((day) => day.periods.map((p) => p.classId))
              ).size
            }
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Số môn học</div>
          <div className="text-2xl font-bold text-purple-800 mt-1">
            {
              new Set(
                currentData.flatMap((day) =>
                  day.periods.map((p) => p.subjectId)
                )
              ).size
            }
          </div>
        </div>
      </div>

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
                                  className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-r-md"
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
    </div>
  );
};

export default TeacherSchedulePage;
