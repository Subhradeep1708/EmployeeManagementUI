import React, { useState } from 'react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { EmployeeTable } from '../components/dashboard/EmployeeTable';
import { AddEmployeeModal } from '../components/common/AddEmployeeModal';
import type { Employee } from '../types';
import { Users, DollarSign, Briefcase, Award, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  employees: Employee[];
  onDelete: (id: number) => void;
  onAdd: (newEmp: Omit<Employee, 'id' | 'joinDate'>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ employees, onDelete, onAdd }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const totalSalary = employees.reduce((sum, e) => sum + Number(e.salary), 0);
  const averageSalary = employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value={employees.length}
          icon={<Users className="w-6 h-6" />}
          trend="+8% from last quarter"
          trendType="positive"
          color="purple"
        />
        <StatsCard
          title="Active Personnel"
          value={activeCount}
          icon={<Briefcase className="w-6 h-6" />}
          trend="+3% new hires"
          trendType="positive"
          color="blue"
        />
        <StatsCard
          title="Annual Payroll"
          value={`$${(totalSalary / 1000).toFixed(0)}k`}
          icon={<DollarSign className="w-6 h-6" />}
          trend="-2.4% adjustments"
          trendType="negative"
          color="emerald"
        />
        <StatsCard
          title="Average Salary"
          value={`$${(averageSalary / 1000).toFixed(0)}k`}
          icon={<Award className="w-6 h-6" />}
          trend="Stable"
          trendType="neutral"
          color="orange"
        />
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-brand-heading">Active Staff Directory</h3>
            <span className="text-xs text-brand-text/80 bg-brand-code border border-brand-border px-2.5 py-1 rounded-lg">
              Dynamic Filter Enabled
            </span>
          </div>
          <EmployeeTable
            employees={employees}
            onDelete={onDelete}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        </div>

        {/* Quick Analytics & Department Breakdown */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm">
            <h3 className="text-sm font-bold text-brand-heading uppercase tracking-wider mb-4">
              Department Breakdown
            </h3>
            <div className="space-y-4">
              {['Engineering', 'Design', 'Product', 'Marketing', 'Human Resources'].map((dept) => {
                const count = employees.filter((e) => e.department === dept).length;
                const percentage = employees.length > 0 ? (count / employees.length) * 100 : 0;
                return (
                  <div key={dept} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-brand-heading">{dept}</span>
                      <span className="text-brand-text">{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-2 w-full bg-brand-code rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-accent rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="p-6 rounded-2xl bg-brand-accent-bg border border-brand-accent-border relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-brand-accent/5 rounded-full border border-brand-accent-border/30 group-hover:scale-125 transition-transform duration-500"></div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-white shrink-0 shadow-md">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-brand-heading">Security Compliance Check</h4>
                <p className="text-xs text-brand-text/90 mt-1 leading-relaxed">
                  The quarterly security audit begins next Monday. Please ensure all employee portal logs are cleared and role assignments verified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAdd}
      />
    </div>
  );
};

export default Dashboard;
