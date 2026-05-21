'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MOCK_FACILITIES } from '@/lib/constants';

export function Facilities() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="facilities" className="py-20 bg-card relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">World-Class Facilities</h2>
          <p className="text-lg text-foreground/60">Everything you need for a perfect stay</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {MOCK_FACILITIES.map((facility) => (
            <motion.div
              key={facility.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="h-full p-6 bg-background border-border hover:border-accent transition-all duration-300 cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {facility.icon}
                  </motion.div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-foreground">{facility.name}</h3>

                  {/* Description */}
                  {facility.description && (
                    <p className="text-sm text-foreground/60 line-clamp-2">
                      {facility.description}
                    </p>
                  )}

                  {/* Accent bar */}
                  <motion.div
                    className="w-0 h-1 bg-accent"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
