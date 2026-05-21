'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const ADMIN_LINKS: SidebarLink[] = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/dashboard/admin/users', label: 'Users', icon: <Users size={20} /> },
  { href: '/dashboard/admin/rooms', label: 'Rooms', icon: <DoorOpen size={20} /> },
  { href: '/dashboard/admin/bookings', label: 'Bookings', icon: <BookOpen size={20} /> },
  { href: '/dashboard/admin/staff', label: 'Staff', icon: <Users size={20} /> },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: <LayoutDashboard size={20} /> },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
];

const STAFF_LINKS: SidebarLink[] = [
  { href: '/dashboard/staff', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/dashboard/admin/rooms', label: 'Rooms', icon: <DoorOpen size={20} /> },
  { href: '/dashboard/admin/bookings', label: 'Bookings', icon: <BookOpen size={20} /> },
  { href: '/dashboard/admin/users', label: 'Users', icon: <Users size={20} /> },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(isOpen);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getLinks = () => {
    switch (currentUser?.role) {
      case 'ADMIN':
        return ADMIN_LINKS;
      case 'STAFF':
        return STAFF_LINKS;
      default:
        return [];
    }
  };

  const links = getLinks();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-4 border-b border-border"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">✨</span>
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:inline">LuxeStay</span>
        </Link>
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 py-4 border-b border-border"
      >
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-full border-2 border-accent"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{currentUser?.name}</p>
            <p className="text-xs text-foreground/60">{currentUser?.role}</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link, idx) => {
          const isActive = pathname === link.href;
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <Link
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-accent text-primary-foreground'
                    : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                }`}
              >
                {link.icon}
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 py-4 border-t border-border"
      >
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-border text-foreground hover:bg-secondary flex items-center gap-2"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </motion.div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-border flex-col z-40"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="border-border bg-sidebar"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-64 h-screen bg-sidebar border-r border-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
