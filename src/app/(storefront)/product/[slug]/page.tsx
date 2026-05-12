import React from 'react';
import { getProductBySlug } from '@/actions/product';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Ruler, ShieldCheck } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="text-sm text-muted-foreground mb-8">
        Home / Shop / {product.category?.name} / <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted/20">
            <img 
              src={product.images?.[0] || 'https://via.placeholder.com/800x1200?text=Luxury+Fashion'} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnail row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img: string, i: number) => (
                <div key={i} className="w-24 h-32 rounded-lg overflow-hidden border border-border cursor-pointer opacity-70 hover:opacity-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col pt-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
          <div className="text-2xl font-medium mb-6">${product.price.toFixed(2)}</div>
          
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="space-y-6 mb-8">
            {/* Sizes (Mocked for now since schema has sizes but maybe empty) */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Size</span>
                <button className="text-sm text-muted-foreground underline flex items-center hover:text-foreground">
                  <Ruler className="w-4 h-4 mr-1" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button key={size} className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors focus:ring-2 focus:ring-ring focus:outline-none">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <span className="font-medium block mb-3">Color</span>
              <div className="flex gap-3">
                <button className="w-8 h-8 rounded-full bg-rose-100 ring-2 ring-offset-2 ring-primary border border-border"></button>
                <button className="w-8 h-8 rounded-full bg-amber-50 border border-border"></button>
                <button className="w-8 h-8 rounded-full bg-slate-800 border border-border"></button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-10">
            <Button size="lg" className="flex-1 rounded-full h-14 text-lg">Add to Cart</Button>
            <Button size="icon" variant="outline" className="rounded-full w-14 h-14 shrink-0">
              <Heart className="w-6 h-6" />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full w-14 h-14 shrink-0">
              <Share2 className="w-6 h-6" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6 border-y border-border mb-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              <span>Free Worldwide Shipping</span>
            </div>
          </div>

          <Accordion className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger className="text-lg">Description</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {product.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="details">
              <AccordionTrigger className="text-lg">Fabric & Care</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {product.fabric || "Crafted from a luxurious blend of premium materials. Dry clean only. Iron on low heat. Do not bleach."}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-lg">Shipping & Returns</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Free standard shipping on all orders over $150. Returns accepted within 30 days of delivery in original unworn condition with tags attached.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
