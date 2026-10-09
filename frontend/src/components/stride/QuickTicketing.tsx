import React, { useState } from 'react';
import { useStride } from '../../contexts/StrideContext';
import { DestinationSelector } from './DestinationSelector';
import { ChangeCalculator } from './ChangeCalculator';
import { TicketReceiptModal } from './TicketReceiptModal';
import { calculateFare } from '../../domain/fareCalculator';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Banknote, QrCode, CreditCard, Sparkles, AlertCircle, Coins, ChevronRight, Zap, CheckCircle2, XCircle, RefreshCw, Info, Minus, Plus, RotateCcw, Ticket as TicketIcon } from 'lucide-react';
import { FareCategory } from '../../domain/types';
import { toast } from 'sonner';

export const QuickTicketing: React.FC = () => {
  const {
    activeRoute,
    currentStop,
    selectedDestination,
    setSelectedDestination,
    passengerCount,
    setPassengerCount,
    fareCategory,
    setFareCategory,
    paymentMode,
    setPaymentMode,
    issueTicket,
    repeatLastTicket,
    confirmDigitalPayment,
    failDigitalPayment,
    lastIssuedTicket,
    clearLastIssuedTicket,
    voidTicket,
    reprintTicket,
    settings,
    usabilityEngine,
    activeShift,
    t
  } = useStride();

  const [showChangeCalc, setShowChangeCalc] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [digitalPaymentModalOpen, setDigitalPaymentModalOpen] = useState(false);
  const [pendingDigitalTicketId, setPendingDigitalTicketId] = useState<string | null>(null);

  // Fare Calculation
  const fare = selectedDestination
    ? calculateFare(activeRoute, currentStop, selectedDestination, passengerCount, fareCategory)
    : null;

  const handleDestinationChange = (stop: any) => {
    setSelectedDestination(stop);
    usabilityEngine.recordDestinationTap();
  };

  const handleIssueTicketPressed = () => {
    if (!selectedDestination || !fare) {
      toast.error('Please select a valid destination stop');
      usabilityEngine.recordMisTap();
      return;
    }

    if (isIssuing) return;
    setIsIssuing(true);

    try {
      if (paymentMode === 'upi_qr' || paymentMode === 'smart_card') {
        const ticket = issueTicket({ paymentStatus: 'pending' });
        if (ticket) {
          setPendingDigitalTicketId(ticket.id);
          setDigitalPaymentModalOpen(true);
          toast.info('Waiting for simulated digital payment confirmation...');
        }
      } else {
        const ticket = issueTicket({ paymentStatus: 'completed' });
        if (ticket) {
          toast.success(`Ticket Issued! #${ticket.id} (${ticket.passengerCount} Pax - ₹${ticket.totalFare})`, {
            action: {
              label: 'Undo (10s)',
              onClick: () => voidTicket(ticket.id, 'Undo ticket issuance')
            },
            duration: 8000
          });
          usabilityEngine.stopAndLog('Nielsen 3-Passenger Challenge', passengerCount, settings.handedness, settings.displayMode);
        }
      }
    } catch (err) {
      toast.error('Failed to issue ticket');
    } finally {
      setTimeout(() => setIsIssuing(false), 400);
    }
  };

  const handleRepeatLast = () => {
    const ticket = repeatLastTicket();
    if (ticket) {
      toast.success(`Reissued Last Journey! #${ticket.id} (₹${ticket.totalFare})`, {
        action: {
          label: 'Undo',
          onClick: () => voidTicket(ticket.id, 'Undo reissued ticket')
        }
      });
    } else {
      toast.error('No previous valid ticket available to repeat');
    }
  };

  const handleConfirmDigitalPayment = () => {
    if (pendingDigitalTicketId) {
      confirmDigitalPayment(pendingDigitalTicketId);
      setDigitalPaymentModalOpen(false);
      setPendingDigitalTicketId(null);
      toast.success('Digital Payment Verified & Ticket Confirmed!');
    }
  };

  const handleFailDigitalPayment = () => {
    if (pendingDigitalTicketId) {
      failDigitalPayment(pendingDigitalTicketId);
      setDigitalPaymentModalOpen(false);
      setPendingDigitalTicketId(null);
      toast.error('Digital Payment Failed / Cancelled!');
    }
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-3 pb-2 select-none overflow-y-auto scrollbar-thin pr-1">
      
      {/* Compact 1-Line Header Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-2.5 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B7A5A]"></span>
          <span className="font-extrabold text-[#0F172A] text-xs">Route {activeRoute.routeNumber}</span>
          <span className="text-[11px] text-[#475569] truncate max-w-[140px] font-medium">• {activeShift?.direction || 'UP'} Bound</span>
        </div>
        <button
          onClick={handleRepeatLast}
          className="text-[10px] bg-[#E3F4EE] hover:bg-[#0B7A5A] text-[#0B7A5A] hover:text-white font-extrabold px-2 py-1 rounded-xl border border-[#0B7A5A]/30 flex items-center gap-1 transition-all"
        >
          <RotateCcw className="w-3 h-3" /> Repeat Last
        </button>
      </div>

      {/* Step 1: Destination Selector */}
      <DestinationSelector
        route={activeRoute}
        currentStop={currentStop}
        selectedDestination={selectedDestination}
        onSelectDestination={handleDestinationChange}
        onMisTap={() => usabilityEngine.recordMisTap()}
      />

      {/* Step 2: Passenger Stepper + Presets */}
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#475569] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#0B7A5A]" /> {t('passengers')}
          </span>
          {/* Passenger Stepper (- count +) */}
          <div className="flex items-center gap-2 bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl px-2 py-1">
            <button
              onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
              className="p-1 rounded-lg hover:bg-[#E2E8F0] text-[#0F172A] font-bold"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono-numbers font-black text-sm text-[#0F172A] w-5 text-center">
              {passengerCount}
            </span>
            <button
              onClick={() => setPassengerCount(Math.min(10, passengerCount + 1))}
              className="p-1 rounded-lg hover:bg-[#E2E8F0] text-[#0F172A] font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((cnt) => {
            const isSelected = passengerCount === cnt;
            return (
              <button
                key={cnt}
                onClick={() => setPassengerCount(cnt)}
                className={`py-2 rounded-xl font-extrabold text-xs transition-all border ${
                  isSelected
                    ? 'bg-[#0B7A5A] text-white border-[#0B7A5A] ring-2 ring-[#0B7A5A]/20 font-bold shadow-xs'
                    : 'bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#0F172A] border-[#E2E8F0]'
                }`}
              >
                {cnt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Fare Category Selector */}
      <div className="bg-white border border-[#E2E8F0] p-2.5 rounded-2xl space-y-1.5 shadow-xs">
        <span className="text-[10px] text-[#475569] font-bold uppercase tracking-wider block">
          {t('fareCategory')}
        </span>
        <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
          {[
            { id: 'adult', label: 'Adult' },
            { id: 'child', label: 'Child (50%)' },
            { id: 'women_free', label: 'Shakti Free' }
          ].map((cat) => {
            const isSelected = fareCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFareCategory(cat.id as FareCategory)}
                className={`py-1.5 px-2 rounded-xl text-center border transition-all ${
                  isSelected
                    ? 'bg-[#0B7A5A] text-white border-[#0B7A5A] font-extrabold'
                    : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 4: Strict Payment Color Coding (Cash: Green, UPI: Blue, Pass: Indigo) */}
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#475569] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-[#0B7A5A]" /> {t('paymentMode')}
          </span>
          {paymentMode === 'cash' && fare && (
            <button
              onClick={() => setShowChangeCalc(!showChangeCalc)}
              className="text-[10px] text-[#92400E] font-bold bg-[#FEF3C7] px-2 py-0.5 rounded-lg border border-[#F59E0B]/30 flex items-center gap-1"
            >
              <Coins className="w-3 h-3 text-[#F59E0B]" /> Cash Change Helper
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* CASH: Green */}
          <button
            onClick={() => setPaymentMode('cash')}
            className={`p-2.5 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 border transition-all ${
              paymentMode === 'cash'
                ? 'bg-[#0B7A5A] text-white border-[#0B7A5A] ring-2 ring-[#0B7A5A]/20 shadow-md'
                : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>CASH</span>
          </button>

          {/* UPI: Blue */}
          <button
            onClick={() => setPaymentMode('upi_qr')}
            className={`p-2.5 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 border transition-all ${
              paymentMode === 'upi_qr'
                ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] ring-2 ring-[#1D4ED8]/20 shadow-md'
                : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          {/* PASS: Indigo */}
          <button
            onClick={() => setPaymentMode('pass')}
            className={`p-2.5 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 border transition-all ${
              paymentMode === 'pass'
                ? 'bg-[#4338CA] text-white border-[#4338CA] ring-2 ring-[#4338CA]/20 shadow-md'
                : 'bg-[#F5F7FA] text-[#0F172A] border-[#E2E8F0]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>PASS / CARD</span>
          </button>
        </div>

        {/* Embedded Cash Change Helper */}
        {showChangeCalc && fare && paymentMode === 'cash' && (
          <ChangeCalculator totalFare={fare.totalFare} onClose={() => setShowChangeCalc(false)} />
        )}
      </div>

      {/* Step 5: Sticky Summary Bar & Massive Issue Action Button */}
      <div className="pt-1 space-y-2">
        {fare && (
          <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between text-xs font-semibold text-[#0F172A]">
            <span className="truncate">
              {currentStop.name} ➔ {selectedDestination?.name}
            </span>
            <span className="font-mono-numbers font-black text-sm text-[#0F172A] shrink-0 ml-2">
              {passengerCount} × ₹{fare.unitFare} = ₹{fare.totalFare}
            </span>
          </div>
        )}

        <button
          onClick={handleIssueTicketPressed}
          disabled={!selectedDestination || isIssuing}
          className={`w-full py-4 px-5 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 ${
            selectedDestination && !isIssuing
              ? 'bg-[#0B7A5A] hover:bg-[#09664b] text-white ring-4 ring-[#0B7A5A]/20'
              : 'bg-[#E2E8F0] text-[#475569] cursor-not-allowed border border-[#E2E8F0]'
          }`}
        >
          <TicketIcon className="w-5 h-5 fill-white" />
          <span>
            {isIssuing
              ? 'ISSUING TICKET...'
              : fare
              ? `ISSUE ${passengerCount} TICKETS · ₹${fare.totalFare}`
              : 'SELECT DESTINATION STOP'}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Simulated UPI Digital Payment Modal */}
      {digitalPaymentModalOpen && fare && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white text-[#0F172A] max-w-sm w-full p-5 rounded-3xl border border-[#E2E8F0] shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[#1D4ED8]">
              <QrCode className="w-6 h-6 animate-pulse" />
              <h3 className="font-extrabold text-base text-[#0F172A]">Simulated UPI Payment</h3>
            </div>
            
            <p className="text-xs text-[#475569]">
              Ask passenger to scan UPI QR Code for <strong className="text-[#1D4ED8] font-black text-sm">₹{fare.totalFare}</strong>
            </p>

            <div className="bg-[#E8EFFE] p-3 rounded-2xl inline-block border border-[#1D4ED8]/30">
              <QRCodeSVG value={`upi://pay?pa=bmtc@upi&pn=BMTC&am=${fare.totalFare}&cu=INR`} size={130} />
            </div>

            <div className="bg-[#F5F7FA] p-2.5 rounded-xl border border-[#E2E8F0] text-[11px] text-[#1D4ED8] font-bold flex items-center justify-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1D4ED8]" />
              Waiting for bank confirmation...
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleConfirmDigitalPayment}
                className="bg-[#0B7A5A] hover:bg-[#09664b] text-white text-xs font-black py-3 rounded-xl shadow-md flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Payment
              </button>
              <button
                onClick={handleFailDigitalPayment}
                className="bg-[#FDECEC] text-[#C62828] hover:bg-red-100 border border-[#C62828]/30 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Fail / Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Confirmation Modal */}
      <TicketReceiptModal
        ticket={lastIssuedTicket}
        isOpen={!!lastIssuedTicket && !digitalPaymentModalOpen}
        onClose={clearLastIssuedTicket}
        onVoid={voidTicket}
        onReprint={reprintTicket}
        simulatePrinterError={settings.simulatePrinterError}
      />
    </div>
  );
};
