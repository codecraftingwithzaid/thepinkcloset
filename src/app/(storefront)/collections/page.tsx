import React from 'react';
import Link from 'next/link';

export default function CollectionsPage() {
  const collections = [
    {
      id: 1,
      title: 'The Silk Edit',
      subtitle: 'Pure Mulberry Silk',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Summer Escapade',
      subtitle: 'Lightweight & Breathable',
      image: 'https://images.unsplash.com/photo-1515347619362-793574d6e90d?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Evening Glamour',
      subtitle: 'Timeless Elegance',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Curated Collections</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our thoughtfully curated edits, designed for every occasion and mood.
        </p>
      </div>

      <div className="space-y-16">
        {collections.map((collection, index) => (
          <div key={collection.id} className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}>
            <div className="w-full md:w-1/2 aspect-[4/5] overflow-hidden rounded-2xl relative group">
               <img 
                 src={collection.image} 
                 alt={collection.title} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left space-y-6">
               <span className="text-primary font-medium tracking-widest uppercase text-sm">
                 {collection.subtitle}
               </span>
               <h2 className="font-heading text-4xl md:text-5xl font-bold">
                 {collection.title}
               </h2>
               <p className="text-lg text-muted-foreground">
                 Discover pieces that speak to your style. Handpicked items that blend seamlessly to create the perfect wardrobe for this season.
               </p>
               <div>
                 <Link href="/shop">
                   <button className="border-b-2 border-primary pb-1 text-primary font-medium hover:text-foreground hover:border-foreground transition-colors uppercase tracking-wider text-sm">
                     Explore Collection
                   </button>
                 </Link>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
