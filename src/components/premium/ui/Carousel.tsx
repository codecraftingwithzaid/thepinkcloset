'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export function PremiumCarousel({
  children,
  autoplay = true,
  autoplayInterval = 5000,
  showArrows = true,
  showDots = true,
  className = '',
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + children.length) % children.length);
  };

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        paginate(1);
      }, autoplayInterval);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, autoplayInterval]);

  const handlePrevClick = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    paginate(-1);
  };

  const handleNextClick = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    paginate(1);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {children[current]}
          </motion.div>
        </AnimatePresence>
      </div>

      {showArrows && (
        <>
          <button
            onClick={handlePrevClick}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all hover:shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-neutral-900" />
          </button>
          <button
            onClick={handleNextClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all hover:shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="text-neutral-900" />
          </button>
        </>
      )}

      {showDots && (
        <div className="flex justify-center gap-2 mt-4">
          {children.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={`rounded-full transition-all ${
                idx === current ? 'bg-pink-400 w-8' : 'bg-neutral-300 w-2 hover:bg-pink-300'
              }`}
              style={{ height: '8px' }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductCarouselProps {
  items: React.ReactNode[];
  itemsPerView?: number;
  showArrows?: boolean;
  showDots?: boolean;
  gap?: number;
}

export function ProductCarousel({
  items,
  itemsPerView = 4,
  showArrows = true,
  showDots = false,
  gap = 24,
}: ProductCarouselProps) {
  const [scroll, setScroll] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: number) => {
    if (!containerRef.current) return;
    const itemWidth =
      containerRef.current.scrollWidth / items.length;
    const newScroll = scroll + direction * (itemWidth + gap);
    containerRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    });
    setScroll(newScroll);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
      >
        <div className="flex gap-6 pb-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0"
              style={{
                width: `calc((100vw - 3rem) / ${itemsPerView})`,
                maxWidth: `calc(100% / ${itemsPerView} - ${(gap * (itemsPerView - 1)) / itemsPerView}px)`,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            onClick={() => handleScroll(-1)}
            className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-neutral-900" />
          </button>
          <button
            onClick={() => handleScroll(1)}
            className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-neutral-900" />
          </button>
        </>
      )}
    </div>
  );
}
