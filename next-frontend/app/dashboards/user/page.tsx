'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Desk, Booking, BookingFormData } from '../../types' 
import DeskGridCard from '../../components/DeskGridCard'
import BookingModal from '../../components/BookingModal'
import SuccessModal from '../../components/SuccessModal'
import UserBookings from '../../components/UserBookings'
import UserProfileSettings, { UserProfileData } from '../../components/UserProfileSettings' 

// Type for view navigation
type DashboardView = 'dashboard' | 'bookings' | 'profile';

// --- INITIAL HARDCODED DATA (Used only for initial state) ---
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
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('All Floors'); 

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


  // --- Dynamic Status Update Logic (Interval Check) ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      
      let changedDeskIds: number[] = [];

      setMyBookings(prevBookings => 
        prevBookings.map(booking => {
          const startDateTime = new Date(`${booking.startDate}T${booking.startTime}`)
          const expiresAt = new Date(booking.expiresAt)
          
          let newStatus = booking.status;

          if (now >= startDateTime && now < expiresAt && booking.status === 'upcoming') {
            newStatus = 'active' as const;
          } 
          else if (now >= expiresAt && booking.status !== 'completed' && booking.status !== 'cancelled') {
            newStatus = 'completed' as const;
          }

          if (newStatus !== booking.status) {
            changedDeskIds.push(booking.deskId);
          }
          return { ...booking, status: newStatus };
        })
      )
      
      // A simplified way to update desk status globally (used when interval detects change)
      if (changedDeskIds.length > 0) {
        setDesks(prevDesks => 
          prevDesks.map(desk => {
            if (changedDeskIds.includes(desk.id)) {
              const activeBooking = myBookings.find(b => b.deskId === desk.id && b.status === 'active');
              
              if (activeBooking) {
                return { 
                  ...desk, 
                  status: 'occupied' as const,
                  currentBooking: { userId: 'current-user', endTime: activeBooking.expiresAt }
                };
              } else {
                return { 
                  ...desk, 
                  status: 'available' as const,
                  currentBooking: undefined
                };
              }
            }
            return desk;
          })
        );
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [myBookings])


  // --- Desk Filtering Logic (Dynamic) ---
  const getFilteredDesks = useMemo(() => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    // Step 1: Filter by Search Term and Floor
    let filtered = desks.filter(desk => {
      const matchesSearch = searchTerm.length === 0 || 
                           desk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           desk.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           desk.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
                           
      const matchesFloor = selectedFloor === 'All Floors' || 
                           desk.location.includes(selectedFloor);
                           
      return matchesSearch && matchesFloor;
    });

    // Step 2: Determine availability based on SELECTED DATE and Bookings
    filtered = filtered.map(desk => {
      let deskStatus: Desk["status"] = 'available';
      let currentBooking: Desk["currentBooking"] = undefined;
      
      const bookingForSelectedDate = myBookings.find(booking => 
        booking.deskId === desk.id && 
        booking.startDate === selectedDateStr &&
        (booking.status === 'upcoming' || booking.status === 'active')
      );
      
      if (bookingForSelectedDate) {
        deskStatus = 'occupied';
        currentBooking = {
          userId: 'current-user', 
          endTime: bookingForSelectedDate.expiresAt
        };
      } else {
        deskStatus = 'available'; 
      }
      
      return { 
        ...desk, 
        status: deskStatus, 
        currentBooking: currentBooking 
      };
    });

    return filtered;
  }, [desks, myBookings, selectedDate, searchTerm, selectedFloor]);


  // --- Handlers ---

  const handleBookDesk = (desk: Desk): void => {
    if (hasActiveOrUpcomingBooking()) {
      const existingBooking = getActiveOrUpcomingBooking()
      window.confirm(`You already have a ${existingBooking?.status} booking for ${existingBooking?.deskName}. Please cancel it or wait until it expires before making a new booking.`)
      return
    }
    
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const isBookedForSelectedDate = myBookings.some(booking => 
        booking.deskId === desk.id && 
        booking.startDate === selectedDateStr &&
        (booking.status === 'upcoming' || booking.status === 'active')
    );
    
    if (isBookedForSelectedDate) {
      window.confirm(`Desk ${desk.name} is already booked for ${selectedDateStr}. Please choose another desk or date.`);
      return;
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
      window.confirm("Cannot book a desk for a past time. Please select a future time.")
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
    setShowBookingModal(false)
    setShowSuccessModal(true)
    setSelectedDesk(null)
  }

  const handleCancelBooking = (bookingId: number): void => {
    // NOTE: In a real app, use a custom modal for confirmation instead of window.confirm
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setMyBookings(prevBookings => 
      prevBookings.map(booking => {
        if (booking.id === bookingId) {
          return { ...booking, status: 'cancelled' as const };
        }
        return booking;
      })
    );
  };

  const handleProfileUpdate = (data: UserProfileData) => {
    setProfileData(data);
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

  const availableDesks = getFilteredDesks.filter(desk => desk.status === "available").length
  const bookedDesks = getFilteredDesks.filter(desk => desk.status === "occupied").length
  const upcomingBookingsCount = myBookings.filter(b => b.status === 'upcoming' || b.status === 'active').length


  // --- Render ---

  return (
    // DARK MODE BACKGROUND
    <div className="flex h-screen bg-gray-950 text-white font-inter"> 
      
      {/* 🧭 Sidebar */}
      <aside className="w-64 bg-gray-900/70 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-black/50">
        <div className="p-6">
          <h1 className="text-3xl font-extrabold text-indigo-400">FlexDesk</h1>
        </div>
        
        <nav className="px-4 space-y-1">
          {/* Navigation Links */}
          {([
            { view: 'dashboard', icon: '🏠', label: 'Dashboard', count: null },
            { view: 'bookings', icon: '🗓️', label: 'My Bookings', count: upcomingBookingsCount },
            { view: 'profile', icon: '👤', label: 'Profile & Settings', count: null },
          ] as const).map(({ view, icon, label, count }) => (
            <button 
              key={view}
              onClick={() => setCurrentView(view)}
              className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 
                ${view === currentView 
                  ? 'text-white bg-indigo-600/90 shadow-lg shadow-indigo-500/30' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
              {count !== null && count > 0 && (
                <span className="bg-white/20 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* 🖥️ Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header (Glassmorphism) */}
        <header className="bg-gray-900/70 backdrop-blur-lg border-b border-white/10 px-8 py-4 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {currentView === 'dashboard' ? 'Workspace Dashboard' : currentView === 'bookings' ? 'My Reservations' : 'Profile & Settings'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-indigo-300">{formatDate(new Date())}</span>
              <button className="px-4 py-2 text-sm text-gray-300 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Conditional View Rendering */}
        {currentView === 'dashboard' ? (
          // --- Dashboard View ---
          <div className="p-8">
            
            {/* Calendar Section (Glassmorphism) */}
            <div className="bg-gray-900/70 backdrop-blur-md rounded-xl shadow-2xl p-6 mb-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Viewing Availability for: 
                  <span className="text-indigo-300 ml-2">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => changeMonth('prev')}
                    className="p-2 text-gray-300 hover:bg-white/10 rounded-full transition-colors"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => changeMonth('next')}
                    className="p-2 text-gray-300 hover:bg-white/10 rounded-full transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs font-medium text-indigo-300 py-2">
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
                      className={`py-2 text-sm rounded-lg transition-colors duration-200 ${
                        isToday && !isSelected
                          ? 'bg-indigo-700/50 text-white font-semibold'
                          : isSelected
                          ? 'bg-indigo-500 text-white font-extrabold ring-2 ring-indigo-300 shadow-md'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filter and Search Bar (Glassmorphism Inputs) */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px] md:min-w-[300px]">
                <input
                  type="text"
                  placeholder="Search desks by name, location, or feature..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg shadow-inner bg-gray-800/70 text-white border border-white/10 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                />
                <span className="absolute left-3 top-2.5 text-indigo-300">🔍</span>
              </div>
              
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-48 px-4 py-2.5 rounded-lg shadow-inner bg-gray-800/70 text-white border border-white/10 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              >
                <option className="bg-gray-800">All Floors</option>
                <option className="bg-gray-800">Floor 1</option>
                <option className="bg-gray-800">Floor 2</option>
                <option className="bg-gray-800">Floor 3</option>
              </select>
            </div>

            {/* Status Legend */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <label className="text-sm text-gray-200">Available ({availableDesks})</label>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-400"></div>
                <label className="text-sm text-gray-200">Booked ({bookedDesks})</label>
              </div>
            </div>
            
            {/* Desk Grid (Uses Filtered Desks) */}
            {getFilteredDesks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {getFilteredDesks.map((desk) => (
                        <DeskGridCard 
                            key={desk.id} 
                            desk={desk} 
                            onBook={handleBookDesk}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
                    <p className="text-xl text-gray-400">No desks match your criteria for this date.</p>
                </div>
            )}
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
        onSubmit={() => setShowSuccessModal(true)}
      />
    </div>
  )
}

export default User