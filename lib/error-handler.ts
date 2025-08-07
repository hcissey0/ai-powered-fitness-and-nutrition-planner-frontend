// lib/error-handler.ts
import axios from "axios";
import { toast } from "sonner";

/**
 * Handles and displays API errors in a user-friendly format using toast notifications.
 * It intelligently parses the error response from the backend.
 * NOTE: Authentication errors (401) are handled globally by the axios interceptor.
 * @param error The error object, expected to be from an Axios call.
 * @param title A custom title for the toast notification.
 */
export const handleApiError = (
  error: unknown,
  title: string = "An error occurred"
) => {
  let errorMessage = "An unexpected error occurred. Please try again later.";

  if (axios.isAxiosError(error) && error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const responseData = error.response.data;
    console.log("API Error Response:", responseData); // Keep this for debugging

    if (responseData && typeof responseData.detail === "string") {
      errorMessage = responseData.detail;
    } else if (responseData && typeof responseData.message === "string") {
      errorMessage = responseData.message;
    } else if (
      responseData &&
      Array.isArray(responseData.non_field_errors) &&
      responseData.non_field_errors.length > 0
    ) {
      errorMessage = responseData.non_field_errors[0];
    } else if (
      typeof responseData === "string" &&
      responseData.length > 0 &&
      responseData.length < 200
    ) {
      errorMessage = responseData;
    } else {
      // Fallback to the generic Axios error message if the response format is unexpected
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    // The error was not from an Axios request (e.g., a client-side error)
    errorMessage = error.message;
  }

  toast.error(title, {
    description: errorMessage,
  });
};
