// import { apiFetch } from './api';
import type { Employee } from '../types';

export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    // API Integration:
    // return apiFetch<Employee[]>('/employees');
    
    throw new Error('Connect ASP.NET Web API endpoint GET /api/employees');
  },

  getEmployeeById: async (_id: number): Promise<Employee> => {
    // API Integration:
    // return apiFetch<Employee>(`/employees/${_id}`);
    
    throw new Error(`Connect ASP.NET Web API endpoint GET /api/employees/${_id}`);
  },

  createEmployee: async (_employee: Omit<Employee, 'id' | 'joinDate'>): Promise<Employee> => {
    // API Integration:
    // return apiFetch<Employee>('/employees', {
    //   method: 'POST',
    //   body: JSON.stringify(_employee),
    // });
    
    throw new Error('Connect ASP.NET Web API endpoint POST /api/employees');
  },

  updateEmployee: async (_id: number, _employee: Partial<Employee>): Promise<Employee> => {
    // API Integration:
    // return apiFetch<Employee>(`/employees/${_id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(_employee),
    // });
    
    throw new Error(`Connect ASP.NET Web API endpoint PUT /api/employees/${_id}`);
  },

  deleteEmployee: async (_id: number): Promise<void> => {
    // API Integration:
    // return apiFetch<void>(`/employees/${_id}`, { method: 'DELETE' });
    
    throw new Error(`Connect ASP.NET Web API endpoint DELETE /api/employees/${_id}`);
  },

  deleteMultipleEmployees: async (_ids: number[]): Promise<void> => {
    // API Integration:
    // return apiFetch<void>('/employees/bulk-delete', {
    //   method: 'POST',
    //   body: JSON.stringify({ ids: _ids }),
    // });
    
    throw new Error('Connect ASP.NET Web API endpoint POST /api/employees/bulk-delete');
  }
};
