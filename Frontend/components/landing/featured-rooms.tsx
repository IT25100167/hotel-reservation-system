'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BedDouble } from 'lucide-react';

interface Room {
  roomId: number;
  roomNumber: string;
  roomType: string;
  price: number;
  status: string;
  description: string;
  image: string;
}

interface SearchFilters {
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}

interface FeaturedRoomsProps {
  filters?: SearchFilters;
}

const ROOM_IMAGES: Record<string, string> = {
  SINGLE: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop',
  DOUBLE: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&h=400&fit=crop',
  DELUXE: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=400&fit=crop',
};

export function FeaturedRooms({ filters }: FeaturedRoomsProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // has the user performed a search?
  const hasSearched = !!(filters?.roomType || filters?.checkIn || filters?.checkOut);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/rooms');
      if (res.ok) setRooms(await res.json());
    } catch {
      // backend not running
    } finally {
      setLoading(false);
    }
  };

  // when no search → show all rooms
  // when searched → show only AVAILABLE + matching type
  const displayedRooms = hasSearched
    ? rooms.filter((room) => {
        if (room.status !== 'AVAILABLE') return false;
        if (filters?.roomType && room.roomType !== filters.roomType) return false;
        return true;
      })
    : rooms;

  const handleBookNow = (room: Room) => {
    // pass search params to /rooms page
    const params = new URLSearchParams({
      roomId: room.roomId.toString(),
      checkIn: filters?.checkIn || '',
      checkOut: filters?.checkOut || '',
      guests: filters?.guests || '1',
    });
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <section id="rooms" className="py-20 bg-amber-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 mb-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            {hasSearched ? 'SEARCH RESULTS' : 'OUR ROOMS'}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            {hasSearched ? 'Available Rooms for Your Dates' : 'Explore Our Rooms'}
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl">
            {hasSearched
              ? 'Rooms available for your selected dates and preferences.'
              : 'Choose from our premium accommodations designed for your comfort.'}
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-stone-400 text-lg">Loading rooms...</div>
        )}

        {/* No results after search */}
        {!loading && hasSearched && displayedRooms.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏨</div>
            <p className="text-stone-500 text-lg">No available rooms match your search.</p>
            <p className="text-stone-400 text-sm mt-2">Try different dates or room type.</p>
          </div>
        )}

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedRooms.map((room, index) => (
            <motion.div
              key={room.roomId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={room.image || ROOM_IMAGES[room.roomType] || ROOM_IMAGES.SINGLE}
                  alt={room.roomType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {room.roomType}
                </div>
                <div className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full ${
                  room.status === 'AVAILABLE' ? 'bg-green-500' :
                  room.status === 'OCCUPIED' ? 'bg-red-500' : 'bg-yellow-500'
                }`}>
                  {room.status}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <BedDouble size={16} className="text-amber-600" />
                  <span className="text-stone-500 text-sm">Room {room.roomNumber}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">
                  {room.roomType.charAt(0) + room.roomType.slice(1).toLowerCase()} Room
                </h3>
                <p className="text-stone-500 text-sm mb-4 line-clamp-2">
                  {room.description || 'Comfortable and well-appointed room for a perfect stay.'}
                </p>

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-amber-700">Rs {room.price}</span>
                    <span className="text-stone-400 text-sm">/night</span>
                  </div>
                </div>

                {/* Book Now button — only show when searched AND room is available */}
                {hasSearched && room.status === 'AVAILABLE' && (
                  <button
                    onClick={() => handleBookNow(room)}
                    className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-md"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
