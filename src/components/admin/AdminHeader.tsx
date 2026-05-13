'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Moon, Sun, User, Settings, Lock, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from './SidebarContext';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { startGlobalLoading, useLoadingStore } from '@/store/useLoadingStore';

export function AdminHeader() {
  const { setTheme, theme } = useTheme();
  const { toggle } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex items-center relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search anything..."
              className="pl-9 bg-muted/50 border-none rounded-full focus-visible:ring-1 h-9 w-[300px]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Sun className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative rounded-full ml-2 p-0 h-9 w-9">
            <Avatar className="h-9 w-9 border border-border/50">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => { if (useLoadingStore.getState().isLoading()) return; toggle() }}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-9 bg-muted/50 border-none rounded-full focus-visible:ring-1 h-9 w-[300px] transition-all focus:w-[400px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground hover:text-foreground" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground hover:text-foreground" />
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
          <DropdownMenuTrigger
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 px-2 pt-2">
              <div className="flex items-center justify-between px-1.5 py-1 text-xs font-medium text-muted-foreground">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <DropdownMenuSeparator className="my-2" />
            </div>
            <div className="flex flex-col gap-1 p-1">
              <button className="text-sm p-3 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background">
                <span className="font-semibold block">New Order #LX-10492</span>
                <span className="text-muted-foreground text-xs">Customer placed a new order</span>
                <span className="text-muted-foreground text-xs block mt-1">2 minutes ago</span>
              </button>
              <button className="text-sm p-3 rounded-md hover:bg-muted/50 transition-colors text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background">
                <span className="font-semibold block">New User Registered</span>
                <span className="text-muted-foreground text-xs">A new customer signed up</span>
                <span className="text-muted-foreground text-xs block mt-1">1 hour ago</span>
              </button>
              <button className="text-sm p-3 rounded-md hover:bg-muted/50 transition-colors text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background">
                <span className="font-semibold block">Low Stock Alert</span>
                <span className="text-muted-foreground text-xs">Product stock is running low</span>
                <span className="text-muted-foreground text-xs block mt-1">3 hours ago</span>
              </button>
            </div>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="text-center justify-center text-primary cursor-pointer py-2 text-sm">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="User menu"
          >
            <Avatar className="h-9 w-9 border border-border/50 transition-transform hover:scale-105 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <div className="flex flex-col space-y-1 py-2">
                <p className="text-sm font-semibold leading-none">Super Admin</p>
                <p className="text-xs leading-none text-muted-foreground">admin@luxeboutique.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="p-1">
              <LogoutButton className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-destructive hover:bg-destructive/10 rounded-md text-sm cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-destructive">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </LogoutButton>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
