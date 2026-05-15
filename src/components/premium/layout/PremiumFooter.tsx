'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Mail, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react';
import { subscribeEmail } from '@/actions/subscriber';
import { useToast } from '../ui/Toast';

const CURRENT_YEAR = new Date().getFullYear();

export function PremiumFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { success, error } = useToast();

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      const result = await subscribeEmail(email);
      if (!result.ok) {
        throw new Error(result.error || 'Subscription failed');
      }
      success('Subscribed!', result.message || 'Thank you for joining our mailing list.');
      setEmail('');
    } catch {
      error('Subscription failed', 'Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'New Arrivals', href: '/shop?sort=new' },
        { name: 'Best Sellers', href: '/shop?sort=trending' },
        { name: 'Collections', href: '/collections' },
        { name: 'Sale', href: '/shop?category=sale' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Brand',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Journal', href: '/blog' },
        { name: 'Track Order', href: '/track-order' },
        { name: 'My Account', href: '/dashboard' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Return Policy', href: '/returns' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <footer className="bg-gradient-to-b from-neutral-50 to-rose-50 border-t border-rose-100">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <div className="bg-gradient-to-r from-pink-50 to-rose-100 rounded-2xl px-6 sm:px-10 py-10 sm:py-12 luxury-shadow">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 mb-3">
              Join the Pink Closet Community
            </h3>
            <p className="text-neutral-700 mb-6">
              Get exclusive offers, style tips, and early access to new collections.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 max-w-md mx-auto sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 px-4 py-3 bg-white rounded-lg border border-pink-200 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                required
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isSubscribing}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>

            <p className="text-xs text-neutral-600 mt-3">
              No spam, just luxury fashion inspiration.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <motion.div variants={itemVariants} initial="hidden" whileInView="visible" className="col-span-2 md:col-span-1">
            <Link href="/" className="block mb-4">
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                PINK CLOSET
              </span>
            </Link>
            <p className="text-sm text-neutral-600 mb-4">
              Luxury feminine fashion for the modern woman. Elegance meets style.
            </p>

            <div className="flex gap-3">
              {[Share2, MessageCircle, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-neutral-600 hover:text-rose-600 transition-colors"
                  aria-label="Social profile"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={itemVariants} initial="hidden" whileInView="visible" className="col-span-1">
              <h4 className="font-semibold text-neutral-900 mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-neutral-600 hover:text-pink-600 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-rose-100">
          {[
            { icon: MapPin, title: 'Location', text: 'New York, USA' },
            { icon: Phone, title: 'Phone', text: '+1 (555) 123-4567' },
            { icon: Mail, title: 'Email', text: 'hello@pinkcloset.com' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100">
                <Icon size={20} className="text-pink-600" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 text-sm">{title}</h4>
                <p className="text-sm text-neutral-600">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-600">
          <p>&copy; {CURRENT_YEAR} Pink Closet. All rights reserved. Made with <Heart size={14} className="inline text-pink-600" /></p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-neutral-900 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
