'use client';

import React, { useState, type ReactNode } from 'react';
import { signOut } from 'next-auth/react';
import { startGlobalLoading, stopGlobalLoading } from '@/store/useLoadingStore';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

type LogoutButtonProps = {
    children: ReactNode;
    className?: string;
    confirmMessage?: string;
    callbackUrl?: string;
};

export function LogoutButton({
    children,
    className,
    confirmMessage = 'Are you sure you want to log out?',
    callbackUrl = '/login',
}: LogoutButtonProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            startGlobalLoading();
            await signOut({ callbackUrl });
        } finally {
            setIsLoading(false);
            stopGlobalLoading();
        }
    };

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className={className}>
                {children}
            </button>
            <ConfirmationDialog
                open={open}
                onOpenChange={setOpen}
                title="Confirm logout"
                description={confirmMessage}
                confirmText="Log out"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleLogout}
                isLoading={isLoading}
            />
        </>
    );
}