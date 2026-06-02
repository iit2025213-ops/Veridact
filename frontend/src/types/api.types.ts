export interface PaginatedResponse<T> {
  items: T[]; total: number; page: number; limit?: number;
  size?: number; pages?: number;
}
export interface ApiError {
  detail: string; error_code?: string; timestamp?: string;
}
export interface ApiResponse<T> {
  data?: T; error?: ApiError; status: number;
}
