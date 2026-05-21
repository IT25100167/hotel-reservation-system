'use client';

import { motion } from 'framer-motion';
import { KPIGrid } from '@/components/dashboard/kpi-cards';
import { Card } from '@/components/ui/card';
import { MOCK_BOOKINGS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function StaffDashboard() {
  const todayBookings = MOCK_BOOKINGS.filter(b => b.status === 'confirmed' || b.status === 'checked-in');
  const checkedInCount = MOCK_BOOKINGS.filter(b => b.status === 'checked-in').length;
  const pendingCheckOuts = MOCK_BOOKINGS.filter(b => b.status === 'checked-in').length;

  const kpiCards = [
    {
      label: "Today's Check-ins",
      value: todayBookings.length,
      icon: <CheckCircle size={28} />,
      description: 'Guests arriving today',
    },
    {
      label: 'Currently Checked In',
      value: checkedInCount,
      icon: <Clock size={28} />,
      description: 'Active guests',
    },
    {
      label: 'Pending Check-outs',
      value: pendingCheckOuts,
      icon: <XCircle size={28} />,
      description: 'Guests leaving today',
    },
  ];

  return (
    <div className="space-y-8 pt-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground">Staff Dashboard</h1>
        <p className="text-foreground/60 mt-2">Guest check-in and room management</p>
      </motion.div>

      {/* KPI Cards */}
      <KPIGrid cards={kpiCards} />

      {/* Today's Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-foreground">Today's Bookings</h3>
            <Button asChild className="bg-accent text-primary-foreground hover:bg-accent/90">
              <a href="/dashboard/staff/check-ins">Manage Check-ins</a>
            </Button>
          </div>

          <div className="space-y-3">
            {todayBookings.map((booking) => (
              <motion.div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border/50 hover:border-accent/50 transition"
                whileHover={{ x: 4 }}
              >
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{booking.guestName}</p>
                  <p className="text-sm text-foreground/60">{booking.roomName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent">{booking.checkInDate}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'checked-in'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {booking.status === 'checked-in' ? 'Checked In' : 'Pending'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-card border-border p-6">
          <h3 className="font-bold text-foreground mb-4">Check-in Guests</h3>
          <Button asChild className="w-full bg-green-600 text-white hover:bg-green-700">
            <a href="/dashboard/staff/check-ins">Go to Check-ins</a>
          </Button>
        </Card>

        <Card className="bg-card border-border p-6">
          <h3 className="font-bold text-foreground mb-4">Check-out Guests</h3>
          <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700">
            <a href="/dashboard/staff/check-outs">Go to Check-outs</a>
          </Button>
        </Card>

        <Card className="bg-card border-border p-6">
          <h3 className="font-bold text-foreground mb-4">Room Status</h3>
          <Button asChild className="w-full bg-purple-600 text-white hover:bg-purple-700">
            <a href="/dashboard/staff/room-status">View Rooms</a>
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
