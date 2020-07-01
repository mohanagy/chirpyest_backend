export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
  status?: number;
  error?: Error | { details: { [key: string]: string } };
}
