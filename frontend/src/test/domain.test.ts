import { describe, it, expect, beforeEach } from 'vitest';
import { SAMPLE_ROUTES } from '../domain/routesData';
import { calculateFare, calculateCashChange } from '../domain/fareCalculator';
import { TicketingEngine } from '../domain/ticketingEngine';
import { UsabilityTimerEngine } from '../domain/usabilityTimer';

describe('STRIDE Complete Ticketing Domain Integration Tests', () => {
  const route = SAMPLE_ROUTES[0]; // BMTC 500-D
  const stop1 = route.stops[0]; // Silk Board (Stage 1)
  const stop4 = route.stops[3]; // Iblur Junction (Stage 4)
  const stop5 = route.stops[4]; // Bellandur EcoSpace (Stage 5)

  beforeEach(() => {
    TicketingEngine.clearAllTickets();
    UsabilityTimerEngine.clearLogs();
  });

  it('calculates fare dynamically when destination or passenger count changes', () => {
    // 3 Passengers from Silk Board to Iblur Junction (3 stages) -> Unit fare ₹10 -> Total ₹30
    const fare3Pax = calculateFare(route, stop1, stop4, 3);
    expect(fare3Pax.stagesTraveled).toBe(3);
    expect(fare3Pax.passengerCount).toBe(3);
    expect(fare3Pax.unitFare).toBe(10);
    expect(fare3Pax.totalFare).toBe(30);

    // Changing passenger count to 1 passenger updates total fare to ₹10
    const fare1Pax = calculateFare(route, stop1, stop4, 1);
    expect(fare1Pax.passengerCount).toBe(1);
    expect(fare1Pax.totalFare).toBe(10);
  });

  it('calculates cash change accurately with shortage validation', () => {
    const change = calculateCashChange(30, 100);
    expect(change.isValid).toBe(true);
    expect(change.changeDue).toBe(70);

    const shortage = calculateCashChange(30, 20);
    expect(shortage.isValid).toBe(false);
    expect(shortage.shortage).toBe(10);
  });

  it('issues cash ticket idempotently and prevents rapid double-tap duplicates', () => {
    const key = 'IK-DOUBLE-TAP-TEST';
    const ticket1 = TicketingEngine.issueTicket({
      shiftId: 'SHIFT-001',
      busNumber: 'KA-01-F-1234',
      routeNumber: '500-D',
      conductorId: 'COND-8821',
      fromStop: stop1,
      toStop: stop4,
      passengerCount: 3,
      unitFare: 10,
      totalFare: 30,
      paymentMode: 'cash',
      idempotencyKey: key
    });

    expect(ticket1.id).toContain('TKT-');
    expect(ticket1.passengerCount).toBe(3);
    expect(ticket1.totalFare).toBe(30);

    // Rapid second tap with same key returns existing ticket without duplicating
    const ticket2 = TicketingEngine.issueTicket({
      shiftId: 'SHIFT-001',
      busNumber: 'KA-01-F-1234',
      routeNumber: '500-D',
      conductorId: 'COND-8821',
      fromStop: stop1,
      toStop: stop4,
      passengerCount: 3,
      unitFare: 10,
      totalFare: 30,
      paymentMode: 'cash',
      idempotencyKey: key
    });

    expect(ticket2.id).toBe(ticket1.id);
    expect(TicketingEngine.getAllTickets().length).toBe(1);
  });

  it('handles digital payment pending state and confirms payment status', () => {
    // Digital payment starts as pending
    const ticket = TicketingEngine.issueTicket({
      shiftId: 'SHIFT-001',
      busNumber: 'KA-01-F-1234',
      routeNumber: '500-D',
      conductorId: 'COND-8821',
      fromStop: stop1,
      toStop: stop4,
      passengerCount: 3,
      unitFare: 10,
      totalFare: 30,
      paymentMode: 'upi_qr',
      paymentStatus: 'pending'
    });

    expect(ticket.paymentStatus).toBe('pending');

    // Confirming payment updates paymentStatus to completed
    const confirmed = TicketingEngine.updatePaymentStatus(ticket.id, 'completed');
    expect(confirmed?.paymentStatus).toBe('completed');
  });

  it('isolates Usability Lab test tickets (isLabTest) from operational history', () => {
    // Operational Ticket
    const opTicket = TicketingEngine.issueTicket({
      shiftId: 'SHIFT-001',
      busNumber: 'KA-01-F-1234',
      routeNumber: '500-D',
      conductorId: 'COND-8821',
      fromStop: stop1,
      toStop: stop4,
      passengerCount: 3,
      unitFare: 10,
      totalFare: 30,
      paymentMode: 'cash',
      isLabTest: false
    });

    // Usability Lab Test Ticket
    const labTicket = TicketingEngine.issueTicket({
      shiftId: 'SHIFT-001',
      busNumber: 'KA-01-F-1234',
      routeNumber: '500-D',
      conductorId: 'COND-8821',
      fromStop: stop1,
      toStop: stop5,
      passengerCount: 3,
      unitFare: 10,
      totalFare: 30,
      paymentMode: 'cash',
      isLabTest: true
    });

    const all = TicketingEngine.getAllTickets();
    expect(all.length).toBe(2);

    const operationalOnly = all.filter((t) => !t.isLabTest);
    expect(operationalOnly.length).toBe(1);
    expect(operationalOnly[0].id).toBe(opTicket.id);
  });

  it('supports voiding tickets with audit reason and reprinting', () => {
    const ticket = TicketingEngine.issueTicket({
      shiftId: 'SHIFT-001',
      busNumber: 'KA-01-F-1234',
      routeNumber: '500-D',
      conductorId: 'COND-8821',
      fromStop: stop1,
      toStop: stop4,
      passengerCount: 3,
      unitFare: 10,
      totalFare: 30,
      paymentMode: 'cash'
    });

    const voided = TicketingEngine.voidTicket(ticket.id, 'Wrong destination selected');
    expect(voided?.status).toBe('voided');
    expect(voided?.voidReason).toBe('Wrong destination selected');

    const reprinted = TicketingEngine.reprintTicket(ticket.id);
    expect(reprinted?.printCount).toBe(2);
  });

  it('records usability timer logs and calculates pass statistics', () => {
    const timer = new UsabilityTimerEngine();
    timer.startTimer();
    timer.recordDestinationTap();
    
    const log = timer.stopAndLog('Nielsen 3-Passenger Challenge', 3, 'right', 'standard');
    expect(log).not.toBeNull();
    expect(log?.passengerCount).toBe(3);
    
    const stats = UsabilityTimerEngine.calculateStats();
    expect(stats.count).toBe(1);
    expect(stats.passRatePercentage).toBeGreaterThanOrEqual(0);
  });
});
