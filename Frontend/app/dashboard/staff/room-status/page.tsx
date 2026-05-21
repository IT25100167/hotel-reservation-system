'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MOCK_ROOMS } from '@/lib/constants';

export default function RoomStatusPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 pt-4"
    >
      <h1 className="text-4xl font-bold text-foreground">Room Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ROOMS.map((room, idx) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`bg-card border-2 p-6 ${
              room.available ? 'border-green-500/50' : 'border-red-500/50'
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-foreground">{room.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      room.available
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {room.available ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <p className="text-sm text-foreground/60">{room.description}</p>
                <p className="text-sm text-foreground/70">
                  Capacity: <span className="font-semibold">{room.capacity} guests</span>
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
