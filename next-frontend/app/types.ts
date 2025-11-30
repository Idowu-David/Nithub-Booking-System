export type DeskStatus = 'available' | 'occupied' | 'maintenance';
export type BookingType = 'hourly' | 'half-day' | 'full-day' | 'weekly' | 'monthly';
export type BookingStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Desk {
  id: number;
  name: string;
  location: string;
  status: DeskStatus;
  price: string; // e.g., "₦1,500/day"
  features: string[];
  image: string; // Emoji used as an icon
  currentBooking?: {
    userId: string;
    endTime: Date;
  };
}

export interface BookingFormData {
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  bookingType: BookingType;
  purpose: string;
}

export interface Booking {
  id: number;
  deskId: number;
  deskName: string;
  deskIcon: string;
  location: string;
  bookingType: BookingType;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  purpose: string;
  status: BookingStatus;
  createdAt: Date;
  expiresAt: Date; // Full Date object for comparison
  userId?: string; // Made optional for safer development, but assigned in User.tsx
}

export interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  defaultFloor: string;
  notificationPref: 'email' | 'sms';
}