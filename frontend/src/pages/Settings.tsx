import React, { useState } from 'react';
import { useStride } from '../contexts/StrideContext';
import { Settings as SettingsIcon, Sun, Hand, Eye, Printer, WifiOff, Volume2, RotateCcw, ShieldCheck, Trash2, Globe, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Language } from '../domain/types';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllDemoData, t } = useStride();
  const [showDevTools, setShowDevTools] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleConfirmReset = () => {
    resetAllDemoData();
    setResetModalOpen(false);
    toast.warning('All local demo tickets and usability lab logs reset!');
  };

  return (
    <div className="p-3.5 flex flex-col h-full space-y-3 overflow-y-auto scrollbar-thin">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2.5">
        <SettingsIcon className="w-5 h-5 text-[#0B7A5A]" />
        <h2 className="font-extrabold text-base text-[#0F172A]">{t('settingsTab')}</h2>
      </div>

      {/* Group 1: Display & Ergonomics */}
      <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl space-y-3 shadow-xs">
        <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider block border-b border-[#E2E8F0] pb-1">
          1. Display & Ergonomics
        </span>

        {/* Handedness Orientation */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#475569] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Hand className="w-3.5 h-3.5 text-[#0B7A5A]" /> Handedness Orientation
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateSettings({ handedness: 'right' })}
              className={`p-2.5 rounded-xl font-bold text-xs border transition-all ${
                settings.handedness === 'right'
                  ? 'bg-[#0B7A5A] text-white border-[#0B7A5A] font-extrabold'
                  : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              RIGHT HAND
            </button>
            <button
              onClick={() => updateSettings({ handedness: 'left' })}
              className={`p-2.5 rounded-xl font-bold text-xs border transition-all ${
                settings.handedness === 'left'
                  ? 'bg-[#0B7A5A] text-white border-[#0B7A5A] font-extrabold'
                  : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              LEFT HAND
            </button>
          </div>
        </div>

        {/* High-Glare Sunlight Contrast Mode */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#475569] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-[#F59E0B]" /> Sunlight Glare Contrast
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateSettings({ displayMode: 'standard' })}
              className={`p-2.5 rounded-xl font-bold text-xs border transition-all ${
                settings.displayMode === 'standard'
                  ? 'bg-[#0B7A5A] text-white border-[#0B7A5A]'
                  : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              DEFAULT LIGHT MODE
            </button>
            <button
              onClick={() => updateSettings({ displayMode: 'sunlight' })}
              className={`p-2.5 rounded-xl font-bold text-xs border transition-all ${
                settings.displayMode === 'sunlight'
                  ? 'bg-[#000000] text-white border-[#000000]'
                  : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              BRIGHT SUNLIGHT MODE
            </button>
          </div>
        </div>

        {/* Ergonomic Zone Overlay */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[#0F172A] font-bold flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#0B7A5A]" /> Heatmap Overlay
          </span>
          <button
            onClick={() => updateSettings({ showThumbZonesOverlay: !settings.showThumbZonesOverlay })}
            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
              settings.showThumbZonesOverlay
                ? 'bg-[#0B7A5A] text-white border-[#0B7A5A]'
                : 'bg-[#F5F7FA] text-[#475569] border-[#E2E8F0]'
            }`}
          >
            {settings.showThumbZonesOverlay ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </div>

      {/* Group 2: Language & Audio */}
      <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl space-y-2.5 shadow-xs">
        <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider block border-b border-[#E2E8F0] pb-1">
          2. Language & Feedback
        </span>

        <div className="space-y-1.5">
          <label className="text-[11px] text-[#475569] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#0B7A5A]" /> Application Language
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
            {[
              { id: 'en', label: 'English' },
              { id: 'kn', label: 'ಕನ್ನಡ' },
              { id: 'hi', label: 'हिंदी' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => updateSettings({ language: lang.id as Language })}
                className={`py-2 rounded-xl border transition-all text-center ${
                  settings.language === lang.id
                    ? 'bg-[#0B7A5A] text-white border-[#0B7A5A]'
                    : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Group 3: Collapsible Developer & Testing Tools */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => setShowDevTools(!showDevTools)}
          className="w-full p-3.5 flex items-center justify-between text-xs font-extrabold text-[#0F172A] hover:bg-[#F5F7FA]"
        >
          <span>3. Developer & Simulator Stress Tools</span>
          {showDevTools ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDevTools && (
          <div className="p-3.5 border-t border-[#E2E8F0] space-y-3 bg-[#F5F7FA]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569] font-bold flex items-center gap-1.5">
                <WifiOff className="w-4 h-4 text-[#F59E0B]" /> Simulate Network Offline
              </span>
              <button
                onClick={() => updateSettings({ simulateNetworkOffline: !settings.simulateNetworkOffline })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  settings.simulateNetworkOffline ? 'bg-[#F59E0B] text-white border-[#F59E0B]' : 'bg-white text-[#475569] border-[#E2E8F0]'
                }`}
              >
                {settings.simulateNetworkOffline ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569] font-bold flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-[#C62828]" /> Simulate Paper Jam
              </span>
              <button
                onClick={() => updateSettings({ simulatePrinterError: !settings.simulatePrinterError })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  settings.simulatePrinterError ? 'bg-[#C62828] text-white border-[#C62828]' : 'bg-white text-[#475569] border-[#E2E8F0]'
                }`}
              >
                {settings.simulatePrinterError ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Stacked Reset Data Box - No clipping */}
            <div className="bg-white p-3 rounded-xl border border-[#C62828]/30 space-y-2 pt-3">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-[#C62828] block">Reset Local Demo Data</span>
                <span className="text-[10px] text-[#475569] block">Clears all saved tickets and usability lab benchmark logs</span>
              </div>
              <button
                onClick={() => setResetModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#FDECEC] hover:bg-red-100 border border-[#C62828]/40 text-[#C62828] text-xs font-extrabold transition-all"
              >
                RESET DEMO DATA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Reset Demo Data */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white text-[#0F172A] max-w-sm w-full p-5 rounded-3xl border border-[#E2E8F0] shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[#C62828]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-extrabold text-base text-[#0F172A]">Confirm Demo Reset</h3>
            </div>
            
            <p className="text-xs text-[#475569]">
              Are you sure you want to clear all tickets and usability test records? This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleConfirmReset}
                className="bg-[#C62828] hover:bg-red-700 text-white text-xs font-extrabold py-3 rounded-xl shadow-md"
              >
                Yes, Reset All Data
              </button>
              <button
                onClick={() => setResetModalOpen(false)}
                className="bg-[#F5F7FA] text-[#475569] text-xs font-bold py-3 rounded-xl border border-[#E2E8F0]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
