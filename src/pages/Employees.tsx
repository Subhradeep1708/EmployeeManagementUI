import React, { useState } from 'react';
import { EmployeeTable } from '../components/dashboard/EmployeeTable';
import { AddEmployeeModal } from '../components/common/AddEmployeeModal';
import type { Employee } from '../types';

interface EmployeesProps {
  employees: Employee[];
  onDelete: (id: number) => void;
  onAdd?: (newEmp: Omit<Employee, 'id' | 'joinDate'>) => void;
}

export const Employees: React.FC<EmployeesProps> = ({ employees, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEmployeeAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-brand-heading">Full Directory Listings</h3>
      </div>
      <EmployeeTable
        employees={employees}
        onDelete={onDelete}
        onOpenAddModal={() => {
          setEditingEmployeeId(null);
          setIsModalOpen(true);
        }}
        onEdit={(id) => {
          setEditingEmployeeId(id);
          setIsModalOpen(true);
        }}
        refreshTrigger={refreshTrigger}
      />
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployeeId(null);
        }}
        onAdd={handleEmployeeAdded}
        employeeId={editingEmployeeId}
      />
    </div>
  );
};

export default Employees;
