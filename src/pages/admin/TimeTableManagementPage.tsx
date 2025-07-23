import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Plus, Edit2, Trash2, Download, Calendar, Filter } from "lucide-react";
import {
  classApi,
  ClassLookup,
  ClassSession,
  PeriodLookup,
} from "../../services/api/classApi";
import { userApi, TeacherLookup } from "../../services/api/userApi";
import { subjectApi, SubjectLookup } from "../../services/api/subjectApi";
import { AxiosError } from "axios";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../contexts/ToastContext";

interface TimeSlot {
  periodId: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
}

interface AddSessionForm {
  teacherId: string;
  subjectId: string;
  lessonContent: string;
  generalBehaviorNote: string;
  totalAbsentStudents: number;
}

const TimetablePage: React.FC = () => {
  const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const { showToast } = useToast();
  const [classes, setClasses] = useState<ClassLookup[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [teachers, setTeachers] = useState<TeacherLookup[]>([]);
  const [periods, setPeriods] = useState<PeriodLookup[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<{
    periodId: string;
    periodNumber: number;
    day: string;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(
    null
  );
  const [form, setForm] = useState<AddSessionForm>({
    teacherId: "",
    subjectId: "",
    lessonContent: "",
    generalBehaviorNote: "",
    totalAbsentStudents: 0,
  });
  const [subjects, setSubjects] = useState<SubjectLookup[]>([]);

  const fetchClassSessions = React.useCallback(
    async (classId: string) => {
      try {
        setLoadingTimetable(true);
        setError(null);

        const response = await classApi.getClassSessions({
          ClassId: classId,
          PageSize: 100,
        });

        if (response.success) {
          setClassSessions(response.data);
        } else {
          setClassSessions([]);
          showToast("error", "Lỗi", "Đã xảy ra lỗi khi tải thời khóa biểu");
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (
          axiosError.response?.status === 404 ||
          axiosError.response?.status === 400
        ) {
          setClassSessions([]);
        } else {
          showToast("error", "Lỗi", "Đã xảy ra lỗi khi tải thời khóa biểu");
        }
      } finally {
        setLoadingTimetable(false);
      }
    },
    [showToast]
  );

  // Fetch periods
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await classApi.getPeriodLookup();
        if (response.success) {
          setPeriods(response.data);
        }
      } catch (error) {
        showToast("error", "Lỗi", "Đã xảy ra lỗi khi tải danh sách tiết học");
      }
    };

    fetchPeriods();
  }, [showToast]);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await classApi.getClassLookup();
        if (response.success) {
          setClasses(response.data);
          if (response.data.length > 0) {
            const firstClass = response.data[0];
            setSelectedClassId(firstClass.classId);
            setSelectedClassName(firstClass.className);
            await fetchClassSessions(firstClass.classId);
          }
        } else {
          showToast(
            "error",
            "Lỗi",
            response.message || "Không thể tải danh sách lớp"
          );
        }
      } catch (error) {
        showToast("error", "Lỗi", "Đã xảy ra lỗi khi tải danh sách lớp");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [showToast, fetchClassSessions]);

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await userApi.getTeacherLookup();
        if (response.success) {
          setTeachers(response.data);
        }
      } catch (error) {
        showToast("error", "Lỗi", "Đã xảy ra lỗi khi tải danh sách giáo viên");
      }
    };

    fetchTeachers();
  }, [showToast]);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectApi.getSubjectLookup();
        if (response.success) {
          setSubjects(response.data);
        }
      } catch (error) {
        showToast("error", "Lỗi", "Đã xảy ra lỗi khi tải danh sách môn học");
      }
    };

    fetchSubjects();
  }, [showToast]);

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = classes.find((c) => c.classId === event.target.value);
    if (selectedClass) {
      setSelectedClassId(selectedClass.classId);
      setSelectedClassName(selectedClass.className);
      fetchClassSessions(selectedClass.classId);
    }
  };

  const getSlotForDayAndPeriod = (day: string, periodNumber: number) => {
    return classSessions.find((session) => {
      const sessionDay = new Date(session.date).toLocaleDateString("vi-VN", {
        weekday: "long",
      });
      return sessionDay === day && session.periodNumber === periodNumber;
    });
  };

  const handleAddClick = (periodNumber: number, day: string) => {
    const period = periods.find((p) => p.periodNumber === periodNumber);
    if (!period) {
      showToast("error", "Lỗi", "Không tìm thấy thông tin tiết học");
      return;
    }
    setSelectedPeriod({
      periodId: period.periodId,
      periodNumber: period.periodNumber,
      day,
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (session: ClassSession) => {
    setSelectedSession(session);
    setForm({
      teacherId: "", // Không set mặc định là ID cũ
      subjectId: "",
      lessonContent: session.lessonContent || "",
      generalBehaviorNote: session.generalBehaviorNote || "",
      totalAbsentStudents: session.totalAbsentStudents || 0,
    });
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDateFromDay = (day: string): string => {
    const dayMap: { [key: string]: number } = {
      "Thứ Hai": 1,
      "Thứ Ba": 2,
      "Thứ Tư": 3,
      "Thứ Năm": 4,
      "Thứ Sáu": 5,
      "Thứ Bảy": 6,
      "Chủ Nhật": 0,
    };

    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const targetDayOfWeek = dayMap[day];

    // Tính số ngày cần thêm để đến ngày mục tiêu trong tuần tới
    let daysToAdd = targetDayOfWeek - currentDayOfWeek;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Luôn lấy ngày của tuần tới
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd + 7); // Thêm 7 ngày để đảm bảo luôn lấy ngày trong tương lai

    // Format date as YYYY-MM-DDT00:00:00
    return `${targetDate.getFullYear()}-${String(
      targetDate.getMonth() + 1
    ).padStart(2, "0")}-${String(targetDate.getDate()).padStart(
      2,
      "0"
    )}T00:00:00`;
  };

  const handleSubmit = async () => {
    if (!selectedPeriod) return;

    try {
      const date = calculateDateFromDay(selectedPeriod.day);

      if (!form.teacherId) {
        showToast("error", "Lỗi", "Vui lòng chọn giáo viên");
        return;
      }

      const selectedTeacher = teachers.find((t) => t.userId === form.teacherId);
      if (!selectedTeacher) {
        showToast("error", "Lỗi", "Không tìm thấy thông tin giáo viên");
        return;
      }

      // Lưu lại classId hiện tại để đảm bảo fetch đúng lớp
      const currentClassId = selectedClassId;

      const response = await classApi.createClassSession({
        classId: currentClassId,
        teacherId: selectedTeacher.userId,
        subjectId: form.subjectId,
        periodId: selectedPeriod.periodId,
        date: date,
        lessonContent: form.lessonContent,
        generalBehaviorNote: form.generalBehaviorNote,
        totalAbsentStudents: form.totalAbsentStudents,
      });

      if (response.success) {
        showToast("success", "Thành công", "Thêm tiết học thành công");
        setIsAddModalOpen(false);
        // Fetch lại thời khóa biểu của lớp hiện tại
        await fetchClassSessions(currentClassId);
        resetForm();
      } else {
        showToast("error", "Lỗi", response.message || "Không thể tạo tiết học");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data) {
        showToast("error", "Lỗi", JSON.stringify(axiosError.response.data));
      } else {
        showToast("error", "Lỗi", "Đã xảy ra lỗi khi tạo tiết học");
      }
    }
  };

  const handleUpdate = async () => {
    console.log("Current Selected Session:", selectedSession);
    console.log("Current Form Data:", form);

    if (!selectedSession) {
      showToast("error", "Lỗi", "Không tìm thấy thông tin tiết học");
      return;
    }

    if (!selectedSession.classSessionId) {
      console.log("Session ID is missing:", selectedSession);
      showToast("error", "Lỗi", "Không tìm thấy ID tiết học");
      return;
    }

    if (!form.teacherId || !form.subjectId || !form.lessonContent) {
      showToast("error", "Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const selectedTeacher = teachers.find((t) => t.userId === form.teacherId);
      if (!selectedTeacher) {
        showToast("error", "Lỗi", "Không tìm thấy thông tin giáo viên");
        return;
      }

      const selectedSubject = subjects.find(
        (s) => s.subjectId === form.subjectId
      );
      if (!selectedSubject) {
        showToast("error", "Lỗi", "Không tìm thấy thông tin môn học");
        return;
      }

      // Log thông tin request
      const requestData = {
        sessionId: selectedSession.classSessionId,
        classId: selectedSession.classId, // Sử dụng classId từ session
        teacherId: form.teacherId,
        subjectId: form.subjectId,
        periodId: selectedSession.periodId,
        date: selectedSession.date,
        lessonContent: form.lessonContent,
        totalAbsentStudents: form.totalAbsentStudents,
        generalBehaviorNote: form.generalBehaviorNote || "",
        isDeleted: false,
      };

      console.log("Update Session Request Data:", requestData);
      console.log("Selected Teacher:", selectedTeacher);
      console.log("Selected Subject:", selectedSubject);

      const response = await classApi.updateClassSession(requestData);

      if (response.success) {
        showToast("success", "Thành công", "Cập nhật tiết học thành công");
        setIsAddModalOpen(false);
        await fetchClassSessions(selectedClassId);
        resetForm();
      } else {
        showToast(
          "error",
          "Lỗi",
          response.message || "Không thể cập nhật tiết học"
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data) {
        showToast("error", "Lỗi", JSON.stringify(axiosError.response.data));
      } else {
        showToast("error", "Lỗi", "Đã xảy ra lỗi khi cập nhật tiết học");
      }
    }
  };

  // Kiểm tra thay đổi: nếu chọn lại ID mới hoặc sửa nội dung
  const hasFormChanged = () => {
    if (!selectedSession) return false;
    return (
      (form.teacherId && form.teacherId !== selectedSession.teacherId) ||
      (form.subjectId && form.subjectId !== selectedSession.subjectId) ||
      form.lessonContent !== selectedSession.lessonContent ||
      form.generalBehaviorNote !== selectedSession.generalBehaviorNote ||
      form.totalAbsentStudents !== selectedSession.totalAbsentStudents
    );
  };

  const resetForm = () => {
    setForm({
      teacherId: "",
      subjectId: "",
      lessonContent: "",
      generalBehaviorNote: "",
      totalAbsentStudents: 0,
    });
    setSelectedSession(null);
    setIsEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Đang tải danh sách lớp...</p>
        </div>
      </div>
    );
  }

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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                  value={selectedClassId}
                  onChange={handleClassChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {classes.length > 0 ? (
                    classes.map((classItem) => (
                      <option key={classItem.classId} value={classItem.classId}>
                        Lớp {classItem.className}
                      </option>
                    ))
                  ) : (
                    <option value="">Không có lớp nào</option>
                  )}
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
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="bg-blue-50">
              <div className="flex justify-between items-center">
                <CardTitle>
                  Thời khóa biểu lớp {selectedClassName}
                  {classSessions.length === 0 && !loadingTimetable && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Chưa có thời khóa biểu)
                    </span>
                  )}
                </CardTitle>
                <span className="text-sm text-gray-500">
                  Học kỳ 1 - Năm học 2024-2025
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {loadingTimetable ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2">Đang tải thời khóa biểu...</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse table-fixed">
                    <colgroup>
                      <col className="w-[120px]" />
                      {days.map((_, index) => (
                        <col
                          key={index}
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
                      {periods.map((period) => (
                        <tr key={period.periodId}>
                          <td className="border p-2 text-center bg-gray-50 sticky left-0 z-10">
                            <div className="font-medium">
                              Tiết {period.periodNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              {period.startTime} - {period.endTime}
                            </div>
                          </td>
                          {days.map((day) => {
                            const slot = getSlotForDayAndPeriod(
                              day,
                              period.periodNumber
                            );
                            return (
                              <td
                                key={`${day}-${period.periodId}`}
                                className="border p-2 relative group hover:bg-gray-50"
                              >
                                {slot ? (
                                  <div className="min-h-[120px] p-2">
                                    <div className="font-medium text-blue-800 line-clamp-1">
                                      {slot.subjectName}
                                    </div>
                                    <div className="text-sm text-gray-600 line-clamp-1 mt-1">
                                      {slot.teacherName}
                                    </div>
                                    <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                                      {slot.lessonContent}
                                    </div>
                                    {slot.totalAbsentStudents > 0 && (
                                      <div className="text-xs text-red-500 mt-1">
                                        Vắng: {slot.totalAbsentStudents} học
                                        sinh
                                      </div>
                                    )}
                                    {slot.generalBehaviorNote && (
                                      <div className="text-xs text-orange-500 line-clamp-2 mt-1">
                                        Ghi chú: {slot.generalBehaviorNote}
                                      </div>
                                    )}
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 flex gap-1">
                                      <button
                                        className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                        onClick={() => handleEditClick(slot)}
                                      >
                                        <Edit2 size={14} />
                                      </button>
                                      <button className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="min-h-[120px] flex items-center justify-center text-gray-400 hover:text-blue-500 cursor-pointer"
                                    onClick={() =>
                                      handleAddClick(period.periodNumber, day)
                                    }
                                  >
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title={
          isEditMode
            ? `Chỉnh sửa tiết học - ${selectedSession?.subjectName} - Tiết ${
                selectedSession?.periodNumber
              } - ${new Date(selectedSession?.date || "").toLocaleDateString(
                "vi-VN",
                { weekday: "long" }
              )}`
            : `Thêm tiết học - Tiết ${selectedPeriod?.periodNumber} - ${selectedPeriod?.day}`
        }
      >
        <div className="space-y-4">
          {isEditMode && (
            <>
              <div className="text-sm text-gray-600 mb-2">
                <b>Giáo viên hiện tại:</b> {selectedSession?.teacherName}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <b>Môn học hiện tại:</b> {selectedSession?.subjectName}
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn giáo viên mới (nếu muốn đổi)
            </label>
            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Không đổi --</option>
              {teachers.map((teacher) => (
                <option value={teacher.userId} key={teacher.userId}>
                  {teacher.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn môn học mới (nếu muốn đổi)
            </label>
            <select
              name="subjectId"
              value={form.subjectId}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Không đổi --</option>
              {subjects.map((subject) => (
                <option value={subject.subjectId} key={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung bài học <span className="text-red-500">*</span>
            </label>
            <textarea
              name="lessonContent"
              value={form.lessonContent}
              onChange={handleFormChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập nội dung bài học..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số học sinh vắng mặt
            </label>
            <input
              type="number"
              name="totalAbsentStudents"
              value={form.totalAbsentStudents}
              onChange={handleFormChange}
              min={0}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú chung
            </label>
            <textarea
              name="generalBehaviorNote"
              value={form.generalBehaviorNote}
              onChange={handleFormChange}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập ghi chú về lớp học..."
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={isEditMode ? handleUpdate : handleSubmit}
              disabled={
                isEditMode
                  ? !hasFormChanged()
                  : !form.teacherId || !form.subjectId || !form.lessonContent
              }
            >
              {isEditMode ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TimetablePage;
