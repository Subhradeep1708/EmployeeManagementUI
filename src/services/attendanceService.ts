import { apiFetch } from './api';

export interface AttendanceSummary {
  present: number;
  absent: number;
  leave: number;
  halfDay: number;
  wfh: number;
  attendanceRate: number;
}

export interface AttendanceItem {
  attendanceId: number;
  employeeId: number;
  employeeName: string;
  department: string;
  attendanceDate: string;
  status: string;
  checkIn: string;
  checkOut: string;
}

export interface GetAttendanceResponse {
  success: boolean;
  data: {
    items: AttendanceItem[];
    summary: AttendanceSummary;
    totalRecords: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message: string;
  statusCode: number;
}

export const attendanceService = {
  getAttendance: async (
    page = 1,
    pageSize = 10,
    search = '',
    date = '',
    status = ''
  ): Promise<GetAttendanceResponse> => {
    return apiFetch<GetAttendanceResponse>('/Attendance/get-attendance', {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search ? { search } : {}),
        ...(date ? { date } : {}),
        ...(status ? { status } : {}),
      },
    });
  },

  createAttendance: async (payload: {
    employeeId: number;
    attendanceDate: string;
    status: string;
    checkIn: string;
    checkOut: string;
    remarks: string;
  }): Promise<{ success: boolean; data: any; message: string; statusCode: number }> => {
    return apiFetch('/Attendance/create-attendance', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateAttendance: async (
    attendanceId: number,
    payload: {
      status: string;
      checkIn: string;
      checkOut: string;
      remarks: string;
    }
  ): Promise<{ success: boolean; data: any; message: string; statusCode: number }> => {
    return apiFetch(`/Attendance/update-attendence/${attendanceId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
