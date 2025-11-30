// src/components/BookingModal.tsx
import React, { useState } from 'react';
import { Desk, BookingFormData, BookingType } from '../index'; 

interface BookingModalProps {
  desk: Desk | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: BookingFormData) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ desk, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: new Date().toISOString().slice(0, 10), 
    startTime: '09:00',
    bookingType: 'full-day',
    purpose: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !desk) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
        onSubmit(formData);
        setIsSubmitting(false);
        onClose(); 
    }, 1500); 
  };
  
  const bookingTypes: { value: BookingType, label: string }[] = [
    { value: 'hourly', label: '1 Hour' },
    { value: 'half-day', label: 'Half Day (4 hrs)' },
    { value: 'full-day', label: 'Full Day (8 hrs)' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Book Desk {desk.name}</h3>
          
          {isSubmitting ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
              <p className="text-md text-gray-600">Reserving Your Spot...</p>
            </div>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 10)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="bookingType" className="block text-sm font-medium text-gray-700">Duration</label>
                <select
                  name="bookingType"
                  id="bookingType"
                  value={formData.bookingType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                >
                  {bookingTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose</label>
                <textarea
                  name="purpose"
                  id="purpose"
                  rows={2}
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="e.g., Deep focus work"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookingModal;