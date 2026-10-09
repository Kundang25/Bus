import React from 'react';
import { Handedness } from '../../domain/types';

interface ThumbOverlayProps {
  handedness: Handedness;
  isVisible: boolean;
  onClose: () => void;
}

export const ThumbOverlay: React.FC<ThumbOverlayProps> = ({ handedness, isVisible, onClose }) => {
  if (!isVisible) return null;

  const isRight = handedness === 'right';

  return (
    <div 
      className="absolute inset-0 z-50 pointer-events-auto bg-black/60 backdrop-blur-xs flex flex-col justify-between p-4 transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div className="bg-slate-900/90 text-white rounded-xl p-3 border border-slate-700 shadow-2xl text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold uppercase tracking-wider text-emerald-400">Ergonomic Zone Heatmap ({isRight ? 'Right Hand' : 'Left Hand'})</span>
          <button onClick={onClose} className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 font-medium">Close (Esc)</button>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Nielsen Principle: Primary conductor actions are positioned in the <strong>Green Zone</strong> (Natural Thumb Reach) at the bottom to prevent wrist strain inside a moving bus.
        </p>
        <div className="flex items-center gap-3 text-[11px] pt-1">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-300"></span> Natural (Green)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-300"></span> Stretch (Yellow)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-300"></span> Hard (Red)</span>
        </div>
      </div>

      {/* Visual Reachability Arcs */}
      <div className="relative flex-1 my-4 pointer-events-none overflow-hidden rounded-2xl border-2 border-dashed border-slate-600/40">
        {/* Red Zone (Top Corners) */}
        <div className="absolute top-0 inset-x-0 h-1/3 bg-red-500/15 border-b border-red-500/30 flex items-start justify-center pt-3">
          <span className="text-red-400 font-bold text-xs uppercase tracking-widest bg-red-950/80 px-2 py-1 rounded">Hard Reach Zone</span>
        </div>

        {/* Yellow Zone (Middle Arc) */}
        <div className="absolute top-1/3 inset-x-0 h-1/3 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-center">
          <span className="text-amber-300 font-bold text-xs uppercase tracking-widest bg-amber-950/80 px-2 py-1 rounded">Stretch Reach Zone</span>
        </div>

        {/* Green Zone (Bottom Arc - Curved for Handedness) */}
        <div className={`absolute bottom-0 h-1/2 w-full bg-emerald-500/25 border-t-2 border-emerald-400/80 flex items-end ${isRight ? 'justify-end pr-4 pb-6' : 'justify-start pl-4 pb-6'}`}>
          <div className="bg-emerald-950/90 text-emerald-300 p-2.5 rounded-xl border border-emerald-500/50 shadow-xl max-w-[200px] text-center">
            <span className="font-extrabold text-xs block uppercase">Natural Thumb Zone</span>
            <span className="text-[10px] text-emerald-200 block mt-0.5">Primary Ticket Action & Cash Presets</span>
          </div>
        </div>
      </div>
    </div>
  );
};
