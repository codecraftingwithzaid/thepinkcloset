'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MessageCircle } from 'lucide-react';

interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export function TestimonialsSection({ testimonials = [] }: TestimonialsProps) {
  const defaultTestimonials = [
    {
      id: '1',
      author: 'Sarah Johnson',
      role: 'Fashion Influencer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'Pink Closet has become my go-to for luxury fashion pieces that truly reflect my style. The quality is unmatched!',
      rating: 5,
    },
    {
      id: '2',
      author: 'Emma Wilson',
      role: 'Creative Director',
      avatar: 'https://i.pravatar.cc/150?img=2',
      content: 'Every piece I\'ve purchased has been exceptional. The attention to detail and customer service is outstanding.',
      rating: 5,
    },
    {
      id: '3',
      author: 'Lisa Chen',
      role: 'Lifestyle Blogger',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: 'I love how each collection is carefully curated. Pink Closet really understands luxury feminine fashion.',
      rating: 5,
    },
    {
      id: '4',
      author: 'Jessica Martinez',
      role: 'Fashion Designer',
      avatar: 'https://i.pravatar.cc/150?img=4',
      content: 'The quality and design of these pieces are world-class. A must-have for any fashion-forward woman.',
      rating: 5,
    },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Loved by Our Community
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover why thousands of women trust Pink Closet for luxury fashion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTestimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 luxury-shadow hover:shadow-xl transition-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}
                  />
                ))}
              </div>

              {/* Quote Mark */}
              <Quote size={20} className="text-pink-300 mb-3" />

              {/* Content */}
              <p className="text-neutral-700 text-sm mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{testimonial.author}</p>
                  <p className="text-neutral-600 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
}

interface InstagramGalleryProps {
  posts?: InstagramPost[];
}

export function InstagramGallerySection({ posts = [] }: InstagramGalleryProps) {
  const defaultPosts = [
    { id: '1', image: '/images/insta-1.jpg', likes: 2543, comments: 89, caption: 'Summer vibes ✨' },
    { id: '2', image: '/images/insta-2.jpg', likes: 3102, comments: 156, caption: 'Effortless elegance' },
    { id: '3', image: '/images/insta-3.jpg', likes: 2876, comments: 124, caption: 'Fashion forward' },
    { id: '4', image: '/images/insta-4.jpg', likes: 3421, comments: 201, caption: 'Pink is our passion' },
    { id: '5', image: '/images/insta-5.jpg', likes: 2654, comments: 98, caption: 'Luxury moments' },
    { id: '6', image: '/images/insta-6.jpg', likes: 3189, comments: 167, caption: 'Style inspiration' },
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <MessageCircle size={24} className="text-pink-600" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">
            @pinkcloset
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="relative group rounded-lg overflow-hidden h-40 md:h-56 cursor-pointer luxury-shadow"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
              />

              {/* Overlay Info */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <div className="text-white text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star fill="white" size={16} />
                    <span className="font-semibold">{post.likes}</span>
                  </div>
                  <p className="text-sm opacity-90">{post.comments} comments</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <a
            href="https://instagram.com/pinkcloset"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-300 to-pink-200 text-neutral-900 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Follow on Instagram <MessageCircle size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function TrustBadgesSection() {
  const badges = [
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'On all orders over $100',
    },
    {
      icon: '↩️',
      title: 'Easy Returns',
      description: '30 days money-back guarantee',
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: '100% encrypted transactions',
    },
    {
      icon: '⭐',
      title: 'Premium Quality',
      description: 'Handpicked fashion pieces',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-white border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h3 className="font-semibold text-neutral-900 mb-1">{badge.title}</h3>
              <p className="text-sm text-neutral-600">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
