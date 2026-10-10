import React, { useState } from 'react';
import { useStride } from '../../contexts/StrideContext';
import { Smartphone, Monitor, ShieldCheck, Zap, Globe, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../../domain/types';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  displayMode?: 'standard' | 'sunlight';
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children, displayMode = 'standard' }) => {
  const { settings, updateSettings, t } = useStride();
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  const isSunlight = displayMode === 'sunlight';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-300 font-sans ${
      isSunlight ? 'bg-white text-black sunlight-mode' : 'bg-[#F5F7FA] text-[#0F172A]'
    }`}>
      
      {/* Top Navbar Header - Visible on desktop, subtle on mobile */}
      <header className="hidden md:flex w-full max-w-6xl px-4 py-3 border-b border-[#E2E8F0] bg-white shadow-xs items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B7A5A] text-white flex items-center justify-center shadow-md font-black text-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-[#0F172A]">STRIDE</h1>
              <span className="text-[10px] bg-[#E3F4EE] text-[#0B7A5A] font-extrabold px-2 py-0.5 rounded-full border border-[#0B7A5A]/30 uppercase tracking-wider">
                CONDUCTOR COMPANION
              </span>
            </div>
            <p className="text-[11px] text-[#475569]">Empirical Nielsen 4-Second Ticketing Prototype • One-Handed Ergonomics</p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 text-xs font-bold">
          
          {/* Sunlight Mode Quick Toggle */}
          <button
            onClick={() => updateSettings({ displayMode: isSunlight ? 'standard' : 'sunlight' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border flex items-center gap-1.5 transition-all ${
              isSunlight
                ? 'bg-amber-400 text-black border-black shadow-xs'
                : 'bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#0F172A] border-[#E2E8F0]'
            }`}
            title="Toggle Bright Sunlight Glare Contrast Mode"
          >
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{isSunlight ? 'Sunlight ON' : 'Sunlight Mode'}</span>
          </button>

          {/* Network Status Dot */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            settings.simulateNetworkOffline
              ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/40'
              : 'bg-[#E3F4EE] text-[#0B7A5A] border-[#0B7A5A]/30'
          }`}>
            {settings.simulateNetworkOffline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping"></span>
                <span>OFFLINE (LOCAL)</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#0B7A5A]"></span>
                <span>ONLINE LOCAL</span>
              </>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-[#475569] mr-1" />
            <select
              value={settings.language || 'en'}
              onChange={(e) => updateSettings({ language: e.target.value as Language })}
              className="bg-transparent text-[11px] font-bold text-[#0F172A] focus:outline-hidden cursor-pointer"
            >
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          <Link
            to="/usability-lab"
            className="px-3 py-1.5 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#0B7A5A] border border-[#E2E8F0] flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-4 h-4 text-[#0B7A5A]" /> <span>Usability Lab</span>
          </Link>
          
          <Link
            to="/case-study"
            className="px-3 py-1.5 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#92400E] border border-[#E2E8F0] flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-[#F59E0B]" /> <span>Case Study</span>
          </Link>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="p-2 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#475569] border border-[#E2E8F0] flex items-center gap-1.5"
            title={isMobileFrame ? "Switch to Full View" : "Switch to Phone Frame"}
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Screen Container: Edge-to-edge native on mobile, framed on desktop */}
      <main className="flex-1 w-full flex items-center justify-center p-0 md:p-6 overflow-hidden">
        {/* Mobile Viewport: Direct Native Experience (100dvh, zero artificial bezel) */}
        <div className="w-full h-[100dvh] md:hidden flex flex-col overflow-hidden bg-white">
          <div className={`flex-1 w-full h-full flex flex-col overflow-hidden ${
            isSunlight ? 'bg-white text-black sunlight-mode' : 'bg-[#F5F7FA] text-[#0F172A]'
          }`}>
            {children}
          </div>
        </div>

        {/* Desktop Viewport: Realistic Smartphone Outer Shell */}
        <div className="hidden md:flex w-full items-center justify-center">
          {isMobileFrame ? (
            <div className="relative w-full max-w-[412px] h-[870px] bg-slate-900 rounded-[44px] p-3 border-[6px] border-slate-800 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.3)] flex flex-col overflow-hidden ring-1 ring-slate-700/50">
              {/* Phone Speaker Notch */}
              <div className="absolute top-4 inset-x-0 flex justify-center z-40 pointer-events-none">
                <div className="w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 px-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></span>
                  <span className="w-10 h-1 bg-slate-800 rounded-full"></span>
                </div>
              </div>

              {/* Inner Phone Screen Content */}
              <div className={`flex-1 w-full rounded-[34px] overflow-hidden flex flex-col pt-5 relative shadow-inner ${
                isSunlight ? 'bg-white text-black sunlight-mode' : 'bg-[#F5F7FA] text-[#0F172A]'
              }`}>
                {children}
              </div>
            </div>
          ) : (
            <div className={`w-full max-w-md min-h-[800px] rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden flex flex-col ${
              isSunlight ? 'bg-white text-black sunlight-mode' : 'bg-[#F5F7FA] text-[#0F172A]'
            }`}>
              {children}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
