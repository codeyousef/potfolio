'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/directus/auth-context';

export default function ProtectedRoute({
  children,
  requireAdmin = true,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not logged in, redirect to login
        router.push('/admin/login');
      } else if (requireAdmin && user.role !== 'admin') {
        // User is logged in but not an admin, redirect to home
        router.push('/');
      } else {
        // User is authorized
        setIsAuthorized(true);
      }
    }
  }, [user, loading, requireAdmin, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
