import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/directus/auth-context";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import ServiceDetail from "./pages/ServiceDetail";

// Admin Components
import AdminLayout from "./pages/admin/layout";
import AdminDashboard from "./pages/admin/page";
import AdminProjects from "./pages/admin/projects/page";
import AdminProjectEdit from "./pages/admin/projects/[id]/page";
import AdminProjectNew from "./pages/admin/projects/new/page";
import AdminSettings from "./pages/admin/settings/page";
import LoginPage from "./pages/admin/login/page";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: window.location.pathname }} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Project Detail Page */}
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        
        {/* Service Detail Page */}
        <Route path="/services/:slug" element={<ServiceDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/projects" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminProjects />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/projects/new" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminProjectNew />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/projects/:id" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminProjectEdit />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/login" element={<LoginPage />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;