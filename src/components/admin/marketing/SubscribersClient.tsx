'use client';

import { useState, useEffect } from 'react';
import {
  Users, Search, Download, Filter, MoreVertical,
  Trash2, Mail, CheckCircle2, XCircle, BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/loaders/PageLoader';
import { toast } from 'sonner';
import { getSubscribers, deleteSubscriber, getSubscriberStats } from '@/actions/subscriber';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  source?: string;
  createdAt: string;
}

export function SubscribersClient() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, subscribed: 0, unsubscribed: 0, bounced: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [subRes, statsRes] = await Promise.all([
      getSubscribers(),
      getSubscriberStats(),
    ]);

    if (subRes.ok) {
      setSubscribers(subRes.subscribers);
    } else {
      toast.error(subRes.error || 'Failed to load subscribers');
    }

    if (statsRes.ok) {
      setStats(statsRes.stats);
    }
    setLoading(false);
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Delete ${email}?`)) return;
    const res = await deleteSubscriber(id);
    if (res.ok) {
      toast.success('Subscriber deleted');
      await loadData();
    } else {
      toast.error(res.error || 'Failed to delete');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Email', 'Name', 'Status', 'Source', 'Joined'],
      ...subscribers.map(s => [
        s.email,
        s.name || '',
        s.status,
        s.source || '',
        new Date(s.createdAt).toLocaleDateString(),
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground mt-2">
            Manage your email list, track engagement, and export your audience.
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Mini Analytics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Total Subscribers</span>
          </div>
          <span className="text-2xl font-bold font-heading">{stats.total.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border bg-card p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <span className="text-2xl font-bold font-heading">{stats.subscribed.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border bg-card p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">Unsubscribed</span>
          </div>
          <span className="text-2xl font-bold font-heading">{stats.unsubscribed.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border bg-card p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Bounced</span>
          </div>
          <span className="text-2xl font-bold font-heading">{stats.bounced.toLocaleString()}</span>
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
      </div>

      {/* Subscribers Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Date Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((sub) => (
                  <tr key={sub._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0 text-xs">
                          {(sub.name || sub.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm">{sub.name || 'N/A'}</span>
                          <span className="text-muted-foreground text-xs">{sub.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${sub.status === 'subscribed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          sub.status === 'unsubscribed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{sub.source || '-'}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Subscriber actions">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem disabled>
                            <Mail className="w-4 h-4 mr-2" /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => handleDelete(sub._id, sub.email)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
