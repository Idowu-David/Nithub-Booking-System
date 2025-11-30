// src/components/UserBookings.tsx
import React from 'react';
import Link from 'next/link';
import { Booking, BookingStatus } from '../index'; 

interface UserBookingsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: number) => void;
  onNavigate: (view: 'dashboard') => void; // Added for internal navigation
}

const formatDisplayDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusStyles = (status: BookingStatus) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'upcoming':
      return 'bg-indigo-100 text-indigo-700 border-indigo-300';
    case 'completed':
      return 'bg-gray-100 text-gray-500 border-gray-300';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
};

const UserBookings: React.FC<UserBookingsProps> = ({ bookings, onCancelBooking, onNavigate }) => {
  
  const sortedBookings = bookings
    .slice()
    .sort((a, b) => {
      const statusA = a.status === 'active' ? 2 : a.status === 'upcoming' ? 1 : 0;
      const statusB = b.status === 'active' ? 2 : b.status === 'upcoming' ? 1 : 0;
      
      if (statusA !== statusB) {
        return statusB - statusA; 
      }
      
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-lg m-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Found 😢</h2>
        <p className="text-gray-600 mb-4">You haven't booked any desks yet.</p>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Browse Available Desks
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🗓️ My Bookings</h2>
      
      <div className="space-y-4">
        {sortedBookings.map((booking) => {
          const isActionable = booking.status === 'upcoming' || booking.status === 'active';
          
          return (
            <div 
              key={booking.id} 
              className="bg-white p-6 rounded-lg shadow-md flex justify-between items-start transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{booking.deskIcon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-indigo-700">{booking.deskName}</h3>
                  <p className="text-sm text-gray-600">{booking.location}</p>
                  <p className="text-gray-700 font-medium mt-1">
                    {formatDisplayDate(booking.startDate)} | {booking.startTime} - {booking.endTime}
                  </p>
                  <p className="text-sm text-gray-500 italic">Purpose: {booking.purpose}</p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {/* Status Badge */}
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                
                {isActionable && (
                  <button
                    onClick={() => onCancelBooking(booking.id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                {booking.status === 'completed' && (
                  <span className="px-3 py-1 text-xs font-medium text-gray-600">Archived</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserBookings;