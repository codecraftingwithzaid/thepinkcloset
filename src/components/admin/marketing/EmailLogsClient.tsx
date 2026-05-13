'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  AlertCircle,
  RefreshCw,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageLoader } from '@/components/loaders/PageLoader';
import { toast } from 'sonner';

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  status: 'Delivered' | 'Bounced' | 'Failed' | 'Pending';
  time: string;
  type: 'Transactional' | 'Campaign' | 'Flow' | 'Newsletter';
  error?: string;
}

const defaultLogs: EmailLog[] = [
  {
    id: '1',
    recipient: 'sarah.j@example.com',
    subject: 'Welcome to Luxe!',
    status: 'Delivered',
    time: '10:42 AM, Today',
    type: 'Transactional',
  },
  {
    id: '2',
    recipient: 'mike.r@example.com',
    subject: 'Order #4829 Confirmed',
    status: 'Delivered',
    time: '09:15 AM, Today',
    type: 'Transactional',
  },
  {
    id: '3',
    recipient: 'emily.b@example.com',
    subject: 'Summer Sale Kickoff',
    status: 'Bounced',
    time: 'Yesterday',
    type: 'Campaign',
    error: 'Address rejected',
  },
  {
    id: '4',
    recipient: 'john.d@example.com',
    subject: 'Password Reset',
    status: 'Delivered',
    time: 'Yesterday',
    type: 'Transactional',
  },
  {
    id: '5',
    recipient: 'jane.s@example.com',
    subject: 'Summer Sale Kickoff',
    status: 'Failed',
    time: 'Aug 12, 2024',
    type: 'Campaign',
    error: 'SMTP Connection Timeout',
  },
];

export function EmailLogsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [logs, setLogs] = useState<EmailLog[]>(defaultLogs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching logs from backend
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Backend call would go here
      // const res = await getEmailLogs();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setLogs(defaultLogs);
    } catch (error) {
      toast.error('Failed to load email logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesType = filterType === 'all' || log.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    delivered: logs.filter((l) => l.status === 'Delivered').length,
    bounced: logs.filter((l) => l.status === 'Bounced').length,
    failed: logs.filter((l) => l.status === 'Failed').length,
    total: logs.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Bounced':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Bounced':
        return <AlertCircle className="w-4 h-4" />;
      case 'Failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) return <PageLoader variant="standard" showText={true} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Email Logs</h1>
          <p className="text-muted-foreground mt-2">
            Monitor email delivery status and troubleshoot sending issues.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 shrink-0"
          onClick={loadLogs}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold font-heading">{stats.delivered}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bounced</p>
              <p className="text-2xl font-bold font-heading">{stats.bounced}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {stats.total > 0 ? Math.round((stats.bounced / stats.total) * 100) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold font-heading">{stats.failed}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold font-heading">{stats.total}</p>
              <Button variant="ghost" size="sm" className="h-auto p-0 mt-1 text-xs">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2 w-full sm:flex-1 border rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by recipient or subject..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Bounced">Bounced</option>
                <option value="Failed">Failed</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Transactional">Transactional</option>
                <option value="Campaign">Campaign</option>
                <option value="Newsletter">Newsletter</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Mail className="w-12 h-12 mb-4 opacity-50" />
              <p>No logs found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Recipient & Subject</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {getStatusIcon(log.status)}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-[300px]">
                          <span className="font-medium text-foreground truncate">
                            {log.subject}
                          </span>
                          <span className="text-muted-foreground text-xs flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {log.recipient}
                          </span>
                          {log.error && (
                            <span className="text-xs text-red-500 mt-1 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded w-fit">
                              Error: {log.error}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-muted-foreground flex items-center justify-end gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {log.time}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
