export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  salary: string;
  joinDate: string;
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface UserSession {
  id: number;
  username: string;
  email: string;
  token: string;
}

export interface DepartmentSummary {
  name: string;
  employeeCount: number;
  totalPayroll: number;
  averageSalary: number;
}
