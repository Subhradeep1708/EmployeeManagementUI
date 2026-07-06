import React, { useState, useEffect } from 'react';
import type { Employee } from '../types';
import { Check, X, Clock, CalendarDays, RefreshCw, Loader2, Search } from 'lucide-react';
import { getAvatarFallback } from '../utils/helpers';
import { attendanceService, type AttendanceItem, type AttendanceSummary } from '../services/attendanceService';
import { useToast } from '../context/ToastContext';

interface AttendanceProps {
  employees: Employee[];
}

const CHECK_IN_OPTIONS = [
  { label: '08:00 AM', value: '08:00:00' },
  { label: '08:30 AM', value: '08:30:00' },
  { label: '09:00 AM', value: '09:00:00' },
  { label: '09:30 AM', value: '09:30:00' },
  { label: '10:00 AM', value: '10:00:00' },
  { label: '10:30 AM', value: '10:30:00' },
  { label: '11:00 AM', value: '11:00:00' },
  { label: '11:30 AM', value: '11:30:00' },
  { label: '12:00 PM', value: '12:00:00' },
];

const CHECK_OUT_OPTIONS = [
  { label: '04:00 PM', value: '16:00:00' },
  { label: '04:30 PM', value: '16:30:00' },
  { label: '05:00 PM', value: '17:00:00' },
  { label: '05:30 PM', value: '17:30:00' },
  { label: '06:00 PM', value: '18:00:00' },
  { label: '06:30 PM', value: '18:30:00' },
  { label: '07:00 PM', value: '19:00:00' },
  { label: '07:30 PM', value: '19:30:00' },
  { label: '08:00 PM', value: '20:00:00' },
  { label: '08:30 PM', value: '20:30:00' },
  { label: '09:00 PM', value: '21:00:00' },
];

export const Attendance: React.FC<AttendanceProps> = () => {
  const { showToast } = useToast();
  const [records, setRecords] = useState<AttendanceItem[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>({
    present: 0,
    absent: 0,
    leave: 0,
    halfDay: 0,
    wfh: 0,
    attendanceRate: 0,
  });

  const [currentDate, setCurrentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const response = await attendanceService.getAttendance(
        page,
        pageSize,
        debouncedSearchQuery,
        currentDate,
        selectedStatus
      );

      if (response.success && response.data) {
        setRecords(response.data.items || []);
        setSummary(response.data.summary || {
          present: 0,
          absent: 0,
          leave: 0,
          halfDay: 0,
          wfh: 0,
          attendanceRate: 0,
        });
        setTotalPages(response.data.totalPages || 1);
        setTotalRecords(response.data.totalRecords || 0);
      } else {
        showToast(response.message || 'Failed to fetch attendance records.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred while loading attendance logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAttendance();
  }, [page, currentDate, selectedStatus, debouncedSearchQuery]);

  const handleStatusChange = async (record: AttendanceItem, status: string) => {
    setActionLoading(true);
    try {
      if (record.attendanceId && record.attendanceId > 0) {
        // Update existing record
        const response = await attendanceService.updateAttendance(record.attendanceId, {
          status,
          checkIn: record.checkIn || '09:00:00',
          checkOut: record.checkOut || '18:00:00',
          remarks: '',
        });

        if (response.success) {
          showToast(`Attendance updated for ${record.employeeName}.`, 'success');
          void loadAttendance();
        } else {
          showToast(response.message || 'Failed to update attendance.', 'error');
        }
      } else {
        // Create new record
        const response = await attendanceService.createAttendance({
          employeeId: record.employeeId,
          attendanceDate: currentDate + 'T00:00:00Z',
          status,
          checkIn: '09:00:00',
          checkOut: '18:00:00',
          remarks: '',
        });

        if (response.success) {
          showToast(`Attendance created for ${record.employeeName}.`, 'success');
          void loadAttendance();
        } else {
          showToast(response.message || 'Failed to mark attendance.', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred while updating status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTimeChange = async (record: AttendanceItem, field: 'checkIn' | 'checkOut', newValue: string) => {
    setActionLoading(true);
    try {
      const updatedCheckIn = field === 'checkIn' ? newValue : (record.checkIn || '09:00:00');
      const updatedCheckOut = field === 'checkOut' ? newValue : (record.checkOut || '18:00:00');

      if (record.attendanceId && record.attendanceId > 0) {
        const response = await attendanceService.updateAttendance(record.attendanceId, {
          status: record.status || 'Present',
          checkIn: updatedCheckIn,
          checkOut: updatedCheckOut,
          remarks: '',
        });

        if (response.success) {
          showToast(`Time updated for ${record.employeeName}.`, 'success');
          void loadAttendance();
        } else {
          showToast(response.message || 'Failed to update time.', 'error');
        }
      } else {
        const response = await attendanceService.createAttendance({
          employeeId: record.employeeId,
          attendanceDate: currentDate + 'T00:00:00Z',
          status: 'Present',
          checkIn: updatedCheckIn,
          checkOut: updatedCheckOut,
          remarks: '',
        });

        if (response.success) {
          showToast(`Attendance created and time set for ${record.employeeName}.`, 'success');
          void loadAttendance();
        } else {
          showToast(response.message || 'Failed to set time.', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred while saving time.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllPresent = async () => {
    if (records.length === 0) return;
    setActionLoading(true);
    try {
      const promises = records.map((rec) => {
        if (rec.attendanceId && rec.attendanceId > 0) {
          return attendanceService.updateAttendance(rec.attendanceId, {
            status: 'Present',
            checkIn: '09:00:00',
            checkOut: '18:00:00',
            remarks: 'Bulk update to Present',
          });
        } else {
          return attendanceService.createAttendance({
            employeeId: rec.employeeId,
            attendanceDate: currentDate + 'T00:00:00Z',
            status: 'Present',
            checkIn: '09:00:00',
            checkOut: '18:00:00',
            remarks: 'Bulk mark Present',
          });
        }
      });

      await Promise.all(promises);
      showToast('All listed employees marked Present.', 'success');
      void loadAttendance();
    } catch (err: any) {
      showToast(err.message || 'An error occurred during bulk operation.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr || timeStr === '-') return '-';
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hour = Number(parts[0]);
      const minute = parts[1];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${String(formattedHour).padStart(2, '0')}:${minute} ${ampm}`;
    }
    return timeStr;
  };

  const formatTimeTo24h = (timeStr?: string) => {
    if (!timeStr || timeStr === '-') return '09:00:00';
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') {
        hours = '00';
      }
      if (modifier === 'PM') {
        hours = String(parseInt(hours, 10) + 12);
      }
      return `${hours.padStart(2, '0')}:${minutes}:00`;
    }
    return timeStr;
  };

  const getCheckInOptions = (currentValue?: string) => {
    const options = [...CHECK_IN_OPTIONS];
    if (currentValue && currentValue !== '-') {
      const normalizedValue = currentValue.includes(' ') ? formatTimeTo24h(currentValue) : currentValue;
      if (!options.some(opt => opt.value === normalizedValue)) {
        options.unshift({
          label: formatTime(normalizedValue),
          value: normalizedValue
        });
      }
    }
    return options;
  };

  const getCheckOutOptions = (currentValue?: string) => {
    const options = [...CHECK_OUT_OPTIONS];
    if (currentValue && currentValue !== '-') {
      const normalizedValue = currentValue.includes(' ') ? formatTimeTo24h(currentValue) : currentValue;
      if (!options.some(opt => opt.value === normalizedValue)) {
        options.unshift({
          label: formatTime(normalizedValue),
          value: normalizedValue
        });
      }
    }
    return options;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return 'bg-brand-code/80 text-brand-text';
    switch (status) {
      case 'Present':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'Absent':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/20';
      case 'Leave':
      case 'On Leave':
        return 'bg-blue-500/10 text-blue-650 dark:text-blue-400 border border-blue-500/20';
      case 'HalfDay':
        return 'bg-purple-500/10 text-purple-650 dark:text-purple-400 border border-purple-500/20';
      case 'WFH':
        return 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20';
      default:
        return 'bg-brand-code/80 text-brand-text border border-brand-border/40';
    }
  };

  return (
    <div className="space-y-8">
      {/* Attendance Header Summary Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Present Rate */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex items-center justify-between transition-all duration-300 hover:border-emerald-500/40">
          <div>
            <p className="text-xs font-semibold text-brand-text/75 uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-3xl font-bold text-brand-heading mt-2">{summary.attendanceRate}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <Check className="w-6 h-6" />
          </div>
        </div>

        {/* Present Count */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex items-center justify-between transition-all duration-300 hover:border-brand-accent/40">
          <div>
            <p className="text-xs font-semibold text-brand-text/75 uppercase tracking-wider">Present Today</p>
            <h3 className="text-3xl font-bold text-brand-heading mt-2">{summary.present} / {totalRecords}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-accent-bg text-brand-accent flex items-center justify-center border border-brand-accent-border">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Absent Count */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex items-center justify-between transition-all duration-300 hover:border-rose-500/40">
          <div>
            <p className="text-xs font-semibold text-brand-text/75 uppercase tracking-wider">Absent Today</p>
            <h3 className="text-3xl font-bold text-brand-heading mt-2">{summary.absent}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
            <X className="w-6 h-6" />
          </div>
        </div>

        {/* On Leave Today */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex items-center justify-between transition-all duration-300 hover:border-blue-500/40">
          <div>
            <p className="text-xs font-semibold text-brand-text/75 uppercase tracking-wider">On Approved Leave</p>
            <h3 className="text-3xl font-bold text-brand-heading mt-2">{summary.leave}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Attendance Ledger Table */}
      <div className="bg-brand-bg border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        {/* Roster toolbar */}
        <div className="p-6 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-code/10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-brand-accent shrink-0" />
              <span className="text-sm font-semibold text-brand-heading whitespace-nowrap">Daily Logs Roster</span>
            </div>

            {/* Local Search */}
            <div className="relative w-full max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-text/60">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="Search employee name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading || actionLoading}
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200"
              />
            </div>

            {/* Date filter */}
            <input
              type="date"
              value={currentDate}
              onChange={(e) => {
                setPage(1);
                setCurrentDate(e.target.value);
              }}
              disabled={loading || actionLoading}
              className="text-xs px-3 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-heading focus:outline-none cursor-pointer"
            />

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setPage(1);
                setSelectedStatus(e.target.value);
              }}
              disabled={loading || actionLoading}
              className="text-xs px-3 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-heading focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">On Leave</option>
              <option value="HalfDay">Half Day</option>
              <option value="WFH">WFH</option>
            </select>
          </div>
          
          <button 
            onClick={handleMarkAllPresent}
            disabled={loading || actionLoading || records.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-code border border-brand-border text-brand-text hover:text-brand-heading rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50"
          >
            {actionLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Mark All Present</span>
          </button>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-code/20">
                <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider text-right">Quick Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-brand-text">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
                      <p className="font-semibold">Loading attendance logs...</p>
                    </div>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((rec) => (
                  <tr key={`${rec.employeeId}-${rec.attendanceId}`} className="hover:bg-brand-code/10 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center font-bold text-brand-accent">
                          {getAvatarFallback(rec.employeeName)}
                        </div>
                        <div className="font-semibold text-brand-heading">{rec.employeeName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-text">{rec.department}</td>
                    <td className="px-6 py-4">
                      <select
                        value={rec.checkIn ? (rec.checkIn.includes(' ') ? formatTimeTo24h(rec.checkIn) : rec.checkIn) : '09:00:00'}
                        onChange={(e) => handleTimeChange(rec, 'checkIn', e.target.value)}
                        disabled={loading || actionLoading}
                        className="text-xs px-2 py-1 rounded-lg bg-brand-bg border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent cursor-pointer font-mono font-semibold"
                      >
                        {getCheckInOptions(rec.checkIn).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={rec.checkOut ? (rec.checkOut.includes(' ') ? formatTimeTo24h(rec.checkOut) : rec.checkOut) : '18:00:00'}
                        onChange={(e) => handleTimeChange(rec, 'checkOut', e.target.value)}
                        disabled={loading || actionLoading}
                        className="text-xs px-2 py-1 rounded-lg bg-brand-bg border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent cursor-pointer font-mono font-semibold"
                      >
                        {getCheckOutOptions(rec.checkOut).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(rec.status)}`}>
                        {rec.status === 'Leave' ? 'On Leave' : rec.status === 'HalfDay' ? 'Half Day' : rec.status || 'Unmarked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(['Present', 'Absent', 'Leave', 'WFH'] as const).map((stat) => (
                          <button
                            key={stat}
                            onClick={() => handleStatusChange(rec, stat)}
                            disabled={loading || actionLoading}
                            className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                              rec.status === stat
                                ? 'bg-brand-accent border-brand-accent text-white shadow-sm'
                                : 'bg-brand-bg border-brand-border text-brand-text hover:text-brand-heading hover:bg-brand-border/40'
                            } disabled:opacity-50`}
                          >
                            {stat === 'Leave' ? 'Leave' : stat}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-brand-text">
                    <p className="font-semibold">No attendance logs found matching the filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Statistics */}
        <div className="p-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-text bg-brand-code/10">
          <span>Showing {records.length} of {totalRecords} records</span>
          <span className="font-medium">Active Logs Directory</span>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-end gap-4 p-4">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded border hover:bg-brand-border/40 disabled:opacity-50 cursor-pointer text-xs font-semibold"
          >
            Previous
          </button>
          <span className="text-xs font-medium">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages || loading}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded border hover:bg-brand-border/40 disabled:opacity-50 cursor-pointer text-xs font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
