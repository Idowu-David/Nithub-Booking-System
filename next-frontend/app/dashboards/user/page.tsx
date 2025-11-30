// src/pages/User.tsx

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
// ⚠️ Ensure these paths match your project structure ⚠️
import { Desk, Booking, BookingFormData } from '../../index' 
import DeskGridCard from '../../components/DeskGridCard'
import BookingModal from '../../components/BookingModal'
import SuccessModal from '../../components/SuccessModal'
import UserBookings from '../../components/UserBookings'
import UserProfileSettings, { UserProfileData } from '../../components/UserProfileSettings'

// Type for view navigation
type DashboardView = 'dashboard' | 'bookings' | 'profile';

const initialDesks: Desk[] = [
  { id: 1, name: "D-1", location: "Window Side - Floor 1", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Adjustable Chair", "Natural Light"], image: "🪑" },
  { id: 2, name: "D-2", location: "Quiet Zone - Floor 1", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Ergonomic Chair", "Privacy Screen"], image: "💺" },
  { id: 3, name: "D-3", location: "Collaborative Area - Floor 1", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Standing Desk", "Nearby Lounge"], image: "🪑" },
  { id: 4, name: "D-4", location: "Window Side - Floor 2", status: "available", price: "₦2,000/day", features: ["Power Outlet", "Dual Monitor Setup", "Natural Light"], image: "💺" },
  { id: 5, name: "D-5", location: "Quiet Zone - Floor 2", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Ergonomic Chair", "Bookshelf Access"], image: "🪑" },
  { id: 6, name: "D-6", location: "Tech Hub - Floor 2", status: "available", price: "₦2,500/day", features: ["Power Outlet", "USB Charging", "Monitor", "Fast WiFi"], image: "💺" },
  { id: 7, name: "D-7", location: "Collaborative Area - Floor 2", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Adjustable Chair", "Whiteboard Access"], image: "🪑" },
  { id: 8, name: "D-8", location: "Window Side - Floor 3", status: "available", price: "₦2,000/day", features: ["Power Outlet", "Premium Chair", "City View"], image: "💺" },
  { id: 9, name: "D-9", location: "Private Pod - Floor 3", status: "available", price: "₦3,000/day", features: ["Power Outlet", "Enclosed Space", "Phone Booth Nearby"], image: "🪑" },
  { id: 10, name: "D-10", location: "Quiet Zone - Floor 3", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Ergonomic Chair", "Plants Nearby"], image: "💺" },
  { id: 11, name: "D-11", location: "Tech Hub - Floor 3", status: "available", price: "₦2,500/day", features: ["Power Outlet", "Monitor", "USB Hub", "Cable Management"], image: "🪑" },
  { id: 12, name: "D-12", location: "Collaborative Area - Floor 3", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Standing Desk", "Meeting Room Access"], image: "💺" },
  { id: 13, name: "D-13", location: "Window Side - Floor 1", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Adjustable Chair"], image: "🪑" },
  { id: 14, name: "D-14", location: "Quiet Zone - Floor 1", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Ergonomic Chair"], image: "💺" },
  { id: 15, name: "D-15", location: "Collaborative Area - Floor 2", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Standing Desk"], image: "🪑" },
  { id: 16, name: "D-16", location: "Window Side - Floor 2", status: "available", price: "₦2,000/day", features: ["Power Outlet", "Premium Chair"], image: "💺" },
  { id: 17, name: "D-17", location: "Tech Hub - Floor 3", status: "available", price: "₦2,500/day", features: ["Power Outlet", "Monitor"], image: "🪑" },
  { id: 18, name: "D-18", location: "Quiet Zone - Floor 3", status: "available", price: "₦1,500/day", features: ["Power Outlet", "Ergonomic Chair"], image: "💺" },
  { id: 19, name: "D-19", location: "Window Side - Floor 3", status: "available", price: "₦2,000/day", features: ["Power Outlet", "City View"], image: "🪑" },
  { id: 20, name: "D-20", location: "Private Pod - Floor 3", status: "available", price: "₦3,000/day", features: ["Power Outlet", "Enclosed Space"], image: "💺" }
];


const User: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null)
  const [myBookings, setMyBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [desks, setDesks] = useState<Desk[]>(initialDesks)
  const [profileData, setProfileData] = useState<UserProfileData>({ 
    fullName: "Alice Johnson",
    email: "alice.johnson@flexdesk.com",
    phone: "+234 800 123 4567",
    defaultFloor: "Floor 2",
    notificationPref: 'email',
  });


  // --- Booking Logic Helpers ---

  const hasActiveOrUpcomingBooking = (): boolean => {
    const now = new Date()
    return myBookings.some(booking => {
      const expiresAt = new Date(booking.expiresAt)
      return (booking.status === 'active' || booking.status === 'upcoming') && expiresAt > now
    })
  }

  const getActiveOrUpcomingBooking = (): Booking | null => {
    const now = new Date()
    return myBookings.find(booking => {
      const expiresAt = new Date(booking.expiresAt)
      return (booking.status === 'active' || booking.status === 'upcoming') && expiresAt > now
    }) || null
  }
  
  const calculateEndTime = (startDate: string, startTime: string, bookingType: string): Date => {
    const start = new Date(`${startDate}T${startTime}`)
    
    switch (bookingType) {
      case 'hourly': return new Date(start.getTime() + 60 * 60 * 1000)
      case 'half-day': return new Date(start.getTime() + 4 * 60 * 60 * 1000)
      case 'full-day': return new Date(start.getTime() + 8 * 60 * 60 * 1000)
      case 'weekly': return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)
      case 'monthly': return new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000)
      default: return new Date(start.getTime() + 60 * 60 * 1000)
    }
  }


  // --- Status and Desk Update Logic (Interval Check) ---

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      
      setMyBookings(prevBookings => 
        prevBookings.map(booking => {
          const startDateTime = new Date(`${booking.startDate}T${booking.startTime}`)
          const expiresAt = new Date(booking.expiresAt)
          
          let newStatus = booking.status;

          // Transition from upcoming to active
          if (now >= startDateTime && now < expiresAt && booking.status === 'upcoming') {
            newStatus = 'active' as const;
          } 
          // Transition from active/upcoming to completed
          else if (now >= expiresAt && booking.status !== 'completed' && booking.status !== 'cancelled') {
            newStatus = 'completed' as const;
          }

          // If status changed, update desks accordingly
          if (newStatus !== booking.status) {
            setDesks(prevDesks => 
              prevDesks.map(desk => {
                if (desk.id === booking.deskId) {
                  return { 
                    ...desk, 
                    status: (newStatus === 'active' ? 'occupied' : 'available') ,
                    currentBooking: (newStatus === 'active' ? { userId: 'current-user', endTime: expiresAt } : undefined)
                  };
                }
                return desk;
              })
            );
          }
          return { ...booking, status: newStatus };
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [myBookings])


  // --- Handlers ---

  const handleBookDesk = (desk: Desk): void => {
    if (desk.status === "occupied") {
      alert("This desk is currently occupied. Please select another desk.")
      return
    }

    if (hasActiveOrUpcomingBooking()) {
      const existingBooking = getActiveOrUpcomingBooking()
      alert(`You already have a ${existingBooking?.status} booking for ${existingBooking?.deskName}. Please cancel it or wait until it expires before making a new booking.`)
      return
    }

    setSelectedDesk(desk)
    setShowBookingModal(true)
  }

  const handleSubmitBooking = (formData: BookingFormData): void => {
    if (!selectedDesk) return

    const now = new Date()
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    const endDateTime = calculateEndTime(formData.startDate, formData.startTime, formData.bookingType)

    if (startDateTime < now) {
      alert("Cannot book a desk for a past time. Please select a future time.")
      return
    }

    const status: 'active' | 'upcoming' = startDateTime <= now ? 'active' : 'upcoming'

    const newBooking: Booking = {
      id: Date.now(),
      deskId: selectedDesk.id,
      deskName: selectedDesk.name,
      deskIcon: selectedDesk.image,
      location: selectedDesk.location,
      bookingType: formData.bookingType,
      startDate: formData.startDate,
      startTime: formData.startTime,
      endTime: endDateTime.toTimeString().slice(0, 5),
      purpose: formData.purpose,
      status: status,
      createdAt: now,
      expiresAt: endDateTime
    }

    setMyBookings(prev => [...prev, newBooking])

    // Update desk status immediately for 'active' bookings or for 'upcoming' bookings on the selected date
    if (status === 'active' || new Date(formData.startDate).toDateString() === selectedDate.toDateString()) {
      setDesks(prevDesks => 
        prevDesks.map(desk => 
          desk.id === selectedDesk.id 
            ? { 
                ...desk, 
                status: 'occupied' as const,
                currentBooking: {
                  userId: 'current-user',
                  endTime: endDateTime
                }
              }
            : desk
        )
      )
    }

    setShowBookingModal(false)
    setShowSuccessModal(true)
    setSelectedDesk(null)
  }

  const handleCancelBooking = (bookingId: number): void => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setMyBookings(prevBookings => 
      prevBookings.map(booking => {
        if (booking.id === bookingId) {
          // If the booking was active/upcoming, clear the desk status
          setDesks(prevDesks => 
            prevDesks.map(desk => 
              desk.id === booking.deskId && (booking.status === 'active' || booking.status === 'upcoming')
                ? { ...desk, status: 'available' as const, currentBooking: undefined }
                : desk
            )
          );
          return { ...booking, status: 'cancelled' as const };
        }
        return booking;
      })
    );
    alert("Booking has been cancelled.");
  };

  const handleProfileUpdate = (data: UserProfileData) => {
    setProfileData(data);
    // Logic to potentially update desk filtering based on data.defaultFloor would go here
  };


  // --- Calendar Helpers ---

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  const getDaysInMonth = (): Date[] => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: Date[] = []
    
    const firstDayOfMonth = new Date(year, month, 1).getDay() 
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(new Date(NaN)) 
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const changeMonth = (direction: 'prev' | 'next'): void => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const availableDesks = desks.filter(desk => desk.status === "available").length
  const bookedDesks = desks.filter(desk => desk.status === "occupied").length
  const upcomingBookingsCount = myBookings.filter(b => b.status === 'upcoming' || b.status === 'active').length


  // --- Render ---

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* 🧭 Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-700">FlexDesk</h1>
        </div>
        
        <nav className="px-4 space-y-1">
          {/* Dashboard Link */}
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              currentView === 'dashboard' 
                ? 'text-white bg-indigo-600 shadow-md' 
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </button>
          
          {/* My Bookings Link */}
          <button 
            onClick={() => setCurrentView('bookings')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              currentView === 'bookings' 
                ? 'text-white bg-indigo-600 shadow-md' 
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <span>🗓️</span>
            <span>My Bookings ({upcomingBookingsCount})</span>
          </button>
          
          {/* Profile Link */}
          <button 
            onClick={() => setCurrentView('profile')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              currentView === 'profile' 
                ? 'text-white bg-indigo-600 shadow-md' 
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <span>👤</span>
            <span>Profile & Settings</span>
          </button>
          
        </nav>
      </aside>

      {/* 🖥️ Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentView === 'dashboard' ? 'Workspace Dashboard' : currentView === 'bookings' ? 'My Bookings' : 'Profile & Settings'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{formatDate(new Date())}</span>
              <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Conditional View Rendering */}
        {currentView === 'dashboard' ? (
          // --- Dashboard View ---
          <div className="p-8">
            
            {/* Calendar Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => changeMonth('prev')}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => changeMonth('next')}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    →
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                
                {getDaysInMonth().map((date, idx) => {
                  if (isNaN(date.getTime())) {
                    return <div key={`spacer-${idx}`} className="p-2"></div>
                  }
                  
                  const isToday = date.toDateString() === new Date().toDateString()
                  const isSelected = date.toDateString() === selectedDate.toDateString()
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`py-2 text-sm rounded-lg transition-colors ${
                        isToday
                          ? 'bg-indigo-600 text-white font-semibold shadow-md'
                          : isSelected
                          ? 'bg-indigo-100 text-indigo-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <label className="text-sm text-gray-700">Available ({availableDesks})</label>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-400"></div>
                <label className="text-sm text-gray-700">Booked ({bookedDesks})</label>
              </div>
            </div>

            {/* Desk Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {desks.map((desk) => (
                <DeskGridCard 
                  key={desk.id} 
                  desk={desk} 
                  onBook={handleBookDesk}
                />
              ))}
            </div>
          </div>

        ) : currentView === 'bookings' ? (
          // --- Bookings View ---
          <UserBookings 
            bookings={myBookings} 
            onCancelBooking={handleCancelBooking} 
            onNavigate={setCurrentView}
          />
        ) : (
          // --- Profile View ---
          <UserProfileSettings
            onUpdate={handleProfileUpdate}
          />
        )}
      </main>

      {/* Modals */}
      <BookingModal
        desk={selectedDesk}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleSubmitBooking}
      />
      <SuccessModal
        desk={selectedDesk}
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  )
}

export default User