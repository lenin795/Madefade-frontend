import { api } from './api';
import type { DashboardSummary, AnalyticsData, EmailCapture } from '../types';

export async function fetchDashboard(): Promise<DashboardSummary> {
  const { data } = await api.get('/dashboard');
  return data;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const { data } = await api.get('/analytics');
  return data;
}

export async function fetchEmailCaptures(): Promise<EmailCapture[]> {
  const { data } = await api.get('/emails');
  return data.captures;
}
