import { apiFetch } from "./api";


export interface DepartmentBreakdown {
    departmentName: string;
    employeeCount: number;
}
export interface DashboardSummary {
    totalEmployees: number;
    activePersonnel: number;
    attendence: number;
    averageSalary: number;
    annualPayroll: number;
    departmentBreakdown: DepartmentBreakdown[];

}

export const dashboardService = {
    getSummary: async (): Promise<DashboardSummary> => {
        return apiFetch<DashboardSummary>("/Dashboard/summary");
    }
};