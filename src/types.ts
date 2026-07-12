export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  type: string;
  status: 'Active' | 'In Service' | 'Maintenance' | 'Idle';
  fuel: number; // 0-100% or battery
  health: number; // 0-100%
  capacity: string;
  lastService: string;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  safetyScore: number; // 0-100
  status: 'On Duty' | 'Active' | 'Off Duty' | 'Sick';
  hours: number;
  phone: string;
  avatarColor: string;
  email?: string;
  licenseCategory?: string;
  licenseExpiry?: string;
  experience?: string;
  totalDistance?: number;
  fuelEfficiency?: string;
  achievements?: string[];
  recentActivity?: string[];
  performanceTimeline?: { date: string; score: number }[];
  upcomingTripsCount?: number;
  todayDistance?: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  destination: string;
  departure: string;
  status: 'Pending' | 'Loading' | 'On Route' | 'Delayed' | 'Completed';
  eta: string;
  progress: number; // 0-100
  freight: string;
  cost: number;
  date: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  priority: 'Low' | 'Medium' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Resolved';
  cost: number;
  date: string;
  technician: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  volume: number; // Gallons
  pricePerUnit: number; // $ per Gallon
  totalCost: number;
  odometer: number;
  station: string;
  date: string;
}

export interface Expense {
  id: string;
  category: 'Fuel' | 'Maintenance' | 'Driver Salary' | 'Insurance' | 'Tolls & Permits' | 'Other';
  amount: number;
  date: string;
  description: string;
  reference: string;
}

export interface SystemSettings {
  orgName: string;
  address: string;
  taxId: string;
  currency: string;
  timezone: string;
  notificationsEnabled: boolean;
  density: 'High' | 'Compact' | 'Standard';
  theme: 'Light' | 'Slate';
}
