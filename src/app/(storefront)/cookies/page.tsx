export default function CookiesPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Privacy</p>
      <h1 className="font-display text-4xl font-bold text-neutral-950">Cookies Policy</h1>
      <div className="mt-8 space-y-6 rounded-2xl bg-white p-8 text-neutral-700 shadow-sm">
        <p>We use cookies and similar technologies to keep the storefront secure, remember preferences, improve shopping flows, and understand site performance.</p>
        <p>Some cookies are essential for cart, checkout, authentication, and account experiences. Optional analytics or marketing cookies may be used where enabled.</p>
        <p>You can control cookies through your browser settings, though disabling essential cookies may affect parts of the shopping experience.</p>
      </div>
    </section>
  );
}
