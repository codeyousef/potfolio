import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import AdminDashboard from './page';
import { directus } from '@/lib/directus/client';

// Mock the directus client
vi.mock('@/lib/directus/client', () => ({
  directus: {
    items: () => ({
      readByQuery: vi.fn().mockResolvedValue({
        data: [
          { status: 'published' },
          { status: 'published' },
          { status: 'draft' }
        ]
      })
    })
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<AdminDashboard />);

    // Look for the loading spinner by class name
    const loadingSpinner = document.querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('renders dashboard with project stats after loading', async () => {
    render(<AdminDashboard />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check if stats are displayed
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Total projects
    expect(screen.getByText(/2 published, 1 drafts/)).toBeInTheDocument();
  });

  it('renders quick actions section', async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Add New Project')).toBeInTheDocument();
    expect(screen.getByText('Manage Projects')).toBeInTheDocument();
    expect(screen.getByText('Site Settings (Coming Soon)')).toBeInTheDocument();
  });

  it('renders recent activity section', async () => {
    render(<AdminDashboard />);

    // Wait for loading to finish and content to be rendered
    await waitFor(() => {
      // Check that the loading spinner is no longer in the document
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
      // Check that the dashboard content is rendered
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Now check for the recent activity section
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Project X')).toBeInTheDocument();
    expect(screen.getByText('About Page')).toBeInTheDocument();
    expect(screen.getByText('Project Y')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    // Mock API error
    vi.mocked(directus.items().readByQuery).mockRejectedValueOnce(new Error('API Error'));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Even with API error, the UI should render without crashing
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
