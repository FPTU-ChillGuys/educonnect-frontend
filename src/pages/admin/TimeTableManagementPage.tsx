import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Plus, Edit2, Trash2, Download, Calendar, Filter } from "lucide-react";

interface TimeSlot {
  id: string;
  time: string;
  periods: number[];
}

interface TimetableSlot {
  id: string;
  day: string;
  periodId: string;
  className: string;
  subject: string;
  teacher: string;
}

const TimetablePage: React.FC = () => {
  const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

  const [timeSlots] = useState<TimeSlot[]>([
    { id: "1", time: "07:30 - 08:15", periods: [1] },
    { id: "2", time: "08:25 - 09:10", periods: [2] },
    { id: "3", time: "09:30 - 10:15", periods: [3] },
    { id: "4", time: "10:25 - 11:10", periods: [4] },
    { id: "5", time: "11:20 - 12:05", periods: [5] },
  ]);

  const [selectedClass, setSelectedClass] = useState<string>("10A");

  // Mock timetable data
  const [timetableData] = useState<TimetableSlot[]>([
    {
      id: "1",
      day: "Thứ Hai",
      periodId: "1",
      className: "10A",
      subject: "Toán",
      teacher: "Nguyễn Văn A",
    },
    {
      id: "2",
      day: "Thứ Hai",
      periodId: "2",
      className: "10A",
      subject: "Vật lý",
      teacher: "Trần Minh B",
    },
    {
      id: "3",
      day: "Thứ Hai",
      periodId: "3",
      className: "10A",
      subject: "Hóa học",
      teacher: "Lê Thị C",
    },
    {
      id: "4",
      day: "Thứ Hai",
      periodId: "4",
      className: "10A",
      subject: "Sinh học",
      teacher: "Phạm Văn D",
    },
    {
      id: "5",
      day: "Thứ Hai",
      periodId: "5",
      className: "10A",
      subject: "Ngữ văn",
      teacher: "Hoàng Thị E",
    },

    {
      id: "6",
      day: "Thứ Ba",
      periodId: "1",
      className: "10A",
      subject: "Lịch sử",
      teacher: "Vũ Thị F",
    },
    {
      id: "7",
      day: "Thứ Ba",
      periodId: "2",
      className: "10A",
      subject: "Địa lý",
      teacher: "Ngô Văn G",
    },
    {
      id: "8",
      day: "Thứ Ba",
      periodId: "3",
      className: "10A",
      subject: "GDCD",
      teacher: "Đinh Thị H",
    },
    {
      id: "9",
      day: "Thứ Ba",
      periodId: "4",
      className: "10A",
      subject: "Tin học",
      teacher: "Bùi Văn I",
    },
    {
      id: "10",
      day: "Thứ Ba",
      periodId: "5",
      className: "10A",
      subject: "Tiếng Anh",
      teacher: "Đỗ Thị K",
    },

    {
      id: "11",
      day: "Thứ Tư",
      periodId: "1",
      className: "10A",
      subject: "Toán",
      teacher: "Nguyễn Văn A",
    },
    {
      id: "12",
      day: "Thứ Tư",
      periodId: "2",
      className: "10A",
      subject: "Vật lý",
      teacher: "Trần Minh B",
    },
    {
      id: "13",
      day: "Thứ Tư",
      periodId: "3",
      className: "10A",
      subject: "Thể dục",
      teacher: "Lý Văn M",
    },
    {
      id: "14",
      day: "Thứ Tư",
      periodId: "4",
      className: "10A",
      subject: "Tiếng Anh",
      teacher: "Đỗ Thị K",
    },
    {
      id: "15",
      day: "Thứ Tư",
      periodId: "5",
      className: "10A",
      subject: "Ngữ văn",
      teacher: "Hoàng Thị E",
    },

    {
      id: "16",
      day: "Thứ Năm",
      periodId: "1",
      className: "10A",
      subject: "Sinh học",
      teacher: "Phạm Văn D",
    },
    {
      id: "17",
      day: "Thứ Năm",
      periodId: "2",
      className: "10A",
      subject: "Hóa học",
      teacher: "Lê Thị C",
    },
    {
      id: "18",
      day: "Thứ Năm",
      periodId: "3",
      className: "10A",
      subject: "Toán",
      teacher: "Nguyễn Văn A",
    },
    {
      id: "19",
      day: "Thứ Năm",
      periodId: "4",
      className: "10A",
      subject: "Địa lý",
      teacher: "Ngô Văn G",
    },
    {
      id: "20",
      day: "Thứ Năm",
      periodId: "5",
      className: "10A",
      subject: "Lịch sử",
      teacher: "Vũ Thị F",
    },

    {
      id: "21",
      day: "Thứ Sáu",
      periodId: "1",
      className: "10A",
      subject: "Tiếng Anh",
      teacher: "Đỗ Thị K",
    },
    {
      id: "22",
      day: "Thứ Sáu",
      periodId: "2",
      className: "10A",
      subject: "Ngữ văn",
      teacher: "Hoàng Thị E",
    },
    {
      id: "23",
      day: "Thứ Sáu",
      periodId: "3",
      className: "10A",
      subject: "GDQP",
      teacher: "Trịnh Văn N",
    },
    {
      id: "24",
      day: "Thứ Sáu",
      periodId: "4",
      className: "10A",
      subject: "Tin học",
      teacher: "Bùi Văn I",
    },
    {
      id: "25",
      day: "Thứ Sáu",
      periodId: "5",
      className: "10A",
      subject: "Toán",
      teacher: "Nguyễn Văn A",
    },

    {
      id: "26",
      day: "Thứ Bảy",
      periodId: "1",
      className: "10A",
      subject: "Chào cờ",
      teacher: "Nguyễn Văn A",
    },
    {
      id: "27",
      day: "Thứ Bảy",
      periodId: "2",
      className: "10A",
      subject: "Thể dục",
      teacher: "Lý Văn M",
    },
    {
      id: "28",
      day: "Thứ Bảy",
      periodId: "3",
      className: "10A",
      subject: "Vật lý",
      teacher: "Trần Minh B",
    },
    {
      id: "29",
      day: "Thứ Bảy",
      periodId: "4",
      className: "10A",
      subject: "Hoạt động ngoại khóa",
      teacher: "Nhiều GV",
    },
    {
      id: "30",
      day: "Thứ Bảy",
      periodId: "5",
      className: "10A",
      subject: "Sinh hoạt lớp",
      teacher: "Nguyễn Văn A",
    },
  ]);

  const getSlotForDayAndPeriod = (day: string, periodId: string) => {
    return timetableData.find(
      (slot) =>
        slot.day === day &&
        slot.periodId === periodId &&
        slot.className === selectedClass
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thời khóa biểu</h1>
          <p className="text-gray-600 mt-1">Quản lý lịch học cho các lớp</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Xuất PDF
          </Button>
          <Button variant="primary" leftIcon={<Plus size={16} />}>
            Thêm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="lg:col-span-1 h-full">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter size={18} />
              Bộ lọc
            </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lớp
                </label>
                <div className="relative">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="10A">Lớp 10A</option>
                    <option value="10B">Lớp 10B</option>
                    <option value="11A">Lớp 11A</option>
                    <option value="12A">Lớp 12A</option>
                  </select>
                </div>
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Học kỳ
                </label>
                <div className="relative">
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="1">Học kỳ 1</option>
                    <option value="2">Học kỳ 2</option>
                  </select>
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400"
                    size={16}
                  />
                </div>
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năm học
                </label>
                <div className="relative">
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
              </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Thống kê môn học
              </h4>
              <div className="space-y-2 text-xs">
                {Array.from(new Set(timetableData.map(slot => slot.subject))).slice(0, 5).map((subject) => {
                  const count = timetableData.filter(slot => slot.subject === subject).length;
                  return (
                    <div key={subject} className="flex justify-between">
                      <span className="text-gray-600">{subject}:</span>
                      <span className="font-medium">{count} tiết</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1" />
              <Button variant="outline" fullWidth>
                Áp dụng bộ lọc
              </Button>
            </CardContent>
          </Card>

        {/* Timetable */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="bg-blue-50">
              <div className="flex justify-between items-center">
                <CardTitle>
                  Thời khóa biểu lớp {selectedClass}
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
                    <tr>
                      <th className="border p-2 bg-gray-100 w-20">Tiết/Thứ</th>
                      {days.map((day) => (
                        <th key={day} className="border p-2 bg-gray-100">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((timeSlot) => (
                      <tr key={timeSlot.id}>
                        <td className="border p-2 text-center bg-gray-50">
                          <div className="font-medium">
                            Tiết {timeSlot.periods.join(", ")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {timeSlot.time}
                          </div>
                        </td>
                        {days.map((day) => {
                          const slot = getSlotForDayAndPeriod(day, timeSlot.id);
                          return (
                            <td
                              key={`${day}-${timeSlot.id}`}
                              className="border p-2 relative group hover:bg-gray-50"
                            >
                              {slot ? (
                                <div className="min-h-16">
                                  <div className="font-medium text-blue-800">
                                    {slot.subject}
                                  </div>
                                  <div className="text-sm text-gray-600">{slot.teacher}</div>
                                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-1 flex gap-1">
                                    <button className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                      <Edit2 size={14} />
                                    </button>
                                    <button className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="min-h-16 flex items-center justify-center text-gray-400 hover:text-blue-500 cursor-pointer">
                                  <Plus size={20} />
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
      </div>
    </div>
  );
};

export default TimetablePage;
