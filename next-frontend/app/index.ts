// types.ts
export interface Desk {
  id: number
  name: string
  location: string
  status: 'available' | 'occupied'
  price: string
  features: string[]
  image: string
}

export interface Booking {
  id: number
  deskName: string
  deskIcon: string
  location: string
  date: string
  status: 'active' | 'upcoming' | 'completed'
}