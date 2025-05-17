import { Sidebar } from '@/components/admin/sidebar';
import { useAuth } from '@/lib/directus/auth-context';
import { Navigate, Outlet, useNavigate, NavLink as RouterNavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { LogOut, LayoutDashboard, Folder, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            <NavLink to="/admin">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink to="/admin/projects">
              <Folder className="h-5 w-5" />
              <span>Projects</span>
            </NavLink>
            
            <NavLink to="/admin/settings">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </NavLink>
          </nav>
          
          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  {user.first_name?.[0] || user.email?.[0] || 'U'}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {user.first_name || user.email}
                  </div>
                  <div className="text-gray-500">Admin</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
          isActive
            ? 'bg-indigo-50 text-indigo-600 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}
