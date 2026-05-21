'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { BedDouble, CalendarDays, Users, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Room {
  roomId: number;
  roomNumber: string;
  roomType: string;
  price: number;
  status: string;
  description: string;
  image: string;
}

const ROOM_IMAGES: Record<string, string> = {
  SINGLE: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop',
  DOUBLE: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&h=400&fit=crop',
  DELUXE: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=400&fit=crop',
};

function RoomsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();

  const preselectedRoomId = searchParams.get('roomId');
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialGuests = searchParams.get('guests') || '1';

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingData, setBookingData] = useState({
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: initialGuests,
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/rooms');
      if (res.ok) {
        const data: Room[] = await res.json();
        const available = data.filter((r) => r.status === 'AVAILABLE');
        setRooms(available);

        // auto-open modal if roomId passed from landing page
        if (preselectedRoomId) {
          const room = available.find((r) => r.roomId === parseInt(preselectedRoomId));
          if (room) setSelectedRoom(room);
        }
      }
    } catch {
      // backend not running
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (room: Room) => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    setSelectedRoom(room);
    setBookingSuccess(false);
    setBookingError('');
  };

  const handleConfirmBooking = async () => {
    if (!selectedRoom || !currentUser) return;
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setBookingError('Please select check-in and check-out dates');
      return;
    }
    if (new Date(bookingData.checkOut) <= new Date(bookingData.checkIn)) {
      setBookingError('Check-out must be after check-in');
      return;
    }

    setSubmitting(true);
    setBookingError('');
    try {
      const res = await fetch(`http://localhost:8080/reservations/add?userId=${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.roomId,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut,
          numberOfGuests: parseInt(bookingData.guests),
          guestName: currentUser.name,
          guestEmail: currentUser.email,
          guestPhone: '',
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
      } else {
        const msg = await res.text();
        setBookingError(msg || 'Booking failed. Please try again.');
      }
    } catch {
      setBookingError('Could not connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const nights =
    bookingData.checkIn && bookingData.checkOut
      ? Math.max(1, Math.ceil(
          (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        ))
      : 0;

  return (
    <div className="min-h-screen bg-amber-50/30">
      {/* Header */}
      <div className="bg-white border-b border-amber-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-amber-700 transition">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="h-5 w-px bg-stone-200" />
          <h1 className="text-xl font-bold text-stone-800">🏨 Available Rooms</h1>
          {!loading && (
            <span className="ml-auto text-sm text-stone-500">{rooms.length} room{rooms.length !== 1 ? 's' : ''} available</span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="text-center py-20 text-stone-400 text-lg">Loading available rooms...</div>
        )}

        {!loading && rooms.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏨</div>
            <p className="text-stone-500 text-xl font-semibold">No rooms available right now.</p>
            <p className="text-stone-400 text-sm mt-2">Please check back later.</p>
            <Link href="/" className="inline-block mt-6 bg-gradient-to-r from-amber-700 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold">
              Back to Home
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.roomId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={room.image || ROOM_IMAGES[room.roomType] || ROOM_IMAGES.SINGLE}
                  alt={room.roomType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {room.roomType}
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  AVAILABLE
                </div>
              </div>

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
                  <div>
                    <span className="text-2xl font-bold text-amber-700">Rs {room.price}</span>
                    <span className="text-stone-400 text-sm"> /night</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBookNow(room)}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-md"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !bookingSuccess && setSelectedRoom(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-2">Booking Confirmed!</h3>
                  <p className="text-stone-500 mb-2">
                    Room {selectedRoom.roomNumber} — {selectedRoom.roomType}
                  </p>
                  <p className="text-stone-400 text-sm mb-6">
                    {bookingData.checkIn} → {bookingData.checkOut}
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold py-3 rounded-xl"
                  >
                    Back to Home
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-800">Confirm Booking</h3>
                      <p className="text-stone-500 text-sm mt-1">
                        {selectedRoom.roomType} Room — #{selectedRoom.roomNumber}
                      </p>
                    </div>
                    <button onClick={() => setSelectedRoom(null)} className="text-stone-400 hover:text-stone-600">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
                        <CalendarDays size={14} /> Check In
                      </label>
                      <input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                        className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
                        <CalendarDays size={14} /> Check Out
                      </label>
                      <input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                        className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
                        <Users size={14} /> Guests
                      </label>
                      <select
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                        className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4+ Guests</option>
                      </select>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-amber-50 rounded-2xl p-4 mb-6">
                    <div className="flex justify-between text-stone-600 text-sm mb-1">
                      <span>Price per night</span>
                      <span>Rs {selectedRoom.price}</span>
                    </div>
                    {nights > 0 && (
                      <>
                        <div className="flex justify-between text-stone-500 text-sm mb-1">
                          <span>Nights</span>
                          <span>{nights}</span>
                        </div>
                        <div className="flex justify-between font-bold text-stone-800 text-lg border-t border-amber-200 pt-2 mt-2">
                          <span>Total</span>
                          <span className="text-amber-700">Rs {(selectedRoom.price * nights).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
                      {bookingError}
                    </div>
                  )}

                  <button
                    onClick={handleConfirmBooking}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-md disabled:opacity-60"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Reservation'}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-400">Loading...</div>}>
      <RoomsContent />
    </Suspense>
  );
}
