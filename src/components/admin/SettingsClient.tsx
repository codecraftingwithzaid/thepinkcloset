'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateSettings } from '@/actions/settings';
import { Loader2, Save } from 'lucide-react';

type SettingsFormModel = {
    _id: string;
    storeName?: string;
    logo?: string;
    favicon?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    paymentSettings?: {
        razorpayKeyId?: string;
        razorpaySecret?: string;
        stripePublishableKey?: string;
        stripeSecretKey?: string;
        enableCod?: boolean;
        enableRazorpay?: boolean;
        enableStripe?: boolean;
    };
    shippingSettings?: {
        shippingCharge?: number;
        freeShippingThreshold?: number;
        deliveryZones?: string[];
    };
    seoSettings?: {
        defaultTitle?: string;
        defaultDescription?: string;
        keywords?: string;
        openGraphImage?: string;
        googleAnalyticsId?: string;
    };
    emailSettings?: {
        smtpHost?: string;
        smtpPort?: number;
        smtpUser?: string;
        smtpPassword?: string;
        senderEmail?: string;
        senderName?: string;
    };
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        pinterest?: string;
        youtube?: string;
    };
};

export function SettingsClient({ settings }: { settings: SettingsFormModel }) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const res = await updateSettings(settings._id, new FormData(e.currentTarget));
        if (res?.success) {
            toast.success('Settings updated successfully');
        } else {
            toast.error('Failed to update settings', { description: res?.error });
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Store Settings</h2>
                <p className="text-muted-foreground mt-1">Manage global configuration for your boutique.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>Basic info about your store.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Store Name</Label><Input name="storeName" defaultValue={settings?.storeName} required /></div>
                            <div className="space-y-2"><Label>Contact Email</Label><Input name="contactEmail" type="email" defaultValue={settings?.contactEmail} /></div>
                            <div className="space-y-2"><Label>Contact Phone</Label><Input name="contactPhone" defaultValue={settings?.contactPhone} /></div>
                            <div className="space-y-2"><Label>Address</Label><Input name="address" defaultValue={settings?.address} /></div>
                            <div className="space-y-2"><Label>Logo URL</Label><Input name="logo" defaultValue={settings?.logo} /></div>
                            <div className="space-y-2"><Label>Favicon URL</Label><Input name="favicon" defaultValue={settings?.favicon} /></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Payment Configuration</CardTitle>
                        <CardDescription>Manage Razorpay, Stripe, and COD.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="razorpayKeyId" placeholder="Razorpay Key ID" defaultValue={settings?.paymentSettings?.razorpayKeyId} />
                            <Input name="razorpaySecret" placeholder="Razorpay Secret" defaultValue={settings?.paymentSettings?.razorpaySecret} />
                            <Input name="stripePublishableKey" placeholder="Stripe Publishable Key" defaultValue={settings?.paymentSettings?.stripePublishableKey} />
                            <Input name="stripeSecretKey" placeholder="Stripe Secret Key" defaultValue={settings?.paymentSettings?.stripeSecretKey} />
                        </div>
                        <div className="flex flex-wrap gap-6 pt-2">
                            <label className="flex items-center gap-2"><input type="checkbox" name="enableRazorpay" value="true" defaultChecked={settings?.paymentSettings?.enableRazorpay ?? true} /> <span className="text-sm">Enable Razorpay</span></label>
                            <label className="flex items-center gap-2"><input type="checkbox" name="enableStripe" value="true" defaultChecked={settings?.paymentSettings?.enableStripe} /> <span className="text-sm">Enable Stripe</span></label>
                            <label className="flex items-center gap-2"><input type="checkbox" name="enableCod" value="true" defaultChecked={settings?.paymentSettings?.enableCod ?? true} /> <span className="text-sm">Enable COD</span></label>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Shipping Settings</CardTitle>
                        <CardDescription>Define shipping charges and delivery zones.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="shippingCharge" type="number" step="0.01" defaultValue={settings?.shippingSettings?.shippingCharge} placeholder="Shipping charge" />
                            <Input name="freeShippingThreshold" type="number" step="0.01" defaultValue={settings?.shippingSettings?.freeShippingThreshold} placeholder="Free shipping threshold" />
                        </div>
                        <Input name="deliveryZones" defaultValue={(settings?.shippingSettings?.deliveryZones || []).join(', ')} placeholder="Delivery zones comma separated" />
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>SEO & Marketing</CardTitle>
                        <CardDescription>Search and social sharing defaults.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input name="defaultTitle" defaultValue={settings?.seoSettings?.defaultTitle} placeholder="Default meta title" />
                        <Input name="defaultDescription" defaultValue={settings?.seoSettings?.defaultDescription} placeholder="Default meta description" />
                        <Input name="keywords" defaultValue={settings?.seoSettings?.keywords} placeholder="Keywords comma separated" />
                        <Input name="openGraphImage" defaultValue={settings?.seoSettings?.openGraphImage} placeholder="OpenGraph image URL" />
                        <Input name="googleAnalyticsId" defaultValue={settings?.seoSettings?.googleAnalyticsId} placeholder="Google Analytics ID" />
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Email & Social</CardTitle>
                        <CardDescription>SMTP and social profile links.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="smtpHost" defaultValue={settings?.emailSettings?.smtpHost} placeholder="SMTP host" />
                            <Input name="smtpPort" type="number" defaultValue={settings?.emailSettings?.smtpPort} placeholder="SMTP port" />
                            <Input name="smtpUser" defaultValue={settings?.emailSettings?.smtpUser} placeholder="SMTP username" />
                            <Input name="smtpPassword" type="password" defaultValue={settings?.emailSettings?.smtpPassword} placeholder="SMTP password" />
                            <Input name="senderEmail" defaultValue={settings?.emailSettings?.senderEmail} placeholder="Sender email" />
                            <Input name="senderName" defaultValue={settings?.emailSettings?.senderName} placeholder="Sender name" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="instagram" defaultValue={settings?.socialLinks?.instagram} placeholder="Instagram" />
                            <Input name="facebook" defaultValue={settings?.socialLinks?.facebook} placeholder="Facebook" />
                            <Input name="twitter" defaultValue={settings?.socialLinks?.twitter} placeholder="Twitter/X" />
                            <Input name="pinterest" defaultValue={settings?.socialLinks?.pinterest} placeholder="Pinterest" />
                            <Input name="youtube" defaultValue={settings?.socialLinks?.youtube} placeholder="YouTube" />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Settings
                    </Button>
                </div>
            </form>
        </div>
    );
}
