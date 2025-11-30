'use client'
import React from 'react'
import { Desk } from '../index'

interface DeskCardProps {
  desk: Desk
  onBook: (desk: Desk) => void
}

const DeskCard: React.FC<DeskCardProps> = ({ desk, onBook }) => {
  return (
    <div 
      className={`border-2 rounded-lg p-5 transition-all ${
        desk.status === "available" 
          ? "border-green-200 hover:shadow-lg hover:border-green-400" 
          : "border-red-200 bg-gray-50 opacity-75"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="text-4xl">{desk.image}</div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          desk.status === "available" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {desk.status === "available" ? "Available" : "Occupied"}
        </span>
      </div>
      
      <h4 className="text-xl font-bold text-gray-800 mb-1">{desk.name}</h4>
      <p className="text-sm text-gray-600 mb-2">{desk.location}</p>
      <p className="text-indigo-600 font-bold text-lg mb-3">{desk.price}</p>
      
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Features:</p>
        <div className="flex flex-wrap gap-1">
          {desk.features.map((feature, index) => (
            <span key={index} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => onBook(desk)}
        disabled={desk.status === "occupied"}
        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
          desk.status === "available"
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {desk.status === "available" ? "Book Now" : "Not Available"}
      </button>
    </div>
  )
}

export default DeskCard