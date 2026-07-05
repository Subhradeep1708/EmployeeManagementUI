import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { Departments } from './pages/Departments';
import { Roles } from './pages/Roles';
import { Settings } from './pages/Settings';
import { Attendance } from './pages/Attendance';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import type { Employee } from './types';

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    email: 's.jenkins@enterprise.com',
    role: 'Senior Frontend Architect',
    department: 'Engineering',
    status: 'Active',
    salary: '135000',
    joinDate: '2023-04-12',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'm.chen@enterprise.com',
    role: 'Lead Data Scientist',
    department: 'Engineering',
    status: 'Active',
    salary: '142000',
    joinDate: '2022-09-18',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    email: 'e.rostova@enterprise.com',
    role: 'Senior Product Designer',
    department: 'Design',
    status: 'Active',
    salary: '118000',
    joinDate: '2024-01-10',
  },
  {
    id: 4,
    name: 'Marcus Brody',
    email: 'm.brody@enterprise.com',
    role: 'Product Manager',
    department: 'Product',
    status: 'On Leave',
    salary: '125000',
    joinDate: '2021-11-05',
  },
  {
    id: 5,
    name: 'Amina Yousaf',
    email: 'a.yousaf@enterprise.com',
    role: 'Talent Acquisition Partner',
    department: 'Human Resources',
    status: 'Active',
    salary: '85000',
    joinDate: '2023-08-20',
  },
  {
    id: 6,
    name: 'David Vance',
    email: 'd.vance@enterprise.com',
    role: 'Director of Growth',
    department: 'Marketing',
    status: 'Terminated',
    salary: '110000',
    joinDate: '2020-03-15',
  },
];

export function AppInner() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  const handleAddEmployee = (newEmp: Omit<Employee, 'id' | 'joinDate'>) => {
    const created: Employee = {
      ...newEmp,
      id: Date.now(),
      joinDate: new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) => [created, ...prev]);
  };

  const handleDeleteEmployee = (id: number) => {
    if (confirm('Are you sure you want to delete this employee record?')) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Unprotected Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Workspace routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                employees={employees}
                onDelete={handleDeleteEmployee}
                onAdd={handleAddEmployee}
              />
            }
          />
          <Route
            path="/employees"
            element={
              <Employees
                employees={employees}
                onDelete={handleDeleteEmployee}
                onAdd={handleAddEmployee}
              />
            }
          />
          <Route
            path="/attendance"
            element={<Attendance employees={employees} />}
          />
          <Route
            path="/reports"
            element={<Reports employees={employees} />}
          />
          <Route path="/departments" element={<Departments />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
