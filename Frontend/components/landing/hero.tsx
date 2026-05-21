'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, CalendarDays, Users, BedDouble } from 'lucide-react';

export function Hero() {
  const router = useRouter();
  const [roomType, setRoomType] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  const handleSearch = () => {
    const params = new URLSearchParams({ roomType, checkIn, checkOut, guests });
    router.push(`/auth?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&h=900&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Luxury Hotel Experience
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-amber-300">Dream Stay</span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Discover handpicked luxury rooms and suites. Book your ideal getaway in seconds.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Room Type */}
            <div className="text-left">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
                <BedDouble size={14} /> Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-medium"
              >
                <option value="">Any Type</option>
                <option value="SINGLE">Single Room</option>
                <option value="DOUBLE">Double Room</option>
                <option value="DELUXE">Deluxe Suite</option>
              </select>
            </div>

            {/* Check In */}
            <div className="text-left">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
                <CalendarDays size={14} /> Check In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-medium"
              />
            </div>

            {/* Check Out */}
            <div className="text-left">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
                <CalendarDays size={14} /> Check Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-medium"
              />
            </div>

            {/* Guests */}
            <div className="text-left">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
                <Users size={14} /> Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-medium"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white text-lg font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-amber-300/40 hover:scale-[1.01]"
          >
            <Search size={20} />
            Search Available Rooms
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center gap-10 mt-10"
        >
          {[
            { value: '50+', label: 'Luxury Rooms' },
            { value: '1K+', label: 'Happy Guests' },
            { value: '4.9★', label: 'Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-amber-300">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
