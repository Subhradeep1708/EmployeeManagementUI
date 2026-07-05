import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import type { Employee } from '../../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: Omit<Employee, 'id' | 'joinDate'>) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    status: 'Active' as 'Active' | 'On Leave' | 'Terminated',
    salary: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.role) newErrors.role = 'Role/Title is required';
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(Number(formData.salary.replace(/[^0-9.]/g, '')))) {
      newErrors.salary = 'Salary must be a valid number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onAdd(formData);
    // Reset state
    setFormData({
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      status: 'Active',
      salary: '',
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-brand-bg border border-brand-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border bg-brand-code/20">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-accent" />
            <h3 className="text-lg font-bold text-brand-heading">Add New Employee</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-brand-text hover:text-brand-heading hover:bg-brand-border transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Jenkins"
              className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200 ${
                errors.name ? 'border-red-500' : 'border-brand-border'
              }`}
            />
            {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="s.jenkins@company.com"
              className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200 ${
                errors.email ? 'border-red-500' : 'border-brand-border'
              }`}
            />
            {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">Job Role / Title</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer"
                className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200 ${
                  errors.role ? 'border-red-500' : 'border-brand-border'
                }`}
              />
              {errors.role && <p className="text-[10px] text-red-500 mt-1">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200 cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">Annual Salary (USD)</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 115000"
                className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200 ${
                  errors.salary ? 'border-red-500' : 'border-brand-border'
                }`}
              />
              {errors.salary && <p className="text-[10px] text-red-500 mt-1">{errors.salary}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200 cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-brand-border mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-accent text-white shadow-md shadow-brand-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
