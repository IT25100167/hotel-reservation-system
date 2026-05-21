'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const featuredRooms = [
  {
    id: 1,
    name: 'Elegant Suite',
    price: '$250',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Luxury Penthouse',
    price: '$500',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Deluxe Room',
    price: '$180',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Executive Suite',
    price: '$350',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    rating: 4.8,
  },
];

export function FeaturedRooms() {
  return (
    <section id="rooms" className="py-20 bg-amber-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 mb-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            DISCOVER BEST ROOMS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            Explore Stays About Comfort,<br />Your Stay, Our Priority
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl">
            Choose from our curated selection of premium accommodations designed for your comfort and satisfaction.
          </p>
        </motion.div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white border border-border shadow-sm hover:shadow-lg transition-all duration-300 h-80">
                {/* Image */}
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                  <div className="w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-bold text-lg">{room.name}</h3>
                    <p className="text-white/80 text-sm">{room.price}/night</p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-semibold text-foreground">{room.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 px-8 py-6"
          >
            <Link href="/dashboard/customer/search" className="flex items-center gap-2">
              View All Hotels
              <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
