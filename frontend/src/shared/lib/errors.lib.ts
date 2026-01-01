import type { ApiError } from "../model/api-error.types";

export function extractErrorMessageFromBackendError(error: { data: ApiError }) {
  return (
    error.data.message ?? error.data.error ?? "An unexpected error occurred"
  );
}
