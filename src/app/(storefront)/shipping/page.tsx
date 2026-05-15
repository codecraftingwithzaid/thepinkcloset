export default function ShippingPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Delivery Care</p>
      <h1 className="font-display text-4xl font-bold text-neutral-950">Shipping Policy</h1>
      <div className="mt-8 space-y-6 rounded-2xl bg-white p-8 text-neutral-700 shadow-sm">
        <p>Orders are processed carefully and prepared for dispatch after payment confirmation. Delivery timelines may vary by destination, carrier availability, and promotional periods.</p>
        <p>Shipping fees, delivery estimates, and eligible service levels are calculated during checkout using the latest order and address details.</p>
        <p>Once dispatched, tracking information is shared with the customer so every order can be followed from boutique to doorstep.</p>
      </div>
    </section>
  );
}
