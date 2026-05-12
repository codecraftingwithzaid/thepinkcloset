import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="font-heading text-4xl font-bold mb-8 text-center">About Luxe</h1>
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>
          Founded in 2026, Luxe was born from a simple belief: every woman deserves to feel beautiful, confident, and comfortable in her own skin. We are more than just a fashion brand; we are a destination for modern elegance.
        </p>
        <p>
          Our collections are carefully curated with an emphasis on timeless silhouettes, premium fabrics, and impeccable craftsmanship. From luxurious silk slip dresses that glide effortlessly, to cozy cashmere knits perfect for layering, every piece is designed to be cherished for years to come.
        </p>
        <div className="py-8">
          <img 
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop" 
            alt="Fashion atelier" 
            className="w-full h-[400px] object-cover rounded-2xl"
          />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">Our Commitment</h2>
        <p>
          We are committed to ethical fashion. We work closely with our artisans and suppliers to ensure fair labor practices and sustainable sourcing. We believe that true luxury shouldn't come at the expense of our planet or its people.
        </p>
        <p>
          Thank you for being part of our journey.
        </p>
      </div>
    </div>
  );
}
