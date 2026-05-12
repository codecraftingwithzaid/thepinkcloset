'use client';

import React from 'react';
import { 
  Send, Plus, Search, MoreVertical, 
  Calendar, Clock, CheckCircle2, PauseCircle,
  BarChart2, Edit2, Users
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

const campaigns = [
  { 
    id: '1', 
    name: 'Summer Sale Kickoff', 
    status: 'Completed', 
    sentDate: 'Aug 15, 2024', 
    audience: 'All Customers (15,204)',
    stats: { sent: '15.2k', openRate: '48.2%', clickRate: '12.4%', revenue: '$4,250' }
  },
  { 
    id: '2', 
    name: 'New Collection: Fall Basics', 
    status: 'Scheduled', 
    sentDate: 'Sep 01, 2024 10:00 AM', 
    audience: 'VIP Members (3,402)',
    stats: null
  },
  { 
    id: '3', 
    name: 'Weekend Flash Sale', 
    status: 'Draft', 
    sentDate: '-', 
    audience: 'Unengaged (8,420)',
    stats: null
  },
  { 
    id: '4', 
    name: 'Welcome Series - Email 1', 
    status: 'Active', 
    sentDate: 'Ongoing', 
    audience: 'New Subscribers',
    stats: { sent: '2.4k', openRate: '65.1%', clickRate: '22.4%', revenue: '$1,850' }
  },
];

export function EmailCampaignsClient() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Create, schedule, and track the performance of your email marketing campaigns.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:max-w-sm border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search campaigns..." 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Button variant="secondary" size="sm" className="shrink-0">All Campaigns</Button>
          <Button variant="ghost" size="sm" className="shrink-0">Drafts</Button>
          <Button variant="ghost" size="sm" className="shrink-0">Scheduled</Button>
          <Button variant="ghost" size="sm" className="shrink-0">Completed</Button>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Campaign Details</th>
                <th className="px-6 py-4 font-medium">Status & Timing</th>
                <th className="px-6 py-4 font-medium">Performance</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-base mb-1">{campaign.name}</span>
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        Target: {campaign.audience}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                        campaign.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        campaign.status === 'Active' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {campaign.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {campaign.status === 'Scheduled' && <Clock className="w-3 h-3" />}
                        {campaign.status === 'Active' && <Send className="w-3 h-3" />}
                        {campaign.status === 'Draft' && <Edit2 className="w-3 h-3" />}
                        {campaign.status}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {campaign.sentDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {campaign.stats ? (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Open Rate</span>
                          <span className="font-semibold text-foreground text-sm">{campaign.stats.openRate}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Click Rate</span>
                          <span className="font-semibold text-foreground text-sm">{campaign.stats.clickRate}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{campaign.stats.revenue}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Sent</span>
                          <span className="font-medium">{campaign.stats.sent}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">No data yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {campaign.status === 'Draft' && (
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Draft
                          </DropdownMenuItem>
                        )}
                        {campaign.status === 'Scheduled' && (
                          <DropdownMenuItem>
                            <PauseCircle className="w-4 h-4 mr-2" /> Pause/Reschedule
                          </DropdownMenuItem>
                        )}
                        {campaign.stats && (
                          <DropdownMenuItem>
                            <BarChart2 className="w-4 h-4 mr-2" /> View Report
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          Delete Campaign
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
