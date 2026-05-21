export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
  amenities: string[];
  available: boolean;
}

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  roomId: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalPrice: number;
  numberOfGuests: number;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface DashboardMetric {
  label: string;
  value: number | string;
  icon?: string;
  trend?: number;
}

export interface BookingTrend {
  date: string;
  bookings: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
}
