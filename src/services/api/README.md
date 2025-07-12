# API Services Structure

Cấu trúc API đã được tổ chức lại để tách biệt logic gọi API và cấu hình HTTP client.

## Cấu trúc thư mục

```
src/services/api/
├── index.ts              # Export tất cả API services
├── axiosConfig.ts        # Cấu hình axios và interceptors
├── authApi.ts           # API cho authentication
├── dashboardApi.ts      # API cho dashboard
├── classApi.ts          # API cho quản lý lớp học
├── userApi.ts           # API cho quản lý người dùng
└── README.md            # Hướng dẫn sử dụng
```

## Cách sử dụng

### 1. Import API services

```typescript
// Import tất cả API services
import { authApi, dashboardApi, classApi, userApi } from "../services/api";

// Hoặc import riêng lẻ
import { authApi } from "../services/api/authApi";
import { dashboardApi } from "../services/api/dashboardApi";
```

### 2. Sử dụng trong components

```typescript
import React, { useEffect, useState } from "react";
import { dashboardApi, DashboardStats } from "../services/api";

const DashboardComponent: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getAllStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (!stats) return <div>Không có dữ liệu</div>;

  return (
    <div>
      <h2>Thống kê Dashboard</h2>
      <p>Tổng số lớp: {stats.totalClasses}</p>
      <p>Tổng số học sinh: {stats.totalStudents}</p>
      <p>Tổng số giáo viên chủ nhiệm: {stats.totalHomeroomTeachers}</p>
      <p>Tổng số giáo viên bộ môn: {stats.totalSubjectTeachers}</p>
    </div>
  );
};
```

### 3. Sử dụng authentication

```typescript
import { authApi, LoginRequest } from '../services/api';

const LoginComponent: React.FC = () => {
  const handleLogin = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);

      // Lưu token và thông tin user
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Chuyển hướng sau khi đăng nhập thành công
      navigate('/dashboard');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    }
  };

  return (
    // Form đăng nhập
  );
};
```

### 4. Sử dụng quản lý lớp học

```typescript
import { classApi, Class, CreateClassRequest } from '../services/api';

const ClassManagementComponent: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classApi.getAllClasses();
        setClasses(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách lớp:', error);
      }
    };

    fetchClasses();
  }, []);

  const handleCreateClass = async (classData: CreateClassRequest) => {
    try {
      const newClass = await classApi.createClass(classData);
      setClasses(prev => [...prev, newClass]);
    } catch (error) {
      console.error('Lỗi khi tạo lớp:', error);
    }
  };

  return (
    // UI quản lý lớp học
  );
};
```

## Lợi ích của cấu trúc mới

1. **Tách biệt trách nhiệm**: Cấu hình HTTP client và logic API được tách riêng
2. **Type Safety**: Mỗi API service có types riêng, giúp code an toàn hơn
3. **Dễ bảo trì**: Mỗi domain có file riêng, dễ tìm và sửa
4. **Tái sử dụng**: Có thể import và sử dụng ở nhiều nơi
5. **Testing**: Dễ dàng mock và test từng API service
6. **Scalability**: Dễ dàng thêm API services mới

## Migration từ cấu trúc cũ

Nếu bạn đang sử dụng các API calls từ `axiosInstance.ts` cũ:

```typescript
// Cũ
import { getTotalClass, getTotalStudent } from "../services/axiosInstance";

// Mới
import { dashboardApi } from "../services/api";
const totalClass = await dashboardApi.getTotalClass();
const totalStudent = await dashboardApi.getTotalStudent();
```

## Thêm API service mới

Để thêm API service mới:

1. Tạo file mới trong `src/services/api/` (ví dụ: `scheduleApi.ts`)
2. Import `axiosInstance` từ `./axiosConfig`
3. Định nghĩa types và API functions
4. Export từ `src/services/api/index.ts`
