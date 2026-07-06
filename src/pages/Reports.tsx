import React, { useState, useEffect } from 'react';
import type { Employee } from '../types';
import { Download, Award, FileText, BarChart3, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { analyticsService, type AnalyticsDashboardData } from '../services/analyticsService';

interface ReportsProps {
  employees: Employee[];
}

export const Reports: React.FC<ReportsProps> = ({ employees }) => {
  const { showToast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDashboardData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  
  // Client-side CSV Exporter helper
  const handleExportCSV = (reportType: 'directory' | 'salary' | 'performance') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (reportType === 'directory') {
      headers = ['Employee ID', 'Name', 'Email', 'Role', 'Department', 'Status'];
      rows = employees.map(emp => [
        String(emp.employeeId),
        emp.fullName,
        emp.email,
        emp.designation,
        emp.department,
        emp.status
      ]);
      filename = `employee_directory_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (reportType === 'salary') {
      headers = ['Employee ID', 'Name', 'Department', 'Annual Salary (INR)'];
      rows = employees.map(emp => [
        String(emp.employeeId),
        emp.fullName,
        emp.department,
        String(emp.salary)
      ]);
      filename = `payroll_salary_sheet_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (reportType === 'performance') {
      headers = ['Employee Name', 'Department', 'Performance Rating', 'KPI Score'];
      rows = employees.map((emp, idx) => {
        const score = [4.8, 4.2, 4.9, 3.8, 4.5, 3.2][idx % 6];
        const rating = score >= 4.5 ? 'Outstanding' : score >= 4.0 ? 'Exceeds Expectations' : 'Meets Expectations';
        return [
          emp.fullName,
          emp.department,
          rating,
          String(score)
        ];
      });
      filename = `performance_metrics_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleDownloadReport = async (endpoint: string, filename: string) => {
    showToast('Compiling and generating report...', 'info');
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5270/api';
      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (response.status === 401) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('Report downloaded successfully!', 'success');
    } catch (error: any) {
      console.error('Report download error:', error);
      showToast(error.message || 'Failed to download report.', 'error');
    }
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoadingAnalytics(true);
      try {
        const response = await analyticsService.getDashboardAnalytics();
        if (response.success && response.data) {
          setAnalyticsData(response.data);
        } else {
          showToast(response.message || 'Failed to retrieve charts metrics.', 'error');
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to query dashboard analytics.', 'error');
      } finally {
        setLoadingAnalytics(false);
      }
    };
    void loadAnalytics();
  }, []);

  // Mock Performance List
  const performances = employees.map((emp, idx) => {
    const score = [4.8, 4.2, 4.9, 3.8, 4.5, 3.2][idx % 6];
    const rating = score >= 4.5 ? 'Outstanding' : score >= 4.0 ? 'Exceeds Expectations' : 'Meets Expectations';
    const ratingColor = score >= 4.5 ? 'text-emerald-500' : score >= 4.0 ? 'text-blue-500' : 'text-amber-500';
    return {
      name: emp.fullName,
      role: emp.designation,
      department: emp.department,
      score,
      rating,
      ratingColor,
    };
  });

  // dynamic chart calculations
  const hiringTrend = analyticsData?.hiringTrend || [];
  const maxHired = hiringTrend.length > 0 ? Math.max(...hiringTrend.map(h => h.employeesHired)) : 1;

  const departmentGrowth = analyticsData?.departmentGrowth || [];
  const maxCount = departmentGrowth.length > 0 ? Math.max(...departmentGrowth.map(d => d.employeeCount)) : 1;

  const points = departmentGrowth.map((d, idx) => {
    const x = departmentGrowth.length > 1 ? (idx / (departmentGrowth.length - 1)) * 100 : 50;
    const y = 45 - (d.employeeCount / maxCount) * 35; // leaves padding at top
    return { x, y };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') 
    : '';

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} 50 L ${points[0].x} 50 Z` 
    : '';

  const attendancePattern = analyticsData?.attendancePattern || [];
  const presentItem = attendancePattern.find(a => a.status === 'Present');
  const absentItem = attendancePattern.find(a => a.status === 'Absent');
  const presentCount = presentItem ? presentItem.count : 0;
  const absentCount = absentItem ? absentItem.count : 0;
  const totalLogs = presentCount + absentCount;
  
  const presentPercent = totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 0;
  const absentPercent = totalLogs > 0 ? Math.round((absentCount / totalLogs) * 100) : 0;

  return (
    <div className="space-y-8 print:bg-white print:text-black">
      {/* Roster & Export Actions Card */}
      {/* <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm print:hidden transition-all duration-300 hover:border-brand-accent/40">
        <h3 className="text-base font-bold text-brand-heading mb-1">Export Directory Reports</h3>
        <p className="text-xs text-brand-text mb-6">Generate excel-compatible tables and printer-friendly summaries instantly.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleExportCSV('directory')}
            className="flex items-center justify-between p-4 rounded-xl bg-brand-code border border-brand-border text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-brand-accent" />
              <div className="text-left">
                <span className="block text-xs font-semibold">Directory (CSV)</span>
                <span className="text-[10px] text-brand-text/60">Export listings</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleExportCSV('salary')}
            className="flex items-center justify-between p-4 rounded-xl bg-brand-code border border-brand-border text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-emerald-500" />
              <div className="text-left">
                <span className="block text-xs font-semibold">Salary Sheet (CSV)</span>
                <span className="text-[10px] text-brand-text/60">Payroll summary</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleExportCSV('performance')}
            className="flex items-center justify-between p-4 rounded-xl bg-brand-code border border-brand-border text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-purple-500" />
              <div className="text-left">
                <span className="block text-xs font-semibold">KPI Metrics (CSV)</span>
                <span className="text-[10px] text-brand-text/60">Performance sheets</span>
              </div>
            </div>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center justify-between p-4 rounded-xl bg-brand-accent-bg border border-brand-accent-border text-brand-accent hover:border-brand-accent transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <div className="text-left">
                <span className="block text-xs font-semibold">Export PDF Report</span>
                <span className="text-[10px] text-brand-accent/85">Print full page</span>
              </div>
            </div>
          </button>
        </div>
      </div> */}

      {/* Server Report Generation Section */}
      <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm print:hidden transition-all duration-300 hover:border-brand-accent/40">
        <h3 className="text-base font-bold text-brand-heading mb-1">System Server Reports</h3>
        <p className="text-xs text-brand-text mb-6">Generate live PDF and Excel reports dynamically compiled by the backend server.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Button 1: Attendance PDF */}
          <button
            onClick={() => handleDownloadReport('/Reports/attendance/pdf', 'attendance_report.pdf')}
            className="flex items-center justify-between p-4 rounded-xl bg-brand-code border border-brand-border text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-rose-500" />
              <div className="text-left">
                <span className="block text-xs font-semibold">Attendance Log (PDF)</span>
                <span className="text-[10px] text-brand-text/60">Generate attendance sheet</span>
              </div>
            </div>
          </button>

          {/* Button 2: Employees PDF */}
          <button
            onClick={() => handleDownloadReport('/Reports/employees/pdf', 'employees_directory.pdf')}
            className="flex items-center justify-between p-4 rounded-xl bg-brand-code border border-brand-border text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-brand-accent" />
              <div className="text-left">
                <span className="block text-xs font-semibold">Staff Directory (PDF)</span>
                <span className="text-[10px] text-brand-text/60">Download employee list</span>
              </div>
            </div>
          </button>

          {/* Button 3: Employees Excel */}
          <button
            onClick={() => handleDownloadReport('/Reports/employees/excel', 'employees_directory.xlsx')}
            className="flex items-center justify-between p-4 rounded-xl bg-brand-code border border-brand-border text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-emerald-500" />
              <div className="text-left">
                <span className="block text-xs font-semibold">Staff Directory (Excel)</span>
                <span className="text-[10px] text-brand-text/60">Excel spreadsheet table</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Analytics Visualization charts */}
      {loadingAnalytics ? (
        <div className="p-12 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex flex-col items-center justify-center gap-2 text-brand-text h-80">
          <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
          <p className="text-xs font-semibold">Compiling interactive charts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
          {/* Hiring Trend Bar Chart */}
          <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex flex-col h-80 transition-all duration-300 hover:border-brand-accent/40">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-brand-accent" />
              <h4 className="text-xs font-semibold text-brand-heading uppercase tracking-wider">Hiring Trend Analysis</h4>
            </div>
            <div className="flex-1 flex items-end justify-between gap-1.5 pt-6 h-48">
              {hiringTrend.map((d) => {
                const pct = (d.employeesHired / maxHired) * 100;
                return (
                  <div key={d.year} className="flex-1 h-full flex flex-col items-center gap-1 group cursor-pointer">
                    <span className="text-[9px] text-brand-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.employeesHired}
                    </span>
                    <div className="flex-1 w-full flex items-end justify-center px-0.5">
                      <div 
                        className="w-full bg-brand-accent/15 border-t border-brand-accent rounded-t-sm group-hover:bg-brand-accent transition-all duration-300"
                        style={{ height: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] text-brand-text font-semibold">{d.year}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Growth Area Chart */}
          <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex flex-col h-80 transition-all duration-300 hover:border-emerald-500/40">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-semibold text-brand-heading uppercase tracking-wider">Department Growth Tracking</h4>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {points.length > 0 && (
                  <>
                    <path d={areaD} fill="url(#growthGrad)" />
                    <path d={pathD} fill="none" stroke="#10b981" strokeWidth="1.5" />
                    {points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#10b981" />
                    ))}
                  </>
                )}
              </svg>
              <div className="absolute inset-x-0 bottom-0 flex justify-between text-[8px] text-brand-text font-medium px-1 overflow-hidden gap-1">
                {departmentGrowth.map((d) => (
                  <span key={d.department} className="truncate" title={d.department}>
                    {d.department.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance Distribution Donut Chart */}
          <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex flex-col h-80 transition-all duration-300 hover:border-blue-500/40">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-500" />
              <h4 className="text-xs font-semibold text-brand-heading uppercase tracking-wider">Attendance Patterns</h4>
            </div>
            <div className="flex-1 flex items-center justify-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--border)" strokeWidth="3" />
                  {/* Present segment */}
                  {presentPercent > 0 && (
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.91" 
                      fill="none" 
                      stroke="#7c3aed" 
                      strokeWidth="3.2" 
                      strokeDasharray={`${presentPercent} ${100 - presentPercent}`} 
                      strokeDashoffset="0" 
                    />
                  )}
                  {/* Absent segment */}
                  {absentPercent > 0 && (
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.91" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="3.2" 
                      strokeDasharray={`${absentPercent} ${100 - absentPercent}`} 
                      strokeDashoffset={`-${presentPercent}`} 
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center">
                  <span className="text-sm font-bold text-brand-heading">{presentPercent}%</span>
                  <span className="text-[8px] text-brand-text mt-0.5">Rate</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[10px] font-medium text-brand-text">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-brand-accent"></span>
                  <span>Present ({presentPercent}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-red-500"></span>
                  <span>Absent ({absentPercent}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Evaluations */}
      {/* <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm transition-all duration-300 hover:border-brand-accent/40">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-accent" />
            <h3 className="text-base font-bold text-brand-heading">Performance Reviews</h3>
          </div>
          <span className="text-xs font-semibold text-brand-text bg-brand-code border border-brand-border px-3 py-1.5 rounded-xl print:hidden">
            Annual Evaluation Cycle
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-code/20">
                <th className="px-6 py-3 text-xs font-bold text-brand-heading uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-xs font-bold text-brand-heading uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-xs font-bold text-brand-heading uppercase tracking-wider">Evaluation Score</th>
                <th className="px-6 py-3 text-xs font-bold text-brand-heading uppercase tracking-wider">Performance Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {performances.length > 0 ? (
                performances.map((perf, idx) => (
                  <tr key={idx} className="hover:bg-brand-code/10 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <h4 className="font-semibold text-brand-heading">{perf.name}</h4>
                        <p className="text-xs text-brand-text">{perf.role}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-text font-medium">{perf.department}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-brand-heading">{perf.score}</span>
                        <span className="text-brand-text/50">/ 5.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <span className={perf.ratingColor}>{perf.rating}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-brand-text font-medium">
                    No evaluations loaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default Reports;
