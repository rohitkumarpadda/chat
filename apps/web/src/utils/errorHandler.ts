import { AxiosError } from "axios";
import { showNotification } from "@mantine/notifications";

export interface ApiError {
  message: string;
  status?: number;
}

export const handleApiError = (error: any): ApiError => {
  if (error.response?.data?.message) {
    return {
      message: error.response.data.message,
      status: error.response.status,
    };
  }

  if (error.response?.status === 403) {
    return {
      message: "Access denied. You may be blocked by this user or have blocked them.",
      status: 403,
    };
  }

  if (error.response?.status === 404) {
    return {
      message: "Resource not found.",
      status: 404,
    };
  }

  if (error.response?.status === 400) {
    return {
      message: "Invalid request. Please check your input.",
      status: 400,
    };
  }

  if (error.response?.status === 401) {
    return {
      message: "Authentication required. Please log in again.",
      status: 401,
    };
  }

  if (error.response?.status >= 500) {
    return {
      message: "Server error. Please try again later.",
      status: error.response.status,
    };
  }

  if (error.message) {
    return {
      message: error.message,
    };
  }

  return {
    message: "An unexpected error occurred. Please try again.",
  };
};

export const showErrorMessage = (error: any, defaultMessage?: string) => {
  const apiError = handleApiError(error);
  showNotification({
    title: "Error",
    message: apiError.message || defaultMessage || "An error occurred. Please try again.",
    color: "red",
    autoClose: 5000,
  });
};

export const showSuccessMessage = (message: string, title?: string) => {
  showNotification({
    title: title || "Success",
    message,
    color: "green",
    autoClose: 3000,
  });
};
