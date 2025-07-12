import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor để gắn token
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// export const getTotalClass = async () => {
//   const response = await axiosInstance.get("/api/class/count");
//   return response.data;
// };

// export const getTotalStudent = async () => {
//   const response = await axiosInstance.get("/api/student/count");
//   return response.data;
// };

// export const getTotalHomeroomTeacher = async () => {
//   const response = await axiosInstance.get("/api/user/count/homeroom-teachers");
//   return response.data;
// };

// export const getTotalSubjectTeacher = async () => {
//   const response = await axiosInstance.get("/api/user/count/subject-teachers");
//   return response.data;
// };


export default axiosInstance 
