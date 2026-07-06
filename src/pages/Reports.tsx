import React from 'react';
import type { Employee } from '../types';
import { Download, Award, FileText, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ReportsProps {
  employees: Employee[];
}

export const Reports: React.FC<ReportsProps> = ({ employees }) => {
  const { showToast } = useToast();
  
  // Client-side CSV Exporter helper
  const handleExportCSV = (reportType: 'directory' | 'salary' | 'performance') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (reportType === 'directory') {
      headers = ['Employee ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Join Date'];
      rows = employees.map(emp => [
        String(emp.id),
        emp.name,
        emp.email,
        emp.role,
        emp.department,
        emp.status,
        emp.joinDate
      ]);
      filename = `employee_directory_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (reportType === 'salary') {
      headers = ['Employee ID', 'Name', 'Department', 'Annual Salary (USD)'];
      rows = employees.map(emp => [
        String(emp.id),
        emp.name,
        emp.department,
        emp.salary
      ]);
      filename = `payroll_salary_sheet_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (reportType === 'performance') {
      headers = ['Employee Name', 'Department', 'Performance Rating', 'KPI Score'];
      rows = employees.map((emp, idx) => {
        const score = [4.8, 4.2, 4.9, 3.8, 4.5, 3.2][idx % 6];
        const rating = score >= 4.5 ? 'Outstanding' : score >= 4.0 ? 'Exceeds Expectations' : 'Meets Expectations';
        return [
          emp.name,
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
    // Print window triggers native Save to PDF
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

  // Mock Performance List
  const performances = employees.map((emp, idx) => {
    const score = [4.8, 4.2, 4.9, 3.8, 4.5, 3.2][idx % 6];
    const rating = score >= 4.5 ? 'Outstanding' : score >= 4.0 ? 'Exceeds Expectations' : 'Meets Expectations';
    const ratingColor = score >= 4.5 ? 'text-emerald-500' : score >= 4.0 ? 'text-blue-500' : 'text-amber-500';
    return {
      name: emp.name,
      role: emp.role,
      department: emp.department,
      score,
      rating,
      ratingColor,
    };
  });

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
        <h3 className="text-base font-bold text-brand-heading mb-1">Generate Reports</h3>
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

      {/* Analytics Visualization charts (Bonus Features) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Hiring Trend Bar Chart */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex flex-col h-80 transition-all duration-300 hover:border-brand-accent/40">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-brand-accent" />
            <h4 className="text-xs font-semibold text-brand-heading uppercase tracking-wider">Hiring Trend Analysis</h4>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 pt-6">
            {[
              { month: 'Jan', count: 4, height: '40%' },
              { month: 'Feb', count: 6, height: '60%' },
              { month: 'Mar', count: 3, height: '30%' },
              { month: 'Apr', count: 8, height: '80%' },
              { month: 'May', count: 5, height: '50%' },
              { month: 'Jun', count: 10, height: '100%' },
            ].map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-[10px] text-brand-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</span>
                <div 
                  className="w-full bg-brand-accent/15 border-t border-brand-accent rounded-t-lg group-hover:bg-brand-accent transition-colors duration-300"
                  style={{ height: d.height }}
                ></div>
                <span className="text-[10px] text-brand-text font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Growth Area Chart */}
        <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm flex flex-col h-80 transition-all duration-300 hover:border-emerald-500/40">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-semibold text-brand-heading uppercase tracking-wider">Department Growth Tracking</h4>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            {/* Custom SVG line chart */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path
                d="M 0 45 Q 25 35, 50 15 T 100 5 L 100 50 L 0 50 Z"
                fill="url(#growthGrad)"
              />
              <path
                d="M 0 45 Q 25 35, 50 15 T 100 5"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
              />
              {/* Nodes */}
              <circle cx="0" cy="45" r="1.5" fill="#10b981" />
              <circle cx="50" cy="15" r="1.5" fill="#10b981" />
              <circle cx="100" cy="5" r="1.5" fill="#10b981" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-brand-text font-medium px-1">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
            </div>
            <div className="absolute top-2 right-2 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              +125% Growth
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
                {/* Present circle segment */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#7c3aed" strokeWidth="3.2" strokeDasharray="80 20" strokeDashoffset="0" />
                {/* Late segment */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f59e0b" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="-80" />
                {/* Absent segment */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#ef4444" strokeWidth="3.2" strokeDasharray="5 95" strokeDashoffset="-95" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center">
                <span className="text-sm font-bold text-brand-heading">92%</span>
                <span className="text-[8px] text-brand-text mt-0.5">Rate</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] font-medium text-brand-text">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-brand-accent"></span>
                <span>Present (80%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                <span>Late Arrivals (15%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-500"></span>
                <span>Absent (5%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Evaluations (Bonus Features) */}
      <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm transition-all duration-300 hover:border-brand-accent/40">
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
              {performances.map((perf, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
