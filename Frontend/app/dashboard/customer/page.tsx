'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_BOOKINGS } from '@/lib/constants';
import { Calendar, MapPin } from 'lucide-react';

export default function CustomerDashboard() {
  const upcomingBookings = MOCK_BOOKINGS.filter(
    b => b.status === 'pending' || b.status === 'confirmed'
  );

  return (
    <div className="space-y-8 pt-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground">My Bookings</h1>
        <p className="text-foreground/60 mt-2">Manage your hotel reservations</p>
      </motion.div>

      {/* Current Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Upcoming Stays</h2>
          <Button asChild className="bg-accent text-primary-foreground hover:bg-accent/90">
            <a href="/dashboard/customer/search">Book New Stay</a>
          </Button>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingBookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-card border-border p-6 hover:border-accent/50 transition">
                  <div className="space-y-4">
                    {/* Room Name */}
                    <h3 className="text-xl font-bold text-foreground">{booking.roomName}</h3>

                    {/* Booking Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Calendar size={18} className="text-accent" />
                        <span className="text-sm">
                          {booking.checkInDate} to {booking.checkOutDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70">
                        <MapPin size={18} className="text-accent" />
                        <span className="text-sm">Booking ID: {booking.id}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="pt-2 border-t border-border">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                      <p className="text-lg font-bold text-accent mt-2">${booking.totalPrice}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary">
                        Modify
                      </Button>
                      <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border p-8 text-center">
            <p className="text-foreground/60 mb-4">No upcoming bookings</p>
            <Button asChild className="bg-accent text-primary-foreground hover:bg-accent/90">
              <a href="/dashboard/customer/search">Book Your First Stay</a>
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Booking History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Booking History</h2>
        <Card className="bg-card border-border p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Room</th>
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Check-in</th>
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Check-out</th>
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BOOKINGS.map((booking) => (
                  <motion.tr
                    key={booking.id}
                    className="border-b border-border/50 hover:bg-secondary/50 transition"
                    whileHover={{ x: 4 }}
                  >
                    <td className="py-4 px-4 text-foreground/80">{booking.roomName}</td>
                    <td className="py-4 px-4 text-foreground/80">{booking.checkInDate}</td>
                    <td className="py-4 px-4 text-foreground/80">{booking.checkOutDate}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'checked-out'
                            ? 'bg-gray-500/20 text-gray-400'
                            : booking.status === 'checked-in'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
