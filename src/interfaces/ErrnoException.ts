export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
  status?: number;
  error?: ErrorDetails;
  value?: any;
  errors?: any;
}

interface ErrorDetails extends Error {
  details: Array<Record<string, unknown>>;
}
