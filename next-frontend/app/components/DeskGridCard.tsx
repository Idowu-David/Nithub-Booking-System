import React from 'react';
import { Desk } from '../types';

interface DeskGridCardProps {
  desk: Desk;
  onBook: (desk: Desk) => void;
}

const DeskGridCard: React.FC<DeskGridCardProps> = ({ desk, onBook }) => {
  const isOccupied = desk.status === 'occupied';

  // Glassmorphism Card Style
  const cardClasses = `
    p-5 rounded-xl transition-all duration-300 
    backdrop-blur-md border border-white/10 shadow-xl shadow-black/30
    ${isOccupied 
      ? 'bg-red-900/10 cursor-not-allowed opacity-70' 
      : 'bg-indigo-900/10 hover:bg-indigo-800/20 hover:scale-[1.02] cursor-pointer'
    }
  `;

  const statusColor = isOccupied ? 'text-red-400' : 'text-green-400';
  const statusText = isOccupied ? 'OCCUPIED' : 'AVAILABLE';

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={cardClasses} onClick={() => !isOccupied && onBook(desk)}>
      <div className="text-4xl mb-3">{desk.image}</div>
      <h3 className="text-xl font-bold text-white mb-1">{desk.name}</h3>
      <p className="text-sm text-indigo-300 font-medium mb-3">{desk.location}</p>

      <div className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${statusColor} bg-white/5 mb-3`}>
        {statusText}
      </div>

      <div className="space-y-1 text-gray-300 text-sm">
        <p>
          <span className="font-bold text-white">{desk.price}</span>
        </p>
        
        {desk.currentBooking && isOccupied && (
            <p className="text-xs text-red-300 mt-1">
                Booked until: {formatTime(new Date(desk.currentBooking.endTime))}
            </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
            {desk.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full">
                    {feature}
                </span>
            ))}
        </div>
      </div>
      
      {!isOccupied && (
        <button
          className="mt-4 w-full py-2 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-700 transition-colors"
          onClick={(e) => { e.stopPropagation(); onBook(desk); }}
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default DeskGridCard;