import React, { useState } from 'react';
import { Ticket } from '../../domain/types';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, CheckCircle2, RotateCcw, AlertOctagon, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface TicketReceiptModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onVoid: (ticketId: string, reason: string) => void;
  onReprint: (ticketId: string) => void;
  simulatePrinterError?: boolean;
}

export const TicketReceiptModal: React.FC<TicketReceiptModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onVoid,
  onReprint,
  simulatePrinterError = false
}) => {
  const [voiding, setVoiding] = useState(false);
  const [voidReason, setVoidReason] = useState('');

  if (!isOpen || !ticket) return null;

  const handleReprint = () => {
    if (simulatePrinterError) {
      toast.error('Printer Offline / Paper Jam Simulated! Ticket stored safely in history.');
      return;
    }
    onReprint(ticket.id);
    toast.success(`Ticket ${ticket.id} reprinted (Print Count: ${ticket.printCount + 1})`);
  };

  const handleConfirmVoid = () => {
    if (!voidReason.trim()) {
      toast.error('Please enter a void reason');
      return;
    }
    onVoid(ticket.id, voidReason);
    setVoiding(false);
    toast.warning(`Ticket ${ticket.id} voided!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 max-w-sm w-full rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-sm text-emerald-400">TICKET ISSUED SUCCESSFULLY</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="bg-amber-50 text-slate-900 p-5 rounded-2xl shadow-inner border border-amber-200 font-mono text-xs relative overflow-hidden">
            
            {/* Reprint Watermark Banner */}
            {ticket.printCount > 1 && (
              <div className="absolute top-3 -right-8 rotate-45 bg-red-600 text-white font-bold text-[9px] px-8 py-0.5 shadow">
                DUPLICATE ({ticket.printCount})
              </div>
            )}

            {ticket.status === 'voided' && (
              <div className="bg-red-600 text-white font-bold text-center py-1 rounded text-[11px] mb-3 tracking-widest uppercase">
                *** VOIDED TICKET ***
              </div>
            )}

            {/* Transport Agency Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400 space-y-0.5">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-950">BMTC / BEST TRANSPORT</h3>
              <p className="text-[10px] text-slate-600">SHAKTI YATRA DIGITAL VERIFIED</p>
              <p className="text-[10px] text-slate-700 font-bold">BUS: {ticket.busNumber} | ROUTE: {ticket.routeNumber}</p>
            </div>

            {/* Journey Details */}
            <div className="py-3 space-y-2 border-b border-dashed border-slate-400">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600 uppercase">TICKET NO:</span>
                <span className="font-bold text-slate-950">{ticket.id}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600 uppercase">FROM:</span>
                <span className="font-bold text-slate-950">{ticket.fromStop.name}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600 uppercase">TO:</span>
                <span className="font-bold text-slate-950">{ticket.toStop.name}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600 uppercase">PASSENGERS:</span>
                <span className="font-extrabold text-slate-950 bg-amber-200 px-1.5 py-0.5 rounded">{ticket.passengerCount} ADULT(S)</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600 uppercase">PAYMENT MODE:</span>
                <span className="font-bold uppercase text-slate-900">{ticket.paymentMode}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600 uppercase">TIME:</span>
                <span className="text-[10px] text-slate-800">{new Date(ticket.issuedAt).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Fare Summary */}
            <div className="py-3 border-b border-dashed border-slate-400 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-600 uppercase block">Total Fare Paid</span>
                <span className="text-xs text-slate-700 font-semibold">({ticket.passengerCount} × ₹{ticket.unitFare})</span>
              </div>
              <span className="text-2xl font-black text-slate-950">₹{ticket.totalFare}</span>
            </div>

            {/* QR Code Validation */}
            <div className="pt-3 flex flex-col items-center justify-center space-y-2">
              <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-300">
                <QRCodeSVG value={ticket.qrPayload} size={110} level="M" />
              </div>
              <p className="text-[9px] text-slate-500 text-center uppercase tracking-tight">Scan QR for Gate Validation or Conductor Audit</p>
            </div>
          </div>

          {/* Void Dialog Input if Voiding */}
          {voiding ? (
            <div className="bg-red-950/80 border border-red-500/50 p-3 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-300 text-xs font-bold">
                <AlertOctagon className="w-4 h-4" /> Void Ticket Confirmation
              </div>
              <input
                type="text"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="Reason (e.g. Passenger cancelled / Wrong stop)"
                className="w-full bg-slate-900 text-white text-xs p-2.5 rounded-xl border border-red-500/40 focus:outline-hidden focus:ring-1 focus:ring-red-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmVoid}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-xl"
                >
                  Confirm Void
                </button>
                <button
                  onClick={() => setVoiding(false)}
                  className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleReprint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-2 border border-slate-700"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              Reprint Ticket
            </button>
            <button
              onClick={() => setVoiding(true)}
              disabled={ticket.status === 'voided'}
              className="bg-slate-900 hover:bg-red-950 text-red-400 text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-2 border border-slate-800 disabled:opacity-40"
            >
              <AlertOctagon className="w-4 h-4" />
              Void Ticket
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all scale-[1.01]"
          >
            <RotateCcw className="w-5 h-5" />
            NEXT TICKET (RESET FLOW)
          </button>
        </div>
      </div>
    </div>
  );
};
