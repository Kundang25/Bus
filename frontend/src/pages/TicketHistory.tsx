import React, { useState } from 'react';
import { useStride } from '../contexts/StrideContext';
import { Ticket } from '../domain/types';
import { TicketReceiptModal } from '../components/stride/TicketReceiptModal';
import { Ticket as TicketIcon, Search, Filter, AlertOctagon, Printer, CheckCircle, Clock, FlaskConical, Banknote, QrCode, CreditCard } from 'lucide-react';

export const TicketHistory: React.FC = () => {
  const { allTickets, voidTicket, reprintTicket, settings } = useStride();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'voided'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cash' | 'upi_qr' | 'pass'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = allTickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.toStop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.fromStop.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : statusFilter === 'valid' ? t.status === 'valid' : t.status === 'voided';

    const matchesPayment =
      paymentFilter === 'all' ? true : t.paymentMode === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="p-3 flex flex-col h-full space-y-2.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TicketIcon className="w-5 h-5 text-[#0B7A5A]" />
          <h2 className="font-extrabold text-base text-[#0F172A]">Ticket Audit History</h2>
        </div>
        <span className="bg-[#E2E8F0] text-[#0F172A] text-xs px-2.5 py-1 rounded-full font-bold">
          {allTickets.length} Records
        </span>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-1.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#475569]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket ID or stop..."
            className="w-full bg-white text-[#0F172A] placeholder-[#475569] text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] focus:ring-1 focus:ring-[#0B7A5A]"
          />
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
          {[
            { id: 'all', label: 'All Modes' },
            { id: 'cash', label: 'Cash' },
            { id: 'upi_qr', label: 'UPI' },
            { id: 'pass', label: 'Pass' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPaymentFilter(p.id as any)}
              className={`py-1 rounded-lg border text-center transition-all ${
                paymentFilter === p.id
                  ? 'bg-[#0B7A5A] text-white border-[#0B7A5A]'
                  : 'bg-white text-[#475569] border-[#E2E8F0]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Ticket Rows List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            const isVoided = ticket.status === 'voided';
            
            // Payment Mode Dot Color
            const paymentColorClass =
              ticket.paymentMode === 'cash'
                ? 'bg-[#0B7A5A]'
                : ticket.paymentMode === 'upi_qr'
                ? 'bg-[#1D4ED8]'
                : 'bg-[#4338CA]';

            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 shadow-xs ${
                  isVoided
                    ? 'bg-[#FDECEC] border-[#C62828]/30 text-[#0F172A]'
                    : 'bg-white hover:bg-[#F5F7FA] border-[#E2E8F0] text-[#0F172A]'
                }`}
              >
                {/* Row Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${paymentColorClass}`}></span>
                    <span className="font-mono-numbers font-black text-[#0F172A] truncate max-w-[160px]">{ticket.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {ticket.isLabTest && (
                      <span className="bg-[#F1E9FE] text-[#6D28D9] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-[#6D28D9]/30">
                        LAB
                      </span>
                    )}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isVoided
                        ? 'bg-[#FDECEC] text-[#C62828] border border-[#C62828]/30'
                        : 'bg-[#E3F4EE] text-[#0B7A5A] border border-[#0B7A5A]/30'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>

                {/* Journey & Fare Summary Row */}
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="truncate max-w-[220px]">
                    {ticket.fromStop.name} ➔ {ticket.toStop.name}
                  </span>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#475569] mr-1">{ticket.passengerCount} Pax</span>
                    <span className="font-mono-numbers font-black text-[#0F172A] text-sm">₹{ticket.totalFare}</span>
                  </div>
                </div>

                {/* Footer Timestamp */}
                <div className="flex items-center justify-between text-[10px] text-[#475569] pt-1 border-t border-[#E2E8F0]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#475569]" />
                    {new Date(ticket.issuedAt).toLocaleTimeString()}
                  </span>
                  <span className="uppercase font-extrabold text-[#0F172A]">
                    {ticket.paymentMode} ({ticket.paymentStatus})
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-[#475569] text-xs space-y-2 bg-white rounded-2xl border border-[#E2E8F0]">
            <TicketIcon className="w-8 h-8 text-[#475569] mx-auto" />
            <p>No ticket records found for this filter.</p>
          </div>
        )}
      </div>

      {/* Ticket Receipt Preview Modal */}
      <TicketReceiptModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onVoid={voidTicket}
        onReprint={reprintTicket}
        simulatePrinterError={settings.simulatePrinterError}
      />
    </div>
  );
};
