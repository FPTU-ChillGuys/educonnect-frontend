import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Download } from "lucide-react";
import Button from "../../components/ui/Button";
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

const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const periods = Array.from({ length: 10 }, (_, i) => i + 1); // 10 tiết

const TeacherSchedulePage: React.FC = () => {
  const [data, setData] = useState<TeacherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const teacherId = localStorage.getItem("userId");
        console.log("teacherId:", teacherId);
        if (!teacherId) {
          setError(
            "Không tìm thấy thông tin giáo viên. Vui lòng đăng nhập lại."
          );
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/classsession/timetable", {
          params: {
            targetId: teacherId,
            mode: "Teacher",
          },
        });
        console.log("API response:", res.data);
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setData(res.data.data); // nếu mảng rỗng thì vẫn setData([])
        } else {
          setError(res.data.message || "Không thể tải thời khóa biểu");
        }
      } catch (err: unknown) {
        setError("Đã xảy ra lỗi khi tải thời khóa biểu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map dữ liệu: { [dayOfWeek]: { [periodNumber]: TeacherPeriod[] } }
  const timetableMap: Record<string, Record<number, TeacherPeriod[]>> = {};
  data.forEach((day) => {
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lịch giảng dạy</h1>
          <p className="text-gray-600 mt-1">
            Thời khóa biểu cá nhân của giáo viên
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Xuất PDF
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle>Lịch dạy trong tuần</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-fixed">
              <colgroup>
                <col className="w-[120px]" />
                {days.map((_, idx) => (
                  <col
                    key={idx}
                    style={{ width: `calc((100% - 120px) / 6)` }}
                  />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-100 font-medium text-sm sticky left-0 z-10">
                    Tiết/Thứ
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="border p-2 bg-gray-100 font-medium text-sm"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((periodNumber) => (
                  <tr key={periodNumber}>
                    <td className="border p-2 text-center bg-gray-50 sticky left-0 z-10 font-medium">
                      Tiết {periodNumber}
                    </td>
                    {days.map((day) => {
                      const slots = timetableMap[day]?.[periodNumber] || [];
                      return (
                        <td
                          key={day + periodNumber}
                          className="border p-2 min-h-[80px]"
                        >
                          {slots.length > 0 ? (
                            slots.map((slot, idx) => (
                              <div
                                key={slot.classId + slot.subjectId + idx}
                                className="mb-2 p-2 rounded bg-blue-50"
                              >
                                <div className="font-semibold text-blue-800">
                                  {slot.className}
                                </div>
                                <div className="text-sm text-gray-700 mt-1">
                                  {slot.subjectName}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {slot.lessonContent}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-400 text-center">-</div>
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
