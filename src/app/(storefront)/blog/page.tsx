import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BlogListingPage() {
  const blogs = [
    {
      slug: 'summer-collection-2026',
      title: 'The Summer Collection 2026: A Journey in Silk',
      excerpt: 'Discover the inspiration behind our latest collection, featuring lightweight silks and pastel hues perfect for the summer heat.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      date: 'May 10, 2026',
      category: 'Lookbook'
    },
    {
      slug: 'how-to-care-for-cashmere',
      title: 'The Ultimate Guide to Caring for Cashmere',
      excerpt: 'Keep your luxury knitwear looking pristine season after season with our comprehensive care guide.',
      image: 'https://images.unsplash.com/photo-1612423284934-2850a4eaea40?q=80&w=1000&auto=format&fit=crop',
      date: 'April 28, 2026',
      category: 'Care Guides'
    },
    {
      slug: 'sustainable-fashion-future',
      title: 'Our Commitment to a Sustainable Future',
      excerpt: 'Learn about our journey towards zero waste and our partnerships with ethical artisans around the globe.',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop',
      date: 'April 15, 2026',
      category: 'Sustainability'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Luxe Journal</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Style inspiration, brand news, and behind-the-scenes stories from the world of Luxe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.slug}>
            <Card className="group overflow-hidden border-none shadow-none bg-transparent cursor-pointer h-full flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full">
                    {blog.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-0 flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-2">{blog.date}</p>
                <h2 className="font-heading text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {blog.title}
                </h2>
                <p className="text-muted-foreground mb-4 flex-1">
                  {blog.excerpt}
                </p>
                <div className="mt-auto">
                  <Button variant="link" className="px-0 text-primary group-hover:underline">
                    Read More &rarr;
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
