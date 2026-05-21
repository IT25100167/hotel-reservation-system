'use client';

import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { FeaturedRooms } from '@/components/landing/featured-rooms';
import { Facilities } from '@/components/landing/facilities';
import { Testimonials } from '@/components/landing/testimonials';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedRooms />
      <Facilities />
      <Testimonials />
      <Footer />
    </main>
  );
}
