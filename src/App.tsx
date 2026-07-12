import React, { useState, useEffect } from 'react';
import { 
  Truck, AlertTriangle, ShieldCheck, X, LogOut, CheckCircle, Bell
} from 'lucide-react';
import { Vehicle, Driver, Trip, MaintenanceRecord, FuelLog, Expense, SystemSettings } from './types';
import { useAuth } from './context/AuthContext';

// Import Reusable Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import NotificationDrawer from './components/NotificationDrawer';
import CommandPalette from './components/CommandPalette';

// Import Entity Detail Modals
import VehicleDetailModal from './components/VehicleDetailModal';
import DriverDetailModal from './components/DriverDetailModal';
import TripDetailModal from './components/TripDetailModal';

// Import Modular Page Views
import DashboardView from './components/DashboardView';
import DriverDashboardView from './components/DriverDashboardView';
import ForbiddenView from './components/ForbiddenView';
import VehiclesView from './components/VehiclesView';
import DriversView from './components/DriversView';
import TripsView from './components/TripsView';
import MaintenanceView from './components/MaintenanceView';
import FuelLogsView from './components/FuelLogsView';
import ExpensesView from './components/ExpensesView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import ProfileView from './components/ProfileView';

// Capacity Parser Helper
function parseCapacityToKg(capacityStr: string): number {
  if (!capacityStr) return 0;
  const cleaned = capacityStr.toLowerCase().replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (cleaned.includes('ton')) {
    return num * 1000;
  }
  if (cleaned.includes('kg') || cleaned.includes('kilo')) {
    return num;
  }
  if (cleaned.includes('lb')) {
    return num * 0.45359237;
  }
  return num;
}

// Initial Mock Data
const initialVehicles: Vehicle[] = [
  { id: 'v-1', name: 'Volvo FH16', plate: 'AX-902-KL', type: 'Heavy Truck', status: 'Active', fuel: 85, health: 94, capacity: '25 Tons', lastService: '2026-06-15' },
  { id: 'v-2', name: 'Scania R450', plate: 'TY-341-PP', type: 'Heavy Truck', status: 'In Service', fuel: 62, health: 89, capacity: '24 Tons', lastService: '2026-05-20' },
  { id: 'v-3', name: 'Ford Transit', plate: 'ER-881-QQ', type: 'Delivery Van', status: 'Maintenance', fuel: 35, health: 68, capacity: '3.5 Tons', lastService: '2026-07-10' },
  { id: 'v-4', name: 'Rivian EDV', plate: 'EV-772-DX', type: 'Electric Carrier', status: 'Active', fuel: 95, health: 99, capacity: '2.0 Tons', lastService: '2026-07-08' },
];

const initialDrivers: Driver[] = [
  { id: 'd-1', name: 'Robert Vance', license: 'CDL-A-8821', safetyScore: 98, status: 'On Duty', hours: 142, phone: '+1 (555) 321-4567', avatarColor: 'bg-indigo-600' },
  { id: 'd-2', name: 'Arun Singh', license: 'CDL-A-4190', safetyScore: 94, status: 'On Duty', hours: 118, phone: '+1 (555) 890-1234', avatarColor: 'bg-purple-600' },
  { id: 'd-3', name: 'Sarah Parker', license: 'CDL-B-5532', safetyScore: 96, status: 'Active', hours: 160, phone: '+1 (555) 765-4321', avatarColor: 'bg-emerald-600' },
  { id: 'd-4', name: 'Leo Gaultier', license: 'CDL-A-9912', safetyScore: 78, status: 'Off Duty', hours: 110, phone: '+1 (555) 234-5678', avatarColor: 'bg-amber-600' },
  { 
    id: 'd-alex', 
    name: 'Alex Rivera', 
    license: 'CDL-A-9942', 
    safetyScore: 97, 
    status: 'On Duty', 
    hours: 145, 
    phone: '+1 (555) 432-8890', 
    avatarColor: 'bg-[#5B3DF5]', 
    email: 'alex@transitops.com',
    licenseCategory: 'CDL Class A',
    licenseExpiry: '2028-11-15',
    experience: '8 Years',
    totalDistance: 12450,
    fuelEfficiency: '6.8 MPG',
    achievements: ['Safe Driver of the Month', 'Eco-Hauler Certified', 'Zero Incidents 2025'],
    recentActivity: [
      'Logged fuel volume at Pilot Center Denver',
      'Completed cargo transit route TR-8944',
      'Pre-trip checks approved'
    ],
    performanceTimeline: [
      { date: 'Mon', score: 95 },
      { date: 'Tue', score: 96 },
      { date: 'Wed', score: 98 },
      { date: 'Thu', score: 97 },
      { date: 'Fri', score: 97 }
    ],
    upcomingTripsCount: 3,
    todayDistance: 245
  }
];

const initialTrips: Trip[] = [
  { id: 'TR-8942', vehicleId: 'v-1', driverId: 'd-alex', destination: 'Chicago, IL', departure: 'St. Louis, MO', status: 'On Route', eta: '14:20 PM', progress: 75, freight: 'Industrial Equipment', cost: 1450, date: '2026-07-11' },
  { id: 'TR-8943', vehicleId: 'v-2', driverId: 'd-2', destination: 'New York, NY', departure: 'Philadelphia, PA', status: 'Loading', eta: '16:45 PM', progress: 15, freight: 'Consumer Goods', cost: 850, date: '2026-07-11' },
  { id: 'TR-8944', vehicleId: 'v-4', driverId: 'd-3', destination: 'Seattle, WA', departure: 'Portland, OR', status: 'Completed', eta: 'Done', progress: 100, freight: 'Medical Supplies', cost: 500, date: '2026-07-10' },
  { id: 'TR-8945', vehicleId: 'v-1', driverId: 'd-alex', destination: 'Denver, CO', departure: 'Chicago, IL', status: 'Pending', eta: 'Tomorrow 08:00 AM', progress: 0, freight: 'Automotive Parts', cost: 2100, date: '2026-07-13' },
];

const initialMaintenance: MaintenanceRecord[] = [
  { id: 'm-1', vehicleId: 'v-3', type: 'Brake Overhaul', priority: 'Critical', status: 'In Progress', cost: 850, date: '2026-07-10', technician: 'Elite Truck Service' },
  { id: 'm-2', vehicleId: 'v-2', type: 'Engine Tuning', priority: 'Medium', status: 'Pending', cost: 420, date: '2026-07-15', technician: 'McGrath Mechanics' },
];

const initialFuelLogs: FuelLog[] = [
  { id: 'f-1', vehicleId: 'v-1', volume: 120, pricePerUnit: 3.85, totalCost: 462, odometer: 145800, station: 'Shell St. Louis', date: '2026-07-09' },
  { id: 'f-2', vehicleId: 'v-2', volume: 145, pricePerUnit: 3.92, totalCost: 568.4, odometer: 92310, station: 'Pilot Center Denver', date: '2026-07-08' },
];

const initialExpenses: Expense[] = [
  { id: 'e-1', category: 'Fuel', amount: 1030.4, date: '2026-07-09', description: 'Fleet fuel bulk refills', reference: 'INV-9942' },
  { id: 'e-2', category: 'Maintenance', amount: 850.0, date: '2026-07-10', description: 'Volvo Brake System Overhaul', reference: 'INV-8831' },
  { id: 'e-3', category: 'Driver Salary', amount: 3200.0, date: '2026-07-05', description: 'Bi-weekly Driver payroll', reference: 'PAY-2291' },
];

export default function App() {
  const { user, isLoggedIn: authIsLoggedIn, login: authLogin, logout: authLogout, hasPermission } = useAuth();
  
  // Authentication & Layout state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginRole, setLoginRole] = useState<'Admin' | 'Driver'>('Admin');
  const [username, setUsername] = useState<string>('admin@transitops.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Sync isLoggedin state from auth session
  useEffect(() => {
    setIsLoggedIn(authIsLoggedIn);
  }, [authIsLoggedIn]);

  // Notifications Drawer
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', title: 'Route Delayed', message: 'Trip TR-8942 is currently delayed near Chicago.', time: '5m ago', unread: true, type: 'warning' },
    { id: '2', title: 'Low Fuel Warning', message: 'Vehicle AX-902-KL fuel telemetry drops under 15%.', time: '12m ago', unread: true, type: 'danger' },
    { id: '3', title: 'Odometer Update', message: 'Driver Sarah Parker synced vehicle Rivian EDV.', time: '1h ago', unread: false, type: 'info' }
  ]);

  // Command Console Palette
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  // App core state
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => JSON.parse(localStorage.getItem('to_vehicles') || JSON.stringify(initialVehicles)));
  const [drivers, setDrivers] = useState<Driver[]>(() => JSON.parse(localStorage.getItem('to_drivers') || JSON.stringify(initialDrivers)));
  const [trips, setTrips] = useState<Trip[]>(() => JSON.parse(localStorage.getItem('to_trips') || JSON.stringify(initialTrips)));
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(() => JSON.parse(localStorage.getItem('to_maintenance') || JSON.stringify(initialMaintenance)));
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => JSON.parse(localStorage.getItem('to_fuel') || JSON.stringify(initialFuelLogs)));
  const [expenses, setExpenses] = useState<Expense[]>(() => JSON.parse(localStorage.getItem('to_expenses') || JSON.stringify(initialExpenses)));
  const [settings, setSettings] = useState<SystemSettings>({
    orgName: 'TransitOps Logistics Ltd',
    address: '450 Terminal Pkwy, Sector 4, Chicago IL',
    taxId: 'TX-882-901-A',
    currency: 'USD ($)',
    timezone: 'UTC-6 (Central Standard Time)',
    notificationsEnabled: true,
    density: 'High',
    theme: 'Light'
  });

  // Entity Detail Modal states
  const [detailType, setDetailType] = useState<'vehicle' | 'driver' | 'trip' | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Toast Alerts system
  const [toasts, setToasts] = useState<{id: string, text: string, type: 'success' | 'info' | 'error'}[]>([]);
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Synchronize Dark Theme root class
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'Dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Persist State
  useEffect(() => { localStorage.setItem('to_vehicles', JSON.stringify(vehicles)) }, [vehicles]);
  useEffect(() => { localStorage.setItem('to_drivers', JSON.stringify(drivers)) }, [drivers]);
  useEffect(() => { localStorage.setItem('to_trips', JSON.stringify(trips)) }, [trips]);
  useEffect(() => { localStorage.setItem('to_maintenance', JSON.stringify(maintenance)) }, [maintenance]);
  useEffect(() => { localStorage.setItem('to_fuel', JSON.stringify(fuelLogs)) }, [fuelLogs]);
  useEffect(() => { localStorage.setItem('to_expenses', JSON.stringify(expenses)) }, [expenses]);

  // Guarantee that Alex Rivera and their trips exist in localStorage/state without duplicates
  useEffect(() => {
    setDrivers(prev => {
      const unique = new Map(prev.map(d => [d.id, d]));
      const alex = initialDrivers.find(d => d.id === 'd-alex');
      if (alex && !unique.has('d-alex')) {
        unique.set('d-alex', alex);
      }
      return Array.from(unique.values());
    });

    setTrips(prev => {
      const unique = new Map<string, Trip>();
      prev.forEach(t => {
        unique.set(t.id, t);
      });
      const alexTrips = initialTrips.filter(t => t.driverId === 'd-alex');
      alexTrips.forEach(t => {
        unique.set(t.id, t);
      });
      return Array.from(unique.values());
    });
  }, []);

  // Hotkeys for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamic telemetry simulation
  const [simulating, setSimulating] = useState<boolean>(false);
  const triggerSimulation = () => {
    setSimulating(true);
    setTrips(prev => prev.map(t => {
      if (t.status === 'On Route' || t.status === 'Loading' || t.status === 'Pending') {
        const nextProgress = Math.min(t.progress + Math.floor(Math.random() * 12) + 6, 100);
        return {
          ...t,
          progress: nextProgress,
          status: nextProgress === 100 ? 'Completed' : 'On Route',
          eta: nextProgress === 100 ? 'Done' : `${Math.max(1, 10 - Math.floor(nextProgress / 10))}h remaining`
        };
      }
      return t;
    }));
    setVehicles(prev => prev.map(v => {
      if (v.status === 'In Service' || v.status === 'Active') {
        return {
          ...v,
          fuel: Math.max(v.fuel - Math.floor(Math.random() * 6) - 2, 8),
          health: Math.max(v.health - (Math.random() > 0.85 ? 1 : 0), 35)
        };
      }
      return v;
    }));
    setTimeout(() => {
      setSimulating(false);
      showToast('Live GPS coordinates, transit progress, and fuel levels updated', 'success');
    }, 600);
  };

  // Modal State Control
  const [modalType, setModalType] = useState<string | null>(null); 
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Generic Form States
  const [formVehicle, setFormVehicle] = useState<Partial<Vehicle>>({ name: '', plate: '', type: 'Heavy Truck', status: 'Active', fuel: 100, health: 100, capacity: '20 Tons', lastService: '2026-07-01' });
  const [formDriver, setFormDriver] = useState<Partial<Driver>>({ name: '', license: '', safetyScore: 95, status: 'Active', hours: 0, phone: '', avatarColor: 'bg-indigo-600' });
  const [formTrip, setFormTrip] = useState<Partial<Trip>>({ vehicleId: 'v-1', driverId: 'd-1', destination: '', departure: '', status: 'Pending', progress: 0, freight: '', cost: 1000, date: '2026-07-11', eta: 'TBD' });
  const [formMaintenance, setFormMaintenance] = useState<Partial<MaintenanceRecord>>({ vehicleId: 'v-1', type: '', priority: 'Medium', status: 'Pending', cost: 300, date: '2026-07-11', technician: '' });
  const [formFuel, setFormFuel] = useState<Partial<FuelLog>>({ vehicleId: 'v-1', volume: 50, pricePerUnit: 3.80, totalCost: 190, odometer: 100000, station: '', date: '2026-07-11' });
  const [formExpense, setFormExpense] = useState<Partial<Expense>>({ category: 'Fuel', amount: 150, date: '2026-07-11', description: '', reference: '' });

  // Add Item actions
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'vehicle') {
      const plateNormalized = formVehicle.plate?.trim().toLowerCase();
      const isDuplicatePlate = vehicles.some(v => v.plate.trim().toLowerCase() === plateNormalized && (modalMode === 'add' || v.id !== selectedId));
      if (isDuplicatePlate) {
        showToast(`Registration plate number "${formVehicle.plate}" already exists in the fleet registry!`, 'error');
        return;
      }

      if (modalMode === 'add') {
        const newV: Vehicle = { ...(formVehicle as Vehicle), id: 'v-' + Date.now() };
        setVehicles(prev => [...prev, newV]);
        showToast(`Asset ${newV.name} registered!`);
      } else {
        setVehicles(prev => prev.map(v => v.id === selectedId ? { ...v, ...formVehicle } : v));
        showToast(`Vehicle configurations updated!`);
      }
    } else if (modalType === 'driver') {
      if (modalMode === 'add') {
        const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-blue-600', 'bg-rose-600', 'bg-purple-600', 'bg-amber-600'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newD: Driver = { ...(formDriver as Driver), id: 'd-' + Date.now(), avatarColor: randomColor };
        setDrivers(prev => [...prev, newD]);
        showToast(`Operator ${newD.name} onboarded!`);
      } else {
        setDrivers(prev => prev.map(d => d.id === selectedId ? { ...d, ...formDriver } : d));
        showToast(`Operator credentials updated!`);
      }
    } else if (modalType === 'trip') {
      const vehicle = vehicles.find(v => v.id === formTrip.vehicleId);
      const driver = drivers.find(d => d.id === formTrip.driverId);

      if (!vehicle) {
        showToast('Assigned vehicle does not exist in the active fleet!', 'error');
        return;
      }
      if (!driver) {
        showToast('Assigned driver does not exist in the active personnel registry!', 'error');
        return;
      }

      // 1. Vehicle status constraints (must not be 'In Shop' / 'Maintenance' or 'Retired')
      if (vehicle.status === 'Maintenance' || vehicle.status === 'Retired') {
        showToast(`Assigned vehicle ${vehicle.name} is currently In Shop or Retired and cannot be dispatched.`, 'error');
        return;
      }

      // 2. Driver status constraints: Suspended, Expired License, On Duty
      if (driver.status === 'Suspended') {
        showToast(`Driver ${driver.name} is currently Suspended and cannot be assigned.`, 'error');
        return;
      }
      
      const isExpired = driver.licenseExpiry ? new Date(driver.licenseExpiry) < new Date('2026-07-12') : false;
      if (isExpired) {
        showToast(`Driver ${driver.name} has an Expired CDL (Expired: ${driver.licenseExpiry}) and cannot be assigned.`, 'error');
        return;
      }

      if (modalMode === 'add' && driver.status === 'On Duty') {
        showToast(`Driver ${driver.name} is already On Duty on another active route!`, 'error');
        return;
      }

      if (modalMode === 'add' && vehicle.status === 'In Service') {
        showToast(`Vehicle ${vehicle.name} is already In Service on another active route!`, 'error');
        return;
      }

      // 3. Cargo weight vs vehicle capacity
      const cargoWeightNum = parseFloat(formTrip.freight?.match(/\d+/)?.[0] || '0');
      const vehicleCapacityNum = parseCapacityToKg(vehicle.capacity);
      if (cargoWeightNum > 0 && vehicleCapacityNum > 0 && cargoWeightNum > vehicleCapacityNum) {
        showToast(`Safety violation: Freight cargo weight (${cargoWeightNum}kg) exceeds vehicle capacity of (${vehicle.capacity})!`, 'error');
        return;
      }

      if (modalMode === 'add') {
        const newT: Trip = { ...(formTrip as Trip), id: 'TR-' + Math.floor(Math.random() * 9000 + 1000) };
        setTrips(prev => [...prev, newT]);

        // Auto update vehicle and driver statuses to On Trip (In Service and On Duty)
        setVehicles(prev => prev.map(v => v.id === newT.vehicleId ? { ...v, status: 'In Service' } : v));
        setDrivers(prev => prev.map(d => d.id === newT.driverId ? { ...d, status: 'On Duty' } : d));

        showToast(`Freight trip ${newT.id} dispatched successfully!`);
      } else {
        setTrips(prev => prev.map(t => t.id === selectedId ? { ...t, ...formTrip } : t));
        showToast(`Freight trip log modified!`);
      }
    } else if (modalType === 'maintenance') {
      if (modalMode === 'add') {
        const newM: MaintenanceRecord = { ...(formMaintenance as MaintenanceRecord), id: 'm-' + Date.now() };
        setMaintenance(prev => [...prev, newM]);

        // Auto set vehicle to In Shop (Maintenance)
        setVehicles(prev => prev.map(v => v.id === newM.vehicleId ? { ...v, status: 'Maintenance' } : v));

        // Auto log expense
        const newE: Expense = {
          id: 'e-' + Date.now(),
          category: 'Maintenance',
          amount: Number(newM.cost || 0),
          date: newM.date,
          description: `Repair Ticket ${newM.type} for vehicle ${newM.vehicleId}`,
          reference: `WO-${newM.id}`
        };
        setExpenses(prev => [...prev, newE]);
        showToast(`Repair task issued! Vehicle set to In Shop.`);
      } else {
        const updatedM = { ...(formMaintenance as MaintenanceRecord), id: selectedId! };
        setMaintenance(prev => prev.map(m => m.id === selectedId ? updatedM : m));

        // If resolved, restore vehicle status
        if (updatedM.status === 'Resolved') {
          setVehicles(prev => prev.map(v => {
            if (v.id === updatedM.vehicleId && v.status !== 'Retired') {
              return { ...v, status: 'Active' };
            }
            return v;
          }));
          showToast(`Repair task resolved! Vehicle returned to Active service.`);
        } else {
          showToast(`Repair task updated!`);
        }
      }
    } else if (modalType === 'fuel') {
      if (modalMode === 'add') {
        const computedCost = Number(formFuel.volume || 0) * Number(formFuel.pricePerUnit || 0);
        const newF: FuelLog = { ...(formFuel as FuelLog), id: 'f-' + Date.now(), totalCost: Number(computedCost.toFixed(2)) };
        setFuelLogs(prev => [...prev, newF]);
        // Auto log expense
        const newE: Expense = {
          id: 'e-' + Date.now(),
          category: 'Fuel',
          amount: Number(newF.totalCost || 0),
          date: newF.date,
          description: `Fuel logged: ${newF.volume} gal at ${newF.station}`,
          reference: `FL-${newF.id}`
        };
        setExpenses(prev => [...prev, newE]);
        showToast(`Fuel consumption log recorded!`);
      }
    } else if (modalType === 'expense') {
      if (modalMode === 'add') {
        const newEx: Expense = { ...(formExpense as Expense), id: 'e-' + Date.now() };
        setExpenses(prev => [...prev, newEx]);
        showToast(`Overhead expense voucher created!`);
      }
    }
    setModalType(null);
  };

  // Delete Item Action
  const handleDelete = (type: 'vehicle' | 'driver' | 'trip' | 'maintenance' | 'fuel' | 'expense', id: string) => {
    if (confirm(`Are you sure you want to delete this ${type} item?`)) {
      if (type === 'vehicle') setVehicles(prev => prev.filter(x => x.id !== id));
      if (type === 'driver') setDrivers(prev => prev.filter(x => x.id !== id));
      if (type === 'trip') setTrips(prev => prev.filter(x => x.id !== id));
      if (type === 'maintenance') setMaintenance(prev => prev.filter(x => x.id !== id));
      if (type === 'fuel') setFuelLogs(prev => prev.filter(x => x.id !== id));
      if (type === 'expense') setExpenses(prev => prev.filter(x => x.id !== id));
      showToast(`${type.toUpperCase()} log removed`, 'info');
    }
  };

  // Complete and Cancel Trip Logic
  const handleCancelTrip = (tripId: string) => {
    const targetTrip = trips.find(t => t.id === tripId);
    if (!targetTrip) return;

    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Completed', progress: 0, eta: 'Cancelled' } : t));
    
    // Restore vehicle and driver
    setVehicles(prev => prev.map(v => v.id === targetTrip.vehicleId ? { ...v, status: 'Active' } : v));
    setDrivers(prev => prev.map(d => d.id === targetTrip.driverId ? { ...d, status: 'Active' } : d));
    
    showToast(`Trip ${tripId} cancelled. Asset and driver restored to Active.`, 'info');
    setDetailType(null); // Close modal
  };

  const handleCompleteTrip = (tripId: string, fuelVolume: number, distance: number, finalOdometer: number) => {
    const targetTrip = trips.find(t => t.id === tripId);
    if (!targetTrip) return;

    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Completed', progress: 100, eta: 'Arrived' } : t));
    
    // Restore vehicle and driver
    setVehicles(prev => prev.map(v => v.id === targetTrip.vehicleId ? { ...v, status: 'Active' } : v));
    setDrivers(prev => prev.map(d => d.id === targetTrip.driverId ? { ...d, status: 'Active' } : d));

    // Create a Fuel Log
    if (fuelVolume > 0 || distance > 0) {
      const fuelCost = fuelVolume * 3.85; // Standard fuel price
      const newF: FuelLog = {
        id: 'f-' + Date.now(),
        vehicleId: targetTrip.vehicleId,
        volume: fuelVolume,
        pricePerUnit: 3.85,
        totalCost: Number(fuelCost.toFixed(2)),
        odometer: finalOdometer || 115000,
        station: 'Pilot Travel Center',
        date: new Date().toISOString().split('T')[0]
      };
      setFuelLogs(prev => [...prev, newF]);

      // Auto log expense
      const newE: Expense = {
        id: 'e-' + Date.now(),
        category: 'Fuel',
        amount: newF.totalCost,
        date: newF.date,
        description: `Trip ${tripId} completion fuel refill: ${fuelVolume} gal`,
        reference: `FL-${newF.id}`
      };
      setExpenses(prev => [...prev, newE]);
    }

    showToast(`Trip ${tripId} completed! Vehicle and driver restored to Active status.`, 'success');
    setDetailType(null); // Close modal
  };

  // Search filter predicate
  const filterBySearch = (text: string) => {
    if (!globalSearch) return true;
    return text.toLowerCase().includes(globalSearch.toLowerCase());
  };

  // Calculated variables for badges
  const maintenancePendingCount = maintenance.filter(m => m.status !== 'Resolved').length;
  const activeTripsCount = trips.filter(t => t.status === 'On Route' || t.status === 'Loading').length;
  const totalFleetHealth = Math.round(vehicles.reduce((acc, v) => acc + v.health, 0) / (vehicles.length || 1));

  // Reports Excel/PDF Export handler
  const handleExport = (format: 'PDF' | 'CSV') => {
    showToast(`Compiling fleet telemetry logs & billing spreadsheets...`, 'info');
    setTimeout(() => {
      showToast(`Report exported successfully as TransitOps_Audit.${format.toLowerCase()}`, 'success');
    }, 1200);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginRole === 'Admin') {
      const email = username.trim() || 'admin@transitops.com';
      authLogin(email, 'Admin', 'James Donovan');
      showToast('Authenticated as James Donovan (Admin)', 'success');
    } else {
      const email = username.trim() || 'alex@transitops.com';
      authLogin(email, 'Driver', 'Alex Rivera', 'd-alex');
      showToast('Authenticated as Alex Rivera (Driver)', 'success');
    }
  };

  // Open detail popups
  const handleOpenDetail = (type: 'vehicle' | 'driver' | 'trip', id: string) => {
    setDetailId(id);
    setDetailType(type);
  };

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setGlobalSearch('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row font-sans">
        {/* Left Side: Modern Transport Logistics Graphic */}
        <div className="w-full md:w-1/2 bg-[#1E293B] flex flex-col justify-between p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
          
          <div className="flex items-center space-x-3 z-10">
            <div className="p-2 bg-[#5B3DF5] rounded-xl">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="font-bold text-2xl tracking-tight text-white font-[Poppins]">TransitOps</span>
              <p className="text-[10px] uppercase tracking-widest text-[#7C5CFC] font-semibold">ERP System</p>
            </div>
          </div>

          <div className="my-auto py-12 z-10 max-w-md">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none mb-4 text-white font-[Poppins]">
              Smart Transport Operations Platform
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering global logistics, heavy hauling fleets, and commercial delivery systems with live tracking, proactive maintenance, automated fuel logs, and advanced expense ledgering.
            </p>
            
            <div className="border border-slate-700/60 rounded-xl bg-slate-800/40 p-4 space-y-3 backdrop-blur-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Live Active Fleet</span>
                <span className="text-green-400 font-bold">142 Units Online</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#5B3DF5] rounded-full w-[88%]"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 font-bold">
                <div>● 92% Route Efficiency</div>
                <div>● 4.8★ Driver Safety</div>
                <div>● 0 Pending Alerts</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 z-10 font-semibold">
            <span>© 2026 TransitOps Inc. Enterprise Grade Security Guaranteed.</span>
          </div>
        </div>

        {/* Right Side: Professional Login Form */}
        <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-white font-[Poppins]">Account Sign-In</h2>
              <p className="text-slate-400 text-xs mt-1">Authorized operations center personnel only</p>
            </div>

            {/* Segmented Control for Role Selection */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('Admin');
                  setUsername('admin@transitops.com');
                }}
                className={`flex-1 py-2 text-center text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                  loginRole === 'Admin' 
                    ? 'bg-[#5B3DF5] text-white shadow-md shadow-[#5B3DF5]/10' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Admin Role
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('Driver');
                  setUsername('alex@transitops.com');
                }}
                className={`flex-1 py-2 text-center text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                  loginRole === 'Driver' 
                    ? 'bg-[#5B3DF5] text-white shadow-md shadow-[#5B3DF5]/10' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Driver Role
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Username / Corporate Email</label>
                <input 
                  type="email" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#5B3DF5] focus:ring-1 focus:ring-[#5B3DF5]"
                  placeholder={loginRole === 'Admin' ? 'admin@transitops.com' : 'alex@transitops.com'}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Access Password</label>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#5B3DF5] focus:ring-1 focus:ring-[#5B3DF5]"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 px-4 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#5B3DF5]/20 transition-all duration-200 transform active:scale-95 cursor-pointer"
              >
                Sign In to Workstation
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Bypass Authorization</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => {
                  authLogin('admin@transitops.com', 'Admin', 'James Donovan');
                  showToast('Authenticated as James Donovan (Admin)', 'success');
                }}
                className="py-2.5 px-3 bg-slate-800/40 hover:bg-slate-850 text-slate-300 border border-slate-700/50 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all text-center leading-normal"
              >
                Login as Admin
                <span className="block text-[8px] text-[#5B3DF5] font-bold mt-0.5 normal-case">James Donovan</span>
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  authLogin('alex@transitops.com', 'Driver', 'Alex Rivera', 'd-alex');
                  showToast('Authenticated as Alex Rivera (Driver)', 'success');
                }}
                className="py-2.5 px-3 bg-slate-800/40 hover:bg-slate-850 text-slate-300 border border-slate-700/50 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all text-center leading-normal"
              >
                Login as Driver
                <span className="block text-[8px] text-emerald-400 font-bold mt-0.5 normal-case">Alex Rivera</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isDriver = user?.role === 'Driver';
  const forbiddenTabs = ['drivers', 'maintenance', 'expenses', 'reports', 'settings'];
  const isCurrentTabForbidden = isDriver && forbiddenTabs.includes(activeTab);

  return (
    <div className="h-screen flex bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
      
      {/* Dynamic Toast System notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`p-3 rounded-lg shadow-md flex items-center space-x-2 text-white text-xs font-bold animate-fade-in pointer-events-auto ${t.type === 'success' ? 'bg-[#22C55E]' : t.type === 'error' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'}`}>
            {t.type === 'success' ? <ShieldCheck className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* FIXED COLLAPSIBLE SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        vehiclesCount={vehicles.length}
        driversCount={drivers.length}
        tripsCount={trips.length}
        maintenanceCount={maintenancePendingCount}
        onLogout={() => {
          authLogout();
          setIsLoggedIn(false);
          showToast('Workstation logged off', 'info');
        }}
      />

      {/* MAIN WORKSPACE SECTION */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* STICKY NAVBAR PANEL */}
        <Navbar
          activeTab={activeTab}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          unreadNotificationsCount={notifications.filter(n => n.unread).length}
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          theme={settings.theme}
          onToggleTheme={() => {
            const nextTheme = settings.theme === 'Light' ? 'Dark' : 'Light';
            setSettings({ ...settings, theme: nextTheme });
            showToast(`Theme changed to ${nextTheme}`, 'info');
          }}
          onOpenDispatchModal={() => {
            setFormTrip({ vehicleId: vehicles[0]?.id || '', driverId: drivers[0]?.id || '', destination: '', departure: '', status: 'Pending', progress: 0, freight: '', cost: 1200, date: '2026-07-11', eta: 'TBD' });
            setModalMode('add');
            setModalType('trip');
          }}
          onSimulateGps={triggerSimulation}
          isSimulatingGps={simulating}
        />

        {/* PRIMARY VIEWPORTS ROUTING */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-200">
          
          {/* SEARCH INDICATION ON MOBILE */}
          <div className="md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                placeholder="Search active view grid..."
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-[#1E293B] border border-slate-150 dark:border-slate-800 rounded-lg text-xs"
              />
              <span className="absolute left-2.5 top-2.5 text-slate-400">🔍</span>
            </div>
          </div>

          {isCurrentTabForbidden ? (
            <ForbiddenView onBackToDashboard={() => handleSelectTab('dashboard')} />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                isDriver ? (
                  <DriverDashboardView
                    driver={drivers.find(d => d.id === 'd-alex') || drivers[0]}
                    vehicles={vehicles}
                    trips={trips}
                    notifications={notifications}
                    onNavigate={handleSelectTab}
                    onOpenDetail={handleOpenDetail}
                  />
                ) : (
                  <DashboardView
                    vehicles={vehicles}
                    drivers={drivers}
                    trips={trips}
                    maintenance={maintenance}
                    expenses={expenses}
                    onNavigate={handleSelectTab}
                    onOpenDetail={handleOpenDetail}
                  />
                )
              )}

              {activeTab === 'vehicles' && (
                <VehiclesView
                  vehicles={isDriver ? vehicles.filter(v => v.id === 'v-1') : vehicles}
                  filterBySearch={filterBySearch}
                  onAdd={() => {
                    setFormVehicle({ name: '', plate: '', type: 'Heavy Truck', status: 'Active', fuel: 100, health: 100, capacity: '24 Tons', lastService: '2026-07-01' });
                    setModalMode('add');
                    setModalType('vehicle');
                  }}
                  onEdit={(v) => {
                    setFormVehicle(v);
                    setSelectedId(v.id);
                    setModalMode('edit');
                    setModalType('vehicle');
                  }}
                  onDelete={(id) => handleDelete('vehicle', id)}
                  onOpenDetail={(id) => handleOpenDetail('vehicle', id)}
                />
              )}
            </>
          )}

          {activeTab === 'drivers' && (
            <DriversView
              drivers={drivers}
              filterBySearch={filterBySearch}
              onAdd={() => {
                setFormDriver({ name: '', license: '', safetyScore: 98, status: 'Active', hours: 0, phone: '' });
                setModalMode('add');
                setModalType('driver');
              }}
              onEdit={(d) => {
                setFormDriver(d);
                setSelectedId(d.id);
                setModalMode('edit');
                setModalType('driver');
              }}
              onDelete={(id) => handleDelete('driver', id)}
              onOpenDetail={(id) => handleOpenDetail('driver', id)}
            />
          )}

          {activeTab === 'trips' && (
            <TripsView
              trips={isDriver ? trips.filter(t => t.driverId === 'd-alex') : trips}
              vehicles={vehicles}
              drivers={drivers}
              filterBySearch={filterBySearch}
              onAdd={() => {
                setFormTrip({ vehicleId: vehicles[0]?.id || '', driverId: drivers[0]?.id || '', destination: '', departure: '', status: 'Pending', progress: 0, freight: '', cost: 1200, date: '2026-07-11', eta: 'TBD' });
                setModalMode('add');
                setModalType('trip');
              }}
              onEdit={(t) => {
                setFormTrip(t);
                setSelectedId(t.id);
                setModalMode('edit');
                setModalType('trip');
              }}
              onDelete={(id) => handleDelete('trip', id)}
              onOpenDetail={(id) => handleOpenDetail('trip', id)}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceView
              maintenance={maintenance}
              vehicles={vehicles}
              filterBySearch={filterBySearch}
              onAdd={() => {
                setFormMaintenance({ vehicleId: vehicles[0]?.id || '', type: '', priority: 'Medium', status: 'Pending', cost: 350, date: '2026-07-11', technician: '' });
                setModalMode('add');
                setModalType('maintenance');
              }}
              onEdit={(m) => {
                setFormMaintenance(m);
                setSelectedId(m.id);
                setModalMode('edit');
                setModalType('maintenance');
              }}
              onDelete={(id) => handleDelete('maintenance', id)}
            />
          )}

          {activeTab === 'fuel' && (
            <FuelLogsView
              fuelLogs={fuelLogs}
              vehicles={vehicles}
              filterBySearch={filterBySearch}
              onAdd={() => {
                setFormFuel({ vehicleId: vehicles[0]?.id || '', volume: 60, pricePerUnit: 3.85, totalCost: 231, odometer: 110000, station: '', date: '2026-07-11' });
                setModalMode('add');
                setModalType('fuel');
              }}
              onDelete={(id) => handleDelete('fuel', id)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView
              expenses={expenses}
              filterBySearch={filterBySearch}
              onAdd={() => {
                setFormExpense({ category: 'Other', amount: 120, date: '2026-07-11', description: '', reference: 'EX-OP-' + Math.floor(Math.random() * 900) });
                setModalMode('add');
                setModalType('expense');
              }}
              onDelete={(id) => handleDelete('expense', id)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              drivers={drivers}
              fuelLogs={fuelLogs}
              maintenance={maintenance}
              totalFleetHealth={totalFleetHealth}
              handleExport={handleExport}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              onSave={() => showToast('Configurations applied successfully')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              activeTripsCount={activeTripsCount}
            />
          )}

        </div>

        {/* STATIC CONTROL BOARD FOOTER */}
        <footer className="h-9 px-6 bg-white dark:bg-[#1E293B] border-t border-slate-150 dark:border-slate-800/80 flex items-center justify-between shrink-0 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold font-[Poppins] transition-colors">
          <span>TransitOps Enterprise Client System v4.2.1</span>
          <div className="flex space-x-6">
            <span>Server Cluster Status: <span className="text-emerald-500">Optimal</span></span>
            <span>Active Operations: {activeTripsCount}</span>
          </div>
        </footer>
      </main>

      {/* OPERATIONS LOG ALERTS DRAWER */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
      />

      {/* COMMAND PALETTE */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        vehicles={vehicles}
        drivers={drivers}
        trips={trips}
        onNavigate={handleSelectTab}
        onTriggerAction={(actionType) => {
          if (actionType === 'vehicle') {
            setFormVehicle({ name: '', plate: '', type: 'Heavy Truck', status: 'Active', fuel: 100, health: 100, capacity: '24 Tons', lastService: '2026-07-01' });
          } else if (actionType === 'driver') {
            setFormDriver({ name: '', license: '', safetyScore: 98, status: 'Active', hours: 0, phone: '' });
          } else if (actionType === 'trip') {
            setFormTrip({ vehicleId: vehicles[0]?.id || '', driverId: drivers[0]?.id || '', destination: '', departure: '', status: 'Pending', progress: 0, freight: '', cost: 1200, date: '2026-07-11', eta: 'TBD' });
          } else if (actionType === 'maintenance') {
            setFormMaintenance({ vehicleId: vehicles[0]?.id || '', type: '', priority: 'Medium', status: 'Pending', cost: 350, date: '2026-07-11', technician: '' });
          } else if (actionType === 'fuel') {
            setFormFuel({ vehicleId: vehicles[0]?.id || '', volume: 60, pricePerUnit: 3.85, totalCost: 231, odometer: 110000, station: '', date: '2026-07-11' });
          } else if (actionType === 'expense') {
            setFormExpense({ category: 'Other', amount: 120, date: '2026-07-11', description: '', reference: 'EX-OP-' + Math.floor(Math.random() * 900) });
          }
          setModalMode('add');
          setModalType(actionType);
          setShowCommandPalette(false);
        }}
      />

      {/* ENTITY DETAILS POPUPS */}
      {detailType === 'vehicle' && detailId && (
        <VehicleDetailModal
          vehicle={vehicles.find(v => v.id === detailId)!}
          onClose={() => setDetailType(null)}
          maintenanceHistory={maintenance}
          tripsHistory={trips}
        />
      )}
      {detailType === 'driver' && detailId && (
        <DriverDetailModal
          driver={drivers.find(d => d.id === detailId)!}
          onClose={() => setDetailType(null)}
          tripsHistory={trips}
        />
      )}
      {detailType === 'trip' && detailId && (
        <TripDetailModal
          trip={trips.find(t => t.id === detailId)!}
          vehicles={vehicles}
          drivers={drivers}
          onClose={() => setDetailType(null)}
          onCompleteTrip={handleCompleteTrip}
          onCancelTrip={handleCancelTrip}
        />
      )}

      {/* UNIFIED COMPACT MODAL FORM DRAWER */}
      {modalType !== null && (
        <div className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-scale-up text-slate-800 dark:text-slate-100 transition-colors">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                {modalMode === 'add' ? 'Dispatch / Register New' : 'Modify'} {modalType.toUpperCase()}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              
              {/* VEHICLE INPUTS */}
              {modalType === 'vehicle' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Asset Model Name</label>
                    <input
                      type="text"
                      required
                      value={formVehicle.name}
                      onChange={e => setFormVehicle({ ...formVehicle, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      placeholder="e.g. Scania R500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Plate Number</label>
                      <input
                        type="text"
                        required
                        value={formVehicle.plate}
                        onChange={e => setFormVehicle({ ...formVehicle, plate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. AX-902-KL"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Capacity Metric</label>
                      <input
                        type="text"
                        value={formVehicle.capacity}
                        onChange={e => setFormVehicle({ ...formVehicle, capacity: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. 25 Tons"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Asset Type</label>
                      <select
                        value={formVehicle.type}
                        onChange={e => setFormVehicle({ ...formVehicle, type: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                      >
                        <option>Heavy Truck</option>
                        <option>Delivery Van</option>
                        <option>Electric Carrier</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Status</label>
                      <select
                        value={formVehicle.status}
                        onChange={e => setFormVehicle({ ...formVehicle, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                      >
                        <option>Active</option>
                        <option>In Service</option>
                        <option>Maintenance</option>
                        <option>Idle</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* DRIVER INPUTS */}
              {modalType === 'driver' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Full Operator Name</label>
                    <input
                      type="text"
                      required
                      value={formDriver.name}
                      onChange={e => setFormDriver({ ...formDriver, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      placeholder="e.g. Robert Vance"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">License (CDL)</label>
                      <input
                        type="text"
                        required
                        value={formDriver.license}
                        onChange={e => setFormDriver({ ...formDriver, license: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. CDL-A-8821"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={formDriver.phone}
                        onChange={e => setFormDriver({ ...formDriver, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Safety Index (0-100)</label>
                      <input
                        type="number"
                        max="100"
                        min="0"
                        value={formDriver.safetyScore}
                        onChange={e => setFormDriver({ ...formDriver, safetyScore: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Duty Status</label>
                      <select
                        value={formDriver.status}
                        onChange={e => setFormDriver({ ...formDriver, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                      >
                        <option>Active</option>
                        <option>On Duty</option>
                        <option>Off Duty</option>
                        <option>Sick</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TRIP INPUTS */}
              {modalType === 'trip' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Departure Depot</label>
                      <input
                        type="text"
                        required
                        value={formTrip.departure}
                        onChange={e => setFormTrip({ ...formTrip, departure: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. Chicago, IL"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Destination Target</label>
                      <input
                        type="text"
                        required
                        value={formTrip.destination}
                        onChange={e => setFormTrip({ ...formTrip, destination: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. Dallas, TX"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Asset Assigned</label>
                      <select
                        value={formTrip.vehicleId}
                        onChange={e => setFormTrip({ ...formTrip, vehicleId: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                      >
                        {vehicles.filter(v => {
                          if (modalMode === 'edit' && v.id === formTrip.vehicleId) return true;
                          return v.status !== 'Maintenance' && v.status !== 'Retired' && v.status !== 'In Service';
                        }).map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({v.plate}) [{v.status}]</option>
                        ))}
                        {vehicles.filter(v => {
                          if (modalMode === 'edit' && v.id === formTrip.vehicleId) return true;
                          return v.status !== 'Maintenance' && v.status !== 'Retired' && v.status !== 'In Service';
                        }).length === 0 && (
                          <option value="">No Available Vehicles</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Driver Operator</label>
                      <select
                        value={formTrip.driverId}
                        onChange={e => setFormTrip({ ...formTrip, driverId: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                      >
                        {drivers.filter(d => {
                          if (modalMode === 'edit' && d.id === formTrip.driverId) return true;
                          const isSuspended = d.status === 'Suspended';
                          const isExpired = d.licenseExpiry ? new Date(d.licenseExpiry) < new Date('2026-07-12') : false;
                          const isOnDuty = d.status === 'On Duty';
                          return !isSuspended && !isExpired && !isOnDuty;
                        }).map(d => (
                          <option key={d.id} value={d.id}>{d.name} {d.licenseExpiry ? `(CDL Exp: ${d.licenseExpiry})` : ''}</option>
                        ))}
                        {drivers.filter(d => {
                          if (modalMode === 'edit' && d.id === formTrip.driverId) return true;
                          const isSuspended = d.status === 'Suspended';
                          const isExpired = d.licenseExpiry ? new Date(d.licenseExpiry) < new Date('2026-07-12') : false;
                          const isOnDuty = d.status === 'On Duty';
                          return !isSuspended && !isExpired && !isOnDuty;
                        }).length === 0 && (
                          <option value="">No Available Drivers</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Freight Material</label>
                      <input
                        type="text"
                        required
                        value={formTrip.freight}
                        onChange={e => setFormTrip({ ...formTrip, freight: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. Industrial Steel"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Direct Budget Cost ($)</label>
                      <input
                        type="number"
                        required
                        value={formTrip.cost}
                        onChange={e => setFormTrip({ ...formTrip, cost: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MAINTENANCE INPUTS */}
              {modalType === 'maintenance' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Transit Asset Link</label>
                    <select
                      value={formMaintenance.vehicleId}
                      onChange={e => setFormMaintenance({ ...formMaintenance, vehicleId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Repair Task Type</label>
                      <input
                        type="text"
                        required
                        value={formMaintenance.type}
                        onChange={e => setFormMaintenance({ ...formMaintenance, type: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. Oil Change"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Depot Technician</label>
                      <input
                        type="text"
                        required
                        value={formMaintenance.technician}
                        onChange={e => setFormMaintenance({ ...formMaintenance, technician: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. Corporate Depot B"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Invoiced Cost ($)</label>
                      <input
                        type="number"
                        required
                        value={formMaintenance.cost}
                        onChange={e => setFormMaintenance({ ...formMaintenance, cost: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Priority</label>
                      <select
                        value={formMaintenance.priority}
                        onChange={e => setFormMaintenance({ ...formMaintenance, priority: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Status</label>
                      <select
                        value={formMaintenance.status}
                        onChange={e => setFormMaintenance({ ...formMaintenance, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* FUEL LOG INPUTS */}
              {modalType === 'fuel' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Asset Machine Link</label>
                    <select
                      value={formFuel.vehicleId}
                      onChange={e => setFormFuel({ ...formFuel, vehicleId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Refill Volume (gal)</label>
                      <input
                        type="number"
                        required
                        value={formFuel.volume}
                        onChange={e => setFormFuel({ ...formFuel, volume: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Price Rate / gal ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formFuel.pricePerUnit}
                        onChange={e => setFormFuel({ ...formFuel, pricePerUnit: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Station Outlet</label>
                      <input
                        type="text"
                        required
                        value={formFuel.station}
                        onChange={e => setFormFuel({ ...formFuel, station: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. Pilot Center Denver"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Odometer Reading (mi)</label>
                      <input
                        type="number"
                        required
                        value={formFuel.odometer}
                        onChange={e => setFormFuel({ ...formFuel, odometer: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EXPENSE VOUCHER INPUTS */}
              {modalType === 'expense' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Category</label>
                      <select
                        value={formExpense.category}
                        onChange={e => setFormExpense({ ...formExpense, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold"
                      >
                        <option>Fuel</option>
                        <option>Maintenance</option>
                        <option>Driver Salary</option>
                        <option>Insurance</option>
                        <option>Tolls & Permits</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Amount ($)</label>
                      <input
                        type="number"
                        required
                        value={formExpense.amount}
                        onChange={e => setFormExpense({ ...formExpense, amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Voucher Description</label>
                    <input
                      type="text"
                      required
                      value={formExpense.description}
                      onChange={e => setFormExpense({ ...formExpense, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      placeholder="e.g. Standard highway toll gate refills"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Reference ID Code</label>
                    <input
                      type="text"
                      required
                      value={formExpense.reference}
                      onChange={e => setFormExpense({ ...formExpense, reference: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      placeholder="e.g. INV-2026-X"
                    />
                  </div>
                </div>
              )}

              {/* Form Action Controls */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5B3DF5] hover:bg-[#7C5CFC] text-white rounded-lg shadow-sm font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Entries
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
