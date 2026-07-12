import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle, Driver } from '../types';

interface FleetMapProps {
  vehicles: Vehicle[];
  drivers: Driver[];
}

export default function FleetMap({ vehicles, drivers }: FleetMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map only if not already initialized
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([38.5, -96.0], 4); // Centered over US

      // Modern dark/light-friendly clean map theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);

      markerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Clear old markers
    if (markerGroupRef.current) {
      markerGroupRef.current.clearLayers();
    }

    // Static coordinated mock data for vehicles to place on the map
    const vehicleCoords: Record<string, [number, number]> = {
      'v-1': [38.6270, -90.1994], // St. Louis, MO
      'v-2': [40.0150, -105.2705], // Boulder / Denver, CO
      'v-3': [41.8781, -87.6298], // Chicago, IL
      'v-4': [45.5152, -122.6784], // Portland / Seattle route
    };

    vehicles.forEach(vehicle => {
      // Get predefined coords or random offset around midwest
      const coords = vehicleCoords[vehicle.id] || [
        38.5 + (Math.random() - 0.5) * 6,
        -95.0 + (Math.random() - 0.5) * 10
      ];

      const assocDriver = drivers.find(d => d.id === (vehicle.id === 'v-1' ? 'd-1' : vehicle.id === 'v-2' ? 'd-2' : vehicle.id === 'v-3' ? 'd-4' : 'd-3'));

      // Beautiful SVG vector pin marker representing vehicles
      const isCritical = vehicle.health < 75 || vehicle.fuel < 40;
      const markerColor = vehicle.status === 'Active' ? '#22C55E' : vehicle.status === 'In Service' ? '#3B82F6' : '#EF4444';
      
      const svgIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-6 w-6 rounded-full opacity-35 animate-ping" style="background-color: ${markerColor}"></span>
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg text-white" style="background-color: ${markerColor}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><circle cx="7" cy="18" r="2"/><path d="M19 18h2a1 1 0 0 0 1-1v-5a4 4 0 0 0-4-4h-3v10"/><circle cx="17" cy="18" r="2"/></svg>
            </div>
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Bind dynamic popup
      if (mapRef.current && markerGroupRef.current) {
        const popupContent = `
          <div class="p-2 font-sans space-y-1.5 text-xs text-slate-800" style="min-width: 170px;">
            <div class="flex justify-between items-center border-b border-slate-100 pb-1">
              <span class="font-bold text-slate-900">${vehicle.name}</span>
              <span class="text-[9px] font-mono px-1 bg-slate-100 rounded text-slate-500">${vehicle.plate}</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-slate-600">
              <div>
                <span class="block text-slate-400 text-[9px] uppercase">Driver</span>
                <span class="text-slate-800">${assocDriver?.name || 'Unassigned'}</span>
              </div>
              <div>
                <span class="block text-slate-400 text-[9px] uppercase">Fuel level</span>
                <span class="${vehicle.fuel < 40 ? 'text-rose-600' : 'text-slate-800'} font-bold">${vehicle.fuel}%</span>
              </div>
              <div>
                <span class="block text-slate-400 text-[9px] uppercase">Health score</span>
                <span class="text-slate-800 font-bold">${vehicle.health}%</span>
              </div>
              <div>
                <span class="block text-slate-400 text-[9px] uppercase">Status</span>
                <span class="text-white px-1 py-0.5 rounded text-[8px] font-bold" style="background-color: ${markerColor}">${vehicle.status}</span>
              </div>
            </div>
          </div>
        `;

        const marker = L.marker(coords, { icon: svgIcon })
          .bindPopup(popupContent, { closeButton: false, offset: [0, -10] })
          .addTo(markerGroupRef.current);
          
        // Optional path routing simulation (draw lines to target destination cities)
        if (vehicle.status === 'Active' || vehicle.status === 'In Service') {
          const destCoords: Record<string, [number, number]> = {
            'v-1': [41.8781, -87.6298], // Chicago, IL
            'v-2': [40.7128, -74.0060], // NY, NY
            'v-4': [47.6062, -122.3321], // Seattle, WA
          };
          const dest = destCoords[vehicle.id];
          if (dest) {
            L.polyline([coords, dest], {
              color: '#5B3DF5',
              weight: 2,
              opacity: 0.5,
              dashArray: '5, 8'
            }).addTo(markerGroupRef.current);
          }
        }
      }
    });

  }, [vehicles, drivers]);

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-xs border border-slate-100 dark:border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" style={{ zIndex: 1 }} />
      {/* Absolute floating telemetry index */}
      <div className="absolute top-3 right-3 z-[10] bg-white/90 dark:bg-slate-900/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-600 dark:text-slate-300 font-semibold space-y-1 pointer-events-none">
        <span className="text-[9px] uppercase text-slate-400 font-bold block mb-1">Fleet Markers Legend</span>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
          <span>Active GPS Online</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
          <span>Under Service</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span>Scheduled Maintenance</span>
        </div>
      </div>
    </div>
  );
}
