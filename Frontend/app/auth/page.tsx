'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
     
      if (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, currentUser, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-8 left-8 text-foreground/60 hover:text-accent transition flex items-center gap-2 z-10"
      >
        <ChevronLeft size={20} />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-20"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl border border-border shadow-sm p-8 md:p-10 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">Sunrise</h1>
            <p className="text-foreground/60">
              {isLogin ? 'Welcome back' : 'Join us to book luxury hotels'}
            </p>
          </motion.div>

          {/* Forms */}
          <div className="relative">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? (
                <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </motion.div>
          </div>

          {/* Toggle Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border-t border-border pt-6 text-center"
          >
            <p className="text-foreground/60 mb-3">
              {isLogin ? 'New to Sunrise?' : 'Already a member?'}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent font-semibold hover:text-accent/80 transition"
            >
              {isLogin ? 'Create account' : 'Sign in'}
            </button>
          </motion.div>
        </div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-foreground/50 text-sm mt-6"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
