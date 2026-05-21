'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <footer className="bg-stone-900 border-t border-stone-700 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold text-amber-300 mb-4">🏨 Sunrise Hotel</h3>
            <p className="text-stone-400 text-sm mb-4">
              Find amazing hotels, compare prices, and book your dream vacation easily with Sunrise.
            </p>
            <div className="space-y-2 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-400" />
                <span>123 Luxury Lane, Paris</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-amber-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-amber-400" />
                <span>info@sunrisehotel.com</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-amber-300 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-stone-400 hover:text-amber-300 transition">Home</Link></li>
              <li><Link href="/#rooms" className="text-stone-400 hover:text-amber-300 transition">Rooms</Link></li>
              <li><Link href="/#facilities" className="text-stone-400 hover:text-amber-300 transition">Facilities</Link></li>
              <li><Link href="/auth" className="text-stone-400 hover:text-amber-300 transition">Book Now</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-amber-300 mb-4">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-stone-400 hover:text-amber-300 transition">Privacy Policy</a></li>
              <li><a href="#" className="text-stone-400 hover:text-amber-300 transition">Terms & Conditions</a></li>
              <li><a href="#" className="text-stone-400 hover:text-amber-300 transition">Cancellation Policy</a></li>
              <li><a href="#" className="text-stone-400 hover:text-amber-300 transition">Contact Support</a></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-amber-300 mb-4">Newsletter</h4>
            <p className="text-stone-400 text-sm mb-3">Subscribe to get exclusive offers and updates</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-amber-700 to-amber-500 text-white hover:from-amber-800 hover:to-amber-600">
                  Subscribe
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <div className="border-t border-stone-700 my-8" />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center text-sm text-stone-500"
        >
          <p>&copy; 2024 Sunrise Hotel. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-amber-300 transition">Facebook</a>
            <a href="#" className="hover:text-amber-300 transition">Twitter</a>
            <a href="#" className="hover:text-amber-300 transition">Instagram</a>
            <a href="#" className="hover:text-amber-300 transition">LinkedIn</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
