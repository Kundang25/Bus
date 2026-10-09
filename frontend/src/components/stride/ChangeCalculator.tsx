import React, { useState } from 'react';
import { calculateCashChange } from '../../domain/fareCalculator';
import { Coins, Check, AlertTriangle } from 'lucide-react';

interface ChangeCalculatorProps {
  totalFare: number;
  onClose: () => void;
}

export const ChangeCalculator: React.FC<ChangeCalculatorProps> = ({ totalFare, onClose }) => {
  const [cashTendered, setCashTendered] = useState<number>(100);

  const presets = [
    totalFare,
    Math.ceil(totalFare / 50) * 50 || 50,
    100,
    200,
    500
  ].filter((v, idx, arr) => v >= totalFare && arr.indexOf(v) === idx);

  const result = calculateCashChange(totalFare, cashTendered);

  return (
    <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">Fast Cash & Change Calculator</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 bg-slate-800 rounded">
          Done
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div>
          <span className="text-[11px] text-slate-400 block uppercase font-medium">Ticket Payable</span>
          <span className="text-xl font-black text-white">₹{totalFare}</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-400 block uppercase font-medium">Cash Received</span>
          <span className="text-xl font-black text-amber-400">₹{cashTendered}</span>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div>
        <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Quick Tendered Cash Presets:</span>
        <div className="flex flex-wrap gap-2">
          {presets.map((amt) => (
            <button
              key={amt}
              onClick={() => setCashTendered(amt)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                cashTendered === amt
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Change Result Display */}
      <div className={`p-3 rounded-xl flex items-center justify-between border ${
        result.isValid
          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
          : 'bg-red-950/60 border-red-500/50 text-red-300'
      }`}>
        {result.isValid ? (
          <>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold block">Change to Return</span>
                <span className="text-[10px] text-emerald-400/80">Give cash back to passenger</span>
              </div>
            </div>
            <span className="text-2xl font-black text-emerald-400">₹{result.changeDue}</span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <span className="text-xs font-bold block">Insufficient Cash</span>
                <span className="text-[10px] text-red-400/80">Need additional money</span>
              </div>
            </div>
            <span className="text-xl font-bold text-red-400">Short ₹{result.shortage}</span>
          </>
        )}
      </div>
    </div>
  );
};
