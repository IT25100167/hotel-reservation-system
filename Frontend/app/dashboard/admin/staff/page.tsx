'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StaffPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 pt-4"
    >
      <h1 className="text-4xl font-bold text-foreground">Staff Management</h1>
      <Card className="bg-card border-border p-8">
        <div className="text-center space-y-4">
          <p className="text-lg text-foreground/60">Manage hotel staff</p>
          <Button className="bg-accent text-primary-foreground hover:bg-accent/90">
            Add Staff Member
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
