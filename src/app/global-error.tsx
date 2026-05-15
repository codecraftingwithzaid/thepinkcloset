'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <main className="flex min-h-screen items-center justify-center bg-rose-50 px-4 text-center">
          <div className="max-w-xl rounded-2xl bg-white p-10 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">500</p>
            <h1 className="font-heading text-4xl font-bold text-neutral-950">Something needs a quick refresh.</h1>
            <p className="mt-4 text-neutral-600">Please try again. If the issue continues, support can help.</p>
            <button onClick={reset} className="mt-8 rounded-full bg-rose-600 px-7 py-3 font-semibold text-white hover:bg-rose-700">Try Again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
