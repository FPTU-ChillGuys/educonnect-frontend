import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Plus, Edit2, Trash2, Download, Filter } from "lucide-react";
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
import { showErrorToastSafely } from "../../utils/errorUtils";

interface AddSessionForm {
  teacherId: string;
  subjectId: string;
  lessonContent: string;
  generalBehaviorNote: string;
  totalAbsentStudents: number;
  selectedDate: string; // Thêm field để quản lý ngày được chọn
  selectedPeriodId: string; // Thêm field để quản lý tiết học được chọn
}

const TimetablePage: React.FC = () => {
  const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const { showToast } = useToast();
  const [classes, setClasses] = useState<ClassLookup[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
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

  // Ref để track việc khởi tạo lần đầu
  const isInitialized = useRef(false);
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(
    null
  );
  const [form, setForm] = useState<AddSessionForm>({
    teacherId: "",
    subjectId: "",
    lessonContent: "",
    generalBehaviorNote: "",
    totalAbsentStudents: 0,
    selectedDate: "",
    selectedPeriodId: "",
  });
  const [subjects, setSubjects] = useState<SubjectLookup[]>([]);

  // Thêm state cho week filter
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

  const fetchClassSessions = React.useCallback(
    async (classId: string, fromDate?: string, toDate?: string) => {
      try {
        setLoadingTimetable(true);

        const params: {
          ClassId: string;
          PageSize: number;
          FromDate?: string;
          ToDate?: string;
        } = {
          ClassId: classId,
          PageSize: 100,
        };

        // Thêm filter theo tuần nếu có
        if (fromDate && toDate) {
          params.FromDate = fromDate;
          params.ToDate = toDate;
        }

        const response = await classApi.getClassSessions(params);

        if (response.success) {
          setClassSessions(response.data);
        } else {
          setClassSessions([]);
          showErrorToastSafely(
            new Error("API response unsuccessful"),
            showToast,
            "Lỗi",
            "Đã xảy ra lỗi khi tải thời khóa biểu"
          );
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (
          axiosError.response?.status === 404 ||
          axiosError.response?.status === 400
        ) {
          setClassSessions([]);
        } else {
          showErrorToastSafely(
            error,
            showToast,
            "Lỗi",
            "Đã xảy ra lỗi khi tải thời khóa biểu"
          );
        }
      } finally {
        setLoadingTimetable(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Loại bỏ showToast dependency
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
        showErrorToastSafely(
          error,
          showToast,
          "Lỗi",
          "Đã xảy ra lỗi khi tải danh sách tiết học"
        );
      }
    };

    fetchPeriods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Loại bỏ showToast dependency

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await classApi.getClassLookup();
        if (response.success) {
          setClasses(response.data);
          // Chỉ set selectedClassId nếu chưa khởi tạo lần đầu
          if (response.data.length > 0 && !isInitialized.current) {
            const firstClass = response.data[0];
            setSelectedClassId(firstClass.classId);
            setSelectedClassName(firstClass.className);
            isInitialized.current = true; // Đánh dấu đã khởi tạo
            // Chờ selectedWeek được set trước khi fetch
            // Sẽ được gọi trong useEffect khác
          }
        } else {
          showErrorToastSafely(
            new Error("API response unsuccessful"),
            showToast,
            "Lỗi",
            response.message || "Không thể tải danh sách lớp"
          );
        }
      } catch (error) {
        showErrorToastSafely(
          error,
          showToast,
          "Lỗi",
          "Đã xảy ra lỗi khi tải danh sách lớp"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Loại bỏ showToast dependency

  // Fetch class sessions when selectedWeek or selectedClassId changes
  useEffect(() => {
    if (selectedClassId && selectedWeek) {
      fetchClassSessions(
        selectedClassId,
        selectedWeek.fromDate,
        selectedWeek.toDate
      );
    }
  }, [selectedClassId, selectedWeek, fetchClassSessions]);

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await userApi.getTeacherLookup();
        if (response.success) {
          setTeachers(response.data);
        }
      } catch (error) {
        showErrorToastSafely(
          error,
          showToast,
          "Lỗi",
          "Đã xảy ra lỗi khi tải danh sách giáo viên"
        );
      }
    };

    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Loại bỏ showToast dependency

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectApi.getSubjectLookup();
        if (response.success) {
          setSubjects(response.data);
        }
      } catch (error) {
        showErrorToastSafely(
          error,
          showToast,
          "Lỗi",
          "Đã xảy ra lỗi khi tải danh sách môn học"
        );
      }
    };

    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Loại bỏ showToast dependency

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = classes.find((c) => c.classId === event.target.value);
    if (selectedClass) {
      setSelectedClassId(selectedClass.classId);
      setSelectedClassName(selectedClass.className);
      if (selectedWeek) {
        fetchClassSessions(
          selectedClass.classId,
          selectedWeek.fromDate,
          selectedWeek.toDate
        );
      }
    }
  };

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

    // Set ngày mặc định cho add mode
    const defaultDate = calculateDateFromDay(day);
    setForm((prev) => ({
      ...prev,
      selectedDate: defaultDate.split("T")[0], // Lấy phần ngày từ ISO string
      selectedPeriodId: period.periodId, // Set periodId cho add mode
    }));

    setIsAddModalOpen(true);
  };

  const handleEditClick = (session: ClassSession) => {
    // Tìm periodId từ periodNumber
    const period = periods.find((p) => p.periodNumber === session.periodNumber);
    if (!period) {
      showToast("error", "Lỗi", "Không tìm thấy thông tin tiết học");
      return;
    }

    setSelectedSession({
      ...session,
      periodId: period.periodId, // Đảm bảo có periodId từ lookup
    });
    setForm({
      teacherId: session.teacherId, // Set mặc định là ID giáo viên hiện tại
      subjectId: session.subjectId, // Set mặc định là ID môn học hiện tại
      lessonContent: session.lessonContent || "",
      generalBehaviorNote: session.generalBehaviorNote || "",
      totalAbsentStudents: session.totalAbsentStudents || 0,
      selectedDate: session.date.split("T")[0], // Lấy phần ngày từ ISO string
      selectedPeriodId: period.periodId, // Set periodId hiện tại
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
    if (!selectedWeek) {
      // Fallback nếu không có tuần được chọn
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(today.getDate()).padStart(2, "0")}T00:00:00`;
    }

    const dayMap: { [key: string]: number } = {
      "Thứ Hai": 0, // Thứ 2 là ngày đầu tuần (offset 0)
      "Thứ Ba": 1, // Thứ 3 là ngày thứ 2 (offset 1)
      "Thứ Tư": 2, // Thứ 4 là ngày thứ 3 (offset 2)
      "Thứ Năm": 3, // Thứ 5 là ngày thứ 4 (offset 3)
      "Thứ Sáu": 4, // Thứ 6 là ngày thứ 5 (offset 4)
      "Thứ Bảy": 5, // Thứ 7 là ngày thứ 6 (offset 5)
    };

    const dayOffset = dayMap[day];
    if (dayOffset === undefined) {
      // Fallback nếu không tìm thấy thứ
      return selectedWeek.fromDate + "T00:00:00";
    }

    // Tính ngày chính xác trong tuần đã chọn
    const weekStartDate = new Date(selectedWeek.fromDate);
    const targetDate = new Date(weekStartDate);
    targetDate.setDate(weekStartDate.getDate() + dayOffset);

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
      if (!form.teacherId) {
        showToast("error", "Lỗi", "Vui lòng chọn giáo viên");
        return;
      }

      if (!form.selectedDate) {
        showToast("error", "Lỗi", "Vui lòng chọn ngày");
        return;
      }

      if (!form.selectedPeriodId) {
        showToast("error", "Lỗi", "Vui lòng chọn tiết học");
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
        periodId: form.selectedPeriodId || selectedPeriod.periodId, // Sử dụng selectedPeriodId hoặc fallback
        date: form.selectedDate + "T00:00:00", // Sử dụng ngày được chọn
        lessonContent: form.lessonContent,
        generalBehaviorNote: form.generalBehaviorNote,
        totalAbsentStudents: form.totalAbsentStudents,
      });

      if (response.success) {
        showToast("success", "Thành công", "Thêm tiết học thành công");
        setIsAddModalOpen(false);
        // Fetch lại thời khóa biểu của lớp hiện tại với tuần đã chọn
        // Giữ nguyên lớp hiện tại để không bị reset về lớp mặc định
        const classIdToUse = selectedClassId;
        if (selectedWeek) {
          await fetchClassSessions(
            classIdToUse,
            selectedWeek.fromDate,
            selectedWeek.toDate
          );
        } else {
          await fetchClassSessions(classIdToUse);
        }
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
    if (!selectedSession) {
      showToast("error", "Lỗi", "Không tìm thấy thông tin tiết học");
      return;
    }

    if (!selectedSession.classSessionId) {
      showToast("error", "Lỗi", "Không tìm thấy ID tiết học");
      return;
    }

    if (!form.teacherId || !form.subjectId || !form.lessonContent) {
      showToast("error", "Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (isEditMode && !form.selectedDate) {
      showToast("error", "Lỗi", "Vui lòng chọn ngày cho tiết học");
      return;
    }

    if (isEditMode && !form.selectedPeriodId) {
      showToast("error", "Lỗi", "Vui lòng chọn tiết học");
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

      // Đảm bảo có periodId (từ lookup hoặc từ session gốc)
      const periodId =
        selectedSession.periodId ||
        periods.find((p) => p.periodNumber === selectedSession.periodNumber)
          ?.periodId;

      if (!periodId) {
        showToast("error", "Lỗi", "Không tìm thấy thông tin tiết học");
        return;
      }

      // Chuẩn bị dữ liệu request - sử dụng ngày được chọn
      const requestData = {
        sessionId: selectedSession.classSessionId,
        classId: selectedSession.classId, // Sử dụng classId từ session
        teacherId: form.teacherId,
        subjectId: form.subjectId,
        periodId: form.selectedPeriodId, // Sử dụng periodId được chọn từ form
        date: form.selectedDate + "T00:00:00", // Sử dụng ngày được chọn với định dạng ISO
        lessonContent: form.lessonContent,
        totalAbsentStudents: form.totalAbsentStudents,
        generalBehaviorNote: form.generalBehaviorNote || "",
      };

      const response = await classApi.updateClassSession(requestData);

      if (response.success) {
        showToast("success", "Thành công", "Cập nhật tiết học thành công");
        setIsAddModalOpen(false);
        // Giữ nguyên lớp hiện tại để không bị reset về lớp mặc định
        const classIdToRefresh = selectedSession?.classId || selectedClassId;
        if (selectedWeek) {
          await fetchClassSessions(
            classIdToRefresh,
            selectedWeek.fromDate,
            selectedWeek.toDate
          );
        } else {
          await fetchClassSessions(classIdToRefresh);
        }
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

  const handleDelete = async (session: ClassSession) => {
    if (!session.classSessionId) {
      showToast("error", "Lỗi", "Không tìm thấy ID tiết học");
      return;
    }

    // Hiển thị confirm dialog
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa tiết học "${session.subjectName}" - Tiết ${
        session.periodNumber
      } vào ngày ${new Date(session.date).toLocaleDateString("vi-VN")}?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await classApi.deleteClassSession(
        session.classSessionId
      );

      if (response.success) {
        showToast("success", "Thành công", "Xóa tiết học thành công");
        // Fetch lại thời khóa biểu
        if (selectedWeek) {
          await fetchClassSessions(
            selectedClassId,
            selectedWeek.fromDate,
            selectedWeek.toDate
          );
        } else {
          await fetchClassSessions(selectedClassId);
        }
      } else {
        showToast("error", "Lỗi", response.message || "Không thể xóa tiết học");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data) {
        showToast("error", "Lỗi", JSON.stringify(axiosError.response.data));
      } else {
        showToast("error", "Lỗi", "Đã xảy ra lỗi khi xóa tiết học");
      }
    }
  };

  // Kiểm tra thay đổi: so sánh với giá trị gốc
  const hasFormChanged = () => {
    if (!selectedSession) return false;
    return (
      form.teacherId !== selectedSession.teacherId ||
      form.subjectId !== selectedSession.subjectId ||
      form.lessonContent !== (selectedSession.lessonContent || "") ||
      form.generalBehaviorNote !==
        (selectedSession.generalBehaviorNote || "") ||
      form.totalAbsentStudents !== (selectedSession.totalAbsentStudents || 0) ||
      form.selectedDate !== selectedSession.date.split("T")[0] || // So sánh ngày được chọn
      form.selectedPeriodId !== (selectedSession.periodId || "") // So sánh tiết học được chọn
    );
  };

  const resetForm = () => {
    setForm({
      teacherId: "",
      subjectId: "",
      lessonContent: "",
      generalBehaviorNote: "",
      totalAbsentStudents: 0,
      selectedDate: "",
      selectedPeriodId: "",
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
                Tuần học
              </label>
              <div className="relative">
                <select
                  value={
                    selectedWeek
                      ? `${selectedWeek.fromDate}_${selectedWeek.toDate}`
                      : ""
                  }
                  onChange={handleWeekChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {getWeekOptions().map((week) => (
                    <option key={week.value} value={week.value}>
                      {week.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="bg-blue-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    Thời khóa biểu lớp {selectedClassName}
                    {classSessions.length === 0 && !loadingTimetable && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Chưa có thời khóa biểu)
                      </span>
                    )}
                  </CardTitle>
                  {selectedWeek && (
                    <div className="text-sm text-gray-600 mt-1">
                      Tuần: {selectedWeek.label}
                    </div>
                  )}
                </div>
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
                                      <button
                                        className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                        onClick={() => handleDelete(slot)}
                                      >
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
          {!isEditMode && selectedPeriod && (
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm text-blue-700">
                <b>Ngày được chọn tự động:</b>{" "}
                {new Date(
                  calculateDateFromDay(selectedPeriod.day)
                ).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          )}
          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn ngày <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="selectedDate"
                value={form.selectedDate}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Ngày được chọn:{" "}
                {form.selectedDate
                  ? new Date(
                      form.selectedDate + "T00:00:00"
                    ).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Chưa chọn ngày"}
              </div>
            </div>
          )}
          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn tiết học <span className="text-red-500">*</span>
              </label>
              <select
                name="selectedPeriodId"
                value={form.selectedPeriodId}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Chọn tiết học --</option>
                {periods.map((period) => (
                  <option key={period.periodId} value={period.periodId}>
                    Tiết {period.periodNumber} ({period.startTime} -{" "}
                    {period.endTime})
                    {selectedPeriod &&
                      period.periodId === selectedPeriod.periodId &&
                      " (Được chọn)"}
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                Tiết được chọn:{" "}
                {form.selectedPeriodId
                  ? (() => {
                      const selectedPeriod = periods.find(
                        (p) => p.periodId === form.selectedPeriodId
                      );
                      return selectedPeriod
                        ? `Tiết ${selectedPeriod.periodNumber} (${selectedPeriod.startTime} - ${selectedPeriod.endTime})`
                        : "Không tìm thấy tiết học";
                    })()
                  : "Chưa chọn tiết học"}
              </div>
            </div>
          )}
          {isEditMode && (
            <div className="bg-green-50 p-3 rounded-md">
              <div className="text-sm text-green-700">
                <b>Ngày tiết học hiện tại:</b>{" "}
                {new Date(selectedSession?.date || "").toLocaleDateString(
                  "vi-VN",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
            </div>
          )}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn ngày mới <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="selectedDate"
                value={form.selectedDate}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Ngày được chọn:{" "}
                {form.selectedDate
                  ? new Date(
                      form.selectedDate + "T00:00:00"
                    ).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Chưa chọn ngày"}
              </div>
            </div>
          )}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn tiết học mới <span className="text-red-500">*</span>
              </label>
              <select
                name="selectedPeriodId"
                value={form.selectedPeriodId}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Chọn tiết học --</option>
                {periods.map((period) => (
                  <option key={period.periodId} value={period.periodId}>
                    Tiết {period.periodNumber} ({period.startTime} -{" "}
                    {period.endTime})
                    {period.periodId === selectedSession?.periodId &&
                      " (Hiện tại)"}
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                Tiết được chọn:{" "}
                {form.selectedPeriodId
                  ? (() => {
                      const selectedPeriod = periods.find(
                        (p) => p.periodId === form.selectedPeriodId
                      );
                      return selectedPeriod
                        ? `Tiết ${selectedPeriod.periodNumber} (${selectedPeriod.startTime} - ${selectedPeriod.endTime})`
                        : "Không tìm thấy tiết học";
                    })()
                  : "Chưa chọn tiết học"}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditMode ? "Giáo viên" : "Chọn giáo viên"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {!isEditMode && <option value="">-- Chọn giáo viên --</option>}
              {teachers.map((teacher) => (
                <option value={teacher.userId} key={teacher.userId}>
                  {teacher.fullName}
                  {isEditMode &&
                    teacher.userId === selectedSession?.teacherId &&
                    " (Hiện tại)"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditMode ? "Môn học" : "Chọn môn học"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="subjectId"
              value={form.subjectId}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {!isEditMode && <option value="">-- Chọn môn học --</option>}
              {subjects.map((subject) => (
                <option value={subject.subjectId} key={subject.subjectId}>
                  {subject.subjectName}
                  {isEditMode &&
                    subject.subjectId === selectedSession?.subjectId &&
                    " (Hiện tại)"}
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
                  : !form.teacherId ||
                    !form.subjectId ||
                    !form.lessonContent ||
                    !form.selectedDate ||
                    !form.selectedPeriodId
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
