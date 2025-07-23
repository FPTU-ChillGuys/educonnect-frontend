import React, { useState, useEffect, useCallback } from "react";
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
  Search,
  Users,
  GraduationCap,
  UserPlus,
  Download,
  Filter,
  X,
  Upload,
  User,
} from "lucide-react";
import { ClassApi } from "../../types/index";
import { classApi } from "../../services/api";
import { userApi } from "../../services/api/userApi";
import { useToast } from "../../contexts/ToastContext";
import Modal from "../../components/ui/Modal";
import { AxiosError } from "axios";
import { CreateStudentRequest } from "../../services/api/classApi";

// Cập nhật type StudentApi để khớp với response từ API
type StudentApi = {
  studentId: string;
  fullName: string;
  studentCode: string;
  gender: string;
  avatarUrl: string | null;
  dateOfBirth: string;
  classId: string;
  className: string;
  parentId: string;
  parentEmail: string;
  parentFullName: string;
  parentPhoneNumber: string;
  status: string;
};

// Định nghĩa type cho Parent API - cập nhật theo response
type ParentApi = {
  userId: string;
  fullName: string;
  email: string;
};

// Định nghĩa type cho Student Edit Form
type StudentEditForm = {
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: string; // "Male" or "Female"
  avatar?: File | null;
  status: string;
  classId: string;
  parentId: string;
};

// Định nghĩa type cho giáo viên chủ nhiệm
interface HomeroomTeacher {
  userId: string;
  fullName: string;
  email: string;
}

const ClassManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  // Thêm state để theo dõi trạng thái modal
  const [showEditStudentModal, setShowEditStudentModal] =
    useState<boolean>(false);

  // State cho add class
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [addClassForm, setAddClassForm] = useState({
    gradeLevel: "10",
    className: "",
    academicYear: "",
    homeroomTeacherId: "",
  });
  const [homeroomTeachers, setHomeroomTeachers] = useState<HomeroomTeacher[]>(
    []
  );

  // State cho edit student
  const [editingStudent, setEditingStudent] = useState<StudentApi | null>(null);
  const [editForm, setEditForm] = useState<StudentEditForm>({
    studentCode: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Male",
    avatar: null,
    status: "Active",
    classId: "",
    parentId: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho danh sách data
  const [students, setStudents] = useState<StudentApi[]>([]);
  const [classes, setClasses] = useState<ClassApi[]>([]);
  const [parents, setParents] = useState<ParentApi[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  const pageSize = 6;

  // Stats
  const [stats] = useState({
    totalClasses: 20,
    totalStudents: 20,
    totalHomeroomTeachers: 20,
    totalSubjectTeachers: 20,
  });

  // Debounce search để tránh gọi API quá nhiều
  const debounceSearch = useCallback(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const cleanup = debounceSearch();
    return cleanup;
  }, [debounceSearch]);

  // Fetch danh sách lớp
  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoadingClasses(true);
      try {
        const response = await classApi.getClasses({
          PageNumber: 1,
          PageSize: 100,
        });
        setClasses(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp:", error);
        setClasses([]);
      } finally {
        setIsLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch danh sách parents sử dụng userApi
  useEffect(() => {
    const fetchParents = async () => {
      setIsLoadingParents(true);
      try {
        const data = await userApi.getUsersByRole("parent");

        if (data.success && data.data && Array.isArray(data.data)) {
          setParents(data.data);
        } else if (data.data && Array.isArray(data.data)) {
          setParents(data.data);
        } else {
          console.error("Invalid API response structure:", data);
          setParents([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phụ huynh:", error);
        setParents([]);
      } finally {
        setIsLoadingParents(false);
      }
    };

    fetchParents();
  }, []);

  // Fetch danh sách học sinh với filter
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const params: {
          pageNumber: number;
          pageSize: number;
          Keyword?: string;
          ClassId?: string;
        } = {
          pageNumber: page,
          pageSize,
        };

        if (searchTerm.trim() !== "") {
          params.Keyword = searchTerm.trim();
        }

        if (selectedClass !== "all") {
          params.ClassId = selectedClass;
        }

        const res = await classApi.getStudents(params);
        setStudents(res.data);
        setTotalCount(res.totalCount);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
        setStudents([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [page, searchTerm, selectedClass]);

  // Thêm useEffect để theo dõi thay đổi của editingStudent
  useEffect(() => {
    if (editingStudent) {
      setAvatarPreview(editingStudent.avatarUrl || "");
    }
  }, [editingStudent]);

  // Function để tìm parent name từ email
  const getParentNameByEmail = (email: string): string => {
    if (!parents || parents.length === 0) {
      return "Đang tải...";
    }

    const parent = parents.find((p) => p.email === email);
    return parent ? parent.fullName : "Chưa xác định";
  };

  // Function để tìm parent từ student data
  const getCurrentParentInfo = (student: StudentApi) => {
    if (!parents || parents.length === 0) {
      return null;
    }

    const parent = parents.find((p) => p.email === student.parentEmail);
    return parent
      ? {
          id: parent.userId,
          name: parent.fullName,
          email: parent.email,
        }
      : null;
  };

  // Function để handle edit student - cập nhật để set parentId
  const handleEditStudent = (student: StudentApi) => {
    const studentToEdit = { ...student };
    setEditingStudent(studentToEdit);

    const currentParent = getCurrentParentInfo(studentToEdit);

    setEditForm({
      studentCode: studentToEdit.studentCode,
      fullName: studentToEdit.fullName,
      dateOfBirth: studentToEdit.dateOfBirth,
      gender:
        studentToEdit.gender === "Nam" || studentToEdit.gender === "Male"
          ? "Male"
          : "Female",
      avatar: null,
      status: studentToEdit.status,
      classId:
        classes.find((cls) => cls.className === studentToEdit.className)
          ?.classId || "",
      parentId: currentParent ? currentParent.id : "",
    });

    setShowEditStudentModal(true);
  };

  // Function để handle form input change
  const handleEditFormChange = (
    field: keyof StudentEditForm,
    value: string | File | null
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function để handle avatar upload với toast validation
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("error", "Lỗi", "Vui lòng chọn file hình ảnh!");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Lỗi", "Kích thước file không được vượt quá 5MB!");
        return;
      }

      setEditForm((prev) => ({ ...prev, avatar: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function để remove avatar
  const handleRemoveAvatar = () => {
    setEditForm((prev) => ({ ...prev, avatar: null }));
    setAvatarPreview("");
  };

  // Function để submit edit form
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingStudent) return;

    setIsSubmitting(true);

    try {
      const updateData = {
        studentCode: editForm.studentCode.trim(),
        fullName: editForm.fullName.trim(),
        dateOfBirth: editForm.dateOfBirth,
        gender: editForm.gender,
        status: editForm.status,
        classId: editForm.classId,
        parentId: editForm.parentId,
        avatar: editForm.avatar || undefined,
      };

      await classApi.updateStudent(editingStudent.studentId, updateData);
      await refreshStudentList();

      showToast(
        "success",
        "Thành công",
        `Đã cập nhật thông tin học sinh ${editForm.fullName}`
      );

      handleCloseEditModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật học sinh:", error);
      let errorMessage = "Có lỗi không xác định xảy ra";

      if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          errorMessage = data.message || "Dữ liệu không hợp lệ";
        } else if (status === 404) {
          errorMessage = "Không tìm thấy học sinh";
        } else {
          errorMessage = data.message || `Lỗi ${status}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast("error", "Cập nhật thất bại", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function để refresh danh sách học sinh
  const refreshStudentList = async () => {
    try {
      setIsLoading(true);
      const params = {
        pageNumber: page,
        pageSize,
        ...(searchTerm.trim() && { Keyword: searchTerm.trim() }),
        ...(selectedClass !== "all" && { ClassId: selectedClass }),
      };

      const res = await classApi.getStudents(params);

      setStudents(res.data);
      setTotalCount(res.totalCount);

      if (editingStudent && showEditStudentModal) {
        const updatedStudent = res.data.find(
          (student: StudentApi) =>
            student.studentId === editingStudent.studentId
        );
        if (updatedStudent) {
          setEditingStudent(updatedStudent);
        }
      }
    } catch (error) {
      console.error("Lỗi khi refresh danh sách học sinh:", error);
      let errorMessage = "Không thể làm mới danh sách học sinh";

      if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response;
        errorMessage =
          data.message || `Lỗi ${status}: Không thể làm mới danh sách học sinh`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast("error", "Lỗi", errorMessage);
      setStudents([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Function để handle close edit modal
  const handleCloseEditModal = () => {
    setShowEditStudentModal(false);
    setEditingStudent(null);
    setEditForm({
      studentCode: "",
      fullName: "",
      dateOfBirth: "",
      gender: "Male",
      avatar: null,
      status: "Active",
      classId: "",
      parentId: "",
    });
    setAvatarPreview("");
  };

  // Function để clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  // Function để clear tất cả filters
  const handleClearAllFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedClass("all");
    setPage(1);
  };

  // Function để handle search submit (Enter key)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setPage(1);
  };

  // Function để format giới tính cho hiển thị
  const formatGender = (gender: string) => {
    if (gender === "Male" || gender === "Nam") {
      return "Nam";
    } else if (gender === "Female" || gender === "Nữ") {
      return "Nữ";
    }
    return gender;
  };

  const openAddClassModal = async () => {
    setShowAddClassModal(true);
    try {
      const data = await userApi.getAvailableHomeroomTeachers();
      setHomeroomTeachers(data.data || []);
    } catch {
      setHomeroomTeachers([]);
    }
  };

  // Thêm state loading cho form thêm lớp
  const [isAddingClass, setIsAddingClass] = useState(false);

  // Thêm state cho form errors
  const [addClassFormErrors, setAddClassFormErrors] = useState<{
    className?: string;
    academicYear?: string;
    homeroomTeacherId?: string;
  }>({});

  // Hàm validate form thêm lớp
  const validateAddClassForm = (): boolean => {
    const errors: typeof addClassFormErrors = {};

    if (!addClassForm.className.trim()) {
      errors.className = "Vui lòng nhập tên lớp";
    }

    if (!addClassForm.academicYear.trim()) {
      errors.academicYear = "Vui lòng nhập năm học";
    } else if (!/^\d{4}-\d{4}$/.test(addClassForm.academicYear)) {
      errors.academicYear =
        "Năm học phải có định dạng YYYY-YYYY (VD: 2023-2024)";
    }

    if (!addClassForm.homeroomTeacherId) {
      errors.homeroomTeacherId = "Vui lòng chọn giáo viên chủ nhiệm";
    }

    setAddClassFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAddClassForm()) {
      return;
    }

    setIsAddingClass(true);
    try {
      await classApi.createClass(addClassForm);
      showToast("success", "Thành công", "Đã thêm lớp học mới");
      setShowAddClassModal(false);
      // Refresh danh sách lớp
      await refreshClassList();
    } catch (error) {
      console.error("Lỗi khi thêm lớp:", error);
      showToast(
        "error",
        "Lỗi",
        "Không thể thêm lớp học. Vui lòng thử lại sau."
      );
    } finally {
      setIsAddingClass(false);
    }
  };

  // Function để refresh danh sách lớp
  const refreshClassList = async () => {
    setIsLoadingClasses(true);
    try {
      const response = await classApi.getClasses({
        PageNumber: 1,
        PageSize: 100,
      });
      setClasses(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp sau khi thêm:", error);
      setClasses([]);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  // Thêm state cho add student
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [addStudentForm, setAddStudentForm] = useState<StudentEditForm>({
    studentCode: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Male",
    avatar: null,
    status: "Active",
    classId: "",
    parentId: "",
  });
  const [addStudentAvatarPreview, setAddStudentAvatarPreview] =
    useState<string>("");
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // Function để handle avatar upload cho add student
  const handleAddStudentAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("error", "Lỗi", "Vui lòng chọn file hình ảnh!");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Lỗi", "Kích thước file không được vượt quá 5MB!");
        return;
      }

      setAddStudentForm((prev) => ({ ...prev, avatar: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAddStudentAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function để remove avatar cho add student
  const handleRemoveAddStudentAvatar = () => {
    setAddStudentForm((prev) => ({ ...prev, avatar: null }));
    setAddStudentAvatarPreview("");
  };

  // Function để handle form input change cho add student
  const handleAddStudentFormChange = (
    field: keyof StudentEditForm,
    value: string | File | null
  ) => {
    setAddStudentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function để submit add student form
  const handleSubmitAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!addStudentForm.studentCode.trim()) {
      showToast("error", "Lỗi", "Vui lòng nhập mã học sinh!");
      return;
    }

    if (!addStudentForm.fullName.trim()) {
      showToast("error", "Lỗi", "Vui lòng nhập họ tên học sinh!");
      return;
    }

    if (!addStudentForm.classId) {
      showToast("error", "Lỗi", "Vui lòng chọn lớp học!");
      return;
    }

    if (!addStudentForm.parentId) {
      showToast("error", "Lỗi", "Vui lòng chọn phụ huynh!");
      return;
    }

    if (!addStudentForm.dateOfBirth) {
      showToast("error", "Lỗi", "Vui lòng chọn ngày sinh!");
      return;
    }

    setIsAddingStudent(true);

    try {
      // Convert StudentEditForm to CreateStudentRequest
      const createStudentData: CreateStudentRequest = {
        studentCode: addStudentForm.studentCode,
        fullName: addStudentForm.fullName,
        dateOfBirth: addStudentForm.dateOfBirth,
        gender: addStudentForm.gender,
        status: addStudentForm.status,
        classId: addStudentForm.classId,
        parentId: addStudentForm.parentId,
        avatar: addStudentForm.avatar || undefined,
      };

      // Gọi API thêm học sinh
      await classApi.createStudent(createStudentData);

      // Show success toast
      showToast(
        "success",
        "Thành công",
        `Đã thêm học sinh ${addStudentForm.fullName}`
      );

      // Close modal và reset form
      handleCloseAddModal();

      // Refresh student list
      await refreshStudentList();
    } catch (error) {
      console.error("Lỗi khi thêm học sinh:", error);

      let errorMessage = "Có lỗi không xác định xảy ra";

      if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.join(", ");
          } else if (data.message) {
            errorMessage = data.message;
          } else {
            errorMessage = "Dữ liệu không hợp lệ";
          }
        } else if (status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn";
        } else if (status === 403) {
          errorMessage = "Bạn không có quyền thực hiện thao tác này";
        } else if (status === 409) {
          errorMessage = "Mã học sinh đã tồn tại";
        } else if (status >= 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau";
        } else {
          errorMessage = data.message || `Lỗi ${status}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast("error", "Thêm học sinh thất bại", errorMessage);
    } finally {
      setIsAddingStudent(false);
    }
  };

  // Function để handle close add modal
  const handleCloseAddModal = () => {
    setShowAddStudentModal(false);
    setAddStudentForm({
      studentCode: "",
      fullName: "",
      dateOfBirth: "",
      gender: "Male",
      avatar: null,
      status: "Active",
      classId: "",
      parentId: "",
    });
    setAddStudentAvatarPreview("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            onClick={openAddClassModal}
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
                  {classes.length > 0 ? classes.length : stats.totalClasses}
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
                  {totalCount > 0 ? totalCount : stats.totalStudents}
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
                  {students.filter((s) => s.status === "Active").length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-teal-100">
                <Users className="text-teal-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters - Giữ nguyên */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter size={18} />
              Bộ lọc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Box */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Mã HS hoặc họ tên..."
                  className="w-full p-2 pl-8 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search
                  className="absolute left-2.5 top-2.5 text-gray-400"
                  size={16}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>
              {searchTerm && (
                <p className="text-xs text-gray-500 mt-1">
                  Đang tìm kiếm: "
                  <span className="font-medium">{searchTerm}</span>"
                </p>
              )}
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lớp học
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoadingClasses}
              >
                <option value="all">
                  {isLoadingClasses ? "Đang tải..." : "Tất cả lớp"}
                </option>
                {classes.map((cls) => (
                  <option key={cls.classId} value={cls.classId}>
                    Lớp {cls.className} - {cls.academicYear} (GV:{" "}
                    {cls.homeroomTeacherName})
                  </option>
                ))}
              </select>
            </div>

            {/* Rest of filters content - giữ nguyên */}
            {(searchTerm || selectedClass !== "all") && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Bộ lọc đang áp dụng
                  </h4>
                  <button
                    onClick={handleClearAllFilters}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="space-y-1">
                  {searchTerm && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Từ khóa:</span>
                      <span className="font-medium text-gray-900 truncate ml-2">
                        {searchTerm}
                      </span>
                    </div>
                  )}
                  {selectedClass !== "all" && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Lớp:</span>
                      <span className="font-medium text-gray-900 truncate ml-2">
                        {classes.find((cls) => cls.classId === selectedClass)
                          ?.className || selectedClass}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Thống kê nhanh
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng:</span>
                  <span className="font-medium text-gray-900">
                    {totalCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đang học:</span>
                  <span className="font-medium text-green-600">
                    {students.filter((s) => s.status === "Active").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm nghỉ:</span>
                  <span className="font-medium text-red-600">
                    {students.filter((s) => s.status === "Inactive").length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student List - Chỉ sửa action buttons */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Danh sách học sinh
                  {selectedClass !== "all" &&
                    (() => {
                      const selectedClassData = classes.find(
                        (cls) => cls.classId === selectedClass
                      );
                      return selectedClassData
                        ? ` - Lớp ${selectedClassData.className}`
                        : "";
                    })()}
                  {searchTerm && (
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      (Tìm kiếm: "{searchTerm}")
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isLoading && (
                    <div className="text-sm text-gray-500">Đang tải...</div>
                  )}
                  <span className="text-sm text-gray-500">
                    {totalCount} học sinh
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
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
                  {students.length > 0 ? (
                    <tbody>
                      {Array.from({ length: pageSize }).map((_, idx) => {
                        const student = students[idx];
                        if (student) {
                          const displayGender = formatGender(student.gender);
                          return (
                            <tr
                              key={student.studentId}
                              className={`border-b border-gray-100 hover:bg-gray-50 h-16 ${
                                student.status !== "Active"
                                  ? "opacity-75 bg-gray-25"
                                  : ""
                              }`}
                            >
                              {/* Table cells - giữ nguyên */}
                              <td
                                className="py-3 px-4 font-medium text-blue-600 truncate"
                                title={student.studentCode}
                              >
                                {searchTerm &&
                                student.studentCode
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ? (
                                  <span>
                                    {student.studentCode
                                      .split(
                                        new RegExp(`(${searchTerm})`, "gi")
                                      )
                                      .map((part, i) =>
                                        part.toLowerCase() ===
                                        searchTerm.toLowerCase() ? (
                                          <mark
                                            key={i}
                                            className="bg-yellow-200"
                                          >
                                            {part}
                                          </mark>
                                        ) : (
                                          part
                                        )
                                      )}
                                  </span>
                                ) : (
                                  student.studentCode
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="min-w-0">
                                  <div
                                    className={`font-medium truncate ${
                                      student.status === "Active"
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                    }`}
                                    title={student.fullName}
                                  >
                                    {searchTerm &&
                                    student.fullName
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ? (
                                      <span>
                                        {student.fullName
                                          .split(
                                            new RegExp(`(${searchTerm})`, "gi")
                                          )
                                          .map((part, i) =>
                                            part.toLowerCase() ===
                                            searchTerm.toLowerCase() ? (
                                              <mark
                                                key={i}
                                                className="bg-yellow-200"
                                              >
                                                {part}
                                              </mark>
                                            ) : (
                                              part
                                            )
                                          )}
                                      </span>
                                    ) : (
                                      student.fullName
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap"
                                  title={student.className}
                                >
                                  {student.className}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    displayGender === "Nam"
                                      ? "bg-blue-100 text-blue-800"
                                      : displayGender === "Nữ"
                                      ? "bg-pink-100 text-pink-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                  title={displayGender}
                                >
                                  {displayGender}
                                </span>
                              </td>
                              <td
                                className={`py-3 px-4 text-sm whitespace-nowrap ${
                                  student.status === "Active"
                                    ? "text-gray-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {new Date(
                                  student.dateOfBirth
                                ).toLocaleDateString("vi-VN")}
                              </td>
                              <td
                                className={`py-3 px-4 text-sm truncate ${
                                  student.status === "Active"
                                    ? "text-gray-600"
                                    : "text-gray-400"
                                }`}
                                title={student.parentPhoneNumber}
                              >
                                {student.parentPhoneNumber}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    student.status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                  title={
                                    student.status === "Active"
                                      ? "Đang học"
                                      : "Tạm nghỉ"
                                  }
                                >
                                  {student.status === "Active"
                                    ? "Đang học"
                                    : "Tạm nghỉ"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-1">
                                  <button
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                    title="Chỉnh sửa"
                                    onClick={() => handleEditStudent(student)}
                                    disabled={isLoading}
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        // Empty row
                        return (
                          <tr
                            key={`empty-${idx}`}
                            className="h-16 border-b border-gray-100"
                          >
                            <td
                              colSpan={8}
                              className="py-3 px-4 text-gray-400 text-center"
                            >
                              &nbsp;
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={8}>
                          <div className="text-center py-8">
                            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {isLoading
                                ? "Đang tải..."
                                : "Không tìm thấy học sinh"}
                            </h3>
                            <p className="text-gray-500">
                              {isLoading
                                ? "Vui lòng chờ trong giây lát..."
                                : searchTerm || selectedClass !== "all"
                                ? "Không có học sinh nào phù hợp với bộ lọc hiện tại."
                                : "Chưa có học sinh nào trong hệ thống."}
                            </p>
                            {!isLoading &&
                              (searchTerm || selectedClass !== "all") && (
                                <Button
                                  variant="outline"
                                  onClick={handleClearAllFilters}
                                  className="mt-4"
                                >
                                  Xóa bộ lọc
                                </Button>
                              )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>

              {/* Pagination - giữ nguyên */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Hiển thị {Math.min((page - 1) * pageSize + 1, totalCount)} -{" "}
                  {Math.min(page * pageSize, totalCount)} của {totalCount} học
                  sinh
                  {(searchTerm || selectedClass !== "all") && (
                    <span className="text-blue-600 ml-1">(đã lọc)</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1 || isLoading}
                    onClick={() => setPage(page - 1)}
                  >
                    Trang trước
                  </Button>
                  <span className="flex items-center px-3 py-1 text-sm">
                    Trang {page} / {Math.ceil(totalCount / pageSize) || 1}
                  </span>
                  <Button
                    variant="outline"
                    disabled={
                      page >= Math.ceil(totalCount / pageSize) || isLoading
                    }
                    onClick={() => setPage(page + 1)}
                  >
                    Trang sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Student Modal - Đơn giản hóa */}
      {showEditStudentModal && editingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Chỉnh sửa thông tin học sinh
              </h3>
              <button
                onClick={handleCloseEditModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmitEdit}
              className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ảnh đại diện
                      </label>

                      {/* Avatar Preview */}
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 bg-gray-50">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-full h-full object-cover rounded-lg"
                            // Thêm key để force re-render khi URL thay đổi
                            key={avatarPreview}
                            // Thêm onError handler
                            onError={(e) => {
                              console.error("Error loading avatar:", e);
                              setAvatarPreview("");
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <User className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Chưa có ảnh</p>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      <div className="flex gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                          <span className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            <Upload size={16} className="mr-2" />
                            Chọn ảnh
                          </span>
                        </label>

                        {(avatarPreview || editForm.avatar) && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                            disabled={isSubmitting}
                          >
                            Xóa ảnh
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Định dạng: JPG, PNG, GIF. Tối đa 5MB.
                      </p>
                    </div>

                    {/* Current Student Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Thông tin hiện tại
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">ID:</span>
                          <span className="ml-2 font-mono text-xs">
                            {editingStudent.studentId}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Mã cũ:</span>
                          <span className="ml-2">
                            {editingStudent.studentCode}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Lớp cũ:</span>
                          <span className="ml-2">
                            {editingStudent.className}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">PH hiện tại:</span>
                          <span className="ml-2">
                            {isLoadingParents
                              ? "Đang tải..."
                              : getParentNameByEmail(
                                  editingStudent.parentEmail
                                )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email PH:</span>
                          <span className="ml-2 text-xs">
                            {editingStudent.parentEmail}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">SĐT PH:</span>
                          <span className="ml-2 text-xs">
                            {editingStudent.parentPhoneNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mã học sinh */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã học sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.studentCode}
                        onChange={(e) =>
                          handleEditFormChange("studentCode", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="HS001"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Họ và tên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) =>
                          handleEditFormChange("fullName", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nguyễn Văn An"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Ngày sinh */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={
                          editForm.dateOfBirth
                            ? new Date(editForm.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleEditFormChange("dateOfBirth", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Giới tính */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) =>
                          handleEditFormChange("gender", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                      </select>
                    </div>

                    {/* Lớp học */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lớp học <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editForm.classId}
                        onChange={(e) =>
                          handleEditFormChange("classId", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isSubmitting || isLoadingClasses}
                      >
                        <option value="">Chọn lớp</option>
                        {classes.map((cls) => (
                          <option key={cls.classId} value={cls.classId}>
                            Lớp {cls.className} - {cls.academicYear} (GV:{" "}
                            {cls.homeroomTeacherName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phụ huynh */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phụ huynh <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editForm.parentId}
                        onChange={(e) =>
                          handleEditFormChange("parentId", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isSubmitting || isLoadingParents}
                      >
                        <option value="">
                          {isLoadingParents
                            ? "Đang tải danh sách phụ huynh..."
                            : "Chọn phụ huynh"}
                        </option>
                        {parents.map((parent) => (
                          <option key={parent.userId} value={parent.userId}>
                            {parent.fullName} ({parent.email})
                            {parent.email === editingStudent?.parentEmail &&
                              " - Hiện tại"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Trạng thái */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          handleEditFormChange("status", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      >
                        <option value="Active">Đang học</option>
                        <option value="Inactive">Tạm nghỉ</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseEditModal}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmitEdit}
                disabled={isSubmitting || isLoadingParents || isLoadingClasses}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang cập nhật...
                  </div>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Modals for Add functions */}
      {showAddClassModal && (
        <Modal
          isOpen={showAddClassModal}
          onClose={() => setShowAddClassModal(false)}
          title="Thêm lớp học mới"
        >
          <form onSubmit={handleAddClass} className="space-y-6">
            <div className="space-y-4">
              {/* Khối lớp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khối lớp <span className="text-red-500">*</span>
                </label>
                <select
                  value={addClassForm.gradeLevel}
                  onChange={(e) =>
                    setAddClassForm({
                      ...addClassForm,
                      gradeLevel: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>

              {/* Tên lớp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên lớp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addClassForm.className}
                  onChange={(e) =>
                    setAddClassForm({
                      ...addClassForm,
                      className: e.target.value,
                    })
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    addClassFormErrors.className
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="VD: 10A1"
                  required
                />
                {addClassFormErrors.className && (
                  <p className="mt-1 text-sm text-red-600">
                    {addClassFormErrors.className}
                  </p>
                )}
              </div>

              {/* Năm học */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Năm học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addClassForm.academicYear}
                  onChange={(e) =>
                    setAddClassForm({
                      ...addClassForm,
                      academicYear: e.target.value,
                    })
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    addClassFormErrors.academicYear
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="VD: 2023-2024"
                  required
                />
                {addClassFormErrors.academicYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {addClassFormErrors.academicYear}
                  </p>
                )}
              </div>

              {/* Giáo viên chủ nhiệm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giáo viên chủ nhiệm <span className="text-red-500">*</span>
                </label>
                <select
                  value={addClassForm.homeroomTeacherId}
                  onChange={(e) =>
                    setAddClassForm({
                      ...addClassForm,
                      homeroomTeacherId: e.target.value,
                    })
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    addClassFormErrors.homeroomTeacherId
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Chọn giáo viên chủ nhiệm</option>
                  {homeroomTeachers.map((teacher) => (
                    <option key={teacher.userId} value={teacher.userId}>
                      {teacher.fullName} ({teacher.email})
                    </option>
                  ))}
                </select>
                {addClassFormErrors.homeroomTeacherId && (
                  <p className="mt-1 text-sm text-red-600">
                    {addClassFormErrors.homeroomTeacherId}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddClassModal(false)}
                disabled={isAddingClass}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isAddingClass}
                className="min-w-[100px]"
              >
                {isAddingClass ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang thêm...
                  </div>
                ) : (
                  "Thêm lớp"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Thêm học sinh mới
              </h3>
              <button
                onClick={handleCloseAddModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isAddingStudent}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmitAddStudent}
              className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ảnh đại diện
                      </label>

                      {/* Avatar Preview */}
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 bg-gray-50">
                          {addStudentAvatarPreview ? (
                            <img
                              src={addStudentAvatarPreview}
                              alt="Avatar preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <User className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">
                                Chưa có ảnh
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex gap-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAddStudentAvatarChange}
                              className="hidden"
                              disabled={isAddingStudent}
                            />
                            <span className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                              <Upload size={16} className="mr-2" />
                              Chọn ảnh
                            </span>
                          </label>

                          {(addStudentAvatarPreview ||
                            addStudentForm.avatar) && (
                            <button
                              type="button"
                              onClick={handleRemoveAddStudentAvatar}
                              className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                              disabled={isAddingStudent}
                            >
                              Xóa ảnh
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Định dạng: JPG, PNG, GIF. Tối đa 5MB.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mã học sinh */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã học sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addStudentForm.studentCode}
                        onChange={(e) =>
                          handleAddStudentFormChange(
                            "studentCode",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="HS001"
                        required
                        disabled={isAddingStudent}
                      />
                    </div>

                    {/* Họ và tên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addStudentForm.fullName}
                        onChange={(e) =>
                          handleAddStudentFormChange("fullName", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nguyễn Văn A"
                        required
                        disabled={isAddingStudent}
                      />
                    </div>

                    {/* Ngày sinh */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={
                          addStudentForm.dateOfBirth
                            ? new Date(addStudentForm.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleAddStudentFormChange(
                            "dateOfBirth",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isAddingStudent}
                      />
                    </div>

                    {/* Giới tính */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addStudentForm.gender}
                        onChange={(e) =>
                          handleAddStudentFormChange("gender", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isAddingStudent}
                      >
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                      </select>
                    </div>

                    {/* Lớp học */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lớp học <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addStudentForm.classId}
                        onChange={(e) =>
                          handleAddStudentFormChange("classId", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isAddingStudent || isLoadingClasses}
                      >
                        <option value="">
                          {isLoadingClasses
                            ? "Đang tải danh sách lớp..."
                            : "Chọn lớp"}
                        </option>
                        {classes.map((cls) => (
                          <option key={cls.classId} value={cls.classId}>
                            Lớp {cls.className} - {cls.academicYear} (GV:{" "}
                            {cls.homeroomTeacherName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phụ huynh */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phụ huynh <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addStudentForm.parentId}
                        onChange={(e) =>
                          handleAddStudentFormChange("parentId", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isAddingStudent || isLoadingParents}
                      >
                        <option value="">
                          {isLoadingParents
                            ? "Đang tải danh sách phụ huynh..."
                            : "Chọn phụ huynh"}
                        </option>
                        {parents.map((parent) => (
                          <option key={parent.userId} value={parent.userId}>
                            {parent.fullName} ({parent.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Trạng thái */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                      </label>
                      <select
                        value={addStudentForm.status}
                        onChange={(e) =>
                          handleAddStudentFormChange("status", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isAddingStudent}
                      >
                        <option value="Active">Đang học</option>
                        <option value="Inactive">Tạm nghỉ</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseAddModal}
                disabled={isAddingStudent}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmitAddStudent}
                disabled={
                  isAddingStudent || isLoadingParents || isLoadingClasses
                }
                className="min-w-[120px]"
              >
                {isAddingStudent ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang thêm...
                  </div>
                ) : (
                  "Thêm học sinh"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagementPage;
