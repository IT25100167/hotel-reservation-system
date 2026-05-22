'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

interface Booking {
  id: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function StaffDashboard() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/reservations/all');
      if (res.ok) {
        const data = await res.json();
        // Filter for only PENDING and CONFIRMED bookings
        const recentBookings = data.filter((b: Booking) => b.status === 'PENDING' || b.status === 'CONFIRMED');
        setBookings(recentBookings.slice(0, 5));
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-8 pt-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground">Staff Dashboard</h1>
        <p className="text-foreground/60 mt-2">Welcome, {currentUser?.name}</p>
      </motion.div>

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-card border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-foreground">Recent Bookings</h3>
            <Button asChild className="bg-accent text-primary-foreground hover:bg-accent/90">
              <a href="/dashboard/staff/bookings">View All</a>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-foreground/60">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-foreground/60">No recent bookings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-foreground/70 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Room</th>
                    <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Check-in</th>
                    <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Check-out</th>
                    <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Guests</th>
                    <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      className="border-b border-border/50 hover:bg-secondary/50 transition"
                      whileHover={{ x: 4 }}
                    >
                      <td className="py-4 px-4 text-foreground/80">#{booking.id}</td>
                      <td className="py-4 px-4 text-foreground/80">Room {booking.roomId}</td>
                      <td className="py-4 px-4 text-foreground/80">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-foreground/80">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-foreground/80">{booking.numberOfGuests}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-accent font-semibold">Rs {booking.totalPrice.toFixed(2)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
