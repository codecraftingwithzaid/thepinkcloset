'use client';

import { useEffect, useState } from 'react';
import { 
  Send, Users, MailOpen, MousePointerClick, 
  TrendingUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { PageLoader } from '@/components/loaders/PageLoader';
import { getMarketingDashboard } from '@/actions/analytics';
import { toast } from 'sonner';

interface DashboardData {
  campaigns: {
    total: number;
    sent: number;
    scheduled: number;
    recent: any[];
  };
  emails: {
    total: number;
    sent: number;
    failed: number;
    opened: number;
    clicked: number;
  };
  subscribers: {
    total: number;
    active: number;
  };
  analytics: {
    openRate: number;
    clickRate: number;
    failureRate: number;
    deliveryRate: string;
  };
  recentActivity: any[];
}

export function MarketingDashboardClient() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const res = await getMarketingDashboard();
    if (res.ok && res.dashboard) {
      setDashboard(res.dashboard);
    } else {
      toast.error(res.error || 'Failed to load dashboard');
    }
    setLoading(false);
  };

  if (loading) return <PageLoader />;

  const d = dashboard!;
  const performanceData = [
    { name: 'Sent', value: d.emails.sent },
    { name: 'Opened', value: d.emails.opened },
    { name: 'Clicked', value: d.emails.clicked },
    { name: 'Failed', value: d.emails.failed },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Marketing Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your campaign performance and audience engagement.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Total Emails Sent" 
          value={d.emails.sent.toLocaleString()} 
          change={d.emails.sent > 0 ? '+' : ''} 
          isPositive={true} 
          icon={Send} 
        />
        <KPICard 
          title="Open Rate" 
          value={`${d.analytics.openRate.toFixed(1)}%`} 
          change={d.analytics.openRate > 30 ? '+' : ''} 
          isPositive={d.analytics.openRate > 30} 
          icon={MailOpen} 
        />
        <KPICard 
          title="Click Rate" 
          value={`${d.analytics.clickRate.toFixed(1)}%`} 
          change={d.analytics.clickRate > 10 ? '+' : ''} 
          isPositive={d.analytics.clickRate > 10} 
          icon={MousePointerClick} 
        />
        <KPICard 
          title="Active Subscribers" 
          value={d.subscribers.active.toLocaleString()} 
          change={`${((d.subscribers.active / d.subscribers.total) * 100).toFixed(0)}%`} 
          isPositive={true} 
          icon={Users} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Performance Chart */}
        <div className="lg:col-span-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold font-heading tracking-tight">Email Performance</h2>
              <p className="text-sm text-muted-foreground">Sent, Opened, Clicked, Failed</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-3 rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold font-heading tracking-tight mb-4">Campaign Stats</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Total Campaigns</span>
              <span className="font-semibold text-lg">{d.campaigns.total}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Sent</span>
              <span className="font-semibold text-lg text-green-600">{d.campaigns.sent}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Scheduled</span>
              <span className="font-semibold text-lg text-blue-600">{d.campaigns.scheduled}</span>
            </div>
            <div className="flex justify-between items-center pb-3">
              <span className="text-sm text-muted-foreground">Failed Emails</span>
              <span className="font-semibold text-lg text-red-600">{d.emails.failed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-lg font-semibold font-heading tracking-tight">Recent Email Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-3 font-medium">Recipient</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {d.recentActivity && d.recentActivity.length > 0 ? (
                d.recentActivity.slice(0, 5).map((activity, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{activity.recipientEmail}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        activity.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-muted-foreground">No activity yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, isPositive, icon: Icon }: { title: string, value: string, change: string, isPositive: boolean, icon: any }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold font-heading tracking-tight">{value}</span>
      </div>
      <div className="mt-2 flex items-center text-xs">
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
        )}
      </div>
    </div>
  );
}
