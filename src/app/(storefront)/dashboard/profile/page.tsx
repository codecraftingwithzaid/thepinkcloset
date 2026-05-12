import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';

export default async function CustomerProfilePage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading mb-2">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your personal information and password.</p>
      </div>

      <div className="max-w-2xl">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue={session?.user?.name?.split(' ')[0] || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue={session?.user?.name?.split(' ').slice(1).join(' ') || ''} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={session?.user?.email || ''} readOnly className="bg-muted" />
            <p className="text-xs text-muted-foreground">To change your email address, please contact support.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>

          <div className="pt-4 border-t border-border mt-8">
            <h3 className="text-lg font-bold font-heading mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button className="rounded-full px-8">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
