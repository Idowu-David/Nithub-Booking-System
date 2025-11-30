import React from 'react';
import { Booking, BookingStatus } from '../types';

interface UserBookingsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: number) => void;
  onNavigate: (view: 'dashboard' | 'bookings' | 'profile') => void;
}

const UserBookings: React.FC<UserBookingsProps> = ({ bookings, onCancelBooking, onNavigate }) => {
  
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'upcoming': return 'bg-indigo-600';
      case 'completed': return 'bg-gray-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-700';
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    // Sort by status (active/upcoming first), then by date
    const statusOrder: Record<BookingStatus, number> = { 'active': 1, 'upcoming': 2, 'completed': 3, 'cancelled': 4 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-6">🗓️ My Reservations</h2>
      
      {sortedBookings.length === 0 ? (
        <div className="bg-gray-900/70 backdrop-blur-md p-10 rounded-xl text-center border border-white/10 shadow-lg">
          <p className="text-xl text-gray-300 mb-4">You have no upcoming or past bookings.</p>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/50"
          >
            Start Booking Now
          </button>
        </div>
      ) : (
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="text-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Desk</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sortedBookings.map((booking) => {
                const canCancel = booking.status === 'upcoming' || booking.status === 'active';
                
                return (
                  <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <span className="text-lg mr-2">{booking.deskIcon}</span>{booking.deskName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{booking.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {booking.startDate} at {booking.startTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                      {booking.bookingType.replace('-', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {canCancel ? (
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="text-red-400 hover:text-red-300 transition-colors text-xs font-bold"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-500 text-xs">No Action</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserBookings;