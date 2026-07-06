const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5270/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export const apiFetch = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { params, headers, ...customConfig } = options;
  
  // Construct URL with query parameters if any
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Get auth token from local storage
  const token = localStorage.getItem('auth-token');

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      window.location.href = '/login';
      throw new Error('Unauthorized session. Redirecting...');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Fetch Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
};
