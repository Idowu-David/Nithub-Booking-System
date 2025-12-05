"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Monitor,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  Sparkles,
  Loader2,
  MonitorCheck,
  X,
  LayoutDashboard,
} from "lucide-react";

// --- CONFIGURATION ---
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// --- TYPE DEFINITIONS ---
type Package = {
  id: number;
  label: string;
  mins: number;
  price: number;
  popular: boolean;
};

interface SelectionData {
  mins: number;
  price: number;
  count: number;
}

interface PackageSelectorProps {
  onSelectionChange: (data: SelectionData) => void;
}

interface Desk {
  id: number;
  label: string;
  available: boolean;
}

// Time Slots
const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];


const PACKAGES: Package[] = [
  { id: 1, label: "30 Mins", mins: 30, price: 500, popular: false },
  { id: 2, label: "1 Hour", mins: 60, price: 1000, popular: true },
  { id: 3, label: "2 Hours", mins: 120, price: 1800, popular: false },
  { id: 4, label: "Half Day", mins: 240, price: 3500, popular: false },
];

// Helper for nice time formatting
const formatTime = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}hr ${m}m`;
  if (h > 0) return `${h}hr`;
  return `${m}m`;
};

// --- CHILD COMPONENT: PackageSelector ---
const PackageSelector = ({ onSelectionChange }: PackageSelectorProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const togglePackage = (pkgId: number) => {
    setSelectedIds((prev) =>
      prev.includes(pkgId)
        ? prev.filter((id) => id !== pkgId)
        : [...prev, pkgId]
    );
  };

  const totalMins = PACKAGES.filter((p) => selectedIds.includes(p.id)).reduce(
    (sum, item) => sum + item.mins,
    0
  );
  const totalPrice = PACKAGES.filter((p) => selectedIds.includes(p.id)).reduce(
    (sum, item) => sum + item.price,
    0
  );

  useEffect(() => {
    onSelectionChange({
      mins: totalMins,
      price: totalPrice,
      count: selectedIds.length,
    });
  }, [totalMins, totalPrice, selectedIds.length, onSelectionChange]);

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
            {pkg.popular && (
              <span className="absolute -top-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles size={10} /> BEST VALUE
              </span>
            )}
            {isSelected && (
              <CheckCircle className="absolute top-3 right-3 text-blue-600 w-5 h-5 animate-in zoom-in" />
            )}
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

// --- MAIN DASHBOARD COMPONENT ---
const BookingDashboard = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [bookingData, setBookingData] = useState<SelectionData>({
    mins: 0,
    price: 0,
    count: 0,
  });

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [desks, setDesks] = useState<Desk[]>([]);

  // Modal State
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // --- HANDLER: Receives data from PackageSelector ---
  const handlePackageData = useCallback((data: SelectionData) => {
    setBookingData(data);
  }, []);

  // --- CORE LOGIC: Fetch Desks (API Integration with Axios) ---
  const fetchAvailableDesks = useCallback(
    async (date: string, time: string, durationMins: number) => {
      if (durationMins === 0 || !time) return;

      setLoading(true);
      setFetchError(null);

      // Calculate End Time logic
      const [h, m] = time.split(":").map(Number);
      const startMins = h * 60 + m;
      const endMins = startMins + durationMins;

      const endH = Math.floor(endMins / 60)
        .toString()
        .padStart(2, "0");
      const endM = (endMins % 60).toString().padStart(2, "0");
      const endTime = `${endH}:${endM}:00`;

      try {
        const queryUrl = `${API_BASE_URL}/api/desks`;

        console.log(
          `Checking availability for: ${date} | ${time} - ${endTime}`
        );

        const response = await axios.get<Desk[]>(queryUrl, {
          params: {
            date: date,
            start: time,
            end: endTime,
            duration: durationMins,
          },
        });

        setDesks(response.data);
      } catch (e: any) {
        console.error("Desk Fetch Error:", e);

        const errorMessage = e.response?.status
          ? `Server returned status ${e.response.status}.`
          : "Failed to connect to the backend.";

        setFetchError(errorMessage);
        setDesks([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // --- AUTO-FETCH TRIGGER ---
  useEffect(() => {
    if (step === 2 && selectedTime && bookingData.mins > 0) {
      fetchAvailableDesks(selectedDate, selectedTime, bookingData.mins);
    }
  }, [step, selectedDate, selectedTime, bookingData.mins, fetchAvailableDesks]);

  // --- STEP TRANSITION ---
  const handleStepTwoStart = () => {
    if (bookingData.mins > 0) {
      setStep(2);
    }
  };

  // --- MODAL/BOOKING HANDLERS ---
  const handleDeskClick = (desk: Desk) => {
    if (desk.available) {
      setSelectedDesk(desk);
    }
  };

  const closeModal = () => {
    setSelectedDesk(null);
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    navigate("/dashboard/user");
  };

  // --- UPDATED CONFIRM BOOKING HANDLER ---
  const handleConfirmBooking = async () => {
    if (!selectedTime || !selectedDesk) return;

    // 1. Get User ID from Local Storage (Ensure you saved this during Login!)
		const userId = localStorage.getItem("user_id");		
		console.log("USERID:", userId)

    if (!userId) {
      alert("You must be logged in to book a desk.");
      navigate("/login");
      return;
    }

    const bookingPayload = {
      user_id: userId,
      desk_id: selectedDesk.id,
      date: selectedDate,
      start_time: selectedTime,
      duration: bookingData.mins,
      price: bookingData.price,
    };

    console.log("Booking Payload Sent to Backend:", bookingPayload);

    try {
      // 2. SEND THE REQUEST TO YOUR BACKEND
      // This hits the createBooking controller you wrote
      await axios.post(`${API_BASE_URL}/desks/booking`, bookingPayload);

      // 3. IF SUCCESSFUL:
      closeModal();
      setShowSuccessModal(true);

      // Refresh grid so this desk turns RED immediately
      fetchAvailableDesks(selectedDate, selectedTime, bookingData.mins);
    } catch (e: any) {
      console.error("Booking Failed:", e);
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Booking failed.";
      alert(`Booking Failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-slate-900">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Monitor size={24} />
            </div>
            Workspace<span className="text-blue-600">Booking</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* LIVE SUMMARY WIDGET */}
          {bookingData.mins > 0 && (
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-6 animate-in slide-in-from-top-4 transition-all">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Time
                </p>
                <p className="text-lg font-bold leading-none">
                  {formatTime(bookingData.mins)}
                </p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Price
                </p>
                <p className="text-lg font-bold text-green-600 leading-none">
                  ₦{bookingData.price.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* MY DASHBOARD BUTTON (Navigation Link) */}
          <button
            onClick={handleGoToDashboard}
            className="px-5 py-3 bg-white text-slate-600 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <LayoutDashboard size={18} />
            My Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* --- STEP 1: PACKAGE SELECTION --- */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-left-8 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">
                Step 1: How long do you need?
              </h2>
              <p className="text-slate-500">
                Select multiple packages to stack your time.
              </p>
            </div>

            <div className="mb-12">
              <PackageSelector onSelectionChange={handlePackageData} />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStepTwoStart}
                disabled={bookingData.mins === 0}
                className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 flex items-center gap-2 group"
              >
                Choose Date & Time
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: DATE/TIME & DESK SELECTION --- */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            {/* TOOLBAR */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-slate-500 hover:text-blue-600 font-bold flex items-center gap-2 transition-colors self-start md:self-center"
                >
                  <ArrowLeft size={18} /> Change Package
                </button>

                {/* INPUTS GROUP */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  {/* Date Picker */}
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <Calendar size={18} className="text-slate-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent border-none outline-none font-semibold text-slate-700 cursor-pointer w-full"
                    />
                  </div>

                  {/* Time Picker */}
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all relative">
                    <Clock size={18} className="text-slate-400" />
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="bg-transparent border-none outline-none font-semibold text-slate-700 cursor-pointer w-full appearance-none pr-8"
                    >
                      <option value="" disabled>
                        Select Start Time
                      </option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FEEDBACK AREA */}
            {!selectedTime ? (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-600">
                  Select a Start Time
                </h3>
                <p className="text-slate-400">
                  Please choose when you want to start your session to see
                  available desks.
                </p>
              </div>
            ) : fetchError ? (
              <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-200">
                <X className="text-red-500 w-8 h-8 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Error Connecting
                </h3>
                <p className="text-red-600 max-w-md mx-auto">{fetchError}</p>
              </div>
            ) : loading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <Loader2 className="animate-spin text-blue-600 w-8 h-8 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800">
                  Checking Availability...
                </h3>
              </div>
            ) : (
              /* GRID */
              <div>
                <div className="flex justify-end gap-6 mb-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>{" "}
                    Available
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>{" "}
                    Occupied
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {desks.map((desk) => (
                    <button
                      key={desk.id}
                      onClick={() => handleDeskClick(desk)}
                      disabled={!desk.available}
                      className={`
                                  h-32 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 relative overflow-hidden group
                                  ${
                                    desk.available
                                      ? "bg-white border-emerald-100 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                                      : "bg-rose-50 border-rose-200 opacity-80 cursor-not-allowed grayscale-[0.5]"
                                  }
                              `}
                    >
                      <div
                        className={`mb-3 p-3 rounded-full ${
                          desk.available
                            ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors"
                            : "bg-rose-100 text-rose-400"
                        }`}
                      >
                        <MonitorCheck size={24} />
                      </div>
                      <span
                        className={`font-bold ${
                          desk.available ? "text-slate-700" : "text-rose-300"
                        }`}
                      >
                        {desk.label}
                      </span>
                      {!desk.available && (
                        <span className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] font-bold text-rose-600 text-sm">
                          TAKEN
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {selectedDesk && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
              <h3 className="text-xl font-bold">Confirm Booking</h3>
              <button onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Desk</span>
                  <span className="font-bold text-slate-800">
                    {selectedDesk.label}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Date</span>
                  <span className="font-bold text-slate-800">
                    {selectedDate}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Time</span>
                  <span className="font-bold text-slate-800">
                    {selectedTime} ({formatTime(bookingData.mins)})
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-500 font-bold">Total</span>
                  <span className="text-2xl font-black text-green-600">
                    ₦{bookingData.price.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={handleConfirmBooking}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800"
              >
                Pay & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS MODAL --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6 animate-in zoom-in" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-slate-500 mb-6">
              Your session for {formatTime(bookingData.mins)} at{" "}
              {selectedDesk?.label} is secured.
            </p>
            <button
              onClick={handleGoToDashboard}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-md hover:bg-blue-700 transition-colors shadow-lg"
            >
              Go to My Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDashboard;
