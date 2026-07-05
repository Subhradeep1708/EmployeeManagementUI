import React, { useState } from 'react';
import { EmployeeTable } from '../components/dashboard/EmployeeTable';
import { AddEmployeeModal } from '../components/common/AddEmployeeModal';
import type { Employee } from '../types';

interface EmployeesProps {
  employees: Employee[];
  onDelete: (id: number) => void;
  onAdd: (newEmp: Omit<Employee, 'id' | 'joinDate'>) => void;
}

export const Employees: React.FC<EmployeesProps> = ({ employees, onDelete, onAdd }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-brand-heading">Full Directory Listings</h3>
      </div>
      <EmployeeTable
        employees={employees}
        onDelete={onDelete}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAdd}
      />
    </div>
  );
};

export default Employees;
