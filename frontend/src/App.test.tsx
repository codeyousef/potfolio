import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the auth context
vi.mock('@/lib/directus/auth-context', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

// Mock the page components
vi.mock('./pages/Index', () => ({
  default: () => <div data-testid="index-page">Index Page</div>,
}));

vi.mock('./pages/NotFound', () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

vi.mock('./pages/ProjectDetail', () => ({
  default: () => <div data-testid="project-detail-page">Project Detail Page</div>,
}));

vi.mock('./pages/ServiceDetail', () => ({
  default: () => <div data-testid="service-detail-page">Service Detail Page</div>,
}));

vi.mock('./pages/admin/login/page', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

describe('App', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  it('renders the index page on the root route', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByTestId('index-page')).toBeInTheDocument();
  });

  it('renders the not found page for unknown routes', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/unknown-route']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  it('redirects to login page when accessing protected route without authentication', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders the project detail page for project routes', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/projects/test-project']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
  });

  it('renders the service detail page for service routes', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/services/test-service']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByTestId('service-detail-page')).toBeInTheDocument();
  });
});
