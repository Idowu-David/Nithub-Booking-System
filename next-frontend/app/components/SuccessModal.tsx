// src/components/SuccessModal.tsx
import React, { useEffect } from 'react';
import { Desk } from '../index'; 

interface SuccessModalProps {
  desk: Desk | null;
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ desk, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !desk) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm">
        <div className="p-6 text-center">
          <div className="text-5xl text-green-500 mb-4">✅</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            You successfully booked **{desk.name}**.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Great!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;