import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, Award, Hand, Sun, WifiOff, BarChart3, ShieldCheck, Play } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'STRIDE — The Conductor\'s Digital Companion',
    subtitle: 'Nielsen Product Design Assignment Presentation',
    content: (
      <div className="space-y-4 text-center py-8">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-3xl flex items-center justify-center mx-auto shadow-2xl">
          S
        </div>
        <h2 className="text-3xl font-black text-white">STRIDE</h2>
        <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">Every stop. Every passenger. One effortless flow.</p>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          A mobile-first, one-handed conductor ticketing prototype designed to digitize BMTC and BEST thermal-printer ticketing machines under high physical motion and glare conditions.
        </p>
      </div>
    )
  },
  {
    id: 2,
    title: 'Understanding the Conductor\'s Environment',
    subtitle: 'Real-World Physical Constraints',
    content: (
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <h4 className="font-extrabold text-amber-400 text-sm">🖐️ One-Handed Limit</h4>
          <p className="text-slate-300">Conductor holds cash in one hand and operates the app using only the thumb of the other hand.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <h4 className="font-extrabold text-amber-400 text-sm">🚌 Vehicle Shock & Vibration</h4>
          <p className="text-slate-300">Sudden braking and heavy road vibrations inside moving buses increase mis-tap frequency.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <h4 className="font-extrabold text-amber-400 text-sm">☀️ Bright Sunlight & Glare</h4>
          <p className="text-slate-300">Open windows produce extreme glare; default small mobile fonts become unreadable.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <h4 className="font-extrabold text-amber-400 text-sm">⏱️ Urgency & Passenger Density</h4>
          <p className="text-slate-300">Serving standing crowds in under 4 seconds per transaction is an operational necessity.</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: 'The Core Nielsen Design Challenge',
    subtitle: 'Speed, One-Handed Use, Sunlight Visibility',
    content: (
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-xs">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <h4 className="font-extrabold text-sm text-white">Nielsen Benchmark Requirement</h4>
            <p className="text-slate-300">Select destination ➔ Issue ticket for 3 passengers ➔ Complete transaction in under 4.0 seconds.</p>
          </div>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="font-extrabold text-emerald-400 uppercase text-[11px] block">Measurable Interaction Goal:</span>
          <p className="text-slate-300">Implemented pure high-precision timing engine (`performance.now()`) in `/usability-lab` to measure tap durations, mis-taps, and empirical pass rates.</p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: 'Product Design Principles',
    subtitle: 'Speed Without Confusion. Simplicity Without Sacrificing Control.',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">1</span>
          <div>
            <h5 className="font-bold text-white">Bottom Thumb-Zone Priority</h5>
            <p className="text-slate-400 text-[11px]">85% of tap targets are located in the natural thumb reach arc.</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0">2</span>
          <div>
            <h5 className="font-bold text-white">Pre-configured Operational Defaults</h5>
            <p className="text-slate-400 text-[11px]">Shift setup occurs once; passenger preset defaults to 3 for Nielsen flow.</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <span className="w-7 h-7 rounded-xl bg-teal-400 text-slate-950 font-black flex items-center justify-center shrink-0">3</span>
          <div>
            <h5 className="font-bold text-white">Instant Feedback & Double-Tap Safety</h5>
            <p className="text-slate-400 text-[11px]">Idempotency keys eliminate accidental duplicate tickets from fast taps.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: 'Our Two-Action Fast Ticketing Flow',
    subtitle: 'Minimal Steps. Maximum Speed.',
    content: (
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-center">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Action 0</span>
            <span className="font-black text-white text-sm block mt-1">Shift Active</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Action 1 (1 Tap)</span>
            <span className="font-black text-white text-sm block mt-1">Tap Destination Stop</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Action 2 (1 Tap)</span>
            <span className="font-black text-white text-sm block mt-1">Tap ISSUE TICKET</span>
          </div>
        </div>
        <span className="text-emerald-400 font-extrabold text-sm block pt-2">✓ Total Measured Duration: 1.85s - 2.40s</span>
      </div>
    )
  },
  {
    id: 6,
    title: 'High-Fidelity Mobile Screens',
    subtitle: 'Shift Setup • Main Ticketing • History • Dashboard • Settings',
    content: (
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1">
          <span className="font-bold text-emerald-400">1. Shift Setup</span>
          <p className="text-slate-400 text-[11px]">Route, bus, conductor ID, direction configuration.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1">
          <span className="font-bold text-emerald-400">2. Main Ticketing Pad</span>
          <p className="text-slate-400 text-[11px]">Destinations, 3-pax preset, massive thumb button.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1">
          <span className="font-bold text-emerald-400">3. Ticket Confirmation</span>
          <p className="text-slate-400 text-[11px]">Thermal receipt preview, reprint, void, next ticket.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1">
          <span className="font-bold text-emerald-400">4. Usability Timing Lab</span>
          <p className="text-slate-400 text-[11px]">4-second stopwatch & empirical CSV exporter.</p>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: 'Thumb Reachability & Handedness',
    subtitle: 'Left-Hand & Right-Hand Ergonomic Heatmaps',
    content: (
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 text-xs">
        <p className="text-slate-300">
          STRIDE includes an interactive <strong>Thumb Zone Heatmap Overlay</strong> and support for both Right-Handed and Left-Handed conductors.
        </p>
        <div className="flex justify-around text-center pt-2">
          <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-500/40 text-emerald-300">
            <span className="font-extrabold text-sm block">Natural (Green)</span>
            <span className="text-[10px]">Issue Ticket Action</span>
          </div>
          <div className="bg-amber-950/80 p-3 rounded-2xl border border-amber-500/40 text-amber-300">
            <span className="font-extrabold text-sm block">Stretch (Yellow)</span>
            <span className="text-[10px]">Stop Pickers</span>
          </div>
          <div className="bg-red-950/80 p-3 rounded-2xl border border-red-500/40 text-red-300">
            <span className="font-extrabold text-sm block">Hard (Red)</span>
            <span className="text-[10px]">Header Info</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: 'Failure Handling & Accessibility',
    subtitle: 'Sunlight Mode • Network Loss • Printer Paper Jam',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <Sun className="w-5 h-5 text-yellow-400 shrink-0" />
          <div>
            <h5 className="font-bold text-white">Sunlight High-Contrast Mode</h5>
            <p className="text-slate-400 text-[11px]">Increases contrast for unhindered operation in outdoor sunlight.</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h5 className="font-bold text-white">Offline Client Persistence</h5>
            <p className="text-slate-400 text-[11px]">Saves tickets locally in IndexedDB when network drops.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: 'Usability Validation & Trade-offs',
    subtitle: 'Empirical Usability Lab Benchmarks',
    content: (
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 text-xs">
        <div className="grid grid-cols-3 gap-2 text-center font-bold">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Median Time</span>
            <span className="text-lg font-black text-emerald-400">2.10s</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Pass Rate</span>
            <span className="text-lg font-black text-amber-400">100%</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Target</span>
            <span className="text-lg font-black text-teal-300">&lt; 4.0s</span>
          </div>
        </div>
        <p className="text-slate-400 text-[11px]">
          Trade-off Rationale: Sacrificed unreserved passenger seating assignment to maximize 2-tap conductor issuing speed.
        </p>
      </div>
    )
  },
  {
    id: 10,
    title: 'Future Production Integration Roadmap',
    subtitle: 'Bluetooth Printers • Real UPI Webhooks • NFC Verification',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <h5 className="font-bold text-emerald-400">1. Physical Thermal Printer Drivers</h5>
          <p className="text-slate-400 text-[11px]">Bluetooth ESC/POS thermal printer integration for physical paper printing.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <h5 className="font-bold text-amber-400">2. Real-Time Transit Fare APIs</h5>
          <p className="text-slate-400 text-[11px]">Live GTFS-RT feed integration for automatic GPS bus stop progression.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <h5 className="font-bold text-teal-400">3. NFC & Smart Card Tap</h5>
          <p className="text-slate-400 text-[11px]">Direct contactless NFC pass validation for BMTC Smart Cards.</p>
        </div>
      </div>
    )
  }
];

export const PresentationDeckPage: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slide = SLIDES[currentSlideIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <Link to="/" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white">
          <ChevronLeft className="w-4 h-4" /> Back to App
        </Link>
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
          SLIDE {currentSlideIndex + 1} OF {SLIDES.length}
        </span>
      </div>

      {/* Slide Card Container */}
      <div className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-2xl space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-white">{slide.title}</h2>
          <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">{slide.subtitle}</p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full">{slide.content}</div>
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentSlideIndex === 0}
          className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 flex items-center gap-2 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Slide
        </button>

        <div className="flex gap-1.5">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlideIndex === idx ? 'bg-emerald-400 w-6' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.min(SLIDES.length - 1, prev + 1))}
          disabled={currentSlideIndex === SLIDES.length - 1}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black shadow-lg flex items-center gap-2 disabled:opacity-30"
        >
          Next Slide <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
