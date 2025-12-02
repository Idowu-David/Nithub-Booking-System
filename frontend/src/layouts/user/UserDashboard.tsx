"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  LogOut,
  MonitorCheck,
  Zap,
  Loader2,
  Wifi,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- CONFIGURATION ---
const API_BASE_URL = "http://localhost:5000/api";

// --- TYPES ---
interface ActiveBooking {
  id: number;
  desk_id: number;
  desk_label: string; // Assuming the backend join returns this, or we map it
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  booking_date: string; // YYYY-MM-DD
  package_duration_mins: number;
  status: "CONFIRMED" | "CHECKED_OUT" | "CANCELLED";
}

// Helper for nice time formatting
const formatTime = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h} hr ${m} min`;
  if (h > 0) return `${h} hr`;
  return `${m} min`;
};

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. FETCH ACTIVE BOOKING ---
  const fetchActiveBooking = async () => {
    setLoading(true);
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      // If not logged in, redirect
      navigate("/login");
      return;
    }

    try {
      // Assuming you have a route GET /bookings/active/:user_id
      // If you haven't built this route yet, this call will fail (404).
      const response = await axios.get(
        `${API_BASE_URL}/bookings/active/${userId}`
      );

      if (response.data) {
        setActiveBooking(response.data);
      } else {
        setActiveBooking(null);
      }
    } catch (err: any) {
      console.error("Dashboard Fetch Error:", err);
      // If 404, it just means no active booking, which is fine.
      if (err.response && err.response.status === 404) {
        setActiveBooking(null);
      } else {
        setError("Could not load booking details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveBooking();
  }, []);

  // --- 2. COUNTDOWN TIMER LOGIC ---
  useEffect(() => {
    if (!activeBooking) return;

    // Combine date and time for precise calculation
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
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBooking]);

  // --- 3. CHECKOUT HANDLER ---
  const handleCheckout = async () => {
    if (!activeBooking) return;
    if (!window.confirm("Are you sure you want to end your session early?"))
      return;

    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    setIsCheckingOut(true);
    try {
      // Using the controller logic you provided:
      // body: { user_id, desk_id }
      const payload = {
        user_id: userId,
        desk_id: activeBooking.desk_id,
      };

      await axios.post(`${API_BASE_URL}/bookings/checkout`, payload);

      // Clear state immediately upon success
      setActiveBooking(null);
      setTimeLeft(null);
      alert("Checked out successfully!");
    } catch (err: any) {
      console.error("Checkout failed", err);
      alert(
        err.response?.data?.message || "Failed to check out. Please try again."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              User Dashboard
            </h1>
            <p className="text-slate-500">Welcome back.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/booking")}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-sm"
          >
            Book New Space
          </button>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        {activeBooking ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: HERO STATUS CARD */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Status Bar */}
              <div className="bg-blue-600 px-8 py-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 font-bold tracking-wide text-sm uppercase">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  Active Session
                </div>
                <div className="flex items-center gap-2 opacity-90 text-sm">
                  <Calendar size={16} /> {activeBooking.booking_date}
                </div>
              </div>

              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
                      Current Workspace
                    </p>
                    {/* Display Real Desk ID/Label */}
                    <h2 className="text-4xl font-black text-slate-800">
                      {activeBooking.desk_label ||
                        `Desk ${activeBooking.desk_id}`}
                    </h2>
                    <div className="flex items-center gap-2 text-slate-500 mt-2 font-medium">
                      <MapPin size={18} className="text-blue-500" />
                      <span>Floor 2, Central Hub</span>
                    </div>
                  </div>

                  {/* Timer Display */}
                  <div className="bg-slate-900 rounded-2xl p-6 text-center shadow-lg min-w-[200px]">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                      Time Remaining
                    </p>
                    <div
                      className={`text-4xl font-mono font-bold ${
                        timeLeft === "EXPIRED"
                          ? "text-red-500"
                          : "text-emerald-400"
                      }`}
                    >
                      {timeLeft || "--:--:--"}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="flex-1 py-3.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 border border-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <LogOut size={20} />
                    )}
                    Check Out Now
                  </button>
                  <button className="flex-1 py-3.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: INFO CARDS */}
            <div className="space-y-6">
              {/* Package Info */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Package
                    </p>
                    <p className="font-bold text-slate-800 text-lg">
                      {/* Approximate duration based on start/end */}
                      {activeBooking.package_duration_mins
                        ? formatTime(activeBooking.package_duration_mins)
                        : "Custom"}{" "}
                      Access
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 flex justify-between">
                  <span>Start</span>
                  <span className="font-mono font-bold">
                    {activeBooking.start_time?.slice(0, 5)}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 flex justify-between mt-2">
                  <span>End</span>
                  <span className="font-mono font-bold">
                    {activeBooking.end_time?.slice(0, 5)}
                  </span>
                </div>
              </div>

              {/* Wi-Fi Info */}
              <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-200 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-indigo-200 text-xs font-bold uppercase mb-1">
                      Wi-Fi Network
                    </p>
                    <h3 className="text-xl font-bold">NitHub_Guest</h3>
                  </div>
                  <Wifi className="text-indigo-300" />
                </div>
                <div className="bg-indigo-500/50 p-3 rounded-xl backdrop-blur-sm border border-indigo-400/30">
                  <p className="text-xs text-indigo-200 mb-1">Password</p>
                  <p className="font-mono font-bold tracking-wider">
                    FastNet2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <MonitorCheck className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              No Active Booking
            </h2>
            <p className="text-slate-500 max-w-md mb-8">
              You are not currently checked into any workspace. Start a new
              session to see your dashboard light up!
            </p>
            <button
              onClick={() => navigate("/dashboard/booking")}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200"
            >
              Book a Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
