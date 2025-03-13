const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Reusable fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred',
    }));
    
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  /**
   * Example GET request
   */
  get: <T>(endpoint: string) => {
    return fetchAPI<T>(endpoint, { method: 'GET' });
  },
  
  /**
   * Example POST request
   */
  post: <T>(endpoint: string, data: any) => {
    return fetchAPI<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
