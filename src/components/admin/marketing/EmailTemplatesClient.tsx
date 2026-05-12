'use client';

import React, { useState } from 'react';
import { 
  LayoutTemplate, Plus, Search, MoreVertical, 
  Edit3, Copy, Trash2, Eye, Variable
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

const dummyTemplates = [
  { id: '1', name: 'Welcome Email (New Customer)', subject: 'Welcome to Luxe! Here is 10% off', type: 'Transactional', lastUpdated: '2 days ago' },
  { id: '2', name: 'Order Confirmation', subject: 'Order #{{order_id}} Confirmed', type: 'Transactional', lastUpdated: '1 week ago' },
  { id: '3', name: 'Abandoned Cart Reminder', subject: 'You left something behind...', type: 'Flow', lastUpdated: '3 days ago' },
  { id: '4', name: 'Spring Sale Announcement', subject: 'Spring into Style: Up to 50% Off!', type: 'Campaign', lastUpdated: '1 month ago' },
  { id: '5', name: 'Shipping Update', subject: 'Your order is on the way!', type: 'Transactional', lastUpdated: '2 weeks ago' },
];

export function EmailTemplatesClient() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = dummyTemplates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground mt-2">
            Design and manage reusable templates for your campaigns and automated flows.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-card border rounded-lg px-3 py-2 max-w-md shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search templates..." 
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
            {/* Template Preview Area (Placeholder) */}
            <div className="h-40 bg-muted/30 relative border-b flex items-center justify-center p-4">
              <div className="w-full max-w-[200px] h-full bg-background border rounded shadow-sm opacity-80 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-muted-foreground gap-2">
                <LayoutTemplate className="w-8 h-8 opacity-50" />
                <span className="text-xs font-medium">Template Preview</span>
              </div>
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="h-8 w-8 shadow-sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Template Details */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-semibold font-heading tracking-tight text-lg leading-tight line-clamp-1" title={template.name}>
                  {template.name}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Edit3 className="w-4 h-4 mr-2" /> Edit Template
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 line-clamp-1" title={template.subject}>
                  <Variable className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{template.subject}</span>
                </p>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                    template.type === 'Transactional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    template.type === 'Campaign' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {template.type}
                  </span>
                  <span className="text-xs">Updated {template.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
            <LayoutTemplate className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No templates found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              We couldn't find any templates matching your search. Try adjusting your filters or create a new template.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
