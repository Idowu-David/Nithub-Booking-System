'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Sparkles, ShoppingBag } from 'lucide-react';

// Define the shape of a package object
type Package = {
  id: number;
  durationLabel: string;
  durationMins: number;
  price: number;
  popular: boolean;
};

// Define props to pass data back to the parent
type PackageSelectorProps = {
  onChange?: (totalMins: number, totalPrice: number) => void;
};

const PackageSelector = ({ onChange }: PackageSelectorProps) => {
  // State to track multiple selected packages (Array of IDs)
  // Fix: Explicitly type the state as an array of numbers to avoid 'never[]' inference
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Mock Data for Packages
  const packages: Package[] = [
    { id: 1, durationLabel: "30 Mins", durationMins: 30, price: 500, popular: false },
    { id: 2, durationLabel: "1 Hour", durationMins: 60, price: 1000, popular: true },
    { id: 3, durationLabel: "2 Hours", durationMins: 120, price: 1800, popular: false }, // Slight discount
    { id: 4, durationLabel: "Half Day", durationMins: 240, price: 3500, popular: false },
  ];

  const handleSelect = (pkg: Package) => {
    setSelectedIds((prev) => {
      if (prev.includes(pkg.id)) {
        // Remove if already selected
        return prev.filter((id) => id !== pkg.id);
      } else {
        // Add if not selected
        return [...prev, pkg.id];
      }
    });
  };

  // Calculate Totals
  const selectedPackages = packages.filter((p) => selectedIds.includes(p.id));
  const totalMins = selectedPackages.reduce((sum, p) => sum + p.durationMins, 0);
  const totalPrice = selectedPackages.reduce((sum, p) => sum + p.price, 0);

  // Notify parent component whenever totals change
  useEffect(() => {
    if (onChange) {
      onChange(totalMins, totalPrice);
    }
  }, [totalMins, totalPrice, onChange]);

  // Helper to format total duration nicely
  const formatTotalDuration = (mins: number) => {
    if (mins === 0) return "0 mins";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h} hr ${m} mins`;
    if (h > 0) return `${h} hr${h > 1 ? 's' : ''}`;
    return `${m} mins`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-blue-600" /> 
            Select Duration Packages
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Click multiple cards to stack your time.
          </p>
        </div>

        {/* Live Summary Badge */}
        {totalMins > 0 && (
          <div className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-4 shadow-lg animate-in slide-in-from-right-5 fade-in duration-300">
            <div className="text-right border-r border-slate-700 pr-4">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Time</p>
                <p className="font-bold text-lg leading-none">{formatTotalDuration(totalMins)}</p>
            </div>
            <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Price</p>
                <p className="font-bold text-lg text-green-400 leading-none">₦{totalPrice.toLocaleString()}</p>
            </div>
            <div className="bg-blue-600 p-2 rounded-lg ml-2">
                <ShoppingBag size={18} />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const isSelected = selectedIds.includes(pkg.id);

          return (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg)}
              className={`
                relative group cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2
                flex flex-col items-center justify-between min-h-[180px] select-none
                ${isSelected 
                  ? 'bg-blue-50 border-blue-600 shadow-xl shadow-blue-100 scale-105 z-10' 
                  : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-lg'
                }
              `}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={10} /> BEST VALUE
                </div>
              )}

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 text-blue-600 animate-in zoom-in duration-200">
                  <CheckCircle size={20} fill="currentColor" className="text-white" />
                </div>
              )}

              {/* Top: Duration */}
              <div className="text-center mt-2">
                <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                  Duration
                </p>
                <h4 className={`text-2xl font-black ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>
                  {pkg.durationLabel}
                </h4>
              </div>

              {/* Divider Line */}
              <div className={`w-12 h-1 rounded-full my-4 ${isSelected ? 'bg-blue-200' : 'bg-gray-100'}`}></div>

              {/* Bottom: Price */}
              <div className="text-center">
                 <p className="text-xs text-gray-400 mb-1">Price</p>
                 <div className={`text-xl font-bold flex items-center gap-0.5 ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                    <span className="text-sm align-top mt-0.5">₦</span>
                    {pkg.price.toLocaleString()}
                 </div>
              </div>
              
              {/* Multi-select helper text */}
              <p className={`text-[10px] mt-4 font-bold transition-opacity ${isSelected ? 'text-blue-400' : 'text-gray-300 opacity-0 group-hover:opacity-100'}`}>
                 {isSelected ? 'CLICK TO REMOVE' : 'CLICK TO ADD'}
              </p>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PackageSelector;