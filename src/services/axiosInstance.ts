import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

// Biến để theo dõi trạng thái đăng xuất
let isLoggingOut = false;

// Hàm để set trạng thái đăng xuất
export const setLoggingOut = (status: boolean) => {
  isLoggingOut = status;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để gắn token
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý response và lỗi
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Nếu đang trong quá trình đăng xuất, không hiển thị lỗi
    if (isLoggingOut) {
      return Promise.reject({ ...error, suppressToast: true });
    }

    // Nếu lỗi 401 (Unauthorized) và không có token, có thể là đã đăng xuất
    if (error.response?.status === 401 && !localStorage.getItem("token")) {
      return Promise.reject({ ...error, suppressToast: true });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
