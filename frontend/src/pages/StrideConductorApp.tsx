import React from 'react';
import { useStride } from '../contexts/StrideContext';
import { QuickTicketing } from '../components/stride/QuickTicketing';
import { TicketHistory } from './TicketHistory';
import { ShiftDashboard } from './ShiftDashboard';
import { SettingsPage } from './Settings';
import { ShiftSetup } from './ShiftSetup';
import { OfflineSyncBanner } from '../components/stride/OfflineSyncBanner';
import { ThumbOverlay } from '../components/stride/ThumbOverlay';
import { MobileDeviceFrame } from '../components/stride/MobileDeviceFrame';
import { Ticket as TicketIcon, History, ClipboardList, Settings, Eye, EyeOff } from 'lucide-react';

export const StrideConductorApp: React.FC = () => {
  const { activeShift, currentTab, setCurrentTab, settings, updateSettings, t } = useStride();

  if (!activeShift || !activeShift.isActive) {
    return (
      <MobileDeviceFrame displayMode={settings.displayMode}>
        <ShiftSetup />
      </MobileDeviceFrame>
    );
  }

  return (
    <MobileDeviceFrame displayMode={settings.displayMode}>
      <div className="flex flex-col h-full bg-[#F5F7FA] text-[#0F172A] select-none relative overflow-hidden font-sans">
        
        {/* Offline & Printer Warning Banner */}
        <OfflineSyncBanner />

        {/* Ergonomic Thumb Zone Heatmap Overlay */}
        <ThumbOverlay
          handedness={settings.handedness}
          isVisible={settings.showThumbZonesOverlay}
          onClose={() => updateSettings({ showThumbZonesOverlay: false })}
        />

        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#E2E8F0] px-3 py-2 flex items-center justify-between z-10 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0B7A5A] text-white font-black text-xs flex items-center justify-center">
              S
            </div>
            <div>
              <span className="font-extrabold text-xs text-[#0F172A] block leading-tight">STRIDE</span>
              <span className="text-[9px] text-[#475569] block font-mono-numbers font-bold">#{activeShift.busNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Heatmap Toggle with Explicit ON/OFF Text */}
            <button
              onClick={() => updateSettings({ showThumbZonesOverlay: !settings.showThumbZonesOverlay })}
              className={`px-2 py-1 rounded-xl text-[10px] font-extrabold border flex items-center gap-1 transition-all ${
                settings.showThumbZonesOverlay
                  ? 'bg-[#0B7A5A] text-white border-[#0B7A5A]'
                  : 'bg-[#F5F7FA] text-[#475569] border-[#E2E8F0]'
              }`}
            >
              {settings.showThumbZonesOverlay ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Heatmap {settings.showThumbZonesOverlay ? 'ON' : 'OFF'}</span>
            </button>
            <span className="bg-[#E2E8F0] text-[#0F172A] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeShift.conductorId}
            </span>
          </div>
        </header>

        {/* Tab View Container */}
        <main className="flex-1 overflow-hidden relative p-2 sm:p-3">
          {currentTab === 'ticket' && <QuickTicketing />}
          {currentTab === 'history' && <TicketHistory />}
          {currentTab === 'dashboard' && <ShiftDashboard />}
          {currentTab === 'settings' && <SettingsPage />}
        </main>

        {/* Bottom Mobile Navigation Bar (with 10px Horizontal Padding to avoid touching screen edge) */}
        <nav className="bg-white border-t border-[#E2E8F0] grid grid-cols-4 px-2 py-1.5 z-20 shadow-lg">
          {[
            { id: 'ticket', label: t('ticketTab'), icon: TicketIcon },
            { id: 'history', label: t('historyTab'), icon: History },
            { id: 'dashboard', label: t('shiftTab'), icon: ClipboardList },
            { id: 'settings', label: t('settingsTab'), icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`py-1.5 px-2 rounded-xl flex flex-col items-center gap-0.5 text-[10px] font-extrabold transition-all mx-0.5 ${
                  isActive
                    ? 'bg-[#0B7A5A] text-white shadow-md scale-102'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F5F7FA]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </MobileDeviceFrame>
  );
};
