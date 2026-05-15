'use client';

import { useState } from 'react';
import { subscribeEmail } from '@/actions/subscriber';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await subscribeEmail(email);
    setMessage(result.ok ? result.message || 'Subscribed successfully.' : result.error || 'Please try again.');
    if (result.ok) setEmail('');
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Style Letters</p>
      <h1 className="font-display text-4xl font-bold text-neutral-950">Newsletter</h1>
      <p className="mx-auto mt-4 max-w-xl text-neutral-600">Join for collection drops, private offers, and styling notes.</p>
      <form onSubmit={subscribe} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm sm:flex-row">
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Enter your email" className="min-w-0 flex-1 rounded-full border border-rose-100 px-5 py-3 outline-none focus:ring-2 focus:ring-rose-200" />
        <button className="rounded-full bg-rose-600 px-7 py-3 font-semibold text-white hover:bg-rose-700">Subscribe</button>
      </form>
      {message && <p className="mt-4 text-sm text-neutral-600">{message}</p>}
    </section>
  );
}
