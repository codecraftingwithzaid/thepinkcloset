'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Users, FolderTree, FileText, 
  Settings, Tags, Image as ImageIcon, Layers, Star, Mail, Bell, LogOut,
  Target, LayoutTemplate, Send, Mails, History, LineChart, ChevronDown
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type SidebarItem = {
  name: string;
  href?: string;
  icon: any;
  submenus?: { name: string; href: string; icon: any }[];
};

const sidebarLinks: SidebarItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Orders', href: '/admin/orders', icon: FileText },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Collections', href: '/admin/collections', icon: Layers },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Blogs / CMS', href: '/admin/blogs', icon: FileText },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  {
    name: 'Marketing',
    icon: Target,
    submenus: [
      { name: 'Dashboard', href: '/admin/marketing', icon: LayoutDashboard },
      { name: 'Email Templates', href: '/admin/marketing/templates', icon: LayoutTemplate },
      { name: 'Email Campaigns', href: '/admin/marketing/campaigns', icon: Send },
      { name: 'Bulk Emails', href: '/admin/marketing/bulk-emails', icon: Mails },
      { name: 'Newsletter', href: '/admin/marketing/newsletter', icon: Mail },
      { name: 'Subscribers', href: '/admin/marketing/subscribers', icon: Users },
      { name: 'Notifications', href: '/admin/marketing/notifications', icon: Bell },
      { name: 'Coupons & Promos', href: '/admin/marketing/coupons', icon: Tags },
      { name: 'Email Logs', href: '/admin/marketing/logs', icon: History },
      { name: 'Analytics', href: '/admin/marketing/analytics', icon: LineChart },
    ],
  },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Marketing': pathname.startsWith('/admin/marketing')
  });

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-[70px] xl:w-64 flex-col border-r bg-card transition-all duration-300 hidden md:flex">
      <div className="flex h-16 items-center justify-center xl:justify-start xl:px-6 border-b border-border/50">
        <span className="font-heading font-bold text-2xl tracking-wider text-primary hidden xl:block">LUXE</span>
        <span className="font-heading font-bold text-2xl tracking-wider text-primary xl:hidden">L</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3 custom-scrollbar">
        {sidebarLinks.map((link) => {
          if (link.submenus) {
            const isParentActive = link.submenus.some(sub => pathname === sub.href || pathname.startsWith(`${sub.href}/`));
            const isExpanded = expandedMenus[link.name];

            return (
              <div key={link.name} className="flex flex-col gap-1">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleSubmenu(link.name)}
                      className={`flex items-center justify-between w-full rounded-xl px-3 py-2.5 transition-all duration-200 group relative overflow-hidden ${
                        isParentActive && !isExpanded
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isParentActive && !isExpanded && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                        <link.icon className={`w-5 h-5 shrink-0 ${isParentActive && !isExpanded ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                        <span className="hidden xl:block text-sm tracking-wide">{link.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 shrink-0 hidden xl:block transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="xl:hidden font-medium border-border/50 bg-popover/95 backdrop-blur-sm">
                    {link.name} (Expandable)
                  </TooltipContent>
                </Tooltip>

                {isExpanded && (
                  <div className="flex flex-col gap-1 xl:pl-9 hidden xl:flex animate-in slide-in-from-top-2 duration-200">
                    {link.submenus.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 group relative ${
                            isSubActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          }`}
                        >
                          {isSubActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                          )}
                          <sub.icon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                          <span className="text-sm tracking-wide">{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === link.href || (link.href && link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Tooltip key={link.name} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link 
                  href={link.href!}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                  <link.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  <span className="hidden xl:block text-sm tracking-wide">{link.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="xl:hidden font-medium border-border/50 bg-popover/95 backdrop-blur-sm">
                {link.name}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <a 
              href="/api/auth/signout"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="hidden xl:block text-sm font-medium">Log out</span>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right" className="xl:hidden border-destructive/20 text-destructive bg-destructive/5 font-medium">
            Log out
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}

