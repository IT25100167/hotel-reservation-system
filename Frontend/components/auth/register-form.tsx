'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword || !phone) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      await register(name, email, password, phone);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4 py-4">
        <div className="text-5xl">✅</div>
        <h3 className="text-xl font-bold text-foreground">Account Created!</h3>
        <p className="text-foreground/60">You can now log in with your credentials.</p>
        <Button onClick={onSwitchToLogin} className="bg-gradient-to-r from-amber-700 to-amber-500 text-white w-full py-6">
          Go to Login
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="block text-foreground font-medium mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent" size={20} />
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
            className="pl-12 bg-input border-border text-foreground placeholder:text-foreground/50" disabled={loading} />
        </div>
      </div>

      <div>
        <label className="block text-foreground font-medium mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent" size={20} />
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
            className="pl-12 bg-input border-border text-foreground placeholder:text-foreground/50" disabled={loading} />
        </div>
      </div>

      <div>
        <label className="block text-foreground font-medium mb-2">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent" size={20} />
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0771234567"
            className="pl-12 bg-input border-border text-foreground placeholder:text-foreground/50" disabled={loading} />
        </div>
      </div>

      <div>
        <label className="block text-foreground font-medium mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent" size={20} />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
            className="pl-12 bg-input border-border text-foreground placeholder:text-foreground/50" disabled={loading} />
        </div>
      </div>

      <div>
        <label className="block text-foreground font-medium mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent" size={20} />
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
            className="pl-12 bg-input border-border text-foreground placeholder:text-foreground/50" disabled={loading} />
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
          {error}
        </motion.div>
      )}

      <Button type="submit" disabled={loading}
        className="w-full bg-gradient-to-r from-amber-700 to-amber-500 text-white hover:from-amber-800 hover:to-amber-600 text-lg py-6">
        {loading ? 'Creating account...' : 'Sign up'}
      </Button>

      <div className="text-center">
        <p className="text-foreground/60">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className="text-amber-700 hover:text-amber-600 font-semibold transition">
            Log in
          </button>
        </p>
      </div>
    </motion.form>
  );
}
