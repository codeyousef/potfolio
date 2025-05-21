import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/utils';
import Index from './Index';
import { useAethelframeStore } from '../store/useAethelframeStore';

// Create a mock implementation that can be modified for each test
const mockFetchProjects = vi.fn();
const mockFetchJournalEntries = vi.fn();
const mockFetchServices = vi.fn();
let mockIsOvertureVisible = false;

// Mock the store
vi.mock('../store/useAethelframeStore', () => ({
  useAethelframeStore: () => ({
    get isOvertureVisible() { return mockIsOvertureVisible; },
    fetchProjects: mockFetchProjects,
    fetchJournalEntries: mockFetchJournalEntries,
    fetchServices: mockFetchServices,
  }),
}));

// Mock the components
vi.mock('../components/sections/Overture', () => ({
  default: () => <div data-testid="overture">Overture Component</div>,
}));

vi.mock('../components/core/SiteShell', () => ({
  default: () => <div data-testid="site-shell">Site Shell Component</div>,
}));

describe('Index', () => {
  it('renders SiteShell when isOvertureVisible is false', () => {
    // Set isOvertureVisible to false
    mockIsOvertureVisible = false;

    render(<Index />);

    expect(screen.getByTestId('site-shell')).toBeInTheDocument();
    expect(screen.queryByTestId('overture')).not.toBeInTheDocument();
  });

  it('renders Overture when isOvertureVisible is true', () => {
    // Set isOvertureVisible to true
    mockIsOvertureVisible = true;

    render(<Index />);

    expect(screen.getByTestId('overture')).toBeInTheDocument();
    expect(screen.queryByTestId('site-shell')).not.toBeInTheDocument();
  });

  it('calls fetch functions on mount', () => {
    // Reset isOvertureVisible to false
    mockIsOvertureVisible = false;

    // Clear mock function calls
    mockFetchProjects.mockClear();
    mockFetchJournalEntries.mockClear();
    mockFetchServices.mockClear();

    render(<Index />);

    expect(mockFetchProjects).toHaveBeenCalledTimes(1);
    expect(mockFetchJournalEntries).toHaveBeenCalledTimes(1);
    expect(mockFetchServices).toHaveBeenCalledTimes(1);
  });
});
