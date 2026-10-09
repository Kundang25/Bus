import { Ticket, TicketStatus, PaymentMode, PaymentStatus, FareCategory, BusStop } from './types';
import { assertForwardJourney } from './fareCalculator';

const STORAGE_KEY = 'stride_issued_tickets_v1';

export class TicketingPersistError extends Error {
  constructor(message = 'Could not save ticket to browser storage') {
    super(message);
    this.name = 'TicketingPersistError';
  }
}

export class InvalidJourneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidJourneyError';
  }
}

export class TicketingEngine {
  private static getStoredTickets(): Ticket[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveTickets(tickets: Ticket[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      const roundTrip = localStorage.getItem(STORAGE_KEY);
      if (!roundTrip) {
        throw new TicketingPersistError();
      }
    } catch (e) {
      if (e instanceof TicketingPersistError) throw e;
      throw new TicketingPersistError();
    }
  }

  public static generateTicketId(existing: Ticket[] = this.getStoredTickets()): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const used = new Set(existing.map((t) => t.id));
    for (let i = 0; i < 8; i++) {
      const entropy =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
          : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
      const ticketId = `TKT-${dateStr}-${entropy.toUpperCase()}`;
      if (!used.has(ticketId)) return ticketId;
    }
    throw new TicketingPersistError('Could not allocate a unique ticket ID');
  }

  public static issueTicket(params: {
    shiftId: string;
    busNumber: string;
    routeNumber: string;
    conductorId: string;
    fromStop: BusStop;
    toStop: BusStop;
    passengerCount: number;
    category?: FareCategory;
    unitFare: number;
    totalFare: number;
    paymentMode: PaymentMode;
    paymentStatus?: PaymentStatus;
    idempotencyKey?: string;
    isOffline?: boolean;
    isLabTest?: boolean;
  }): Ticket {
    const journey = assertForwardJourney(params.fromStop, params.toStop);
    if (!journey.ok) {
      throw new InvalidJourneyError(journey.reason);
    }

    const tickets = this.getStoredTickets();
    const key = params.idempotencyKey || `IK-${crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`}`;

    const existingByKey = tickets.find((t) => t.idempotencyKey === key);
    if (existingByKey) {
      return existingByKey;
    }

    const now = new Date();
    const ticketId = this.generateTicketId(tickets);

    const qrPayload = JSON.stringify({
      tktId: ticketId,
      demo: true,
      prototype: true,
      bus: params.busNumber,
      route: params.routeNumber,
      from: params.fromStop.code,
      to: params.toStop.code,
      pax: params.passengerCount,
      cat: params.category || 'adult',
      amt: params.totalFare,
      time: now.toISOString(),
      lab: !!params.isLabTest
    });

    const newTicket: Ticket = {
      id: ticketId,
      idempotencyKey: key,
      shiftId: params.shiftId,
      busNumber: params.busNumber,
      routeNumber: params.routeNumber,
      conductorId: params.conductorId,
      fromStop: params.fromStop,
      toStop: params.toStop,
      passengerCount: params.passengerCount,
      category: params.category || 'adult',
      unitFare: params.unitFare,
      totalFare: params.totalFare,
      paymentMode: params.paymentMode,
      paymentStatus: params.paymentStatus || 'completed',
      status: 'valid',
      issuedAt: now.toISOString(),
      synced: false,
      isOffline: !!params.isOffline,
      printCount: 1,
      qrPayload,
      isLabTest: !!params.isLabTest
    };

    const next = [newTicket, ...tickets];
    this.saveTickets(next);
    return newTicket;
  }

  public static getAllTickets(): Ticket[] {
    return this.getStoredTickets();
  }

  public static updatePaymentStatus(ticketId: string, status: PaymentStatus): Ticket | null {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;

    const ticket = { ...tickets[index], paymentStatus: status };
    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  public static voidTicket(ticketId: string, reason: string): Ticket | null {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;

    const ticket: Ticket = {
      ...tickets[index],
      status: 'voided' as TicketStatus,
      voidReason: reason,
      voidedAt: new Date().toISOString()
    };

    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  public static reprintTicket(ticketId: string): Ticket | null {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;

    const ticket = { ...tickets[index], printCount: (tickets[index].printCount || 1) + 1 };
    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  public static clearAllTickets() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
