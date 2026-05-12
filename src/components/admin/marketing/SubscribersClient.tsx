'use client';

import React, { useState } from 'react';
import { 
  Users, Search, Download, Filter, MoreVertical, 
  Trash2, Mail, CheckCircle2, XCircle, BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const dummySubscribers = [
  { id: '1', email: 'sarah.jenkins@example.com', name: 'Sarah Jenkins', source: 'Checkout', status: 'Subscribed', joined: 'Aug 12, 2024', engagement: 'High' },
  { id: '2', email: 'mike.ross@example.com', name: 'Mike Ross', source: 'Popup', status: 'Subscribed', joined: 'Aug 10, 2024', engagement: 'Medium' },
  { id: '3', email: 'emily.blunt@example.com', name: 'Emily Blunt', source: 'Footer', status: 'Unsubscribed', joined: 'Jul 25, 2024', engagement: 'Low' },
  { id: '4', email: 'john.doe@example.com', name: 'John Doe', source: 'Checkout', status: 'Subscribed', joined: 'Jul 18, 2024', engagement: 'High' },
  { id: '5', email: 'jane.smith@example.com', name: 'Jane Smith', source: 'Landing Page', status: 'Bounced', joined: 'Jun 05, 2024', engagement: 'None' },
];

export function SubscribersClient() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground mt-2">
            Manage your email list, track engagement, and export your audience.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Mini Analytics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Total Subscribers</span>
          </div>
          <span className="text-2xl font-bold font-heading">24,500</span>
        </div>
        <div className="rounded-xl border bg-card p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <span className="text-2xl font-bold font-heading">21,240</span>
        </div>
        <div className="rounded-xl border bg-card p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">Unsubscribed</span>
          </div>
          <span className="text-2xl font-bold font-heading">1,820</span>
        </div>
        <div className="rounded-xl border bg-card p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Avg. Engagement</span>
          </div>
          <span className="text-2xl font-bold font-heading">42%</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:max-w-sm border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by email or name..." 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Subscriber</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Engagement</th>
                <th className="px-6 py-4 font-medium">Date Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummySubscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">
                        {sub.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{sub.name}</span>
                        <span className="text-muted-foreground text-xs">{sub.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'Subscribed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      sub.status === 'Unsubscribed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{sub.source}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${
                      sub.engagement === 'High' ? 'text-emerald-500' :
                      sub.engagement === 'Medium' ? 'text-blue-500' :
                      'text-muted-foreground'
                    }`}>
                      {sub.engagement}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{sub.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Subscriber
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
