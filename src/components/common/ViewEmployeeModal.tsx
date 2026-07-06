import React, { useState, useEffect } from 'react';
import { X, User, Loader2, Shield, Calendar, Phone, Mail, MapPin, DollarSign } from 'lucide-react';
import { employeeService } from '../../services/employeeService';

interface ViewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number | null;
}

export const ViewEmployeeModal: React.FC<ViewEmployeeModalProps> = ({ isOpen, onClose, employeeId }) => {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && employeeId) {
      const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await employeeService.getEmployeeById(employeeId);
          if (res.success && res.data) {
            setEmployee(res.data);
          } else {
            setError(res.message || 'Failed to retrieve employee details.');
          }
        } catch (err: any) {
          setError(err.message || 'An error occurred while loading profile details.');
        } finally {
          setLoading(false);
        }
      };
      void fetchDetails();
    } else {
      setEmployee(null);
    }
  }, [isOpen, employeeId]);

  if (!isOpen) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr.split('T')[0]);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (statusName?: string) => {
    if (!statusName) return 'bg-brand-code/80 text-brand-text';
    switch (statusName) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'On Leave':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'Terminated':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/20';
      default:
        return 'bg-brand-code/80 text-brand-text border border-brand-border/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl bg-brand-bg border border-brand-border rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border bg-brand-code/20 shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-accent" />
            <h3 className="text-lg font-bold text-brand-heading">
              Employee Profile View
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-brand-text hover:text-brand-heading hover:bg-brand-border transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-brand-text">
              <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
              <p className="text-sm font-semibold">Loading employee profile...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-rose-500 font-semibold text-sm">
              {error}
            </div>
          ) : employee ? (
            <div className="space-y-6">
              {/* Profile Bio Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-brand-code/10 border border-brand-border/40">
                <div className="w-16 h-16 rounded-full bg-brand-accent/15 border border-brand-accent/20 flex items-center justify-center text-xl font-bold text-brand-accent uppercase shrink-0">
                  {employee.firstName?.[0]}
                  {employee.lastName?.[0]}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="text-base font-bold text-brand-heading">
                    {employee.firstName} {employee.lastName}
                  </h4>
                  <p className="text-xs text-brand-text font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                    <Shield className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                    <span>{employee.designationName || 'N/A'}</span>
                    <span className="text-brand-border/60">|</span>
                    <span className="text-brand-text/60">{employee.departmentName || 'N/A'}</span>
                  </p>
                </div>
                <div className="sm:ml-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${getStatusBadge(employee.statusName)}`}>
                    {employee.statusName || 'Active'}
                  </span>
                </div>
              </div>

              {/* Grid Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-brand-heading uppercase tracking-wider border-b border-brand-border/40 pb-1.5">
                    Personal Information
                  </h5>
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-brand-text/60 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Employee Code</span>
                        <span className="text-xs font-bold text-brand-heading">{employee.employeeCode}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-brand-text/60 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Gender</span>
                        <span className="text-xs font-semibold text-brand-heading">{employee.gender || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-brand-text/60 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Date of Birth</span>
                        <span className="text-xs font-semibold text-brand-heading">{formatDate(employee.dateOfBirth)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Location Details */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-brand-heading uppercase tracking-wider border-b border-brand-border/40 pb-1.5">
                    Contact & Location
                  </h5>
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-brand-text/60 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Email Address</span>
                        <span className="text-xs font-bold text-brand-heading break-all">{employee.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-brand-text/60 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Phone Number</span>
                        <span className="text-xs font-semibold text-brand-heading">{employee.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-brand-text/60 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Residential Address</span>
                        <span className="text-xs font-semibold text-brand-heading">{employee.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment details */}
                <div className="space-y-4 md:col-span-2">
                  <h5 className="text-xs font-bold text-brand-heading uppercase tracking-wider border-b border-brand-border/40 pb-1.5">
                    Job & Compensation
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-brand-code/5 border border-brand-border/40 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-brand-text/60 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Hire Date</span>
                        <span className="text-xs font-semibold text-brand-heading">{formatDate(employee.hireDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-brand-text/60 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Basic Salary</span>
                        <span className="text-xs font-semibold text-brand-heading">{formatCurrency(employee.basicSalary)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Bonus</span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(employee.bonus)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-rose-500 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Deduction</span>
                        <span className="text-xs font-semibold text-rose-600 dark:text-rose-450">{formatCurrency(employee.deduction)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:col-span-2">
                      <DollarSign className="w-4 h-4 text-brand-accent shrink-0" />
                      <div>
                        <span className="block text-[10px] text-brand-text/60">Computed Net Payroll</span>
                        <span className="text-sm font-bold text-brand-accent">{formatCurrency(employee.netSalary)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-brand-text font-semibold text-sm">
              No employee profile selected.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-brand-border bg-brand-code/10 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-brand-code border border-brand-border rounded-xl text-xs font-semibold text-brand-text hover:text-brand-heading hover:bg-brand-border/40 transition-all duration-200 cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
