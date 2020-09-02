import { ErrnoException } from '../interfaces';

export default (error: ErrnoException): string => {
  return (
    (error?.errors && error.errors[0]?.message) ||
    error.message ||
    error.error?.details[0]?.message ||
    'Internal server'
  );
};
