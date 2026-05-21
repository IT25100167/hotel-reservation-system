'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function Navbar() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">🏨 Sunrise Hotel</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-6"
            >
              <Link href="/#rooms" className="text-foreground/80 hover:text-accent transition">
                Rooms
              </Link>
              <Link href="/#facilities" className="text-foreground/80 hover:text-accent transition">
                Facilities
              </Link>
              <Link href="/#testimonials" className="text-foreground/80 hover:text-accent transition">
                Reviews
              </Link>
              <Link href="/#about" className="text-foreground/80 hover:text-accent transition">
                About
              </Link>
            </motion.div>
          </div>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            {isAuthenticated ? (
              <>
                <span className="text-foreground text-sm hidden sm:inline">
                  Welcome, {currentUser?.name}
                </span>
                {currentUser?.role !== 'CUSTOMER' && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-primary-foreground"
                  >
                    <Link href={`/dashboard/${currentUser?.role.toLowerCase()}`}>Dashboard</Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-foreground hover:text-accent"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="bg-gradient-to-r from-amber-700 to-amber-500 text-white hover:from-amber-800 hover:to-amber-600 shadow-md"
              >
                <Link href="/auth">Login</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 border-t border-border"
          >
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/#rooms" className="text-foreground/80 hover:text-accent transition py-2">
                Rooms
              </Link>
              <Link href="/#facilities" className="text-foreground/80 hover:text-accent transition py-2">
                Facilities
              </Link>
              <Link href="/#testimonials" className="text-foreground/80 hover:text-accent transition py-2">
                Reviews
              </Link>
              <Link href="/#about" className="text-foreground/80 hover:text-accent transition py-2">
                About
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
