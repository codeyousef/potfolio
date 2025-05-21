import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { directus } from './client';

type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // Skip if we're already on the login page or not on an admin page
        if (window.location.pathname === '/admin/login' || !window.location.pathname.startsWith('/admin')) {
          setLoading(false);
          return;
        }

        console.log('Checking authentication status...');

        // Check if user is already logged in on initial load
        const token = localStorage.getItem('directus_token');

        if (token) {
          // Set the token in the Directus client
          // @ts-ignore - Directus types don't include the setToken method
          await directus.setToken(token);

          // Fetch the current user
          const user = await directus.getCurrentUser();
          if (user) {
            setUser(user);
          } else {
            // If we can't get the user, clear the token
            localStorage.removeItem('directus_token');
          }
        }

        // Use the Directus client to check authentication
        const currentUser = await directus.getCurrentUser();

        if (!currentUser) {
          throw new Error('Not authenticated');
        }

        console.log('User is authenticated:', currentUser);

        setUser({
          id: currentUser.id,
          email: currentUser.email,
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          avatar: currentUser.avatar || null
        });
      } catch (error) {
        console.log('Not authenticated, redirecting to login...');
        setUser(null);

        // Only redirect if we're trying to access an admin page and not already on the login page
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          console.log('Redirecting to login from:', window.location.pathname);
          navigate('/admin/login', { 
            state: { from: window.location.pathname },
            replace: true 
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);

      // Make a direct login request to the Directus API with JSON response
      const loginResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8055'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          mode: 'json' // Use JSON mode instead of cookies
        }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const loginData = await loginResponse.json();
      console.log('Login successful:', loginData);

      if (!loginData.data?.access_token) {
        throw new Error('No access token received from login');
      }

      // Store the access token in local storage
      const token = loginData.data.access_token;
      localStorage.setItem('directus_token', token);

      // Make a request to get the current user with the token
      const userResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8055'}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data after login');
      }

      const userData = await userResponse.json();

      if (!userData?.data) {
        throw new Error('Invalid user data received');
      }

      const user = userData.data;

      // Set the user data directly from the login response
      setUser({
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        avatar: user.avatar || null
      });

      console.log('User data set from login response');
      return true;
    } catch (error) {
      console.error('Login error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear the token from local storage
      localStorage.removeItem('directus_token');

      // Clear the token from the Directus client
      // @ts-ignore - Directus types don't include the setToken method
      await directus.setToken(null);

      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, continue with clearing the user
    } finally {
      // Clear user and redirect to login
      setUser(null);
      navigate('/admin/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
