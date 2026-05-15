import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-4 text-center">
      <div className="max-w-xl rounded-2xl bg-white p-10 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">404</p>
        <h1 className="font-heading text-4xl font-bold text-neutral-950">This page slipped out of the collection.</h1>
        <p className="mt-4 text-neutral-600">The link may have changed or the page may no longer exist.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-rose-600 px-7 py-3 font-semibold text-white hover:bg-rose-700">Return Home</Link>
      </div>
    </main>
  );
}
