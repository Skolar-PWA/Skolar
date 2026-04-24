export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface BulkImportResultRow {
  row: number;
  status: 'succeeded' | 'failed';
  id?: string;
  field?: string;
  message?: string;
}

export interface BulkImportResult {
  total: number;
  succeeded: number;
  failed: number;
  jobId?: string;
  results?: BulkImportResultRow[];
}

export interface JobStatus {
  id: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  result?: unknown;
  error?: string;
}
