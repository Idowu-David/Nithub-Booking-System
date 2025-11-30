'use client'
import React from 'react'
import { Booking } from '../index'

interface BookingCardProps {
  booking: Booking
  onCancel: (id: number) => void
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const getStatusColor = (status: Booking['status']): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Booking['status']): string => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-lg ${
        booking.status === 'active' 
          ? 'border-2 border-indigo-200 bg-indigo-50' 
          : 'border border-gray-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{booking.deskIcon}</div>
        <div>
          <p className="font-semibold text-gray-800">{booking.deskName}</p>
          <p className="text-sm text-gray-600">{booking.location}</p>
          <p className="text-sm text-gray-600">{booking.date}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`px-3 py-1 rounded-full text-sm font-medium block mb-2 ${getStatusColor(booking.status)}`}>
          {getStatusText(booking.status)}
        </span>
        <button 
          onClick={() => onCancel(booking.id)}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default BookingCard