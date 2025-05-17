import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Settings, Activity, Clock, CheckCircle } from 'lucide-react';
import { directus } from '@/lib/directus/client';

type Stats = {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
};

type RecentActivity = {
  id: string;
  title: string;
  type: 'project' | 'page' | 'user';
  action: 'created' | 'updated' | 'deleted';
  date: string;
  user: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects count
        const projects = await directus.items('projects').readByQuery({
          fields: ['status'],
          limit: -1,
        });

        const totalProjects = projects.data?.length || 0;
        const publishedProjects = projects.data?.filter(p => p.status === 'published').length || 0;
        const draftProjects = totalProjects - publishedProjects;

        setStats({
          totalProjects,
          publishedProjects,
          draftProjects,
        });

        // Fetch recent activity (in a real app, you would have an activity log)
        setRecentActivity([
          {
            id: '1',
            title: 'Project X',
            type: 'project',
            action: 'updated',
            date: new Date().toISOString(),
            user: 'You',
          },
          {
            id: '2',
            title: 'About Page',
            type: 'page',
            action: 'updated',
            date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            user: 'You',
          },
          {
            id: '3',
            title: 'Project Y',
            type: 'project',
            action: 'created',
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            user: 'You',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your portfolio.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/projects/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedProjects} published, {stats.draftProjects} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedProjects}</div>
              <p className="text-xs text-muted-foreground">
                Live projects on your site
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draftProjects}</div>
              <p className="text-xs text-muted-foreground">
                Drafts waiting to be published
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/admin/projects/new')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Project
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/admin/projects')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Manage Projects
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/admin/settings')}
              disabled
            >
              <Settings className="mr-2 h-4 w-4" />
              Site Settings (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes to your content</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {activity.type === 'project' && (
                        <FileText className="h-5 w-5 text-indigo-500" />
                      )}
                      {activity.type === 'page' && (
                        <FileText className="h-5 w-5 text-blue-500" />
                      )}
                      {activity.type === 'user' && (
                        <Users className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {activity.title}
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          {activity.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} by {activity.user}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(activity.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No activity yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating a new project.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
