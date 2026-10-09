import React, { useState } from 'react';
import { useStride } from '../contexts/StrideContext';
import { SAMPLE_ROUTES } from '../domain/routesData';
import { Bus, User, MapPin, Compass, Play, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const ShiftSetup: React.FC = () => {
  const { startShift, activeShift, t } = useStride();

  const [conductorId, setConductorId] = useState(activeShift?.conductorId || 'C-8821');
  const [conductorName, setConductorName] = useState(activeShift?.conductorName || 'Ramesh Kumar');
  const [busNumber, setBusNumber] = useState(activeShift?.busNumber || 'KA-01-F-4509');
  const [routeId, setRouteId] = useState(activeShift?.routeId || SAMPLE_ROUTES[0].id);
  const [direction, setDirection] = useState<'UP' | 'DOWN'>(activeShift?.direction || 'UP');

  const handleStartShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conductorId.trim() || !busNumber.trim()) {
      toast.error('Please enter valid Conductor ID and Bus Number');
      return;
    }

    startShift({
      conductorId,
      conductorName,
      busNumber,
      routeId,
      direction
    });

    toast.success('Shift started successfully! Ready for one-handed ticketing.');
  };

  return (
    <div className="p-4 flex flex-col h-full justify-between space-y-3 bg-[#F5F7FA] text-[#0F172A]">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl space-y-1 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0B7A5A]" />
          <h2 className="font-extrabold text-base text-[#0F172A]">STRIDE Shift Setup</h2>
        </div>
        <p className="text-xs text-[#475569]">
          Configure route parameters once at shift start to avoid redundant inputs during fast ticketing.
        </p>
      </div>

      {/* Setup Form */}
      <form onSubmit={handleStartShift} className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
        
        {/* Conductor Profile Input */}
        <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl space-y-2 shadow-xs">
          <label className="text-[11px] text-[#475569] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#0B7A5A]" /> Conductor Details
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-[#475569] block mb-1">Conductor ID</span>
              <input
                type="text"
                value={conductorId}
                onChange={(e) => setConductorId(e.target.value)}
                className="w-full bg-[#F5F7FA] text-[#0F172A] text-xs p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-1 focus:ring-[#0B7A5A]"
                required
              />
            </div>
            <div>
              <span className="text-[10px] text-[#475569] block mb-1">Conductor Name</span>
              <input
                type="text"
                value={conductorName}
                onChange={(e) => setConductorName(e.target.value)}
                className="w-full bg-[#F5F7FA] text-[#0F172A] text-xs p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-1 focus:ring-[#0B7A5A]"
                required
              />
            </div>
          </div>
        </div>

        {/* Bus Vehicle Number Input */}
        <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl space-y-2 shadow-xs">
          <label className="text-[11px] text-[#475569] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Bus className="w-3.5 h-3.5 text-[#0B7A5A]" /> Bus Vehicle Number
          </label>
          <input
            type="text"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            placeholder="e.g. KA-01-F-4509"
            className="w-full bg-[#F5F7FA] text-[#0F172A] font-mono-numbers font-bold text-sm p-3 rounded-xl border border-[#E2E8F0] focus:ring-1 focus:ring-[#0B7A5A] uppercase"
            required
          />
        </div>

        {/* Route Selector */}
        <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl space-y-2 shadow-xs">
          <label className="text-[11px] text-[#475569] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0B7A5A]" /> Assigned Bus Route
          </label>
          <select
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            className="w-full bg-[#F5F7FA] text-[#0F172A] text-xs p-3 rounded-xl border border-[#E2E8F0] focus:ring-1 focus:ring-[#0B7A5A]"
          >
            {SAMPLE_ROUTES.map((r) => (
              <option key={r.id} value={r.id}>
                Route {r.routeNumber}: {r.routeName} ({r.agency})
              </option>
            ))}
          </select>
        </div>

        {/* Direction Toggle */}
        <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl space-y-2 shadow-xs">
          <label className="text-[11px] text-[#475569] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#0B7A5A]" /> Travel Direction
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDirection('UP')}
              className={`p-3 rounded-xl font-bold text-xs border transition-all ${
                direction === 'UP'
                  ? 'bg-[#0B7A5A] text-white border-[#0B7A5A]'
                  : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              UP BOUND
            </button>
            <button
              type="button"
              onClick={() => setDirection('DOWN')}
              className={`p-3 rounded-xl font-bold text-xs border transition-all ${
                direction === 'DOWN'
                  ? 'bg-[#0B7A5A] text-white border-[#0B7A5A]'
                  : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              DOWN BOUND
            </button>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-[#0B7A5A] hover:bg-[#09664b] text-white font-black text-base shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Play className="w-5 h-5 fill-white" />
          {t('startShift')}
        </button>
      </form>
    </div>
  );
};
