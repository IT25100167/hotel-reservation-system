'use client';

import { useState } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { FeaturedRooms } from '@/components/landing/featured-rooms';
import { Facilities } from '@/components/landing/facilities';
import { Testimonials } from '@/components/landing/testimonials';
import { Footer } from '@/components/landing/footer';

interface SearchFilters {
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}

export default function Home() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    roomType: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero onSearch={setSearchFilters} />
      <FeaturedRooms filters={searchFilters} />
      <Facilities />
      <Testimonials />
      <Footer />
    </main>
  );
}
