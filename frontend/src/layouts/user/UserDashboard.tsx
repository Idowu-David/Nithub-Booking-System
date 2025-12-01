import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  LogOut,
  MonitorCheck,
  Calendar,
  Zap,
  RefreshCw,
  X,
  Loader2,
} from "lucide-react";

// Helper for nice time formatting (e.g., 90 -> 1hr 30m)
const formatTime = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h} hr ${m} min`;
  if (h > 0) return `${h} hr`;
  return `${m} min`;
};

// Define the shape of the data we expect from the backend API
interface ActiveBooking {
  id: number;
  desk_id: number;
  desk_label: string;
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  booking_date: string; // YYYY-MM-DD
  package_duration_mins: number;
}

const UserDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // --- 1. SIMULATE DATA FETCHING (GET /api/bookings/active) ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const now = new Date();
      // Mocking a booking that ends 50 minutes from now
      const futureTime = new Date(now.getTime() + 50 * 60000);

      const mockData: ActiveBooking = {
        id: 501,
        desk_id: 8,
        desk_label: "Desk 8",
        booking_date: new Date().toISOString().split("T")[0],
        start_time: now.toTimeString().slice(0, 8),
        end_time: futureTime.toTimeString().slice(0, 8),
        package_duration_mins: 50,
      };

      setActiveBooking(mockData);
      setLoading(false);
    }, 1000); // Shorter loading time
  }, []);

  // --- 2. COUNTDOWN LOGIC (Live Timer) ---
  useEffect(() => {
    if (!activeBooking) return;

    const targetTime = new Date(
      `${activeBooking.booking_date}T${activeBooking.end_time}`
    );

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(interval);
      } else {
        const totalSeconds = Math.floor(difference / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBooking]);

  // --- 3. CHECKOUT HANDLER ---
  const handleCheckout = async () => {
    if (!activeBooking || !window.confirm("Confirm checkout?")) return;

    setIsCheckingOut(true);

    console.log(`Checking out of Desk ${activeBooking.desk_id}...`);

    setTimeout(() => {
      setActiveBooking(null);
      setTimeLeft(null);
      setIsCheckingOut(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        <span className="ml-3 text-lg text-gray-600">Fetching Status...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-lg text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">My Workspace</h1>
        <p className="text-gray-500 mt-1">Active session overview.</p>
      </div>

      {activeBooking ? (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* HEADER: Desk & Status */}
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MonitorCheck size={28} />
              <span className="text-2xl font-bold">
                {activeBooking.desk_label}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                timeLeft === "EXPIRED" ? "bg-red-400" : "bg-green-400"
              }`}
            >
              {timeLeft === "EXPIRED" ? "EXPIRED" : "LIVE"}
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* COLUMN 1: TIME REMAINING (Focus) */}
            <div className="space-y-3 bg-slate-900 rounded-xl p-4 text-white shadow-inner">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Time Remaining
              </p>
              <div className="text-5xl font-mono font-extrabold text-green-400 flex items-center justify-start gap-3">
                <Clock size={32} className="animate-pulse" />
                {timeLeft}
              </div>
              <p className="text-xs text-slate-500 pt-2">
                Ends at {activeBooking.end_time.slice(0, 5)} on{" "}
                {activeBooking.booking_date}
              </p>
            </div>

            {/* COLUMN 2: PACKAGE DETAILS & ACTION */}
            <div className="space-y-4">
              {/* Package Details */}
              <div className="flex items-center gap-4 bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                <Zap size={24} className="text-yellow-700" />
                <div>
                  <p className="text-sm font-bold text-gray-700">
                    Package Duration
                  </p>
                  <h3 className="text-xl font-black text-gray-900">
                    {formatTime(activeBooking.package_duration_mins)}
                  </h3>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <MapPin size={24} className="text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-gray-700">Location</p>
                  <p className="text-sm text-gray-600">Floor 2, Central Hub</p>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || timeLeft === "EXPIRED"}
                className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
              >
                {isCheckingOut ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
                {isCheckingOut ? "Processing..." : "Check Out Now"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // --- NO ACTIVE BOOKING STATE ---
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10 text-center border-2 border-dashed border-gray-200 mt-12">
          <X className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Active Session
          </h3>
          <p className="text-gray-500 mb-6">
            You are not currently checked into a desk.
          </p>
          <button
            onClick={() => console.log("Redirect to Booking Page")} // Simulating navigation
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start a New Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
