'use client';

import React, { useState } from 'react';
import { 
  Users, Send, Search, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const audienceSegments = [
  { id: 'all', name: 'All Customers', count: 15204, description: 'Everyone who has made a purchase or created an account.' },
  { id: 'vip', name: 'VIP Customers', count: 3402, description: 'Customers with more than 3 orders or high lifetime value.' },
  { id: 'newsletter', name: 'Newsletter Subscribers', count: 24500, description: 'All active newsletter subscribers.' },
  { id: 'inactive', name: 'Inactive Customers', count: 8420, description: 'Customers who haven\'t purchased in the last 6 months.' },
];

export function BulkEmailsClient() {
  const [selectedSegment, setSelectedSegment] = useState<string>('newsletter');
  const [subject, setSubject] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Send Bulk Email</h1>
        <p className="text-muted-foreground mt-2">
          Select an audience segment and compose your message to send in bulk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Audience */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 font-heading">1. Select Audience</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {audienceSegments.map((segment) => (
                <div 
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment.id)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedSegment === segment.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
                  }`}
                >
                  {selectedSegment === segment.id && (
                    <div className="absolute top-3 right-3 text-primary">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <Users className={`w-4 h-4 ${selectedSegment === segment.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-semibold text-foreground">{segment.name}</span>
                  </div>
                  <div className="text-2xl font-bold tracking-tight mb-1">{segment.count.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground leading-snug">{segment.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated recipients:</span>
              <span className="font-bold text-lg text-primary">
                {audienceSegments.find(s => s.id === selectedSegment)?.count.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 font-heading">2. Compose Message</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input 
                  id="subject" 
                  placeholder="e.g., Huge Summer Sale - Up to 50% Off!" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Email Content</Label>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <FileText className="w-3 h-3 mr-1" /> Use Template
                  </Button>
                </div>
                {/* Rich Text Editor Placeholder */}
                <div className="min-h-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background flex flex-col">
                  {/* Fake Toolbar */}
                  <div className="flex items-center gap-1 border-b pb-2 mb-2 text-muted-foreground">
                    <span className="font-bold px-2 cursor-pointer hover:text-foreground">B</span>
                    <span className="italic px-2 cursor-pointer hover:text-foreground">I</span>
                    <span className="underline px-2 cursor-pointer hover:text-foreground">U</span>
                    <span className="px-2 cursor-pointer hover:text-foreground">Link</span>
                    <span className="px-2 cursor-pointer hover:text-foreground">Image</span>
                    <div className="flex-1" />
                    <span className="text-xs">Insert Variable: {'{{name}}'}</span>
                  </div>
                  {/* Fake Editor Area */}
                  <textarea 
                    className="flex-1 resize-none bg-transparent outline-none p-1 placeholder:text-muted-foreground/50"
                    placeholder="Write your email content here..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 font-heading">Send Summary</h2>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Audience</span>
                <span className="font-medium text-right max-w-[150px] truncate">
                  {audienceSegments.find(s => s.id === selectedSegment)?.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Recipients</span>
                <span className="font-medium">
                  {audienceSegments.find(s => s.id === selectedSegment)?.count.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Subject</span>
                <span className="font-medium text-right max-w-[150px] truncate">
                  {subject || <span className="italic text-muted-foreground/50">Not set</span>}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 p-3 rounded-lg flex items-start gap-2 text-sm mb-6">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Please ensure your audience is correct. Bulk emails cannot be unsent once processed.</p>
            </div>

            <div className="space-y-3">
              <Button className="w-full gap-2" size="lg">
                <Send className="w-4 h-4" /> Send Now
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Schedule for Later
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground" size="sm">
                Send Test Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
