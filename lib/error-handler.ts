import axios from "axios";
import { toast } from "sonner";

export const handleApiError = (
  error: unknown,
  title: string = "An error occurred"
) => {
  let errorMessage = "An unexpected error occurred. Please try again later.";
  if (axios.isAxiosError(error) && error.response) {
    const responseData = error.response.data;
    console.error("API Error:", responseData);
    if (responseData && typeof responseData.detail === 'string') {
      errorMessage = responseData.detail;
      // if (errorMessage === 'Invalid token.') {
      //   errorMessage = 'Your session has expired. Please log in again.';
      // }
    } else if (responseData && typeof responseData.message === 'string') {
        errorMessage = responseData.message;
    } else if (typeof responseData === 'string' && responseData.length > 0 && responseData.length < 200) {
        errorMessage = responseData;
    } else if (responseData && responseData.non_field_errors.length > 0) {
      errorMessage = responseData.non_field_errors[0];
    } else {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  toast.error(title, {
    description: errorMessage,
  });
};
