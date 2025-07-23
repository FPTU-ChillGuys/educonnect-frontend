import { AxiosError } from "axios";

// Import ToastType từ Toast component
type ToastType = "success" | "error" | "warning" | "info";

// Interface để định nghĩa error có thể có suppressToast
interface ErrorWithSuppressToast {
  suppressToast?: boolean;
}

// Kiểm tra xem có nên hiển thị toast lỗi hay không
export const shouldShowErrorToast = (error: unknown): boolean => {
  // Nếu error có flag suppressToast, không hiển thị toast
  if (
    error &&
    typeof error === "object" &&
    (error as ErrorWithSuppressToast).suppressToast
  ) {
    return false;
  }

  // Nếu là AxiosError với suppressToast
  if (
    error instanceof AxiosError &&
    (error as ErrorWithSuppressToast).suppressToast
  ) {
    return false;
  }

  // Nếu không có token trong localStorage (đã đăng xuất), không hiển thị toast
  if (!localStorage.getItem("token")) {
    return false;
  }

  return true;
};

// Wrapper function để hiển thị toast lỗi an toàn
export const showErrorToastSafely = (
  error: unknown,
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => void,
  title: string = "Lỗi",
  defaultMessage: string = "Đã xảy ra lỗi"
) => {
  if (shouldShowErrorToast(error)) {
    showToast("error", title, defaultMessage);
  }
};
