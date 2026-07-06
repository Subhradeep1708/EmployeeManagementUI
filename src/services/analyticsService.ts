import { apiFetch } from './api';

export interface HiringTrendItem {
  year: number;
  employeesHired: number;
}

export interface DepartmentGrowthItem {
  department: string;
  employeeCount: number;
}

export interface AttendancePatternItem {
  status: string;
  count: number;
}

export interface AnalyticsDashboardData {
  hiringTrend: HiringTrendItem[];
  departmentGrowth: DepartmentGrowthItem[];
  attendancePattern: AttendancePatternItem[];
}

export interface GetAnalyticsResponse {
  success: boolean;
  data: AnalyticsDashboardData;
  message: string;
  statusCode: number;
}

export const analyticsService = {
  getDashboardAnalytics: async (): Promise<GetAnalyticsResponse> => {
    return apiFetch<GetAnalyticsResponse>('/Analytics/dashboard');
  },
};
