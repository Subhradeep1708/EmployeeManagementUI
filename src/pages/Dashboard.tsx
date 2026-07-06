import React, { useEffect, useState } from 'react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { EmployeeTable } from '../components/dashboard/EmployeeTable';
import { AddEmployeeModal } from '../components/common/AddEmployeeModal';
import type { Employee } from '../types';
import { Users, DollarSign, Briefcase, Award, UserPlus } from 'lucide-react';
import { dashboardService, type DashboardSummary } from '../services/dashboardService';


interface DashboardProps {
  employees: Employee[];
  onDelete: (id: number) => void;
  onAdd?: (newEmp: Omit<Employee, 'id' | 'joinDate'>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({  onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [summary, setSummary] = useState<DashboardSummary>({
    totalEmployees: 0,
    activePersonnel: 0,
    attendence: 0,
    averageSalary: 0,
    annualPayroll: 0,
    departmentBreakdown: [],
  });

  const loadDashboard = async () => {
    try {
      const response = await dashboardService.getSummary();
      setSummary(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const handleEmployeeAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    void loadDashboard();
  };


  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value={summary.totalEmployees}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Active Personnel"
          value={summary.activePersonnel}
          icon={<Briefcase className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Annual Payroll"
          // value={`$${(totalSalary / 1000).toFixed(0)}k`}
          value={summary.annualPayroll}
          icon={<DollarSign className="w-6 h-6" />}
          color="emerald"
        />
        <StatsCard
          title="Average Salary"
          // value={`$${(averageSalary / 1000).toFixed(0)}k`}
          value={summary.averageSalary}
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
            <button
              onClick={() => {
                setEditingEmployeeId(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-brand-accent text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-accent/25 transition-all duration-200 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
          <EmployeeTable
            // employees={employees}
            onDelete={onDelete}
            onOpenAddModal={() => {
              setEditingEmployeeId(null);
              setIsModalOpen(true);
            }}
            onEdit={(id) => {
              setEditingEmployeeId(id);
              setIsModalOpen(true);
            }}
            showAddButton={false}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Quick Analytics & Department Breakdown */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm transition-all duration-300 hover:border-brand-accent/40">
            <h3 className="text-sm font-bold text-brand-heading uppercase tracking-wider mb-4">
              Department Breakdown
            </h3>
            <div className="space-y-4">
              {summary.departmentBreakdown.map((dept) => {
                const percentage =
                  summary.totalEmployees === 0
                    ? 0
                    : (dept.employeeCount / summary.totalEmployees) * 100;
                return (
                  <div key={dept.departmentName} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-brand-heading">{dept.departmentName}</span>
                      <span className="text-brand-text">{dept.employeeCount} ({Math.round(percentage)}%)</span>
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


        </div>
      </div>

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

export default Dashboard;
