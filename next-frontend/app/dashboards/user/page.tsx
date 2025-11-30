'use client'
import { useState } from 'react'
import Link from 'next/link'

const User = () => {
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDesk, setSelectedDesk] = useState(null)

  const desks = [
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

  const handleBookDesk = (desk) => {
    if (desk.status === "occupied") {
      alert("This desk is currently occupied. Please select another desk.")
      return
    }
    setSelectedDesk(desk)
    setShowBookingModal(true)
  }

  const handleSubmitBooking = (e) => {
    e.preventDefault()
    // Handle booking submission here
    alert(`Booking submitted for ${selectedDesk.name}`)
    setShowBookingModal(false)
  }

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
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Desks</div>
            <div className="text-3xl font-bold text-gray-800">{desks.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Available</div>
            <div className="text-3xl font-bold text-green-600">{availableDesks}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Occupied</div>
            <div className="text-3xl font-bold text-red-600">{occupiedDesks}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">My Bookings</div>
            <div className="text-3xl font-bold text-indigo-600">3</div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
            </div>
            <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm">
              All Desks
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm">
              Available Only
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm">
              Floor 1
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm">
              Floor 2
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm">
              Floor 3
            </button>
          </div>
        </div>

        {/* Available Desks */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Available Desks</h3>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {desks.map((desk) => (
              <div 
                key={desk.id} 
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
                  onClick={() => handleBookDesk(desk)}
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
            ))}
          </div>
        </div>

        {/* My Current Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Current Bookings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-2 border-indigo-200 bg-indigo-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🪑</div>
                <div>
                  <p className="font-semibold text-gray-800">Desk 5</p>
                  <p className="text-sm text-gray-600">Quiet Zone - Floor 2</p>
                  <p className="text-sm text-gray-600">Dec 1, 2024 • Full Day</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium block mb-2">
                  Active
                </span>
                <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                  Cancel
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-3xl">💺</div>
                <div>
                  <p className="font-semibold text-gray-800">Desk 8</p>
                  <p className="text-sm text-gray-600">Window Side - Floor 3</p>
                  <p className="text-sm text-gray-600">Dec 5, 2024 • Full Day</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium block mb-2">
                  Upcoming
                </span>
                <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                  Cancel
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🪑</div>
                <div>
                  <p className="font-semibold text-gray-800">Desk 2</p>
                  <p className="text-sm text-gray-600">Quiet Zone - Floor 1</p>
                  <p className="text-sm text-gray-600">Dec 10, 2024 • Full Day</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium block mb-2">
                  Upcoming
                </span>
                <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Book {selectedDesk?.name}</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-700 mb-1"><strong>Location:</strong> {selectedDesk?.location}</p>
                <p className="text-sm text-gray-700"><strong>Price:</strong> {selectedDesk?.price}</p>
              </div>

              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Type
                  </label>
                  <select 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select booking type</option>
                    <option value="hourly">Hourly (₦200/hour)</option>
                    <option value="half-day">Half Day (₦800)</option>
                    <option value="full-day">Full Day (₦1,500)</option>
                    <option value="weekly">Weekly Pass (₦7,000)</option>
                    <option value="monthly">Monthly Pass (₦25,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose (Optional)
                  </label>
                  <textarea
                    rows="3"
                    placeholder="What will you be working on?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">I agree to the terms and conditions</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default User