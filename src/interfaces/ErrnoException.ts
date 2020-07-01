export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
  status?: number;
  error?: ErrorDetails;
}

interface ErrorDetails extends Error {
  details: string;
}
