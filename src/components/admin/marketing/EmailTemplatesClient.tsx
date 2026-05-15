'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Trash2, Copy, Edit2, Plus, Search, LayoutTemplate } from 'lucide-react';
import { PageLoader } from '@/components/loaders/PageLoader';
import {
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  duplicateEmailTemplate,
  toggleTemplateStatus,
} from '@/actions/emailTemplate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Template {
  _id: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export function EmailTemplatesClient() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    html: '',
    text: '',
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const res = await getEmailTemplates();
    if (res.ok) {
      setTemplates(res.templates as Template[]);
    } else {
      toast.error(res.error || 'Failed to load templates');
    }
    setLoading(false);
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.html.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      name: formData.name,
      subject: formData.subject,
      html: formData.html,
      text: formData.text,
    };

    let res;
    if (editingId) {
      res = await updateEmailTemplate(editingId, payload);
    } else {
      res = await createEmailTemplate(payload);
    }

    if (res.ok) {
      toast.success(editingId ? 'Template updated' : 'Template created');
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', subject: '', html: '', text: '' });
      await loadTemplates();
    } else {
      toast.error(res.error || 'Failed to save template');
    }
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      html: template.html,
      text: template.text || '',
    });
    setEditingId(template._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    const res = await deleteEmailTemplate(id);
    if (res.ok) {
      toast.success('Template deleted');
      await loadTemplates();
    } else {
      toast.error(res.error || 'Failed to delete template');
    }
  };

  const handleDuplicate = async (id: string) => {
    const res = await duplicateEmailTemplate(id);
    if (res.ok) {
      toast.success('Template duplicated');
      await loadTemplates();
    } else {
      toast.error(res.error || 'Failed to duplicate template');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const res = await toggleTemplateStatus(id);
    if (res.ok) {
      toast.success('Status updated');
      await loadTemplates();
    } else {
      toast.error(res.error || 'Failed to update status');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground mt-2">
            Design and manage reusable templates for your campaigns and automated flows.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger
            onClick={() => {
              setFormData({ name: '', subject: '', html: '', text: '' });
              setEditingId(null);
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Template' : 'Create Template'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Template Name
                </label>
                <Input
                  placeholder="e.g., Welcome Email"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject Line
                </label>
                <Input
                  placeholder="e.g., Welcome to our store!"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  HTML Content
                </label>
                <textarea
                  placeholder="HTML email content..."
                  rows={10}
                  value={formData.html}
                  onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-background text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Plain Text (Optional)
                </label>
                <textarea
                  placeholder="Plain text fallback..."
                  rows={6}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-background text-sm font-mono"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
          <div key={template._id} className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="h-32 bg-muted/30 relative border-b flex items-center justify-center p-4">
              <div className="text-center text-muted-foreground">
                <LayoutTemplate className="w-8 h-8 opacity-50 mx-auto mb-2" />
                <span className="text-xs font-medium">Template</span>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-2">
                <h3 className="font-semibold tracking-tight text-lg leading-tight line-clamp-1" title={template.name}>
                  {template.name}
                </h3>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p className="line-clamp-1" title={template.subject}>
                  {template.subject}
                </p>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${template.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                    {template.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(template)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDuplicate(template._id)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Copy className="h-3 w-3" /> Copy
                </Button>
                <Button
                  size="sm"
                  variant={template.status === 'active' ? 'outline' : 'default'}
                  onClick={() => handleToggleStatus(template._id)}
                  className="text-xs"
                >
                  {template.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(template._id)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
            <LayoutTemplate className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No templates found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              {searchTerm ? 'No templates match your search. Try adjusting your filters.' : 'No templates yet. Create your first one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
