import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './auth-context';
import { MemoryRouter } from 'react-router-dom';
import { directus } from './client';

// Mock the directus client
vi.mock('./client', () => ({
  directus: {
    getCurrentUser: vi.fn(),
    setToken: vi.fn(),
  }
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/',
  },
  writable: true,
});

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, login, logout } = useAuth();

  return (
    <div>
      {loading ? (
        <div data-testid="loading">Loading...</div>
      ) : (
        <>
          <div data-testid="auth-status">
            {user ? `Logged in as ${user.email}` : 'Not logged in'}
          </div>
          <button 
            data-testid="login-button" 
            onClick={() => login('test@example.com', 'password')}
          >
            Login
          </button>
          <button 
            data-testid="logout-button" 
            onClick={logout}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    window.location.pathname = '/';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading state initially', () => {
    // Mock getCurrentUser to return a promise that never resolves
    vi.mocked(directus.getCurrentUser).mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('checks authentication status on mount', async () => {
    // Mock getCurrentUser to return null (not authenticated)
    vi.mocked(directus.getCurrentUser).mockResolvedValue(null);

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not logged in');
  });

  it('redirects to login page if not authenticated and not on login page', async () => {
    // Mock getCurrentUser to throw an error (not authenticated)
    vi.mocked(directus.getCurrentUser).mockRejectedValue(new Error('Not authenticated'));

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/admin/login', expect.any(Object));
  });

  it('successfully logs in a user', async () => {
    // Mock fetch for login
    mockFetch.mockImplementation((url) => {
      if (url.includes('/auth/login')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: {
              access_token: 'test-token',
            }
          })
        });
      } else if (url.includes('/users/me')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: {
              id: '1',
              email: 'test@example.com',
              first_name: 'Test',
              last_name: 'User',
            }
          })
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Click login button
    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged in as test@example.com');
    });

    // Check that token was stored
    expect(localStorageMock.setItem).toHaveBeenCalledWith('directus_token', 'test-token');
  });

  it('handles login failure', async () => {
    // Mock fetch to return an error
    mockFetch.mockImplementation((url) => {
      if (url.includes('/auth/login')) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: 'Invalid credentials'
          })
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Click login button and expect it to throw
    const user = userEvent.setup();

    // We need to wrap the click in act and try/catch because it will throw
    await act(async () => {
      try {
        await user.click(screen.getByTestId('login-button'));
      } catch (error) {
        // Expected error
      }
    });

    // Auth status should still show not logged in
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not logged in');
  });

  it('successfully logs out a user', async () => {
    // Mock a logged in user
    vi.mocked(directus.getCurrentUser).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged in as test@example.com');
    });

    // Click logout button
    const user = userEvent.setup();
    await user.click(screen.getByTestId('logout-button'));

    // Check that token was removed
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('directus_token');

    // Check that user was redirected to login
    expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
  });
});
