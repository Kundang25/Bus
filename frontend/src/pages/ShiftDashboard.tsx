import React, { useState } from 'react';
import { useStride } from '../contexts/StrideContext';
import { Download, Users, Banknote, QrCode, AlertOctagon, WifiOff, Clock, Power, DollarSign, Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const ShiftDashboard: React.FC = () => {
  const { activeShift, endShift, allTickets } = useStride();
  const [reconciliationModalOpen, setReconciliationModalOpen] = useState(false);
  const [countedCashInput, setCountedCashInput] = useState<string>('');

  if (!activeShift) return null;

  const operationalTickets = allTickets.filter((t) => !t.isLabTest && t.shiftId === activeShift.shiftId);

  const exportCSV = () => {
    if (operationalTickets.length === 0) {
      toast.error('No tickets recorded in current shift to export');
      return;
    }

    const headers = ['TicketID', 'IssuedAt', 'Bus', 'Route', 'From', 'To', 'Passengers', 'Category', 'UnitFare', 'TotalFare', 'PaymentMode', 'Status'];
    const rows = operationalTickets.map((t) => [
      t.id,
      t.issuedAt,
      t.busNumber,
      t.routeNumber,
      `"${t.fromStop.name}"`,
      `"${t.toStop.name}"`,
      t.passengerCount,
      t.category || 'adult',
      t.unitFare,
      t.totalFare,
      t.paymentMode,
      t.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stride_shift_${activeShift.shiftId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Shift summary CSV downloaded!');
  };

  // Cash vs Digital Progress Percentage
  const cashPct = activeShift.totalRevenue > 0
    ? Math.round((activeShift.cashRevenue / activeShift.totalRevenue) * 100)
    : 100;
  const digitalPct = 100 - cashPct;

  const expectedCash = activeShift.cashRevenue;
  const countedCash = parseFloat(countedCashInput) || 0;
  const cashDiff = countedCash - expectedCash;

  const handleConfirmEndShift = () => {
    endShift();
    setReconciliationModalOpen(false);
    toast.success('Shift ended and cash reconciled successfully!');
  };

  return (
    <div className="p-3.5 flex flex-col h-full space-y-3 overflow-y-auto scrollbar-thin">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#0B7A5A] font-extrabold uppercase tracking-widest block">ACTIVE SHIFT AUDIT</span>
          <h2 className="font-extrabold text-base text-[#0F172A]">{activeShift.conductorName} ({activeShift.conductorId})</h2>
          <span className="text-xs text-[#475569]">Bus #{activeShift.busNumber} • Route {activeShift.routeNumber}</span>
        </div>
        <button
          onClick={exportCSV}
          className="p-2 py-1.5 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#0B7A5A] border border-[#E2E8F0] flex items-center gap-1.5 text-xs font-bold transition-all"
        >
          <Download className="w-4 h-4 text-[#0B7A5A]" /> CSV
        </button>
      </div>

      {/* Group 1: Revenue & Financials */}
      <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl space-y-3 shadow-xs">
        <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider block border-b border-[#E2E8F0] pb-1.5">
          1. Financial Collections
        </span>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#F5F7FA] p-2.5 rounded-xl border border-[#E2E8F0]">
            <span className="text-[10px] text-[#475569] font-bold block uppercase">Gross Revenue</span>
            <span className="text-xl font-mono-numbers font-black text-[#0F172A]">₹{activeShift.totalRevenue}</span>
          </div>

          <div className="bg-[#E3F4EE] p-2.5 rounded-xl border border-[#0B7A5A]/30">
            <span className="text-[10px] text-[#0B7A5A] font-bold block uppercase">Cash Revenue</span>
            <span className="text-lg font-mono-numbers font-black text-[#0B7A5A]">₹{activeShift.cashRevenue}</span>
          </div>

          <div className="bg-[#E8EFFE] p-2.5 rounded-xl border border-[#1D4ED8]/30">
            <span className="text-[10px] text-[#1D4ED8] font-bold block uppercase">Digital UPI</span>
            <span className="text-lg font-mono-numbers font-black text-[#1D4ED8]">₹{activeShift.digitalRevenue}</span>
          </div>
        </div>

        {/* Cash vs Digital Split Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] font-bold text-[#475569]">
            <span>Cash ({cashPct}%)</span>
            <span>Digital ({digitalPct}%)</span>
          </div>
          <div className="w-full h-3 bg-[#E8EFFE] rounded-full overflow-hidden flex border border-[#E2E8F0]">
            <div className="bg-[#0B7A5A] h-full transition-all" style={{ width: `${cashPct}%` }}></div>
            <div className="bg-[#1D4ED8] h-full transition-all" style={{ width: `${digitalPct}%` }}></div>
          </div>
        </div>
      </div>

      {/* Group 2: Passenger & Ticket Volume */}
      <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl space-y-2.5 shadow-xs">
        <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider block border-b border-[#E2E8F0] pb-1.5">
          2. Passenger & Ticket Volume
        </span>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-[#F5F7FA] p-3 rounded-xl border border-[#E2E8F0]">
            <span className="text-[10px] text-[#475569] font-bold block uppercase">Passengers Served</span>
            <span className="text-2xl font-mono-numbers font-black text-[#0F172A]">{activeShift.totalPassengers}</span>
          </div>

          <div className="bg-[#F5F7FA] p-3 rounded-xl border border-[#E2E8F0]">
            <span className="text-[10px] text-[#475569] font-bold block uppercase">Valid Tickets Issued</span>
            <span className="text-2xl font-mono-numbers font-black text-[#0F172A]">{activeShift.totalTickets}</span>
          </div>
        </div>
      </div>

      {/* Operational Audit Details */}
      <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl space-y-2 shadow-xs text-xs">
        <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
          <span className="text-[#475569]">Voided Tickets Count</span>
          <span className="font-bold text-[#C62828]">{activeShift.voidedTicketsCount}</span>
        </div>
        <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
          <span className="text-[#475569]">Pending Offline Sync</span>
          <span className="font-bold text-[#F59E0B]">{activeShift.pendingSyncCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#475569]">Shift Started</span>
          <span className="font-mono-numbers font-bold text-[#0F172A]">
            {new Date(activeShift.startTime).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* 2-Step End Shift Action */}
      <button
        onClick={() => setReconciliationModalOpen(true)}
        className="w-full py-3.5 rounded-2xl bg-[#FDECEC] hover:bg-red-100 border border-[#C62828]/40 text-[#C62828] font-extrabold text-xs flex items-center justify-center gap-2 transition-all mt-auto"
      >
        <Power className="w-4 h-4 text-[#C62828]" /> END SHIFT & RECONCILE CASH
      </button>

      {/* End Shift Cash Reconciliation Modal */}
      {reconciliationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white text-[#0F172A] max-w-sm w-full p-5 rounded-3xl border border-[#E2E8F0] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#C62828] border-b border-[#E2E8F0] pb-2">
              <Calculator className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-[#0F172A]">Cash Reconciliation</h3>
            </div>

            <div className="bg-[#F5F7FA] p-3 rounded-2xl border border-[#E2E8F0] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#475569]">Expected Cash Revenue:</span>
                <strong className="font-mono-numbers text-sm text-[#0B7A5A]">₹{expectedCash}</strong>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#475569]">Enter Physical Cash Counted (₹):</label>
              <input
                type="number"
                value={countedCashInput}
                onChange={(e) => setCountedCashInput(e.target.value)}
                placeholder={`e.g. ${expectedCash}`}
                className="w-full bg-[#F5F7FA] text-[#0F172A] font-mono-numbers font-extrabold text-lg p-3 rounded-xl border border-[#E2E8F0] focus:ring-1 focus:ring-[#0B7A5A]"
              />
            </div>

            {countedCashInput && (
              <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between font-bold ${
                cashDiff === 0
                  ? 'bg-[#E3F4EE] border-[#0B7A5A]/40 text-[#0B7A5A]'
                  : 'bg-[#FEF3C7] border-[#F59E0B]/40 text-[#92400E]'
              }`}>
                <span>{cashDiff === 0 ? 'Cash Matches Exactly!' : cashDiff > 0 ? 'Excess Cash' : 'Shortage'}</span>
                <span className="font-mono-numbers text-sm">{cashDiff >= 0 ? `+₹${cashDiff}` : `-₹${Math.abs(cashDiff)}`}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleConfirmEndShift}
                className="bg-[#C62828] hover:bg-red-700 text-white text-xs font-extrabold py-3 rounded-xl shadow-md"
              >
                Confirm & End Shift
              </button>
              <button
                onClick={() => setReconciliationModalOpen(false)}
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
