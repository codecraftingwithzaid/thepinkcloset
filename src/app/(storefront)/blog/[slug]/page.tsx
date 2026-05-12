import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BlogDetailsPage({ params }: { params: { slug: string } }) {
  // In a real app, fetch blog by slug. Mocking data for now.
  
  return (
    <article className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">Lookbook</span>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          The Summer Collection 2026: A Journey in Silk
        </h1>
        <p className="text-muted-foreground">May 10, 2026 • 5 min read</p>
      </div>

      <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl mb-12">
        <img 
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop" 
          alt="Summer Collection" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-stone lg:prose-lg mx-auto text-muted-foreground leading-relaxed">
        <p className="lead text-xl text-foreground font-medium mb-8">
          This season, we're taking a deep dive into the world of pure silk. Lightweight, breathable, and undeniably luxurious, our new summer collection is designed to help you beat the heat without sacrificing an ounce of style.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Inspiration from the Riviera</h2>
        <p className="mb-6">
          Drawing inspiration from the effortless glamour of the French Riviera in the 1960s, our design team focused on creating silhouettes that flow with the body. We wanted pieces that you could wear over a swimsuit at the beach, and transition seamlessly into an elegant evening dinner with just a change of shoes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" alt="Silk Dress" className="rounded-xl w-full h-full object-cover" />
          <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop" alt="Pink Dress" className="rounded-xl w-full h-full object-cover" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">The Color Palette</h2>
        <p className="mb-6">
          We stepped away from stark whites this season, opting instead for a palette of warm, sun-drenched pastels. Blush pinks, sage greens, and buttery yellows dominate the collection, designed to flatter a wide range of skin tones while capturing the essence of long summer evenings.
        </p>

        <blockquote className="border-l-4 border-primary pl-6 py-2 my-10 italic text-xl text-foreground font-heading">
          "Fashion should be an extension of your joy. This collection is our love letter to summer."
        </blockquote>

        <p className="mb-6">
          The collection features 12 key pieces, including our signature bias-cut slip dresses, oversized button-down shirts, and wide-leg trousers. Each piece is crafted from 100% Mulberry silk, known for its incredible durability and beautiful drape.
        </p>

        <div className="flex justify-center mt-12">
          <Link href="/shop">
             <Button size="lg" className="rounded-full px-8">Shop the Collection</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
