'use client';

import React from 'react';
import { 
  Send, Users, MailOpen, MousePointerClick, 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const performanceData = [
  { name: 'Mon', sent: 4000, opened: 2400, clicked: 1000 },
  { name: 'Tue', sent: 3000, opened: 1398, clicked: 800 },
  { name: 'Wed', sent: 2000, opened: 9800, clicked: 2000 },
  { name: 'Thu', sent: 2780, opened: 3908, clicked: 1500 },
  { name: 'Fri', sent: 1890, opened: 4800, clicked: 2100 },
  { name: 'Sat', sent: 2390, opened: 3800, clicked: 1200 },
  { name: 'Sun', sent: 3490, opened: 4300, clicked: 1800 },
];

const revenueData = [
  { name: 'Week 1', revenue: 4000 },
  { name: 'Week 2', revenue: 3000 },
  { name: 'Week 3', revenue: 2000 },
  { name: 'Week 4', revenue: 2780 },
];

export function MarketingDashboardClient() {
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
          title="Total Sent" 
          value="24,593" 
          change="+12.5%" 
          isPositive={true} 
          icon={Send} 
        />
        <KPICard 
          title="Avg. Open Rate" 
          value="48.2%" 
          change="+4.1%" 
          isPositive={true} 
          icon={MailOpen} 
        />
        <KPICard 
          title="Avg. Click Rate" 
          value="12.4%" 
          change="-1.2%" 
          isPositive={false} 
          icon={MousePointerClick} 
        />
        <KPICard 
          title="Campaign Revenue" 
          value="$12,450" 
          change="+18.2%" 
          isPositive={true} 
          icon={DollarSign} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <div className="lg:col-span-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold font-heading tracking-tight">Campaign Performance</h2>
              <p className="text-sm text-muted-foreground">Sent vs Opened vs Clicked this week</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="sent" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSent)" />
                <Area type="monotone" dataKey="opened" stroke="#10b981" fillOpacity={1} fill="url(#colorOpened)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="lg:col-span-3 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold font-heading tracking-tight">Revenue Impact</h2>
              <p className="text-sm text-muted-foreground">Revenue generated from campaigns</p>
            </div>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <RechartsTooltip 
                  cursor={{fill: 'hsl(var(--muted))'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Campaigns Table Placeholder */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-lg font-semibold font-heading tracking-tight">Recent Campaigns</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-3 font-medium">Campaign Name</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Sent</th>
                <th className="px-6 py-3 font-medium">Open Rate</th>
                <th className="px-6 py-3 font-medium">Click Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Summer Sale Announcement', status: 'Completed', sent: '12,450', open: '48.2%', click: '14.1%' },
                { name: 'New Arrivals: Floral Collection', status: 'Completed', sent: '8,200', open: '52.4%', click: '16.8%' },
                { name: 'VIP Exclusive Discount', status: 'Draft', sent: '-', open: '-', click: '-' },
                { name: 'Abandoned Cart Reminder', status: 'Active', sent: '1,450', open: '64.5%', click: '28.2%' },
              ].map((campaign, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{campaign.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      campaign.status === 'Active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{campaign.sent}</td>
                  <td className="px-6 py-4 text-muted-foreground">{campaign.open}</td>
                  <td className="px-6 py-4 text-muted-foreground">{campaign.click}</td>
                </tr>
              ))}
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
        <span className={isPositive ? 'text-emerald-500 font-medium' : 'text-red-500 font-medium'}>
          {change}
        </span>
        <span className="text-muted-foreground ml-2">vs last month</span>
      </div>
    </div>
  );
}
