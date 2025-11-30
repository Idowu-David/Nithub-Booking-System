// src/components/DeskGridCard.tsx
import React from 'react';
import { Desk } from '../index'; 

interface DeskGridCardProps {
  desk: Desk;
  onBook: (desk: Desk) => void;
}

const DeskGridCard: React.FC<DeskGridCardProps> = ({ desk, onBook }) => {
  const isBooked = desk.status === 'occupied';
  
  const cardClasses = `p-4 rounded-lg shadow-md transition-all duration-200 text-center ${
    isBooked 
      ? 'bg-gray-200 border-gray-300' 
      : 'bg-white border-indigo-600 hover:bg-indigo-50 hover:border-indigo-700 cursor-pointer'
  }`;
  const buttonClasses = `mt-3 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
    isBooked 
      ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
      : 'bg-indigo-600 text-white hover:bg-indigo-700'
  }`;

  return (
    <div className={cardClasses} onClick={() => !isBooked && onBook(desk)}>
      <div className="text-4xl mb-2">{desk.image}</div>
      <h4 className={`text-lg font-bold ${isBooked ? 'text-gray-600' : 'text-indigo-800'}`}>
        {desk.name}
      </h4>
      <p className="text-sm text-gray-500 mb-3">{desk.location}</p>
      <div className="text-xs text-gray-500 mb-4 h-6 overflow-hidden">
        {desk.features.slice(0, 3).join(', ')}
      </div>
      <p className={`text-md font-bold ${isBooked ? 'text-gray-500' : 'text-green-600'}`}>
        {isBooked ? 'Occupied' : desk.price}
      </p>
      <button 
        className={buttonClasses}
        onClick={(e) => {
          e.stopPropagation();
          !isBooked && onBook(desk);
        }}
        disabled={isBooked}
      >
        {isBooked ? 'Booked' : 'Book Now'}
      </button>
    </div>
  );
};

export default DeskGridCard;