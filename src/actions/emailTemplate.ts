'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/db';
import EmailTemplate from '@/models/EmailTemplate';
import { auth } from '@/auth';
import { Types } from 'mongoose';
import { serializeData } from '@/lib/serialize';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function createEmailTemplate(data: {
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables?: string[];
}) {
  try {
    const session = await requireAdmin();

    if (!data.name?.trim() || !data.subject?.trim() || !data.html?.trim()) {
      throw new Error('Name, subject, and HTML content are required');
    }

    await connectToDatabase();
    const existing = await EmailTemplate.findOne({ name: data.name });
    if (existing) {
      throw new Error('Template with this name already exists');
    }

    const template = await EmailTemplate.create({
      name: data.name,
      subject: data.subject,
      html: data.html,
      text: data.text || '',
      variables: data.variables || [],
      status: 'active',
      createdBy: session.user?.id,
    });

    revalidatePath('/admin/marketing/templates');
    return { ok: true, template: serializeData(template) };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function updateEmailTemplate(id: string, data: Partial<{ name: string; subject: string; html: string; text: string; variables: string[]; status: string }>) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid template ID');
    }

    await connectToDatabase();
    const template = await EmailTemplate.findByIdAndUpdate(id, data, { new: true });
    if (!template) {
      throw new Error('Template not found');
    }

    revalidatePath('/admin/marketing/templates');
    return { ok: true, template: serializeData(template) };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function deleteEmailTemplate(id: string) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid template ID');
    }

    await connectToDatabase();
    const template = await EmailTemplate.findByIdAndDelete(id);
    if (!template) {
      throw new Error('Template not found');
    }

    revalidatePath('/admin/marketing/templates');
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function duplicateEmailTemplate(id: string) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid template ID');
    }

    await connectToDatabase();
    const original = await EmailTemplate.findById(id);
    if (!original) {
      throw new Error('Template not found');
    }

    const newTemplate = await EmailTemplate.create({
      name: `${original.name} (copy)`,
      subject: original.subject,
      html: original.html,
      text: original.text,
      variables: original.variables,
      status: original.status,
      createdBy: session.user?.id,
    });

    revalidatePath('/admin/marketing/templates');
    return { ok: true, template: serializeData(newTemplate) };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function getEmailTemplates() {
  try {
    const session = await requireAdmin();

    await connectToDatabase();
    const templates = await EmailTemplate.find().sort({ createdAt: -1 }).lean();

    return { ok: true, templates: serializeData(templates) };
  } catch (err: any) {
    return { ok: false, error: err?.message, templates: [] };
  }
}

export async function getEmailTemplate(id: string) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid template ID');
    }

    await connectToDatabase();
    const template = await EmailTemplate.findById(id).lean();
    if (!template) {
      throw new Error('Template not found');
    }

    return { ok: true, template: serializeData(template) };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}

export async function toggleTemplateStatus(id: string) {
  try {
    const session = await requireAdmin();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid template ID');
    }

    await connectToDatabase();
    const template = await EmailTemplate.findById(id);
    if (!template) {
      throw new Error('Template not found');
    }

    template.status = template.status === 'active' ? 'inactive' : 'active';
    await template.save();

    revalidatePath('/admin/marketing/templates');
    return { ok: true, template: serializeData(template) };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}
