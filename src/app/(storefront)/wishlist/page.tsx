'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Saved Pieces</p>
        <h1 className="font-display text-4xl font-bold text-neutral-950">Wishlist</h1>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
          <Heart className="mx-auto mb-5 h-12 w-12 text-rose-300" />
          <h2 className="mb-2 text-2xl font-semibold text-neutral-950">Your wishlist is waiting for its first favorite.</h2>
          <p className="mx-auto mb-8 max-w-md text-neutral-600">Save dresses, sets, and everyday luxuries while you browse.</p>
          <Link href="/shop" className="inline-flex rounded-full bg-rose-600 px-7 py-3 font-semibold text-white transition hover:bg-rose-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <Link href={`/product/${item.slug}`} className="block aspect-[3/4] bg-rose-50">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center font-display text-2xl font-bold text-rose-700">{item.title}</div>
                )}
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.slug}`} className="font-semibold text-neutral-950 hover:text-rose-600">{item.title}</Link>
                <p className="mt-1 font-bold text-neutral-900">${item.price.toFixed(2)}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => addToCart({ id: item.id, title: item.title, price: item.price, image: item.image, quantity: 1 })}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                  >
                    <ShoppingBag size={16} /> Add
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-full border border-rose-100 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
