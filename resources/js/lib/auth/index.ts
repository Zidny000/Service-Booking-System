import axios from 'axios';

/**
 * Set the auth token for all subsequent axios requests
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

/**
 * Check if the user is logged in by looking for a token
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('authToken') !== null;
};

/**
 * Get the current auth token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Log the user out
 */
export const logout = async (): Promise<void> => {
  const token = getToken();
  
  if (token) {
    try {
      await axios.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  setAuthToken(null);
};

/**
 * Initialize auth by setting the token from localStorage if it exists
 */
export const initAuth = (): void => {
  const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
  }
};
