'use client'
import React from 'react'

interface StatsCardProps {
  label: string
  value: number
  color?: 'gray' | 'green' | 'red' | 'indigo'
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, color = 'gray' }) => {
  const colorClasses = {
    gray: 'text-gray-800',
    green: 'text-green-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm font-medium text-gray-500 mb-2">{label}</div>
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
    </div>
  )
}

export default StatsCard