import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-10 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Confirmed</p>
        <h1 className="font-display text-4xl font-bold text-neutral-950">Thank you for your order</h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">Your confirmation and order updates will appear in your account as soon as the order is available.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard/orders" className="rounded-full bg-rose-600 px-7 py-3 font-semibold text-white hover:bg-rose-700">View Orders</Link>
          <Link href="/shop" className="rounded-full border border-rose-100 px-7 py-3 font-semibold text-neutral-700 hover:bg-rose-50">Continue Shopping</Link>
        </div>
      </div>
    </section>
  );
}
