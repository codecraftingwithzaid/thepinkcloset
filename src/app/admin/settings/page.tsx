import React from 'react';
import { getSettings } from '@/actions/settings';
import { SettingsClient } from '@/components/admin/SettingsClient';

export default async function AdminSettingsPage() {
  const res = await getSettings();
  const settings = res?.success ? res.data : null;

  return <SettingsClient settings={settings} />;
}
