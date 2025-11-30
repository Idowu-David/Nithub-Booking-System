'use client'
import React from 'react'
import { Desk } from '../index'

interface BookingModalProps {
  desk: Desk | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const BookingModal: React.FC<BookingModalProps> = ({ desk, isOpen, onClose, onSubmit }) => {
  if (!isOpen || !desk) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Book {desk.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              type="button"
            >
              ×
            </button>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700 mb-1"><strong>Location:</strong> {desk.location}</p>
            <p className="text-sm text-gray-700"><strong>Price:</strong> {desk.price}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="booking-type" className="block text-sm font-medium text-gray-700 mb-2">
                Booking Type
              </label>
              <select 
                id="booking-type"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="">Select booking type</option>
                <option value="hourly">Hourly (₦200/hour)</option>
                <option value="half-day">Half Day (₦800)</option>
                <option value="full-day">Full Day (₦1,500)</option>
                <option value="weekly">Weekly Pass (₦7,000)</option>
                <option value="monthly">Monthly Pass (₦25,000)</option>
              </select>
            </div>

            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  id="start-time"
                  type="time"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  id="end-time"
                  type="time"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                Purpose (Optional)
              </label>
              <textarea
                id="purpose"
                rows={3}
                placeholder="What will you be working on?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">I agree to the terms and conditions</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookingModal