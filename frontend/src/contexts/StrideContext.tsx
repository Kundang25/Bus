import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ConductorSettings, ConductorShift, Ticket, Route, BusStop, PaymentMode, PaymentStatus, FareCategory, Language } from '../domain/types';
import { SAMPLE_ROUTES, getRouteById } from '../domain/routesData';
import { calculateFare, assertForwardJourney } from '../domain/fareCalculator';
import { InvalidJourneyError, TicketingEngine, TicketingPersistError } from '../domain/ticketingEngine';
import { toast } from 'sonner';
import { UsabilityTimerEngine } from '../domain/usabilityTimer';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'STRIDE',
    ticketTab: 'Ticket',
    historyTab: 'History',
    shiftTab: 'Shift',
    settingsTab: 'Settings',
    issueTicketBtn: 'ISSUE TICKET',
    frequentDestinations: 'Frequent Destinations',
    passengers: 'Passengers',
    paymentMode: 'Payment Mode',
    totalPayable: 'Total Payable',
    cash: 'CASH',
    upi: 'UPI / DIGITAL',
    passCard: 'PASS / CARD',
    repeatLast: 'Repeat Last Ticket',
    startShift: 'START CONDUCTOR SHIFT',
    endShift: 'END CONDUCTOR SHIFT',
    boardStop: 'Boarding Stop',
    destStop: 'Destination Stop',
    fareCategory: 'Fare Category',
    adult: 'Adult',
    child: 'Child (50%)',
    senior: 'Senior (75%)',
    womenFree: 'Women Scheme (Free)',
    student: 'Student (50%)'
  },
  kn: {
    appTitle: 'ಸ್ಟ್ರೈಡ್ (STRIDE)',
    ticketTab: 'ಟಿಕೆಟ್ (Ticket)',
    historyTab: 'ಇತಿಹಾಸ (History)',
    shiftTab: 'ಶಿಫ್ಟ್ (Shift)',
    settingsTab: 'ಸೆಟ್ಟಿಂಗ್ಸ್ (Settings)',
    issueTicketBtn: 'ಟಿಕೆಟ್ ನೀಡಿ (ISSUE)',
    frequentDestinations: 'ಪ್ರಮುಖ ನಿಲ್ದಾಣಗಳು',
    passengers: 'ಪ್ರಯಾಣಿಕರು',
    paymentMode: 'ಪಾವತಿ ವಿಧಾನ',
    totalPayable: 'ಒಟ್ಟು ಮೊತ್ತ',
    cash: 'ನಗದು (CASH)',
    upi: 'ಯುಪಿಐ (UPI)',
    passCard: 'ಪಾಸ್ / ಕಾರ್ಡ್',
    repeatLast: 'ಕೊನೆಯ ಟಿಕೆಟ್ ಮರುಪಾವತಿ',
    startShift: 'ಶಿಫ್ಟ್ ಪ್ರಾರಂಭಿಸಿ',
    endShift: 'ಶಿಫ್ಟ್ ಮುಕ್ತಾಯ',
    boardStop: 'ಹತ್ತುವ ನಿಲ್ದಾಣ',
    destStop: 'ತಲುಪುವ ನಿಲ್ದಾಣ',
    fareCategory: 'ಟಿಕೆಟ್ ವರ್ಗ',
    adult: 'ಹಿರಿಯರು',
    child: 'ಮಕ್ಕಳು (50%)',
    senior: 'ಹಿರಿಯ ನಾಗರಿಕ (75%)',
    womenFree: 'ಶಕ್ತಿ ಯೋಜನೆ (ಉಚಿತ)',
    student: 'ವಿದ್ಯಾರ್ಥಿ (50%)'
  },
  hi: {
    appTitle: 'स्ट्राइड (STRIDE)',
    ticketTab: 'टिकट (Ticket)',
    historyTab: 'इतिहास (History)',
    shiftTab: 'शिफ्ट (Shift)',
    settingsTab: 'सेटिंग्स (Settings)',
    issueTicketBtn: 'टिकट जारी करें',
    frequentDestinations: 'प्रमुख गंतव्य',
    passengers: 'यात्री',
    paymentMode: 'भुगतान का प्रकार',
    totalPayable: 'कुल राशि',
    cash: 'नकद (CASH)',
    upi: 'यूपीआई (UPI)',
    passCard: 'पास / कार्ड',
    repeatLast: 'पिछला टिकट दोहराएं',
    startShift: 'शिफ्ट शुरू करें',
    endShift: 'शिफ्ट समाप्त करें',
    boardStop: 'बोर्डिंग स्टॉप',
    destStop: 'गंतव्य स्टॉप',
    fareCategory: 'टिकट श्रेणी',
    adult: 'वयस्क',
    child: 'बच्चा (50%)',
    senior: 'वरिष्ठ नागरिक (75%)',
    womenFree: 'महिला योजना (निःशुल्क)',
    student: 'छात्र (50%)'
  }
};

interface StrideContextType {
  settings: ConductorSettings;
  updateSettings: (newSettings: Partial<ConductorSettings>) => void;
  activeShift: ConductorShift | null;
  startShift: (params: {
    conductorId: string;
    conductorName: string;
    busNumber: string;
    routeId: string;
    direction: 'UP' | 'DOWN';
  }) => void;
  endShift: () => void;
  activeRoute: Route;
  currentStopIndex: number;
  currentStop: BusStop;
  setCurrentStopIndex: (index: number) => void;
  selectedDestination: BusStop | null;
  setSelectedDestination: (stop: BusStop | null) => void;
  passengerCount: number;
  setPassengerCount: (count: number) => void;
  fareCategory: FareCategory;
  setFareCategory: (cat: FareCategory) => void;
  paymentMode: PaymentMode;
  setPaymentMode: (mode: PaymentMode) => void;
  issueTicket: (options?: {
    isLabTest?: boolean;
    paymentStatus?: PaymentStatus;
    fromStop?: BusStop;
    toStop?: BusStop;
    passengerCount?: number;
    category?: FareCategory;
    paymentMode?: PaymentMode;
    idempotencyKey?: string;
  }) => Ticket | null;
  repeatLastTicket: () => Ticket | null;
  confirmDigitalPayment: (ticketId: string) => void;
  failDigitalPayment: (ticketId: string) => void;
  lastIssuedTicket: Ticket | null;
  clearLastIssuedTicket: () => void;
  allTickets: Ticket[];
  refreshTickets: () => void;
  voidTicket: (ticketId: string, reason: string) => void;
  reprintTicket: (ticketId: string) => void;
  resetAllDemoData: () => void;
  usabilityEngine: UsabilityTimerEngine;
  currentTab: 'ticket' | 'history' | 'dashboard' | 'settings';
  setCurrentTab: (tab: 'ticket' | 'history' | 'dashboard' | 'settings') => void;
  t: (key: string) => string;
}

const DEFAULT_SETTINGS: ConductorSettings = {
  handedness: 'right',
  displayMode: 'standard',
  language: 'en',
  hapticFeedback: true,
  soundFeedback: true,
  autoPrintReceipt: true,
  simulatePrinterError: false,
  simulateNetworkOffline: false,
  showThumbZonesOverlay: false
};

const StrideContext = createContext<StrideContextType | null>(null);

export const StrideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ConductorSettings>(() => {
    try {
      const saved = localStorage.getItem('stride_settings_v1');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [activeShiftBase, setActiveShiftBase] = useState<{
    shiftId: string;
    conductorId: string;
    conductorName: string;
    busNumber: string;
    routeId: string;
    routeName: string;
    routeNumber: string;
    direction: 'UP' | 'DOWN';
    startTime: string;
    endTime?: string;
    isActive: boolean;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('stride_active_shift_v1');
      return saved ? JSON.parse(saved) : {
        shiftId: 'SHIFT-DEMO-01',
        conductorId: 'C-8821',
        conductorName: 'Ramesh Kumar',
        busNumber: 'KA-01-F-4509',
        routeId: 'bmtc-500d',
        routeName: 'Silk Board ⇄ Hebbal (Outer Ring Road)',
        routeNumber: '500-D',
        direction: 'UP',
        startTime: new Date().toISOString(),
        isActive: true
      };
    } catch {
      return null;
    }
  });

  const [allTickets, setAllTickets] = useState<Ticket[]>(() => TicketingEngine.getAllTickets());

  const activeRoute = useMemo(() => {
    return activeShiftBase ? getRouteById(activeShiftBase.routeId) : SAMPLE_ROUTES[0];
  }, [activeShiftBase]);

  const [currentStopIndex, setCurrentStopIndex] = useState<number>(0);
  const [selectedDestination, setSelectedDestination] = useState<BusStop | null>(null);
  const [passengerCount, setPassengerCount] = useState<number>(3);
  const [fareCategory, setFareCategory] = useState<FareCategory>('adult');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [lastIssuedTicket, setLastIssuedTicket] = useState<Ticket | null>(null);
  const [currentTab, setCurrentTab] = useState<'ticket' | 'history' | 'dashboard' | 'settings'>('ticket');
  const [usabilityEngine] = useState(() => new UsabilityTimerEngine());

  // Language translation helper
  const t = (key: string): string => {
    const lang = settings.language || 'en';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  // Derive Shift Metrics strictly from non-lab operational tickets
  const activeShift = useMemo<ConductorShift | null>(() => {
    if (!activeShiftBase) return null;

    const shiftTickets = allTickets.filter(
      (t) => t.shiftId === activeShiftBase.shiftId && !t.isLabTest
    );

    const validCompletedTickets = shiftTickets.filter(
      (t) => t.status !== 'voided' && t.paymentStatus === 'completed'
    );

    const totalTickets = validCompletedTickets.length;
    const totalPassengers = validCompletedTickets.reduce((acc, t) => acc + t.passengerCount, 0);
    const totalRevenue = validCompletedTickets.reduce((acc, t) => acc + t.totalFare, 0);
    const cashRevenue = validCompletedTickets
      .filter((t) => t.paymentMode === 'cash')
      .reduce((acc, t) => acc + t.totalFare, 0);
    const digitalRevenue = validCompletedTickets
      .filter((t) => t.paymentMode !== 'cash')
      .reduce((acc, t) => acc + t.totalFare, 0);
    const voidedTicketsCount = shiftTickets.filter((t) => t.status === 'voided').length;
    const pendingSyncCount = shiftTickets.filter((t) => !t.synced).length;

    const currentStopId = activeRoute.stops[currentStopIndex]?.id || activeRoute.stops[0].id;

    return {
      ...activeShiftBase,
      currentStopId,
      totalTickets,
      totalPassengers,
      totalRevenue,
      cashRevenue,
      digitalRevenue,
      pendingSyncCount,
      voidedTicketsCount
    };
  }, [activeShiftBase, allTickets, activeRoute, currentStopIndex]);

  useEffect(() => {
    try {
      localStorage.setItem('stride_settings_v1', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  useEffect(() => {
    if (activeShiftBase) {
      try {
        localStorage.setItem('stride_active_shift_v1', JSON.stringify(activeShiftBase));
      } catch (e) {
        console.warn('Failed to save active shift:', e);
      }
    } else {
      localStorage.removeItem('stride_active_shift_v1');
    }
  }, [activeShiftBase]);

  const updateSettings = (newSettings: Partial<ConductorSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const refreshTickets = () => {
    setAllTickets(TicketingEngine.getAllTickets());
  };

  const startShift = (params: {
    conductorId: string;
    conductorName: string;
    busNumber: string;
    routeId: string;
    direction: 'UP' | 'DOWN';
  }) => {
    const route = getRouteById(params.routeId);
    const newShiftBase = {
      shiftId: `SHIFT-${Date.now()}`,
      conductorId: params.conductorId,
      conductorName: params.conductorName,
      busNumber: params.busNumber,
      routeId: params.routeId,
      routeName: route.routeName,
      routeNumber: route.routeNumber,
      direction: params.direction,
      startTime: new Date().toISOString(),
      isActive: true
    };

    setActiveShiftBase(newShiftBase);
    setCurrentStopIndex(0);
    setSelectedDestination(null);
  };

  const endShift = () => {
    if (activeShiftBase) {
      setActiveShiftBase({ ...activeShiftBase, isActive: false, endTime: new Date().toISOString() });
    }
  };

  const issueTicket = (options?: {
    isLabTest?: boolean;
    paymentStatus?: PaymentStatus;
    fromStop?: BusStop;
    toStop?: BusStop;
    passengerCount?: number;
    category?: FareCategory;
    paymentMode?: PaymentMode;
    idempotencyKey?: string;
  }): Ticket | null => {
    if (!activeShift) return null;
    const currentStop = options?.fromStop || activeRoute.stops[currentStopIndex];
    const dest = options?.toStop || selectedDestination;
    if (!dest) return null;

    const pax = options?.passengerCount ?? passengerCount;
    const category = options?.category || fareCategory;
    const mode = options?.paymentMode || paymentMode;

    const journey = assertForwardJourney(currentStop, dest);
    if (!journey.ok) {
      toast.error(journey.reason);
      return null;
    }

    const fare = calculateFare(activeRoute, currentStop, dest, pax, category);

    try {
      const ticket = TicketingEngine.issueTicket({
        shiftId: activeShift.shiftId,
        busNumber: activeShift.busNumber,
        routeNumber: activeShift.routeNumber,
        conductorId: activeShift.conductorId,
        fromStop: currentStop,
        toStop: dest,
        passengerCount: fare.passengerCount,
        category,
        unitFare: fare.unitFare,
        totalFare: fare.totalFare,
        paymentMode: mode,
        paymentStatus: options?.paymentStatus || (mode === 'cash' || mode === 'pass' ? 'completed' : 'pending'),
        idempotencyKey: options?.idempotencyKey,
        isOffline: settings.simulateNetworkOffline,
        isLabTest: options?.isLabTest || false
      });

      setLastIssuedTicket(ticket);
      refreshTickets();

      if (settings.hapticFeedback && navigator.vibrate) {
        navigator.vibrate([40, 30, 40]);
      }

      return ticket;
    } catch (err) {
      if (err instanceof InvalidJourneyError) {
        toast.error(err.message);
      } else if (err instanceof TicketingPersistError) {
        toast.error('Ticket was not saved. Nothing issued.');
      } else {
        toast.error('Failed to issue ticket');
      }
      return null;
    }
  };

  const repeatLastTicket = (): Ticket | null => {
    const validTickets = allTickets.filter((t) => !t.isLabTest && t.status === 'valid');
    if (validTickets.length === 0) return null;

    const last = validTickets[0];
    setSelectedDestination(last.toStop);
    setPassengerCount(last.passengerCount);
    setFareCategory(last.category || 'adult');
    setPaymentMode(last.paymentMode);

    return issueTicket({
      fromStop: last.fromStop,
      toStop: last.toStop,
      passengerCount: last.passengerCount,
      category: last.category || 'adult',
      paymentMode: last.paymentMode
    });
  };

  const confirmDigitalPayment = (ticketId: string) => {
    TicketingEngine.updatePaymentStatus(ticketId, 'completed');
    refreshTickets();
  };

  const failDigitalPayment = (ticketId: string) => {
    TicketingEngine.updatePaymentStatus(ticketId, 'failed');
    refreshTickets();
  };

  const voidTicket = (ticketId: string, reason: string) => {
    TicketingEngine.voidTicket(ticketId, reason);
    refreshTickets();
  };

  const reprintTicket = (ticketId: string) => {
    TicketingEngine.reprintTicket(ticketId);
    refreshTickets();
  };

  const resetAllDemoData = () => {
    TicketingEngine.clearAllTickets();
    UsabilityTimerEngine.clearLogs();
    setLastIssuedTicket(null);
    refreshTickets();
  };

  const currentStop = activeRoute.stops[currentStopIndex] || activeRoute.stops[0];

  return (
    <StrideContext.Provider
      value={{
        settings,
        updateSettings,
        activeShift,
        startShift,
        endShift,
        activeRoute,
        currentStopIndex,
        currentStop,
        setCurrentStopIndex,
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
        clearLastIssuedTicket: () => {
          setLastIssuedTicket(null);
          setSelectedDestination(null);
        },
        allTickets,
        refreshTickets,
        voidTicket,
        reprintTicket,
        resetAllDemoData: () => {
          resetAllDemoData();
          setSelectedDestination(null);
        },
        usabilityEngine,
        currentTab,
        setCurrentTab,
        t
      }}
    >
      {children}
    </StrideContext.Provider>
  );
};

export const useStride = () => {
  const context = useContext(StrideContext);
  if (!context) {
    throw new Error('useStride must be used within a StrideProvider');
  }
  return context;
};
