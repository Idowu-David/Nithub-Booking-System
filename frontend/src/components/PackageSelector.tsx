"use client"; // Keep this if using Next.js, otherwise remove

import { useState, useEffect } from "react";
import { CheckCircle, Sparkles } from "lucide-react";

// Define the shape of a package object
type Package = {
  id: number;
  label: string;
  mins: number;
  price: number;
  popular: boolean;
};

// Define the data structure sent back to the parent
type SelectionData = {
  mins: number;
  price: number;
  count: number;
};

// Define component props
type PackageSelectorProps = {
  onSelectionChange: (data: SelectionData) => void;
};

// Define our products
const PACKAGES: Package[] = [
  { id: 1, label: "30 Mins", mins: 30, price: 500, popular: false },
  { id: 2, label: "1 Hour", mins: 60, price: 1000, popular: true },
  { id: 3, label: "2 Hours", mins: 120, price: 1800, popular: false },
  { id: 4, label: "Half Day", mins: 240, price: 3500, popular: false },
];

const PackageSelector = ({ onSelectionChange }: PackageSelectorProps) => {
  // 1. Local State: Keeps track of highlighting cards
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 2. Handler: Toggle selection logic
  const togglePackage = (pkgId: number) => {
    setSelectedIds(
      (prev) =>
        prev.includes(pkgId)
          ? prev.filter((id) => id !== pkgId) // Remove if exists
          : [...prev, pkgId] // Add if new
    );
  };

  // 3. Effect: Calculate totals and send to Parent (Dashboard)
  useEffect(() => {
    // Filter the full package objects based on selected IDs
    const selectedItems = PACKAGES.filter((p) => selectedIds.includes(p.id));

    const totalMins = selectedItems.reduce((sum, item) => sum + item.mins, 0);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

    // Call the parent's function with the new data
    onSelectionChange({
      mins: totalMins,
      price: totalPrice,
      count: selectedIds.length,
    });
  }, [selectedIds, onSelectionChange]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {PACKAGES.map((pkg) => {
        const isSelected = selectedIds.includes(pkg.id);

        return (
          <div
            key={pkg.id}
            onClick={() => togglePackage(pkg.id)}
            className={`
              relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
              flex flex-col items-center justify-between min-h-[160px] select-none
              ${
                isSelected
                  ? "border-blue-600 bg-blue-50 shadow-xl scale-105 z-10"
                  : "border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg"
              }
            `}
          >
            {/* Visual Flair */}
            {pkg.popular && (
              <span className="absolute -top-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles size={10} /> BEST VALUE
              </span>
            )}

            {isSelected && (
              <CheckCircle className="absolute top-3 right-3 text-blue-600 w-5 h-5 animate-in zoom-in" />
            )}

            {/* Content */}
            <div className="text-center mt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Duration
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {pkg.label}
              </h3>
            </div>

            <div
              className={`w-8 h-1 rounded-full my-3 ${
                isSelected ? "bg-blue-200" : "bg-slate-100"
              }`}
            ></div>

            <div className="text-center">
              <p
                className={`text-xl font-bold ${
                  isSelected ? "text-blue-700" : "text-slate-600"
                }`}
              >
                <span className="text-sm font-normal text-slate-400 mr-1">
                  ₦
                </span>
                {pkg.price.toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PackageSelector;
