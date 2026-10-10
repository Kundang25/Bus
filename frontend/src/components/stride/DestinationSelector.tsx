import React, { useState } from 'react';
import { BusStop, Route } from '../../domain/types';
import { MapPin, Search, Star, AlertCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface DestinationSelectorProps {
  route: Route;
  currentStop: BusStop;
  selectedDestination: BusStop | null;
  onSelectDestination: (stop: BusStop) => void;
  onMisTap?: () => void;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  route,
  currentStop,
  selectedDestination,
  onSelectDestination,
  onMisTap
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullListOpen, setIsFullListOpen] = useState(false);

  // Valid destinations are stops ahead of current stop in route sequence
  const validStops = route.stops.filter((s) => s.stageNumber > currentStop.stageNumber);
  const popularStops = validStops.filter((s) => s.isPopular);

  const filteredStops = validStops.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2.5">
      {/* Header & Current Origin Banner */}
      <div className="flex items-center justify-between text-xs text-[#475569] font-medium px-0.5">
        <span className="flex items-center gap-1.5 text-[#0F172A]">
          <MapPin className="w-4 h-4 text-[#0B7A5A]" />
          Boarding: <strong className="text-[#0F172A] font-bold">{currentStop.name}</strong>
        </span>
        <span className="bg-[#E3F4EE] px-2 py-0.5 rounded-full text-[11px] text-[#0B7A5A] font-bold border border-[#0B7A5A]/30">
          Stage {currentStop.stageNumber}
        </span>
      </div>

      {/* 2x2 Frequent Destination Grid (1-Tap Fast Selection) */}
      {popularStops.length > 0 && (
        <div>
          <span className="text-[11px] text-[#475569] block mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" /> Frequent Destinations
          </span>
          <div className="grid grid-cols-2 gap-2">
            {popularStops.slice(0, 4).map((stop) => {
              const isSelected = selectedDestination?.id === stop.id;
              return (
                <button
                  key={stop.id}
                  onClick={() => onSelectDestination(stop)}
                  className={`p-2.5 rounded-2xl text-left transition-all border flex flex-col justify-between min-h-[62px] ${
                    isSelected
                      ? 'bg-[#0B7A5A] text-white border-[#0B7A5A] ring-2 ring-[#0B7A5A]/30 shadow-md font-bold'
                      : 'bg-white hover:bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0] shadow-xs active:scale-98'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[11px] uppercase font-extrabold tracking-wide ${isSelected ? 'text-white/90' : 'text-[#475569]'}`}>
                      {stop.code}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#0F172A]'
                    }`}>
                      Stage {stop.stageNumber}
                    </span>
                  </div>
                  <span className="text-sm font-black leading-tight line-clamp-1 tracking-tight">{stop.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Collapsible / Bottom Sheet Toggle for Full Stop List */}
      <div className="pt-1">
        <button
          onClick={() => setIsFullListOpen(!isFullListOpen)}
          className="w-full py-2 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#475569] hover:text-[#0F172A] flex items-center justify-between shadow-xs"
        >
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#0B7A5A]" />
            {isFullListOpen ? 'Hide Full Stop List' : 'Search & Pick All Route Stops...'}
          </span>
          {isFullListOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isFullListOpen && (
          <div className="mt-2 p-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-md space-y-2 animate-in fade-in">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination stop..."
              className="w-full bg-[#F5F7FA] text-[#0F172A] placeholder-[#475569] text-xs px-3 py-2 rounded-xl border border-[#E2E8F0] focus:ring-1 focus:ring-[#0B7A5A]"
            />

            <div className="max-h-44 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {filteredStops.length > 0 ? (
                filteredStops.map((stop) => {
                  const isSelected = selectedDestination?.id === stop.id;
                  return (
                    <button
                      key={stop.id}
                      onClick={() => {
                        onSelectDestination(stop);
                        setIsFullListOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs transition-all border ${
                        isSelected
                          ? 'bg-[#0B7A5A] text-white font-bold border-[#0B7A5A]'
                          : 'bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#0F172A] border-[#E2E8F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#0B7A5A]'}`} />
                        <span>{stop.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono-numbers font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#475569]'
                      }`}>
                        Stage {stop.stageNumber}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-center text-[#475569] text-xs">No matching stops found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
