import axios, { AxiosInstance } from "axios"

const axiosInstance: AxiosInstance = axios.create({
  // Replace with actual API base URL tam thoi chua co
  baseURL: "https://your-api-url.com/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Optional: Interceptor để gắn token
// axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

export default axiosInstance 
