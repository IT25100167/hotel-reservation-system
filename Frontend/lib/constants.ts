import { User, Room, Booking, Facility, BookingTrend, RevenueTrend } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@hotel.com',
    role: 'ADMIN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@hotel.com',
    role: 'STAFF',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff',
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'customer@hotel.com',
    role: 'CUSTOMER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
  },
];

export const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Deluxe Suite',
    description: 'Spacious suite with premium amenities and city view',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=350&fit=crop',
    price: 299,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Bathrobe'],
    available: true,
  },
  {
    id: '2',
    name: 'Royal Penthouse',
    description: 'Luxurious penthouse with panoramic views and private balcony',
    image: 'https://images.unsplash.com/photo-1578683078519-94d5c0f6e3b1?w=500&h=350&fit=crop',
    price: 599,
    capacity: 4,
    amenities: ['WiFi', 'Hot Tub', 'Private Bar', 'Jacuzzi'],
    available: true,
  },
  {
    id: '3',
    name: 'Ocean View Room',
    description: 'Elegant room with ocean view and private beach access',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=350&fit=crop',
    price: 399,
    capacity: 3,
    amenities: ['WiFi', 'Beach Access', 'Sauna', 'Room Service'],
    available: true,
  },
  {
    id: '4',
    name: 'Standard Room',
    description: 'Comfortable room with essential amenities',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=350&fit=crop',
    price: 149,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC'],
    available: false,
  },
];

export const MOCK_FACILITIES: Facility[] = [
  { id: '1', name: 'Free WiFi', icon: '📶', description: 'High-speed internet throughout the hotel' },
  { id: '2', name: 'Swimming Pool', icon: '🏊', description: 'Olympic-size heated pool' },
  { id: '3', name: 'Fitness Center', icon: '💪', description: 'State-of-the-art gym equipment' },
  { id: '4', name: 'Restaurant', icon: '🍽️', description: '5-star dining experience' },
  { id: '5', name: 'Spa & Wellness', icon: '🧖', description: 'Full-service spa and massage' },
  { id: '6', name: 'Business Center', icon: '💼', description: 'Complete office facilities' },
  { id: '7', name: '24/7 Concierge', icon: '🛎️', description: 'Always available assistance' },
  { id: '8', name: 'Room Service', icon: '🚀', description: 'Dining in your room anytime' },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'B001',
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah@example.com',
    roomId: '1',
    roomName: 'Deluxe Suite',
    checkInDate: '2024-05-20',
    checkOutDate: '2024-05-23',
    status: 'confirmed',
    totalPrice: 897,
    numberOfGuests: 2,
  },
  {
    id: 'B002',
    guestName: 'Michael Chen',
    guestEmail: 'michael@example.com',
    roomId: '2',
    roomName: 'Royal Penthouse',
    checkInDate: '2024-05-22',
    checkOutDate: '2024-05-25',
    status: 'checked-in',
    totalPrice: 1797,
    numberOfGuests: 4,
  },
  {
    id: 'B003',
    guestName: 'Emma Williams',
    guestEmail: 'emma@example.com',
    roomId: '3',
    roomName: 'Ocean View Room',
    checkInDate: '2024-05-25',
    checkOutDate: '2024-05-27',
    status: 'pending',
    totalPrice: 798,
    numberOfGuests: 2,
  },
  {
    id: 'B004',
    guestName: 'James Smith',
    guestEmail: 'james@example.com',
    roomId: '1',
    roomName: 'Deluxe Suite',
    checkInDate: '2024-05-18',
    checkOutDate: '2024-05-20',
    status: 'checked-out',
    totalPrice: 597,
    numberOfGuests: 2,
  },
];

export const MOCK_BOOKING_TRENDS: BookingTrend[] = [
  { date: 'Mon', bookings: 24 },
  { date: 'Tue', bookings: 13 },
  { date: 'Wed', bookings: 28 },
  { date: 'Thu', bookings: 39 },
  { date: 'Fri', bookings: 42 },
  { date: 'Sat', bookings: 51 },
  { date: 'Sun', bookings: 38 },
];

export const MOCK_REVENUE_TRENDS: RevenueTrend[] = [
  { date: 'Mon', revenue: 4400 },
  { date: 'Tue', revenue: 3000 },
  { date: 'Wed', revenue: 2000 },
  { date: 'Thu', revenue: 2780 },
  { date: 'Fri', revenue: 1890 },
  { date: 'Sat', revenue: 2390 },
  { date: 'Sun', revenue: 3490 },
];
