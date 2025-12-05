import React, { useState, useEffect } from 'react';
import { Clock, MapPin, LogOut, MonitorCheck, Loader2, RefreshCw, X, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Helper for converting milliseconds to HH:MM:SS format
const formatSeconds = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Define the shape of the data retrieved from storage/backend
interface SessionData {
  deskLabel: string;
  endTimestamp: number;
  userId: string;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<SessionData | null>(null);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. FETCH MOCK DATA FROM LOCAL STORAGE ---
  useEffect(() => {
    // In a real app, you would fetch this from the backend GET /api/bookings/active/:userId
    
    setTimeout(() => { // Simulate network delay
      const userId = localStorage.getItem("user_id");
      const deskLabel = localStorage.getItem("desk_id");
      const endTimestampStr = localStorage.getItem("duration");

      if (userId && deskLabel && endTimestampStr) {
        setSession({
          userId: userId,
          deskLabel: deskLabel,
          endTimestamp: parseInt(endTimestampStr, 10),
        });
      }
      setLoading(false);
    }, 500);
  }, []);


  // --- 2. LIVE COUNTDOWN TIMER ---
  useEffect(() => {
    if (!session || session.endTimestamp <= Date.now()) {
      setTimeLeft(session ? "EXPIRED" : null);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = session.endTimestamp - now;

      if (difference <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(interval);
      } else {
        setTimeLeft(formatSeconds(Math.floor(difference / 1000)));
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [session]);


  // --- 3. CHECKOUT HANDLER ---
  const handleCheckout = async () => {
    if (!session || !window.confirm(`Are you sure you want to end your session at ${session.deskLabel}?`)) return;

    setIsCheckingOut(true);
    
    try {
      // In a real app, this sends a POST to /api/bookings/checkout
      console.log(`Sending checkout signal for User ${session.userId} at ${session.deskLabel}`);
      
      // Clear localStorage items simulating successful checkout and redirection
      localStorage.removeItem("desk_id");
      // localStorage.removeItem("end_timestamp");
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call time
      
      setSession(null); // Clear session state
      navigate('/dashboard'); // Redirect back to booking screen
      
    } catch (err: any) {
      setError("Checkout failed: Server error.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // --- RENDERING STATES ---
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-xl">
        
        <header className="text-center mb-10 pt-4">
          <h1 className="text-3xl font-extrabold text-slate-900">My Workspace</h1>
          <p className="text-slate-500 mt-1">Status: Logged in as User ID: {session?.userId || 'N/A'}</p>
        </header>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 p-3 mb-4 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* --- ACTIVE BOOKING DISPLAY --- */}
        {session ? (
          <div className="bg-white rounded-3xl shadow-2xl border border-blue-200 overflow-hidden">
            
            {/* Status Header */}
            <div className="bg-blue-600 px-8 py-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <MonitorCheck size={24} />
                    <span className="text-xl font-bold">{session.deskLabel}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${timeLeft === 'EXPIRED' ? 'bg-red-400' : 'bg-emerald-400'}`}>
                    {timeLeft === 'EXPIRED' ? 'SESSION ENDED' : 'LIVE'}
                </span>
            </div>

            {/* Content & Timer */}
            <div className="p-8">
              
              {/* Timer Block */}
              <div className="bg-slate-900 rounded-xl p-6 text-center mb-6">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Time Remaining</p>
                <div className={`text-5xl font-mono font-extrabold ${timeLeft === 'EXPIRED' ? 'text-red-500' : 'text-emerald-400'} flex items-center justify-center gap-3`}>
                    <Clock size={32} className={timeLeft !== 'EXPIRED' ? 'animate-pulse' : ''} />
                    {timeLeft || "00:00:00"}
                </div>
                <p className="text-slate-500 text-xs mt-3 flex items-center justify-center gap-1">
                    <MapPin size={14} className='text-blue-500'/> Central Zone, ID: {session.userId}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || timeLeft === 'EXPIRED'}
                className="w-full py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <LogOut size={20} />
                )}
                {isCheckingOut ? 'Processing Checkout...' : 'Check Out Now'}
              </button>
            </div>
          </div>
        ) : (
          /* --- NO ACTIVE BOOKING STATE --- */
          <div className="bg-white rounded-xl shadow-lg p-10 text-center border-2 border-dashed border-gray-200 mt-12">
            <div className="bg-slate-50 p-6 rounded-full mb-6 mx-auto w-fit">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Session</h2>
            <p className="text-gray-500 mb-8">
              Click below to reserve your space and view your real-time status here.
            </p>
            <button
              onClick={() => navigate('/dashboards/booking')} 
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Start New Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;