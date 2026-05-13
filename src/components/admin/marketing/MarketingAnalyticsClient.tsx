'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  Users,
  MousePointerClick,
  MailOpen,
  Activity,
  Download,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageLoader } from '@/components/loaders/PageLoader';

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

const campaignPerformance = [
  { name: 'Summer Sale', opens: 1200, clicks: 340, revenue: 12400 },
  { name: 'Back to School', opens: 980, clicks: 245, revenue: 9800 },
  { name: 'Holiday Special', opens: 1540, clicks: 450, revenue: 18900 },
  { name: 'New Arrivals', opens: 720, clicks: 180, revenue: 5600 },
];

const COLORS = ['hsl(var(--primary))', '#10b981', '#f59e0b'];

export function MarketingAnalyticsClient() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('6months');

  useEffect(() => {
    // Load analytics data
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Backend call would go here
      // const res = await getMarketingAnalytics({ dateRange });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && <PageLoader variant="minimal" showText={false} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">
            Marketing Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your marketing ROI, campaign performance, and audience engagement metrics.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground cursor-pointer"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Top Level Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue (Email)"
          value="$129,400"
          change="+24.5%"
          icon={DollarSign}
          positive={true}
        />
        <MetricCard
          title="Marketing ROI"
          value="342%"
          change="+12.4%"
          icon={Activity}
          positive={true}
        />
        <MetricCard
          title="Avg. Open Rate"
          value="48.5%"
          change="+2.1%"
          icon={MailOpen}
          positive={true}
        />
        <MetricCard
          title="Avg. Click Rate"
          value="13.2%"
          change="-0.4%"
          icon={MousePointerClick}
          positive={false}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Over Time
                </CardTitle>
                <CardDescription>Actual Revenue vs Target (Last 6 Months)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend iconType="circle" />
                  <Area
                    type="monotone"
                    name="Actual Revenue"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                  <Line
                    type="monotone"
                    strokeDasharray="5 5"
                    name="Target"
                    dataKey="target"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Source Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
            <CardDescription>Distribution of email revenue</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
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
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Legend layout="vertical" verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Trends */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" />
                  Engagement Trends
                </CardTitle>
                <CardDescription>Open Rates & Click Rates (Last 4 Weeks)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <RechartsTooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `${value}%`}
                  />
                  <Legend iconType="circle" />
                  <Bar name="Open Rate" dataKey="openRate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar name="Click Rate" dataKey="clickRate" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Top performing campaigns this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaignPerformance.map((campaign) => (
                <div key={campaign.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{campaign.name}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Opens: {campaign.opens.toLocaleString()}</span>
                      <span>Clicks: {campaign.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${campaign.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  positive,
}: {
  title: string;
  value: string;
  change: string;
  icon: any;
  positive: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="text-3xl font-bold font-heading tracking-tight">{value}</div>
        <div className="mt-2 text-xs">
          <span
            className={`font-medium ${positive ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {change}
          </span>
          <span className="text-muted-foreground ml-2">vs previous period</span>
        </div>
      </CardContent>
    </Card>
  );
}
