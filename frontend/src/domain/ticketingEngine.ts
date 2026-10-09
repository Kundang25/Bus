import { Ticket, TicketStatus, PaymentMode, PaymentStatus, FareCategory, BusStop } from './types';

const STORAGE_KEY = 'stride_issued_tickets_v1';
const IDEMPOTENCY_KEY_CACHE = new Set<string>();

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
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
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
    const key = params.idempotencyKey || `IK-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    // Check double-tap idempotency
    if (IDEMPOTENCY_KEY_CACHE.has(key)) {
      const existing = this.getStoredTickets().find((t) => t.idempotencyKey === key);
      if (existing) return existing;
    }
    IDEMPOTENCY_KEY_CACHE.add(key);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TKT-${dateStr}-${randomSeq}`;

    const qrPayload = JSON.stringify({
      tktId: ticketId,
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
      synced: !params.isOffline,
      isOffline: !!params.isOffline,
      printCount: 1,
      qrPayload,
      isLabTest: !!params.isLabTest
    };

    const tickets = this.getStoredTickets();
    tickets.unshift(newTicket);
    this.saveTickets(tickets);

    return newTicket;
  }

  public static getAllTickets(): Ticket[] {
    return this.getStoredTickets();
  }

  public static updatePaymentStatus(ticketId: string, status: PaymentStatus): Ticket | null {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;

    const ticket = tickets[index];
    ticket.paymentStatus = status;
    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  public static voidTicket(ticketId: string, reason: string): Ticket | null {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;

    const ticket = tickets[index];
    ticket.status = 'voided';
    ticket.voidReason = reason;
    ticket.voidedAt = new Date().toISOString();

    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  public static reprintTicket(ticketId: string): Ticket | null {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;

    const ticket = tickets[index];
    ticket.printCount = (ticket.printCount || 1) + 1;

    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  public static clearAllTickets() {
    localStorage.removeItem(STORAGE_KEY);
    IDEMPOTENCY_KEY_CACHE.clear();
  }
}
