import { api } from './api';
import type { Admin } from '../types';

export async function login(email: string, password: string): Promise<Admin> {
  const { data } = await api.post('/auth/login', { email, password });
  return data.admin;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function fetchMe(): Promise<Admin> {
  const { data } = await api.get('/auth/me');
  return data.admin;
}
