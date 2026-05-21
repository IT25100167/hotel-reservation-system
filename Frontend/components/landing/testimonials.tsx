'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Anderson',
    role: 'Travel Enthusiast',
    content: 'The best hotel booking experience I\'ve ever had. Seamless, elegant, and truly luxurious!',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Business Traveler',
    content: 'Outstanding service and impeccable attention to detail. Highly recommend for corporate stays.',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Luxury Travel Blogger',
    content: 'A game-changer in the hotel industry. The booking platform is intuitive and the accommodations are world-class.',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
  },
  {
    id: 4,
    name: 'David Martinez',
    role: 'Wedding Planner',
    content: 'Perfect for hosting special events. The team went above and beyond to make our celebration memorable.',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      x: dir > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Guest Testimonials</h2>
          <p className="text-lg text-foreground/60">Hear from our satisfied guests</p>
        </motion.div>

        <div className="relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
              }}
            >
              <div className="bg-white border border-border rounded-3xl p-8 md:p-12 shadow-sm">
                <div className="space-y-6">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                      <span key={i} className="text-2xl">⭐</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-2xl md:text-3xl text-foreground font-light">
                    &quot;{TESTIMONIALS[current].content}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-border">
                    <img
                      src={TESTIMONIALS[current].image}
                      alt={TESTIMONIALS[current].name}
                      className="w-12 h-12 rounded-full border-2 border-foreground/10"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{TESTIMONIALS[current].name}</p>
                      <p className="text-sm text-foreground/60">{TESTIMONIALS[current].role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="border-accent text-accent hover:bg-accent hover:text-primary-foreground"
                onClick={() => paginate(-1)}
              >
                <ChevronLeft size={20} />
              </Button>
            </motion.div>

            {/* Indicators */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === current ? 'bg-accent w-8' : 'bg-muted'
                  }`}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="border-accent text-accent hover:bg-accent hover:text-primary-foreground"
                onClick={() => paginate(1)}
              >
                <ChevronRight size={20} />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
