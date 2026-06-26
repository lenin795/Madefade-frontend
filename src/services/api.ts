import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true,
});

export interface ApiErrorShape {
  error?: string;
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ApiErrorShape>(err)) {
    return err.response?.data?.error || err.message || 'Something went wrong.';
  }

  if (err instanceof Error) return err.message;

  return 'Something went wrong.';
}