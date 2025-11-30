'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Desk, Booking } from '../../index'
import DeskCard from '../../components/DeskCard'
import BookingCard from '../../components/BookingCard'
import BookingModal from '../../components/BookingModal'
import StatsCard from '../../components/StatsCard'

type FilterType = 'all' | 'available' | 'floor1' | 'floor2' | 'floor3'

const User: React.FC = () => {
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false)
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const desks: Desk[] = [
    {
      id: 1,
      name: "Desk 1",
      location: "Window Side - Floor 1",
      status: "available",
      price: "₦1,500/day",
      features: ["Power Outlet", "Adjustable Chair", "Natural Light"],
      image: "🪑"
    },
    {
      id: 2,
      name: "Desk 2",
      location: "Quiet Zone - Floor 1",
      status: "available",
      price: "₦1,500/day",
      features: ["Power Outlet", "Ergonomic Chair", "Privacy Screen"],
      image: "💺"
    },
    {
      id: 3,
      name: "Desk 3",
      location: "Collaborative Area - Floor 1",
      status: "occupied",
      price: "₦1,500/day",
      features: ["Power Outlet", "Standing Desk", "Nearby Lounge"],
      image: "🪑"
    },
    {
      id: 4,
      name: "Desk 4",
      location: "Window Side - Floor 2",
      status: "available",
      price: "₦2,000/day",
      features: ["Power Outlet", "Dual Monitor Setup", "Natural Light"],
      image: "💺"
    },
    {
      id: 5,
      name: "Desk 5",
      location: "Quiet Zone - Floor 2",
      status: "available",
      price: "₦1,500/day",
      features: ["Power Outlet", "Ergonomic Chair", "Bookshelf Access"],
      image: "🪑"
    },
    {
      id: 6,
      name: "Desk 6",
      location: "Tech Hub - Floor 2",
      status: "available",
      price: "₦2,500/day",
      features: ["Power Outlet", "USB Charging", "Monitor", "Fast WiFi"],
      image: "💺"
    },
    {
      id: 7,
      name: "Desk 7",
      location: "Collaborative Area - Floor 2",
      status: "occupied",
      price: "₦1,500/day",
      features: ["Power Outlet", "Adjustable Chair", "Whiteboard Access"],
      image: "🪑"
    },
    {
      id: 8,
      name: "Desk 8",
      location: "Window Side - Floor 3",
      status: "available",
      price: "₦2,000/day",
      features: ["Power Outlet", "Premium Chair", "City View"],
      image: "💺"
    },
    {
      id: 9,
      name: "Desk 9",
      location: "Private Pod - Floor 3",
      status: "available",
      price: "₦3,000/day",
      features: ["Power Outlet", "Enclosed Space", "Phone Booth Nearby"],
      image: "🪑"
    },
    {
      id: 10,
      name: "Desk 10",
      location: "Quiet Zone - Floor 3",
      status: "available",
      price: "₦1,500/day",
      features: ["Power Outlet", "Ergonomic Chair", "Plants Nearby"],
      image: "💺"
    },
    {
      id: 11,
      name: "Desk 11",
      location: "Tech Hub - Floor 3",
      status: "available",
      price: "₦2,500/day",
      features: ["Power Outlet", "Monitor", "USB Hub", "Cable Management"],
      image: "🪑"
    },
    {
      id: 12,
      name: "Desk 12",
      location: "Collaborative Area - Floor 3",
      status: "available",
      price: "₦1,500/day",
      features: ["Power Outlet", "Standing Desk", "Meeting Room Access"],
      image: "💺"
    }
  ]

  const myBookings: Booking[] = [
    {
      id: 1,
      deskName: "Desk 5",
      deskIcon: "🪑",
      location: "Quiet Zone - Floor 2",
      date: "Dec 1, 2024 • Full Day",
      status: "active"
    },
    {
      id: 2,
      deskName: "Desk 8",
      deskIcon: "💺",
      location: "Window Side - Floor 3",
      date: "Dec 5, 2024 • Full Day",
      status: "upcoming"
    },
    {
      id: 3,
      deskName: "Desk 2",
      deskIcon: "🪑",
      location: "Quiet Zone - Floor 1",
      date: "Dec 10, 2024 • Full Day",
      status: "upcoming"
    }
  ]

  const handleBookDesk = (desk: Desk): void => {
    if (desk.status === "occupied") {
      alert("This desk is currently occupied. Please select another desk.")
      return
    }
    setSelectedDesk(desk)
    setShowBookingModal(true)
  }

  const handleSubmitBooking = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (selectedDesk) {
      alert(`Booking submitted for ${selectedDesk.name}`)
      setShowBookingModal(false)
    }
  }

  const handleCancelBooking = (id: number): void => {
    alert(`Booking ${id} cancelled`)
  }

  // Filter logic
  const getFilteredDesks = (): Desk[] => {
    switch (activeFilter) {
      case 'available':
        return desks.filter(desk => desk.status === 'available')
      case 'floor1':
        return desks.filter(desk => desk.location.includes('Floor 1'))
      case 'floor2':
        return desks.filter(desk => desk.location.includes('Floor 2'))
      case 'floor3':
        return desks.filter(desk => desk.location.includes('Floor 3'))
      case 'all':
      default:
        return desks
    }
  }

  const filteredDesks = getFilteredDesks()
  const availableDesks = desks.filter(desk => desk.status === "available").length
  const occupiedDesks = desks.filter(desk => desk.status === "occupied").length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">NitHub Co-working Space</h1>
              <p className="text-sm text-gray-500 mt-1">Book your desk today</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
                Home
              </Link>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-indigo-100">Find and book your perfect workspace.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard label="Total Desks" value={desks.length} color="gray" />
          <StatsCard label="Available" value={availableDesks} color="green" />
          <StatsCard label="Occupied" value={occupiedDesks} color="red" />
          <StatsCard label="My Bookings" value={myBookings.length} color="indigo" />
        </div>

        {/* Filter Options */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
            </div>
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeFilter === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Desks
            </button>
            <button 
              onClick={() => setActiveFilter('available')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeFilter === 'available'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Available Only
            </button>
            <button 
              onClick={() => setActiveFilter('floor1')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeFilter === 'floor1'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Floor 1
            </button>
            <button 
              onClick={() => setActiveFilter('floor2')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeFilter === 'floor2'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Floor 2
            </button>
            <button 
              onClick={() => setActiveFilter('floor3')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeFilter === 'floor3'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Floor 3
            </button>
          </div>
        </div>

        {/* Available Desks */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {activeFilter === 'all' && 'All Desks'}
              {activeFilter === 'available' && 'Available Desks'}
              {activeFilter === 'floor1' && 'Floor 1 Desks'}
              {activeFilter === 'floor2' && 'Floor 2 Desks'}
              {activeFilter === 'floor3' && 'Floor 3 Desks'}
              <span className="text-lg text-gray-500 ml-2">({filteredDesks.length})</span>
            </h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-gray-600">Occupied</span>
              </div>
            </div>
          </div>
          
          {filteredDesks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesks.map((desk) => (
                <DeskCard key={desk.id} desk={desk} onBook={handleBookDesk} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No desks found matching your filter.</p>
            </div>
          )}
        </div>

        {/* My Current Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Current Bookings</h3>
          <div className="space-y-4">
            {myBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={handleCancelBooking} />
            ))}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal
        desk={selectedDesk}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleSubmitBooking}
      />
    </div>
  )
}

export default User