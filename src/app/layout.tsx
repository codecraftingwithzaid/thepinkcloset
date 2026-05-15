import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RootLayoutClient } from './RootLayoutClient';

export const metadata: Metadata = {
  title: {
    template: '%s | Luxe Feminine Boutique',
    default: 'Luxe Feminine Boutique | Premium Clothing',
  },
  description: 'A premium, elegant fashion destination for women.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <TooltipProvider>
            <RootLayoutClient>
              {children}
              <Toaster position="bottom-right" />
            </RootLayoutClient>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
