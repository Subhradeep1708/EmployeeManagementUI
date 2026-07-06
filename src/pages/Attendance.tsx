import React, { useState } from 'react';
import type { Employee } from '../types';
import { Check, X, Clock, CalendarDays, RefreshCw } from 'lucide-react';
import { getAvatarFallback } from '../utils/helpers';

interface AttendanceProps {
  employees: Employee[];
}

interface MockRecord {
  employeeId: number;
  name: string;
  department: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  checkIn?: string;
  checkOut?: string;
}

export const Attendance: React.FC<AttendanceProps> = ({ employees }) => {
  // Setup local state mimicking database logs for attendance
  const [records, setRecords] = useState<MockRecord[]>(() =>
    employees.map((emp) => {
      // Default mock values
      const isLate = emp.id === 2;
      const isOnLeave = emp.id === 4;
      const isTerminated = emp.status === 'Terminated';
      
      let status: MockRecord['status'] = 'Present';
      let checkIn = '08:52 AM';
      let checkOut = '05:30 PM';

      if (isOnLeave) {
        status = 'On Leave';
        checkIn = '-';
        checkOut = '-';
      } else if (isLate) {
        status = 'Late';
        checkIn = '09:18 AM';
        checkOut = '05:30 PM';
      } else if (isTerminated) {
        status = 'Absent';
        checkIn = '-';
        checkOut = '-';
      }

      return {
        employeeId: emp.id,
        name: emp.name,
        department: emp.department,
        status,
        checkIn,
        checkOut,
      };
    })
  );

  const [currentDate, setCurrentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const handleStatusChange = (employeeId: number, status: MockRecord['status']) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.employeeId !== employeeId) return rec;

        let checkIn = '-';
        let checkOut = '-';

        if (status === 'Present') {
          checkIn = '08:58 AM';
          checkOut = '05:30 PM';
        } else if (status === 'Late') {
          checkIn = '09:22 AM';
          checkOut = '05:30 PM';
        }

        return {
          ...rec,
          status,
          checkIn,
          checkOut,
        };
      })
    );
  };

  // Aggregation Metrics
  const total = records.length;
  const present = records.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const late = records.filter((r) => r.status === 'Late').length;
  const leave = records.filter((r) => r.status === 'On Leave').length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Attendance Header Summary Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Present Rate */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex items-center justify-between transition-all duration-300 hover:border-emerald-500/40">
          <div>
            <p className="text-xs font-semibold text-brand-text/75 uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-3xl font-bold text-brand-heading mt-2">{rate}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <Check className="w-6 h-6" />
          </div>
        </div>

        {/* Present Count */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex items-center justify-between transition-all duration-300 hover:border-brand-accent/40">
          <div>
            <p className="text-xs font-semibold text-brand-text/75 uppercase tracking-wider">Present Today</p>
            <h3 className="text-3xl font-bold text-brand-heading mt-2">{present} / {total}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-accent-bg text-brand-accent flex items-center justify-center border border-brand-accent-border">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Late Count */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex items-center justify-between transition-all duration-300 hover:border-amber-500/40">
          <div>
            <p className="text-xs font-semibold text-brand-text/75 uppercase tracking-wider">Late Arrivals</p>
            <h3 className="text-3xl font-bold text-brand-heading mt-2">{late}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* On Leave Today */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex items-center justify-between transition-all duration-300 hover:border-blue-500/40">
          <div>
            <p className="text-xs font-semibold text-brand-text/75 uppercase tracking-wider">On Approved Leave</p>
            <h3 className="text-3xl font-bold text-brand-heading mt-2">{leave}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
            <X className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Attendance Ledger Table */}
      <div className="bg-brand-bg border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        {/* Roster toolbar */}
        <div className="p-6 border-b border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-code/10">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-brand-accent" />
            <span className="text-sm font-semibold text-brand-heading">Daily Logs Roster</span>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-brand-heading focus:outline-none cursor-pointer"
            />
          </div>
          
          <button 
            onClick={() => {
              // Reset all to present
              setRecords(prev => prev.map(r => ({ ...r, status: 'Present', checkIn: '09:00 AM', checkOut: '05:30 PM' })));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-code border border-brand-border text-brand-text hover:text-brand-heading rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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
                <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Status Status</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider text-right">Quick Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {records.map((rec) => (
                <tr key={rec.employeeId} className="hover:bg-brand-code/10 transition-colors text-sm">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center font-bold text-brand-accent">
                        {getAvatarFallback(rec.name)}
                      </div>
                      <div className="font-semibold text-brand-heading">{rec.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-brand-text">{rec.department}</td>
                  <td className="px-6 py-4 font-mono font-medium text-brand-heading">{rec.checkIn}</td>
                  <td className="px-6 py-4 font-mono font-medium text-brand-heading">{rec.checkOut}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        rec.status === 'Present'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : rec.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : rec.status === 'On Leave'
                          ? 'bg-blue-500/10 text-blue-650 dark:text-blue-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {(['Present', 'Late', 'Absent', 'On Leave'] as const).map((stat) => (
                        <button
                          key={stat}
                          onClick={() => handleStatusChange(rec.employeeId, stat)}
                          className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                            rec.status === stat
                              ? 'bg-brand-accent border-brand-accent text-white shadow-sm'
                              : 'bg-brand-bg border-brand-border text-brand-text hover:text-brand-heading hover:bg-brand-border/40'
                          }`}
                        >
                          {stat}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
