'use client';

import React from 'react';
import { 
  BarChart2, TrendingUp, DollarSign, Users, 
  MousePointerClick, MailOpen, Activity, Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Button } from '@/components/ui/button';

const revenueData = [
  { name: 'Jan', revenue: 12400, target: 10000 },
  { name: 'Feb', revenue: 18500, target: 12000 },
  { name: 'Mar', revenue: 15200, target: 14000 },
  { name: 'Apr', revenue: 22400, target: 16000 },
  { name: 'May', revenue: 28500, target: 18000 },
  { name: 'Jun', revenue: 32400, target: 20000 },
];

const engagementData = [
  { name: 'Week 1', openRate: 45, clickRate: 12 },
  { name: 'Week 2', openRate: 48, clickRate: 14 },
  { name: 'Week 3', openRate: 52, clickRate: 15 },
  { name: 'Week 4', openRate: 49, clickRate: 13 },
];

const sourceData = [
  { name: 'Campaigns', value: 45 },
  { name: 'Automated Flows', value: 35 },
  { name: 'Transactional', value: 20 },
];
const COLORS = ['hsl(var(--primary))', '#10b981', '#f59e0b'];

export function MarketingAnalyticsClient() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Marketing Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Deep dive into your marketing ROI, revenue generation, and audience engagement.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Top Level Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Revenue (Email)" value="$129,400" change="+24.5%" icon={DollarSign} />
        <MetricCard title="Marketing ROI" value="342%" change="+12.4%" icon={Activity} />
        <MetricCard title="Avg. Open Rate" value="48.5%" change="+2.1%" icon={MailOpen} />
        <MetricCard title="Avg. Click Rate" value="13.2%" change="-0.4%" icon={MousePointerClick} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold font-heading tracking-tight">Revenue Over Time</h2>
              <p className="text-sm text-muted-foreground">Actual Revenue vs Target (Last 6 Months)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" name="Actual Revenue" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" />
                <Line type="monotone" strokeDasharray="5 5" name="Target" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Source Pie Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold font-heading tracking-tight">Revenue by Source</h2>
            <p className="text-sm text-muted-foreground">Distribution of email revenue</p>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value) => `${value}%`}
                />
                <Legend layout="vertical" verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Trends */}
        <div className="lg:col-span-3 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold font-heading tracking-tight">Engagement Trends</h2>
              <p className="text-sm text-muted-foreground">Open Rates & Click Rates (Last 4 Weeks)</p>
            </div>
            <BarChart2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <RechartsTooltip 
                  cursor={{fill: 'hsl(var(--muted))'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value) => `${value}%`}
                />
                <Legend iconType="circle" />
                <Bar name="Open Rate" dataKey="openRate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar name="Click Rate" dataKey="clickRate" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon }: { title: string, value: string, change: string, icon: any }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="text-3xl font-bold font-heading tracking-tight">{value}</div>
      <div className="mt-2 text-xs">
        <span className={isPositive ? 'text-emerald-500 font-medium' : 'text-red-500 font-medium'}>
          {change}
        </span>
        <span className="text-muted-foreground ml-2">vs previous period</span>
      </div>
    </div>
  );
}
