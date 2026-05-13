'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Trash2, Copy, Edit2, Plus } from 'lucide-react';
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

export default function EmailTemplateClient() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
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
      setTemplates(res.templates);
    } else {
      toast.error(res.error || 'Failed to load templates');
    }
    setLoading(false);
  };

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

  const handleOpenModal = (template?: Template) => {
    if (template) {
      handleEdit(template);
    } else {
      setFormData({ name: '', subject: '', html: '', text: '' });
      setEditingId(null);
      setIsModalOpen(true);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Templates</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage email templates for campaigns</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Template' : 'Create Template'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Template Name
                </label>
                <Input
                  placeholder="e.g., Welcome Email"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Subject Line
                </label>
                <Input
                  placeholder="e.g., Welcome to our store!"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  HTML Content
                </label>
                <textarea
                  placeholder="HTML email content..."
                  rows={10}
                  value={formData.html}
                  onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Plain Text (Optional)
                </label>
                <textarea
                  placeholder="Plain text fallback..."
                  rows={6}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono"
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
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No email templates yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.subject}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    template.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {template.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(template)}
                  className="flex items-center gap-1"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDuplicate(template._id)}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" /> Duplicate
                </Button>
                <Button
                  size="sm"
                  variant={template.status === 'active' ? 'outline' : 'default'}
                  onClick={() => handleToggleStatus(template._id)}
                >
                  {template.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(template._id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
