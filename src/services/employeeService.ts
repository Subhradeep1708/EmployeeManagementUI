import { apiFetch } from './api';

export const employeeService = {
  getEmployees: async (
        page = 1,
        pageSize = 10,
        search?: string,
        departmentId?: number,
        statusId?: number
    ) => {

        return apiFetch("/Employees/get-employees", {
            params: {
                page: page.toString(),
                pageSize: pageSize.toString(),
                ...(search ? { search } : {}),
                ...(departmentId ? { departmentId: departmentId.toString() } : {}),
                ...(statusId ? { statusId: statusId.toString() } : {})
            }
        });

    },

  getEmployeeById: async (id: number): Promise<{ success: boolean; data: any; message: string; statusCode: number }> => {
    return apiFetch(`/Employees/get-employee-by-id/${id}`);
  },

  createEmployee: async (employee: any): Promise<{ success: boolean; data: any; message: string; statusCode: number }> => {
    return apiFetch('/Employees/create-employee', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  },

  updateEmployee: async (id: number, employee: any): Promise<{ success: boolean; data: any; message: string; statusCode: number }> => {
    return apiFetch(`/Employees/update-employee/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
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
