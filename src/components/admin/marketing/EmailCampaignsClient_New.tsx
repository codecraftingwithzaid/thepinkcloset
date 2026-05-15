'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/loaders/PageLoader';
import { toast } from 'sonner';
import { getCampaigns, deleteCampaign, sendCampaign } from '@/actions/campaign';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Campaign {
  _id: string;
  name: string;
  subject: string;
  status: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
}

export function EmailCampaignsClient() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const res = await getCampaigns();
    if (res.ok) {
      setCampaigns(res.campaigns as Campaign[]);
    } else {
      toast.error(res.error || 'Failed to load campaigns');
    }
    setLoading(false);
  };

  const filtered = campaigns.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    const res = await deleteCampaign(id);
    if (res.ok) {
      toast.success('Campaign deleted');
      await loadCampaigns();
    } else {
      toast.error(res.error);
    }
  };

  const handleSend = async (id: string) => {
    if (!confirm('Send this campaign now?')) return;
    const res = await sendCampaign(id, true);
    if (res.ok) {
      toast.success('Campaign sent');
      await loadCampaigns();
    } else {
      toast.error(res.error);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Campaigns</h1>
          <p className="text-muted-foreground mt-1">Create and manage email campaigns</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Campaign creation UI coming soon</p>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 bg-card border rounded-lg px-3 py-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          className="border-0 bg-transparent focus-visible:ring-0 p-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No campaigns found</div>
        ) : (
          filtered.map(c => (
            <div key={c._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.subject}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${c.status === 'sent' ? 'bg-green-100 text-green-800' : c.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                  {c.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {c.totalRecipients} recipients • {c.sentCount} sent • {c.failedCount} failed
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  {c.status === 'draft' && (
                    <Button size="sm" onClick={() => handleSend(c._id)}>
                      <Send className="h-3 w-3 mr-1" /> Send
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(c._id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
