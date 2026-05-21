'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  description?: string;
}

export function KPICard({
  label,
  value,
  icon,
  trend,
  description,
}: KPICardProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const isPositive = trend && trend >= 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-border p-6 cursor-pointer relative overflow-hidden group">
        {/* Background accent */}
        <motion.div
          className="absolute -right-8 -top-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-foreground/60 text-sm font-medium">{label}</p>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mt-1">
                {value}
              </h3>
            </div>
            <motion.div
              className="text-accent text-2xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          </div>

          {/* Trend */}
          {trend !== undefined && (
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span
                className={`text-sm font-semibold ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {Math.abs(trend)}% {isPositive ? 'increase' : 'decrease'}
              </span>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-foreground/50 text-xs">{description}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export function KPIGrid({
  cards,
}: {
  cards: KPICardProps[];
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {cards.map((card, idx) => (
        <KPICard key={idx} {...card} />
      ))}
    </motion.div>
  );
}
