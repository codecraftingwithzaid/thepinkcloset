'use client';

import { useState } from 'react';

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Order Care</p>
        <h1 className="font-display text-4xl font-bold text-neutral-950">Track Order</h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">Enter your order number or tracking reference to continue. Connected fulfillment details can be surfaced here when available.</p>
      </div>
      <form className="mt-10 rounded-2xl bg-white p-6 shadow-sm" onSubmit={(event) => event.preventDefault()}>
        <label className="text-sm font-semibold text-neutral-700" htmlFor="track-order">Order or tracking number</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="track-order"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 rounded-full border border-rose-100 px-5 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="Example: LX-123456"
          />
          <button className="rounded-full bg-rose-600 px-7 py-3 font-semibold text-white hover:bg-rose-700">Track</button>
        </div>
      </form>
    </section>
  );
}
