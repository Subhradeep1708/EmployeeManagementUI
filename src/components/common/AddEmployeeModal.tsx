import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { useToast } from '../../context/ToastContext';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  employeeId?: number | null;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onAdd, employeeId }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    hireDate: new Date().toISOString().split('T')[0],
    departmentId: '1',
    designationId: '1',
    statusId: '1',
    basicSalary: '',
    bonus: '0',
    deduction: '0',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const isEditMode = !!employeeId;

  const handleReset = () => {
    setFormData({
      employeeCode: '',
      firstName: '',
      lastName: '',
      gender: 'Male',
      dateOfBirth: '',
      email: '',
      phone: '',
      address: '',
      hireDate: new Date().toISOString().split('T')[0],
      departmentId: '1',
      designationId: '1',
      statusId: '1',
      basicSalary: '',
      bonus: '0',
      deduction: '0',
    });
    setErrors({});
  };

  useEffect(() => {
    if (isOpen) {
      if (employeeId) {
        const fetchEmployee = async () => {
          setFetchLoading(true);
          try {
            const response = await employeeService.getEmployeeById(employeeId);
            if (response.success && response.data) {
              const emp = response.data;
              setFormData({
                employeeCode: emp.employeeCode || '',
                firstName: emp.firstName || '',
                lastName: emp.lastName || '',
                gender: emp.gender || 'Male',
                dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
                email: emp.email || '',
                phone: emp.phone || '',
                address: emp.address || '',
                hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : new Date().toISOString().split('T')[0],
                departmentId: String(emp.departmentId || '1'),
                designationId: String(emp.designationId || '1'),
                statusId: String(emp.statusId || '1'),
                basicSalary: String(emp.basicSalary || ''),
                bonus: String(emp.bonus || '0'),
                deduction: String(emp.deduction || '0'),
              });
            } else {
              showToast(response.message || 'Failed to fetch employee details.', 'error');
            }
          } catch (err: any) {
            showToast(err.message || 'An error occurred while fetching employee details.', 'error');
          } finally {
            setFetchLoading(false);
          }
        };
        void fetchEmployee();
      } else {
        handleReset();
      }
    }
  }, [isOpen, employeeId]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.employeeCode.trim()) newErrors.employeeCode = 'Employee Code is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire Date is required';
    
    if (!formData.basicSalary.trim()) {
      newErrors.basicSalary = 'Basic Salary is required';
    } else if (isNaN(Number(formData.basicSalary.replace(/[^0-9.]/g, '')))) {
      newErrors.basicSalary = 'Basic Salary must be a valid number';
    }

    if (formData.bonus && isNaN(Number(formData.bonus.replace(/[^0-9.]/g, '')))) {
      newErrors.bonus = 'Bonus must be a valid number';
    }

    if (formData.deduction && isNaN(Number(formData.deduction.replace(/[^0-9.]/g, '')))) {
      newErrors.deduction = 'Deduction must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      employeeCode: formData.employeeCode,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      hireDate: formData.hireDate,
      departmentId: Number(formData.departmentId),
      designationId: Number(formData.designationId),
      statusId: Number(formData.statusId),
      basicSalary: Number(formData.basicSalary.replace(/[^0-9.]/g, '')),
      bonus: Number(formData.bonus.replace(/[^0-9.]/g, '') || 0),
      deduction: Number(formData.deduction.replace(/[^0-9.]/g, '') || 0),
    };

    try {
      const response = isEditMode
        ? await employeeService.updateEmployee(employeeId!, payload)
        : await employeeService.createEmployee(payload);

      if (response.success) {
        const msg = response.message || `Employee ${isEditMode ? 'updated' : 'created'} successfully.`;
        showToast(msg, 'success');
        
        setTimeout(() => {
          onAdd(); // Trigger reload of lists in parent
          handleReset();
          onClose();
        }, 1200);
      } else {
        const errMsg = response.message || `Failed to ${isEditMode ? 'update' : 'create'} employee.`;
        showToast(errMsg, 'error');
      }
    } catch (err: any) {
      const errMsg = err.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the employee.`;
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
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
      <div className="w-full max-w-2xl bg-brand-bg border border-brand-border rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border bg-brand-code/20 shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-accent" />
            <h3 className="text-lg font-bold text-brand-heading">
              {isEditMode ? 'Edit Employee Record' : 'Add New Employee'}
            </h3>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            disabled={loading || fetchLoading}
            className="p-1 rounded-lg text-brand-text hover:text-brand-heading hover:bg-brand-border transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Loading Spinner */}
        {fetchLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3 bg-brand-bg text-brand-text">
            <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
            <p className="text-sm font-semibold">Loading employee details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employee Code */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Employee Code</label>
                <input
                  type="text"
                  name="employeeCode"
                  disabled={loading}
                  value={formData.employeeCode}
                  onChange={handleChange}
                  placeholder="e.g. EMP016"
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 ${
                    errors.employeeCode ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.employeeCode && <p className="text-[10px] text-red-500 mt-1">{errors.employeeCode}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Gender</label>
                <select
                  name="gender"
                  disabled={loading}
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  disabled={loading}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Subhradeep"
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 ${
                    errors.firstName ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.firstName && <p className="text-[10px] text-red-500 mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  disabled={loading}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Sardar"
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 ${
                    errors.lastName ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.lastName && <p className="text-[10px] text-red-500 mt-1">{errors.lastName}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  disabled={loading}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="subhradeep@gmail.com"
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  disabled={loading}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 ${
                    errors.phone ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  disabled={loading}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 cursor-pointer ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.dateOfBirth && <p className="text-[10px] text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>

              {/* Hire Date */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Hire Date</label>
                <input
                  type="date"
                  name="hireDate"
                  disabled={loading}
                  value={formData.hireDate}
                  onChange={handleChange}
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 cursor-pointer ${
                    errors.hireDate ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.hireDate && <p className="text-[10px] text-red-500 mt-1">{errors.hireDate}</p>}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Department</label>
                <select
                  name="departmentId"
                  disabled={loading}
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 cursor-pointer"
                >
                  <option value="1">Information Technology</option>
                  <option value="2">Human Resources</option>
                  <option value="3">Finance</option>
                  <option value="4">Marketing</option>
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Designation</label>
                <select
                  name="designationId"
                  disabled={loading}
                  value={formData.designationId}
                  onChange={handleChange}
                  className="w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 cursor-pointer"
                >
                  <option value="1">Software Engineer</option>
                  <option value="2">HR Manager</option>
                  <option value="3">Finance Analyst</option>
                  <option value="4">Marketing Specialist</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Status</label>
                <select
                  name="statusId"
                  disabled={loading}
                  value={formData.statusId}
                  onChange={handleChange}
                  className="w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 cursor-pointer"
                >
                  <option value="1">Active</option>
                  <option value="2">On Leave</option>
                  <option value="3">Resigned</option>
                  <option value="4">Terminated</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Address</label>
                <input
                  type="text"
                  name="address"
                  disabled={loading}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Kolkata"
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 ${
                    errors.address ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.address && <p className="text-[10px] text-red-500 mt-1">{errors.address}</p>}
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Basic Salary</label>
                <input
                  type="text"
                  name="basicSalary"
                  disabled={loading}
                  value={formData.basicSalary}
                  onChange={handleChange}
                  placeholder="e.g. 60000"
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 ${
                    errors.basicSalary ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.basicSalary && <p className="text-[10px] text-red-500 mt-1">{errors.basicSalary}</p>}
              </div>

              {/* Bonus */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Bonus</label>
                <input
                  type="text"
                  name="bonus"
                  disabled={loading}
                  value={formData.bonus}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 ${
                    errors.bonus ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.bonus && <p className="text-[10px] text-red-500 mt-1">{errors.bonus}</p>}
              </div>

              {/* Deduction */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-brand-text mb-1.5">Deduction</label>
                <input
                  type="text"
                  name="deduction"
                  disabled={loading}
                  value={formData.deduction}
                  onChange={handleChange}
                  placeholder="e.g. 1000"
                  className={`w-full text-sm px-4 py-2.5 rounded-xl bg-brand-code/50 border text-brand-heading focus:outline-none focus:border-brand-accent transition-all duration-200 ${
                    errors.deduction ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {errors.deduction && <p className="text-[10px] text-red-500 mt-1">{errors.deduction}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-brand-border mt-6 shrink-0">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-accent text-white shadow-md shadow-brand-accent/20 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isEditMode ? 'Updating...' : 'Saving...'}</span>
                  </>
                ) : (
                  <span>{isEditMode ? 'Update Employee' : 'Save Employee'}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
