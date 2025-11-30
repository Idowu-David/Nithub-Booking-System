import React, { useState } from 'react';
import { Desk, BookingFormData, BookingType } from '../types'; 

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
    }, 1500); 
  };
  
  const bookingTypes: { value: BookingType, label: string }[] = [
    { value: 'hourly', label: '1 Hour' },
    { value: 'half-day', label: 'Half Day (4 hrs)' },
    { value: 'full-day', label: 'Full Day (8 hrs)' },
  ];

  // Dark Glassmorphism Input Style
  const inputClasses = "mt-1 block w-full rounded-lg bg-gray-800/70 text-white border border-white/10 shadow-inner p-3 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm transition-all";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-2xl border border-indigo-500/20 w-full max-w-md">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-white mb-2">Book Desk {desk.name}</h3>
          <p className="text-indigo-300 mb-6">{desk.location}</p>
          
          {isSubmitting ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-400 mb-4"></div>
              <p className="text-lg text-indigo-200">Processing Payment & Reservation...</p>
            </div>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">Date</label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 10)}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-300">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="bookingType" className="block text-sm font-medium text-gray-300">Duration</label>
                <select
                  name="bookingType"
                  id="bookingType"
                  value={formData.bookingType}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                >
                  {bookingTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-300">Purpose (Optional)</label>
                <textarea
                  name="purpose"
                  id="purpose"
                  rows={2}
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="e.g., Deep focus work or team meeting"
                  className={inputClasses}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-medium text-gray-300 bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition-colors"
                >
                  Confirm Booking ({desk.price.split('/')[0]})
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