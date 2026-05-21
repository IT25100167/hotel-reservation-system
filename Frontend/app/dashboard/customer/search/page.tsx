'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_ROOMS } from '@/lib/constants';
import Image from 'next/image';
import { Star, Filter } from 'lucide-react';
import { useState } from 'react';

export default function SearchPage() {
  const [priceFilter, setPriceFilter] = useState(500);
  const [capacityFilter, setCapacityFilter] = useState(4);

  const filteredRooms = MOCK_ROOMS.filter(
    room => room.price <= priceFilter && room.capacity <= capacityFilter
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pt-4"
    >
      <h1 className="text-4xl font-bold text-foreground">Find Your Room</h1>

      {/* Filters */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-foreground font-medium mb-2">Check-in Date</label>
            <Input
              type="date"
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <label className="block text-foreground font-medium mb-2">Check-out Date</label>
            <Input
              type="date"
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <label className="block text-foreground font-medium mb-2">Guests</label>
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(Number(e.target.value))}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4+ Guests</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="block text-foreground font-medium">Max Price: ${priceFilter}</label>
          <input
            type="range"
            min="100"
            max="600"
            step="50"
            value={priceFilter}
            onChange={(e) => setPriceFilter(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-foreground/60">
            <span>$100</span>
            <span>$600</span>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {filteredRooms.length} Rooms Available
        </h2>

        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-card border-border overflow-hidden hover:border-accent/50 transition cursor-pointer group">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-secondary">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-foreground text-lg">{room.name}</h3>
                    <p className="text-sm text-foreground/60 line-clamp-2">{room.description}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < 4 ? 'fill-accent text-accent' : 'text-foreground/30'}
                        />
                      ))}
                    </div>

                    {/* Price and Capacity */}
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <div>
                        <p className="text-2xl font-bold text-accent">${room.price}</p>
                        <p className="text-xs text-foreground/60">per night</p>
                      </div>
                      <Button className="bg-accent text-primary-foreground hover:bg-accent/90">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border p-8 text-center">
            <p className="text-foreground/60">No rooms match your filters</p>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
