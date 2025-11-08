export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    throw new ApiError(
      error.response.data.message || 'An error occurred',
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    // Request made but no response
    throw new ApiError('Network error - no response received', 503);
  } else {
    // Request setup error
    throw new ApiError('Request failed - ' + error.message, 400);
  }
};