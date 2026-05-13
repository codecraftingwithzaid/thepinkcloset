'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Send, Trash2, Eye, Copy, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageLoader } from '@/components/loaders/PageLoader';
import { FullScreenLoader } from '@/components/loaders/FullScreenLoader';
import { toast } from 'sonner';
import {
    getCampaigns,
    deleteCampaign,
    sendCampaign,
    createCampaign,
} from '@/actions/campaign';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Campaign {
    _id: string;
    name: string;
    subject: string;
    status: string;
    totalRecipients: number;
    sentCount: number;
    failedCount: number;
    createdAt: string;
    html?: string;
    templateId?: string;
}

export function EmailCampaignsClient() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        html: '',
    });

    const loadCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getCampaigns();
            if (res.ok) {
                setCampaigns((res.campaigns || []) as Campaign[]);
            } else {
                toast.error(res.error || 'Failed to load campaigns');
            }
        } catch (error) {
            toast.error('Error loading campaigns');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCampaigns();
    }, [loadCampaigns]);

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.subject || !formData.html) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setIsSending(true);
            const res = await createCampaign({
                name: formData.name,
                subject: formData.subject,
                html: formData.html,
                audience: { type: 'all_subscribers' },
            });

            if (res.ok) {
                toast.success('Campaign created successfully');
                setFormData({ name: '', subject: '', html: '' });
                setIsModalOpen(false);
                await loadCampaigns();
            } else {
                toast.error(res.error || 'Failed to create campaign');
            }
        } catch (error) {
            toast.error('Error creating campaign');
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    const filtered = campaigns.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Delete campaign "${name}"?`)) return;
        try {
            const res = await deleteCampaign(id);
            if (res.ok) {
                toast.success('Campaign deleted');
                await loadCampaigns();
            } else {
                toast.error(res.error || 'Failed to delete campaign');
            }
        } catch (error) {
            toast.error('Error deleting campaign');
            console.error(error);
        }
    };

    const handleSend = async (id: string) => {
        if (!window.confirm('Send this campaign now? This cannot be undone.')) return;
        try {
            setIsSending(true);
            const res = await sendCampaign(id, true);
            if (res.ok) {
                toast.success('Campaign sent successfully');
                await loadCampaigns();
            } else {
                toast.error(res.error || 'Failed to send campaign');
            }
        } catch (error) {
            toast.error('Error sending campaign');
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'sent':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'draft':
                return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const sentPercentage = (sentCount: number, total: number) => {
        return total > 0 ? Math.round((sentCount / total) * 100) : 0;
    };

    if (loading) return <PageLoader variant="standard" showText={true} />;

    return (
        <div className="space-y-6">
            <FullScreenLoader isVisible={isSending} message="Creating campaign..." />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Email Campaigns</h1>
                    <p className="text-muted-foreground mt-2">
                        Create, manage, and send targeted email campaigns to your subscribers.
                    </p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> New Campaign
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <DialogHeader>
                            <DialogTitle>Create New Campaign</DialogTitle>
                            <DialogDescription>
                                Set up a new email campaign with subject, content, and recipient settings.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateCampaign} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="campaign-name">Campaign Name</Label>
                                <Input
                                    id="campaign-name"
                                    placeholder="e.g., Summer Sale 2024"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={isSending}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="campaign-subject">Email Subject</Label>
                                <Input
                                    id="campaign-subject"
                                    placeholder="e.g., Summer Sale - 50% Off Everything!"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    disabled={isSending}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="campaign-content">Email Content (HTML)</Label>
                                <Textarea
                                    id="campaign-content"
                                    placeholder="Paste your HTML email content here..."
                                    value={formData.html}
                                    onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                                    disabled={isSending}
                                    rows={12}
                                    className="font-mono text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    You can use variables like {'{name}'}, {'{email}'}, {'{firstName}'} in your content.
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg flex gap-2 text-sm text-blue-800 dark:text-blue-400">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>
                                    Create your campaign as a draft first. You can review and edit it before
                                    sending to your subscribers.
                                </p>
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSending}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSending}>
                                    {isSending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Campaign'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search campaigns..."
                    className="border-0 bg-transparent focus-visible:ring-0 p-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground text-center">
                            {campaigns.length === 0
                                ? 'No campaigns yet. Create your first campaign to get started.'
                                : 'No campaigns match your search.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((campaign) => (
                        <Card key={campaign._id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                                        <CardDescription className="mt-1">{campaign.subject}</CardDescription>
                                    </div>
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${getStatusColor(
                                            campaign.status
                                        )}`}
                                    >
                                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Recipients</p>
                                            <p className="text-xl font-bold">{campaign.totalRecipients}</p>
                                        </div>
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                                            <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Sent</p>
                                            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                                                {campaign.sentCount}
                                            </p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                                                {sentPercentage(campaign.sentCount, campaign.totalRecipients)}%
                                            </p>
                                        </div>
                                        <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                                            <p className="text-xs text-red-700 dark:text-red-400 mb-1">Failed</p>
                                            <p className="text-xl font-bold text-red-700 dark:text-red-400">
                                                {campaign.failedCount}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">
                                            Created {new Date(campaign.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" title="View campaign">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" title="Duplicate campaign">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            {campaign.status === 'draft' && (
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => handleSend(campaign._id)}
                                                    disabled={isSending}
                                                    title="Send campaign"
                                                >
                                                    <Send className="h-4 w-4 mr-1" />
                                                    Send
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(campaign._id, campaign.name)}
                                                disabled={isSending}
                                                title="Delete campaign"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
