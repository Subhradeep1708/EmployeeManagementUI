import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  UserPlus,
  Loader2,
  Info,
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import type { Employee } from '../../types';
import { useToast } from '../../context/ToastContext';
import { getAvatarFallback } from '../../utils/helpers';
import { ViewEmployeeModal } from '../common/ViewEmployeeModal';

interface EmployeeTableProps {
  onDelete: (id: number) => void;
  onOpenAddModal: () => void;
  onEdit: (id: number) => void;
  showAddButton?: boolean;
  refreshTrigger?: number;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  onDelete,
  onOpenAddModal,
  onEdit,
  showAddButton = true,
  refreshTrigger,
}) => {
  const { showToast } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);

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
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/20';
      default:
        return 'bg-brand-code/80 text-brand-text';
    }
  };

  const formatSalary = (salary: number | string) => {
    const salaryStr = String(salary);
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
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getEmployees(
        page,
        5,
        searchTerm,
        selectedDept === 0 ? undefined : selectedDept,
        selectedStatus === 0 ? undefined : selectedStatus
      ) as any;

      setEmployees(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalRecords(response.data.totalRecords || 0);
    }
    catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, [page, searchTerm, selectedDept, selectedStatus, refreshTrigger]);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      const res = await employeeService.deleteEmployee(deletingId);
      if (res.success) {
        showToast(res.message || 'Employee record deleted successfully.', 'success');
        setDeletingId(null);
        void loadEmployees();
        if (onDelete) {
          onDelete(deletingId);
        }
      } else {
        showToast(res.message || 'Failed to delete employee.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred while deleting employee.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg border border-brand-border rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Table Toolbar */}
      <div className="p-6 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-code/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          {/* Local Search */}
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-text/60">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search employee name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-text font-medium whitespace-nowrap">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => {
                setPage(1);
                setSelectedDept(Number(e.target.value));
              }}
              className="text-xs px-3 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-heading focus:outline-none cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-text font-medium whitespace-nowrap">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setPage(1);
                setSelectedStatus(Number(e.target.value));
              }}
              className="text-xs px-3 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-heading focus:outline-none cursor-pointer"
            >
              {statuses.map((stat) => (
                <option key={stat.id} value={stat.id}>
                  {stat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conditional Add Button */}
        {showAddButton && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-accent/25 transition-all duration-200 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-brand-code/20">
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Salary</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-heading uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-brand-code/10 transition-colors text-sm">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center font-bold text-brand-accent shrink-0">
                        {getAvatarFallback(emp.fullName)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-heading">{emp.fullName}</h4>
                        <p className="text-xs text-brand-text">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-brand-text font-medium">{emp.department}</td>
                  <td className="px-6 py-4 text-brand-text font-medium">{emp.designation}</td>
                  <td className="px-6 py-4 text-brand-heading font-semibold">{formatSalary(emp.salary)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="View Employee Profile"
                        onClick={() => setViewingId(emp.employeeId)}
                        className="p-1.5 rounded-lg text-brand-text hover:text-blue-500 hover:bg-blue-500/10 transition-all duration-150 cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit Employee"
                        onClick={() => onEdit(emp.employeeId)}
                        className="p-1.5 rounded-lg text-brand-text hover:text-brand-accent hover:bg-brand-accent-bg transition-all duration-150 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete Employee"
                        onClick={() => setDeletingId(emp.employeeId)}
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

      {/* Pagination Footer */}
      <div className="p-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-code/10">
        <span className="text-xs text-brand-text">
          Showing {employees.length} of {totalRecords} records
        </span>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-text hover:bg-brand-border/40 disabled:opacity-40 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <span className="text-xs font-bold text-brand-heading">
            {page} / {totalPages}
          </span>
          
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-text hover:bg-brand-border/40 disabled:opacity-40 transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-brand-bg border border-brand-border rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 animate-slide-in">
            <h3 className="text-base font-bold text-brand-heading">Delete Employee Record</h3>
            <p className="text-xs text-brand-text leading-relaxed">
              Are you sure you want to permanently delete this employee? This action cannot be undone and will erase all payroll history and attendance records.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Record</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      <ViewEmployeeModal
        isOpen={viewingId !== null}
        onClose={() => setViewingId(null)}
        employeeId={viewingId}
      />
    </div>
  );
};

export default EmployeeTable;
