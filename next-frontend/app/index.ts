// src/types/index.ts

export type DeskStatus = 'available' | 'occupied';

export interface Desk {
  id: number;
  name: string;
  location: string;
  status: DeskStatus;
  price: string;
  features: string[];
  image: string; // Emoji or icon
  currentBooking?: {
    userId: string;
    endTime: Date;
  };
}

export type BookingType = 'hourly' | 'half-day' | 'full-day' | 'weekly' | 'monthly';
export type BookingStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: number;
  deskId: number;
  deskName: string;
  deskIcon: string;
  location: string;
  bookingType: BookingType;
  startDate: string;
  startTime: string;
  endTime: string; // Time string (e.g., "09:00")
  purpose: string;
  status: BookingStatus;
  createdAt: Date;
  expiresAt: Date; // Full Date object for logic
}

export interface BookingFormData {
  startDate: string;
  startTime: string;
  bookingType: BookingType;
  purpose: string;
}