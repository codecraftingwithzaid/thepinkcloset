'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, CheckCircle2, XCircle, 
  Clock, Mail, AlertCircle, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const dummyLogs = [
  { id: '1', recipient: 'sarah.j@example.com', subject: 'Welcome to Luxe!', status: 'Delivered', time: '10:42 AM, Today', type: 'Transactional' },
  { id: '2', recipient: 'mike.r@example.com', subject: 'Order #4829 Confirmed', status: 'Delivered', time: '09:15 AM, Today', type: 'Transactional' },
  { id: '3', recipient: 'emily.b@example.com', subject: 'Summer Sale Kickoff', status: 'Bounced', time: 'Yesterday', type: 'Campaign', error: 'Address rejected' },
  { id: '4', recipient: 'john.d@example.com', subject: 'Password Reset', status: 'Delivered', time: 'Yesterday', type: 'Transactional' },
  { id: '5', recipient: 'jane.s@example.com', subject: 'Summer Sale Kickoff', status: 'Failed', time: 'Aug 12, 2024', type: 'Campaign', error: 'SMTP Connection Timeout' },
  { id: '6', recipient: 'alex.w@example.com', subject: 'Your Cart is Waiting', status: 'Delivered', time: 'Aug 11, 2024', type: 'Flow' },
];

export function EmailLogsClient() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Email Logs</h1>
          <p className="text-muted-foreground mt-2">
            Monitor email deliverability and troubleshoot sending issues.
          </p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0">
          <RefreshCw className="w-4 h-4" />
          Refresh Logs
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Delivered</p>
            <p className="text-2xl font-bold font-heading">98.4%</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Bounced</p>
            <p className="text-2xl font-bold font-heading">1.2%</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold font-heading">0.4%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:max-w-md border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by recipient or subject..." 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <Button variant="ghost" size="sm" className="shrink-0 gap-2">
            <Filter className="w-4 h-4" /> Filter Status
          </Button>
          <Button variant="ghost" size="sm" className="shrink-0">Transactional</Button>
          <Button variant="ghost" size="sm" className="shrink-0">Campaigns</Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
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
            <tbody>
              {dummyLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      log.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      log.status === 'Bounced' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {log.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                      {log.status === 'Bounced' && <AlertCircle className="w-3 h-3" />}
                      {log.status === 'Failed' && <XCircle className="w-3 h-3" />}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col max-w-[300px]">
                      <span className="font-medium text-foreground truncate" title={log.subject}>{log.subject}</span>
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
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{log.type}</span>
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
      </div>
    </div>
  );
}
