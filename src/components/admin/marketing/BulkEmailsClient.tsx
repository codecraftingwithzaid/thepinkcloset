'use client';

import React, { useState, useCallback } from 'react';
import {
  Users,
  Send,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  Clock,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/loaders';

const audienceSegments = [
  {
    id: 'all',
    name: 'All Subscribers',
    count: 24500,
    description: 'Everyone subscribed to your newsletter.',
  },
  {
    id: 'vip',
    name: 'VIP Customers',
    count: 3402,
    description: 'Customers with multiple purchases or high lifetime value.',
  },
  {
    id: 'inactive',
    name: 'Inactive Subscribers',
    count: 8420,
    description: 'Subscribers who haven\'t engaged in 6 months.',
  },
  {
    id: 'recent',
    name: 'Recent Subscribers',
    count: 5230,
    description: 'New subscribers from the last 30 days.',
  },
];

export function BulkEmailsClient() {
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendMethod, setSendMethod] = useState<'now' | 'schedule'>('now');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleSend = useCallback(async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject line');
      return;
    }
    if (!content.trim()) {
      toast.error('Please enter email content');
      return;
    }

    const confirmed = window.confirm(
      `Send to ${audienceSegments.find((s) => s.id === selectedSegment)?.count.toLocaleString()} recipients? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setIsSending(true);
      // Backend call would go here
      // await sendBulkEmail({ segment: selectedSegment, subject, content, scheduleTime })

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      toast.success(`Email${sendMethod === 'schedule' ? ' scheduled' : ''} successfully!`);
      setSubject('');
      setContent('');
    } catch (error) {
      toast.error('Failed to send email');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }, [selectedSegment, subject, content, sendMethod, scheduleTime]);

  const recipientCount = audienceSegments.find((s) => s.id === selectedSegment)?.count || 0;

  return (
    <div className="space-y-6">
      <FullScreenLoader isVisible={isSending} message="Sending emails..." />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Send Bulk Email</h1>
          <p className="text-muted-foreground mt-2">
            Select an audience and compose a message to send to multiple recipients.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Audience */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Step 1: Select Audience
              </CardTitle>
              <CardDescription>
                Choose which subscriber segment to send this email to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {audienceSegments.map((segment) => (
                  <button
                    key={segment.id}
                    onClick={() => setSelectedSegment(segment.id)}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${selectedSegment === segment.id
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
                      <Users
                        className={`w-4 h-4 ${selectedSegment === segment.id
                            ? 'text-primary'
                            : 'text-muted-foreground'
                          }`}
                      />
                      <span className="font-semibold text-sm">{segment.name}</span>
                    </div>
                    <div className="text-xl font-bold tracking-tight mb-1">
                      {segment.count.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {segment.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimated recipients:</span>
                <span className="font-bold text-lg text-primary">{recipientCount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Step 2: Compose Message
              </CardTitle>
              <CardDescription>Write the subject and body of your email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Huge Summer Sale - Up to 50% Off!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSending}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {subject.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your email content here. You can use HTML or plain text."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSending}
                  rows={10}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  You can use variables like {'{subscriber_name}'} and {'{subscriber_email}'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Send Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Audience</span>
                  <span className="font-medium text-right max-w-[150px] truncate">
                    {audienceSegments.find((s) => s.id === selectedSegment)?.name}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Recipients</span>
                  <span className="font-bold text-primary">{recipientCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Subject</span>
                  <span className="font-medium text-right max-w-[150px] truncate">
                    {subject || <span className="italic text-muted-foreground/50">Not set</span>}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 p-3 rounded-lg flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Bulk emails cannot be unsent once processed. Please review carefully.</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Send Method</Label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSendMethod('now')}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${sendMethod === 'now'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                      Send Now
                    </button>
                    <button
                      onClick={() => setSendMethod('schedule')}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${sendMethod === 'schedule'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                      <Clock className="w-3 h-3 inline mr-1" />
                      Schedule
                    </button>
                  </div>
                </div>

                {sendMethod === 'schedule' && (
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time" className="text-xs">
                      Schedule Time
                    </Label>
                    <Input
                      id="schedule-time"
                      type="datetime-local"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      disabled={isSending}
                    />
                  </div>
                )}
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleSend}
                disabled={isSending || !subject || !content}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {sendMethod === 'schedule' ? 'Schedule Email' : 'Send Email'}
                  </>
                )}
              </Button>

              <Button variant="ghost" className="w-full text-xs" disabled={isSending}>
                Send Test Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
