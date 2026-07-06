import React, { useState } from 'react';
import type { Employee } from '../../types';
import { Search, Filter, Trash2, Edit3, UserPlus, SlidersHorizontal } from 'lucide-react';
import { employeeService } from "../../services/employeeService";
import { useEffect } from "react";

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: number) => void;
  onOpenAddModal: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  onDelete,
  onOpenAddModal,
}) => {
  const [selectedDept, setSelectedDept] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState(0);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [searchInput, setSearchInput] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const departments = [
    { id: 0, name: "All" },
    { id: 1, name: "Information Technology" },
    { id: 2, name: "Human Resources" },
    { id: 3, name: "Finance" },
    { id: 4, name: "Marketing" }
  ];
  const statuses = [
    { id: 0, name: "All" },
    { id: 1, name: "Active" },
    { id: 2, name: "On Leave" },
    { id: 3, name: "Resigned" },
    { id: 4, name: "Terminated" }
  ];



  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'On Leave':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'Terminated':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      default:
        return 'bg-brand-code/80 text-brand-text';
    }
  };

  const formatSalary = (salaryStr: string) => {
    const num = Number(salaryStr.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return salaryStr;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };



  useEffect(() => {

    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 100);

    return () => clearTimeout(timer);

  }, [searchInput]);

  useEffect(() => {
  const loadEmployees = async () => {
    try {

      const response = await employeeService.getEmployees(
        page,
        5,
        searchTerm,
        selectedDept === 0 ? undefined : selectedDept,
        selectedStatus === 0 ? undefined : selectedStatus
      );

      console.log(response.data);
      
      setEmployees(response.data.items);
      setTotalPages(response.data.totalPages);
      setTotalRecords(response.data.totalRecords);

    }
    catch (err) {
      console.error(err);
    }
  };

    loadEmployees();
  }, [page,
    searchTerm,
    selectedDept,
    selectedStatus]);

  return (
    <div className="bg-brand-bg border border-brand-border rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Table Toolbar */}
      <div className="p-6 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-code/10">
        <div className="flex flex-1 items-center gap-3">
          {/* Local Search */}
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-text/60">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search employees name, role..."
              value={searchTerm}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(Number(e.target.value))}
              className="text-xs pl-3 pr-8 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 cursor-pointer appearance-none min-w-[140px]"

            >
              {departments.map((dept) =>
                <option
                  key={dept.id}
                  value={dept.id}
                >
                  {dept.name}
                </option>
              )}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-brand-text/60">
              <Filter className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Status Tabs */}
          <div className="flex bg-brand-code/50 border border-brand-border p-1 rounded-xl">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedStatus === status.id
                    ? 'bg-brand-bg text-brand-accent shadow-sm'
                    : 'text-brand-text hover:text-brand-heading'
                }`}
              >
                {status.name}
              </button>
            ))}
          </div>

          {/* Add Employee Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-accent text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-brand-code/20">
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Annual Salary</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr
                  key={emp.employeeId}
                  className="hover:bg-brand-code/20 transition-colors duration-150 text-sm group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center font-bold text-brand-accent text-sm">
                        {emp.fullName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-heading group-hover:text-brand-accent transition-colors duration-150">
                          {emp.fullName}
                        </h4>
                        <p className="text-xs text-brand-text">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-brand-text font-medium">{emp.department}</td>
                  <td className="px-6 py-4 text-brand-text font-medium">{emp.designation}</td>
                  <td className="px-6 py-4 text-brand-heading font-semibold">{emp.salary}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Edit Employee"
                        className="p-1.5 rounded-lg text-brand-text hover:text-brand-accent hover:bg-brand-accent-bg transition-all duration-150 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete Employee"
                        onClick={() => onDelete(emp.employeeId  )}
                        className="p-1.5 rounded-lg text-brand-text hover:text-red-500 hover:bg-red-500/10 transition-all duration-150 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-brand-text">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <SlidersHorizontal className="w-8 h-8 text-brand-text/50" />
                    <p className="font-medium">No employees found matching the current search filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer statistics */}
      <div className="p-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-text bg-brand-code/10">
        <span>Showing {employees.length} of {totalRecords} employees</span>
        <span className="font-medium">Total payroll: {formatSalary(String(employees.reduce((acc, emp) => acc + Number(emp.salary), 0)))}</span>
      </div>

      <div className="flex items-center justify-end gap-4 p-4">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded border"
        >
          Previous
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded border"
        >
          Next
        </button>

      </div>
    </div>
  );
};
