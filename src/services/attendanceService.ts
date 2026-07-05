// import { apiFetch } from './api';
import type { AttendanceRecord } from '../types';

export const attendanceService = {
  getAttendanceRecords: async (_date?: string): Promise<AttendanceRecord[]> => {
    // API Integration:
    // return apiFetch<AttendanceRecord[]>('/attendance', { params: _date ? { date: _date } : undefined });
    
    throw new Error('Connect ASP.NET Web API endpoint GET /api/attendance');
  },

  updateAttendanceStatus: async (
    _employeeId: number,
    _status: AttendanceRecord['status'],
    _date: string
  ): Promise<AttendanceRecord> => {
    // API Integration:
    // return apiFetch<AttendanceRecord>('/attendance/update', {
    //   method: 'POST',
    //   body: JSON.stringify({ employeeId: _employeeId, status: _status, date: _date }),
    // });
    
    throw new Error('Connect ASP.NET Web API endpoint POST /api/attendance/update');
  }
};
