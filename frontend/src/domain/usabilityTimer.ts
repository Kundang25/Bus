import { UsabilityLog, Handedness, DisplayMode } from './types';

const LAB_LOGS_KEY = 'stride_usability_logs_v1';

export class UsabilityTimerEngine {
  private startTimeMs: number = 0;
  private destSelectedTimeMs: number = 0;
  private issueTappedTimeMs: number = 0;
  private misTapCount: number = 0;
  private isTimerRunning: boolean = false;

  public startTimer() {
    this.startTimeMs = performance.now();
    this.destSelectedTimeMs = 0;
    this.issueTappedTimeMs = 0;
    this.misTapCount = 0;
    this.isTimerRunning = true;
  }

  public recordDestinationTap() {
    if (!this.isTimerRunning) return;
    this.destSelectedTimeMs = performance.now() - this.startTimeMs;
  }

  public recordMisTap() {
    if (this.isTimerRunning) {
      this.misTapCount += 1;
    }
  }

  public stopAndLog(
    testCaseName: string,
    passengerCount: number,
    handedness: Handedness,
    displayMode: DisplayMode
  ): UsabilityLog | null {
    if (!this.isTimerRunning || this.startTimeMs === 0) return null;

    const totalDurationMs = performance.now() - this.startTimeMs;
    this.issueTappedTimeMs = totalDurationMs;
    this.isTimerRunning = false;

    const successUnder4Sec = totalDurationMs <= 4000;

    const log: UsabilityLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      testCaseName,
      destinationSelectTimeMs: Math.round(this.destSelectedTimeMs),
      issueTapTimeMs: Math.round(this.issueTappedTimeMs),
      totalDurationMs: Math.round(totalDurationMs),
      passengerCount,
      successUnder4Sec,
      misTapCount: this.misTapCount,
      handedness,
      displayMode
    };

    this.saveLog(log);
    return log;
  }

  private saveLog(log: UsabilityLog) {
    const existing = UsabilityTimerEngine.getLogs();
    existing.unshift(log);
    try {
      localStorage.setItem(LAB_LOGS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to save usability log:', e);
    }
  }

  public static getLogs(): UsabilityLog[] {
    try {
      const data = localStorage.getItem(LAB_LOGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static clearLogs() {
    localStorage.removeItem(LAB_LOGS_KEY);
  }

  public static exportToCSV(): string {
    const logs = this.getLogs();
    if (logs.length === 0) {
      return 'No logs recorded';
    }
    const headers = [
      'ID',
      'Timestamp',
      'TestCase',
      'DestSelectTime(ms)',
      'IssueTapTime(ms)',
      'TotalDuration(ms)',
      'Passengers',
      'Under4Sec',
      'MisTaps',
      'Handedness',
      'DisplayMode'
    ];

    const rows = logs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.testCaseName}"`,
      l.destinationSelectTimeMs,
      l.issueTapTimeMs,
      l.totalDurationMs,
      l.passengerCount,
      l.successUnder4Sec ? 'PASS' : 'FAIL',
      l.misTapCount,
      l.handedness,
      l.displayMode
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public static calculateStats() {
    const logs = this.getLogs();
    if (logs.length === 0) {
      return {
        count: 0,
        medianMs: 0,
        meanMs: 0,
        fastestMs: 0,
        slowestMs: 0,
        passRatePercentage: 0,
        totalMisTaps: 0
      };
    }

    const times = logs.map((l) => l.totalDurationMs).sort((a, b) => a - b);
    const sum = times.reduce((acc, t) => acc + t, 0);
    const meanMs = Math.round(sum / times.length);
    
    const mid = Math.floor(times.length / 2);
    const medianMs = times.length % 2 !== 0 ? times[mid] : Math.round((times[mid - 1] + times[mid]) / 2);
    
    const fastestMs = times[0];
    const slowestMs = times[times.length - 1];
    
    const passCount = logs.filter((l) => l.successUnder4Sec).length;
    const passRatePercentage = Math.round((passCount / logs.length) * 100);
    const totalMisTaps = logs.reduce((acc, l) => acc + l.misTapCount, 0);

    return {
      count: logs.length,
      medianMs,
      meanMs,
      fastestMs,
      slowestMs,
      passRatePercentage,
      totalMisTaps
    };
  }
}
