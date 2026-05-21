'use client';

import { motion } from 'framer-motion';
import { KPIGrid } from '@/components/dashboard/kpi-cards';
import { Card } from '@/components/ui/card';
import { MOCK_BOOKINGS } from '@/lib/constants';
import { Users, BookOpen, DoorOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export default function StaffDashboard() {
  const { currentUser } = useAuth();

  const totalBookings = MOCK_BOOKINGS.length;
  const totalRevenue = MOCK_BOOKINGS.reduce((sum, b) => sum + b.totalPrice, 0);
  const availableRooms = 2;
  const totalUsers = 156;

  const kpiCards = [
    {
      label: 'Total Bookings',
      value: totalBookings,
      icon: <BookOpen size={28} />,
      trend: 12,
      description: 'This month',
    },
    {
      label: 'Total Revenue',
      value: `Rs ${totalRevenue.toLocaleString()}`,
      icon: <TrendingUp size={28} />,
      trend: 8,
      description: 'This month',
    },
    {
      label: 'Available Rooms',
      value: availableRooms,
      icon: <DoorOpen size={28} />,
      trend: -5,
      description: 'Out of 10 rooms',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: <Users size={28} />,
      trend: 15,
      description: 'Active users',
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
        <p className="text-foreground/60 mt-2">Welcome, {currentUser?.name}</p>
      </motion.div>

      {/* KPI Cards */}
      <KPIGrid cards={kpiCards} />

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
              <a href="/dashboard/admin/bookings">View All</a>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Guest</th>
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Room</th>
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-foreground/70 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BOOKINGS.slice(0, 5).map((booking) => (
                  <motion.tr
                    key={booking.id}
                    className="border-b border-border/50 hover:bg-secondary/50 transition"
                    whileHover={{ x: 4 }}
                  >
                    <td className="py-4 px-4 text-foreground/80">{booking.id}</td>
                    <td className="py-4 px-4 text-foreground/80">{booking.guestName}</td>
                    <td className="py-4 px-4 text-foreground/80">{booking.roomName}</td>
                    <td className="py-4 px-4 text-foreground/80">{booking.checkInDate}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'checked-in' ? 'bg-blue-500/20 text-blue-400' :
                        booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-accent font-semibold">Rs {booking.totalPrice}</td>
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
