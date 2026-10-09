export type Handedness = 'right' | 'left';
export type DisplayMode = 'standard' | 'sunlight';
export type PaymentMode = 'cash' | 'upi_qr' | 'smart_card' | 'pass';
export type PaymentStatus = 'completed' | 'pending' | 'failed';
export type TicketStatus = 'valid' | 'voided' | 'reprinted';
export type FareCategory = 'adult' | 'child' | 'senior' | 'women_free' | 'student';
export type Language = 'en' | 'kn' | 'hi';

export interface BusStop {
  id: string;
  name: string;
  code: string;
  stageNumber: number;
  isPopular?: boolean;
}

export interface Route {
  id: string;
  routeNumber: string;
  routeName: string;
  agency: 'BMTC' | 'BEST' | 'KSRTC';
  stops: BusStop[];
  baseFare: number; // e.g. ₹5
  farePerStage: number; // e.g. ₹5 per 2 stages
}

export interface ConductorShift {
  shiftId: string;
  conductorId: string;
  conductorName: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  routeNumber: string;
  direction: 'UP' | 'DOWN';
  currentStopId: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  totalTickets: number;
  totalPassengers: number;
  totalRevenue: number;
  cashRevenue: number;
  digitalRevenue: number;
  pendingSyncCount: number;
  voidedTicketsCount: number;
}

export interface Ticket {
  id: string; // TKT-20261009-8831
  idempotencyKey: string;
  shiftId: string;
  busNumber: string;
  routeNumber: string;
  conductorId: string;
  fromStop: BusStop;
  toStop: BusStop;
  passengerCount: number;
  category: FareCategory;
  unitFare: number;
  totalFare: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  status: TicketStatus;
  issuedAt: string;
  synced: boolean;
  isOffline: boolean;
  printCount: number;
  voidReason?: string;
  voidedAt?: string;
  qrPayload: string;
  isLabTest?: boolean;
}

export interface FareCalculation {
  fromStop: BusStop;
  toStop: BusStop;
  stagesTraveled: number;
  category: FareCategory;
  unitFare: number;
  passengerCount: number;
  subtotal: number;
  discount: number;
  totalFare: number;
}

export interface UsabilityLog {
  id: string;
  timestamp: string;
  testCaseName: string;
  destinationSelectTimeMs: number;
  issueTapTimeMs: number;
  totalDurationMs: number;
  passengerCount: number;
  successUnder4Sec: boolean;
  misTapCount: number;
  handedness: Handedness;
  displayMode: DisplayMode;
  source?: 'desktop-emulated' | 'phone';
}

export interface ConductorSettings {
  handedness: Handedness;
  displayMode: DisplayMode;
  language: Language;
  hapticFeedback: boolean;
  soundFeedback: boolean;
  autoPrintReceipt: boolean;
  simulatePrinterError: boolean;
  simulateNetworkOffline: boolean;
  showThumbZonesOverlay: boolean;
}
