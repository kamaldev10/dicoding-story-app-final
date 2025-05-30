import CONFIG from '../config';

class AuthApi {
  constructor(baseUrl = CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async register({ name, email, password }) {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || 'Gagal melakukan registrasi';
        throw new Error(errorMessage);
      }

      return result;
    } catch (error) {
      console.error('Register error:', error);
      return {
        error: true,
        message: error.message || 'Gagal melakukan registrasi',
      };
    }
  }

  async login({ email, password }) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      // Check for API errors first
      if (!response.ok) {
        const errorMessage = result.message || 'Gagal melakukan login';
        throw new Error(errorMessage);
      }

      // Fixed: Safely handle loginResult structure
      // In case loginResult is undefined or doesn't have expected properties
      if (result && result.loginResult) {
        const { loginResult } = result;
        if (loginResult.token) localStorage.setItem('authToken', loginResult.token);
        if (loginResult.name) localStorage.setItem('userName', loginResult.name);
        if (loginResult.userId) localStorage.setItem('userId', loginResult.userId);
      } else {
        // If loginResult is missing or not as expected, create a fallback
        console.warn('Login response structure was not as expected');

        // Store whatever token might be available in the response
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }

        if (result.name) {
          localStorage.setItem('userName', result.name);
        }

        if (result.id || result.userId) {
          localStorage.setItem('userId', result.id || result.userId);
        }
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        error: true,
        message: error.message || 'Gagal melakukan login',
      };
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  }
}

export function getAccessToken() {
  try {
    const accessToken = localStorage.getItem('authToken');

    if (accessToken === 'null' || accessToken === 'undefined') {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('getAccessToken: error:', error);
    return null;
  }
}

export function putAccessToken(token) {
  try {
    localStorage.setItem('authToken', token);
    return true;
  } catch (error) {
    console.error('putAccessToken: error:', error);
    return false;
  }
}

export default AuthApi;
