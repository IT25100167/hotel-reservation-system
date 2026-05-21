'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
  id: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/reservations/all');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id: number) => {
    try {
      
      const confirmRes = await fetch(`http://localhost:8080/reservations/confirm/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!confirmRes.ok) {
        alert('Failed to confirm booking');
        return;
      }

     
      const paymentRes = await fetch(`http://localhost:8080/payments/create-for-reservation/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!paymentRes.ok) {
        const errorMsg = await paymentRes.text();
        console.error('Payment creation error:', errorMsg);
      }

    
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CONFIRMED' } : b));
      alert('Booking confirmed and payment created!');
      
      
      await fetchBookings();
    } catch (err) {
      console.error('Error:', err);
      alert('Error confirming booking');
    }
  };

  const cancelBooking = async (id: number) => {
    try {
      console.log('Cancelling booking:', id);
      const res = await fetch(`http://localhost:8080/reservations/cancel/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
        alert('Booking cancelled successfully!');
        fetchBookings();
      } else {
        const errorText = await res.text();
        alert(`Failed to cancel booking: ${errorText}`);
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Error cancelling booking: ' + err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="w-4 h-4" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-2">View and confirm customer bookings</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-in</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-out</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guests</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">#{booking.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">Room {booking.roomId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.numberOfGuests}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        Rs {booking.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => confirmBooking(booking.id)}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
