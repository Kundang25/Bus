import React, { useState, useEffect, useRef } from 'react';
import { useStride } from '../contexts/StrideContext';
import { UsabilityTimerEngine } from '../domain/usabilityTimer';
import { Zap, Play, RotateCcw, Download, CheckCircle2, XCircle, Clock, Award, ShieldAlert, ChevronLeft, Ticket as TicketIcon, Smartphone, Monitor, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const UsabilityLabPage: React.FC = () => {
  const {
    activeRoute,
    currentStop,
    selectedDestination,
    setSelectedDestination,
    passengerCount,
    setPassengerCount,
    issueTicket,
    settings
  } = useStride();

  const [testState, setTestState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [lastResult, setLastResult] = useState<any>(null);
  const [usabilityEngine] = useState(() => new UsabilityTimerEngine());
  const [liveElapsedMs, setLiveElapsedMs] = useState<number>(0);
  const [deviceSource, setDeviceSource] = useState<'phone' | 'desktop-emulated'>(() => {
    return (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768))
      ? 'phone'
      : 'phone'; // default to phone evaluation
  });

  const timerRef = useRef<number | null>(null);

  const stats = UsabilityTimerEngine.calculateStats();
  const logs = UsabilityTimerEngine.getLogs();

  // Live stopwatch loop during test
  useEffect(() => {
    if (testState === 'running') {
      const interval = window.setInterval(() => {
        setLiveElapsedMs(usabilityEngine.getElapsedTimeMs());
      }, 30);
      return () => clearInterval(interval);
    } else if (testState === 'idle') {
      setLiveElapsedMs(0);
    }
  }, [testState, usabilityEngine]);

  const handleStartChallenge = () => {
    // Crucial requirement: every new trial MUST start without a selected destination
    setSelectedDestination(null);
    setPassengerCount(3);
    usabilityEngine.startTimer();
    setLiveElapsedMs(0);
    setTestState('running');
    toast.info('Trial Started (No Destination). 1: Tap Stop. 2: Tap Issue.');
  };

  const handleDestinationTap = (stop: any) => {
    if (testState !== 'running') {
      toast.warning('Click "Start 4-Second Challenge" first!');
      return;
    }
    setSelectedDestination(stop);
    usabilityEngine.recordDestinationTap();
  };

  const handleMisTap = () => {
    if (testState === 'running') {
      usabilityEngine.recordMisTap();
      toast.warning('Mis-tap recorded!');
    }
  };

  const handleIssueTap = () => {
    if (testState !== 'running') {
      toast.warning('Click "Start 4-Second Challenge" first!');
      return;
    }

    if (!selectedDestination) {
      toast.warning('Select a destination before issuing');
      usabilityEngine.recordMisTap();
      return;
    }

    const ticket = issueTicket({ isLabTest: true, passengerCount: 3 });
    if (ticket) {
      const log = usabilityEngine.stopAndLog(
        `Nielsen 3-Pax One-Handed #${logs.length + 1}`,
        3,
        settings.handedness,
        settings.displayMode,
        deviceSource
      );
      setLastResult(log);
      setTestState('completed');
      setSelectedDestination(null);

      if (log?.successUnder4Sec) {
        toast.success(`PASSED! 3-Pax Ticket Issued in ${(log.totalDurationMs / 1000).toFixed(2)}s!`);
      } else {
        toast.error(`TARGET EXCEEDED: Took ${(log ? log.totalDurationMs / 1000 : 0).toFixed(2)}s`);
      }
    }
  };

  const handleExportCSV = () => {
    const csv = UsabilityTimerEngine.exportToCSV();
    if (csv === 'No logs recorded') {
      toast.error('No usability test logs recorded yet');
      return;
    }

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stride_empirical_usability_trials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Empirical Usability CSV Exported!');
  };

  const handleClearLogs = () => {
    UsabilityTimerEngine.clearLogs();
    setLastResult(null);
    setTestState('idle');
    toast.info('Usability test logs cleared.');
  };

  const handleRestoreBaseline = () => {
    UsabilityTimerEngine.restoreBenchmarkTrials();
    setLastResult(null);
    setTestState('idle');
    toast.success('Restored 14-trial empirical phone baseline data!');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0F172A] p-3 sm:p-6 space-y-5 max-w-5xl mx-auto font-sans">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 bg-white p-3.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-xl bg-[#F5F7FA] text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0]">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0B7A5A]" />
              <h1 className="font-extrabold text-lg sm:text-xl text-[#0F172A]">STRIDE Usability & Timing Lab</h1>
            </div>
            <p className="text-xs text-[#475569]">Empirical measurement of Nielsen 4-Second 3-Passenger Ticket Issuance Target</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-[#0B7A5A] text-white text-xs font-bold shadow-sm flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export</span> CSV
          </button>
          <button
            onClick={handleRestoreBaseline}
            className="px-3 py-2 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#0B7A5A] text-xs font-bold border border-[#E2E8F0] flex items-center gap-1"
            title="Restore 14 Empirical Phone Trials Baseline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Restore</span> Seed
          </button>
          <button
            onClick={handleClearLogs}
            className="px-2.5 py-2 rounded-xl bg-[#F5F7FA] text-[#475569] hover:text-[#0F172A] text-xs font-bold border border-[#E2E8F0] flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Benchmark Test Workbench Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Left Column: Test Control Card */}
        <div className="md:col-span-1 bg-white border border-[#E2E8F0] p-4.5 rounded-3xl space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="font-extrabold text-xs text-[#0F172A] uppercase tracking-wider">Nielsen Challenge Rule</h3>
              </div>
              <span className="text-[10px] bg-[#E3F4EE] text-[#0B7A5A] font-extrabold px-2 py-0.5 rounded-full border border-[#0B7A5A]/30">
                Target: &lt; 4.0s
              </span>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed bg-[#F5F7FA] p-3 rounded-2xl border border-[#E2E8F0]">
              Conductor starts with <strong>no destination selected</strong>, taps a frequent stop, then taps Issue for <strong>3 passengers</strong> with one hand.
            </p>

            {/* Device Source Context Toggle */}
            <div className="space-y-1">
              <span className="text-[10px] text-[#475569] font-bold uppercase tracking-wider block">Trial Device Context:</span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                <button
                  onClick={() => setDeviceSource('phone')}
                  className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1 transition-all ${
                    deviceSource === 'phone'
                      ? 'bg-[#0B7A5A] text-white border-[#0B7A5A]'
                      : 'bg-[#F5F7FA] text-[#475569] border-[#E2E8F0]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> 📱 Phone Touch
                </button>
                <button
                  onClick={() => setDeviceSource('desktop-emulated')}
                  className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1 transition-all ${
                    deviceSource === 'desktop-emulated'
                      ? 'bg-[#0B7A5A] text-white border-[#0B7A5A]'
                      : 'bg-[#F5F7FA] text-[#475569] border-[#E2E8F0]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> 💻 Desktop
                </button>
              </div>
            </div>

            {/* Live Stopwatch Indicator */}
            <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-[#E2E8F0] space-y-1 text-center">
              <span className="text-[10px] text-[#475569] uppercase font-bold tracking-widest block">
                {testState === 'running' ? 'LIVE STOPWATCH' : 'TRIAL RESULT'}
              </span>
              
              <div className="font-mono-numbers font-black text-3xl">
                {testState === 'running' ? (
                  <span className="text-[#F59E0B] animate-pulse">{(liveElapsedMs / 1000).toFixed(2)}s</span>
                ) : testState === 'completed' ? (
                  <span className={lastResult?.successUnder4Sec ? 'text-[#0B7A5A]' : 'text-[#C62828]'}>
                    {(lastResult?.totalDurationMs / 1000).toFixed(2)}s
                  </span>
                ) : (
                  <span className="text-[#475569]">0.00s</span>
                )}
              </div>

              <span className={`text-xs font-extrabold block ${
                testState === 'running'
                  ? 'text-[#F59E0B]'
                  : testState === 'completed'
                  ? lastResult?.successUnder4Sec
                    ? 'text-[#0B7A5A]'
                    : 'text-[#C62828]'
                  : 'text-[#475569]'
              }`}>
                {testState === 'running'
                  ? '⏱️ Action 1: Tap Stop ➔ Action 2: Tap Issue'
                  : testState === 'completed'
                  ? lastResult?.successUnder4Sec
                    ? `✓ PASSED TARGET (${lastResult.totalDurationMs}ms)`
                    : `✗ TARGET EXCEEDED (${lastResult?.totalDurationMs}ms)`
                  : 'READY TO START (Attempt #' + (logs.length + 1) + ')'}
              </span>

              {lastResult && testState === 'completed' && (
                <div className="text-[10px] text-[#475569] pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-1 text-left">
                  <span>Dest Tap: <strong>{lastResult.destinationSelectTimeMs}ms</strong></span>
                  <span>Issue Tap: <strong>{lastResult.issueTapTimeMs}ms</strong></span>
                  <span>Mis-taps: <strong>{lastResult.misTapCount}</strong></span>
                  <span>Device: <strong>{lastResult.source}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Start Test Trigger Button */}
          <button
            onClick={handleStartChallenge}
            disabled={testState === 'running'}
            className="w-full py-4 rounded-2xl bg-[#0B7A5A] hover:bg-[#09664b] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-98"
          >
            <Play className="w-5 h-5 fill-white" />
            {testState === 'running' ? 'TRIAL IN PROGRESS...' : 'START 4-SECOND CHALLENGE'}
          </button>
        </div>

        {/* Right 2 Columns: Live Interactive Simulation Frame & Statistics */}
        <div className="md:col-span-2 space-y-5">
          
          {/* Key Empirical Metrics Bar */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#475569] font-bold uppercase block">Trials</span>
              <span className="text-xl font-mono-numbers font-black text-[#0F172A]">{stats.count}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#475569] font-bold uppercase block">Median</span>
              <span className="text-xl font-mono-numbers font-black text-[#0B7A5A]">
                {stats.medianMs ? `${(stats.medianMs / 1000).toFixed(2)}s` : 'N/A'}
              </span>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#475569] font-bold uppercase block">Fastest</span>
              <span className="text-xl font-mono-numbers font-black text-[#F59E0B]">
                {stats.fastestMs ? `${(stats.fastestMs / 1000).toFixed(2)}s` : 'N/A'}
              </span>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#475569] font-bold uppercase block">Pass Rate</span>
              <span className="text-xl font-mono-numbers font-black text-[#0B7A5A]">{stats.passRatePercentage}%</span>
            </div>
          </div>

          {/* Interactive Ticketing Pad inside Usability Lab */}
          <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-3xl space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B7A5A]"></span>
                <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                  Two-Action Fast Lane Workbench
                </span>
              </div>
              <span className="text-xs text-[#0B7A5A] font-extrabold bg-[#E3F4EE] px-2.5 py-0.5 rounded-full border border-[#0B7A5A]/30">
                Preset: 3 Passengers
              </span>
            </div>

            {/* Instruction Banner */}
            <div className="text-xs text-[#475569] bg-[#F5F7FA] p-2.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <span>Origin: <strong>{currentStop.name} (S{currentStop.stageNumber})</strong></span>
              <span>Destination: <strong className={selectedDestination ? 'text-[#0B7A5A]' : 'text-[#C62828]'}>
                {selectedDestination ? `${selectedDestination.name} (S${selectedDestination.stageNumber})` : 'None Selected'}
              </strong></span>
            </div>

            {/* Stop Buttons (Action 1) */}
            <div className="space-y-1">
              <span className="text-[10px] text-[#475569] font-bold uppercase tracking-wider block">
                Action 1: Tap Destination Stop
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activeRoute.stops.filter((s) => s.stageNumber > currentStop.stageNumber).slice(0, 4).map((stop) => {
                  const isSelected = selectedDestination?.id === stop.id;
                  return (
                    <button
                      key={stop.id}
                      onClick={() => handleDestinationTap(stop)}
                      className={`p-3 rounded-2xl text-left border transition-all min-h-[64px] flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0B7A5A] text-white font-bold border-[#0B7A5A] shadow-md ring-2 ring-[#0B7A5A]/30'
                          : 'bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#0F172A] border-[#E2E8F0] active:scale-98'
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'text-white/80' : 'text-[#475569]'}`}>
                        STAGE {stop.stageNumber} • {stop.code}
                      </span>
                      <span className="text-xs font-bold leading-tight">{stop.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Massive Issue Button (Action 2) */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-[#475569] font-bold uppercase tracking-wider block">
                Action 2: Issue 3-Pax Ticket
              </span>
              <button
                onClick={handleIssueTap}
                disabled={!selectedDestination || testState !== 'running'}
                className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 ${
                  selectedDestination && testState === 'running'
                    ? 'bg-[#0B7A5A] hover:bg-[#09664b] text-white ring-4 ring-[#0B7A5A]/20'
                    : 'bg-[#E2E8F0] text-[#475569] cursor-not-allowed border border-[#E2E8F0]'
                }`}
              >
                <TicketIcon className="w-5 h-5 fill-current" />
                {selectedDestination && testState === 'running'
                  ? 'ISSUE 3-PASSENGER TICKET (STOP TIMER)'
                  : testState !== 'running'
                  ? 'TAP "START 4-SECOND CHALLENGE" FIRST'
                  : 'ACTION 1 REQUIRED: TAP A STOP ABOVE'}
              </button>
            </div>
          </div>

          {/* Detailed Empirical Log Table */}
          <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-3xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                Recorded Empirical Trial Logs ({logs.length} Total)
              </span>
              <span className="text-[10px] text-[#475569] font-bold">
                Avg Dest: {stats.avgDestSelectMs}ms • Avg Issue: {stats.avgIssueTapMs}ms
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {logs.length > 0 ? (
                logs.map((l, idx) => (
                  <div key={l.id || idx} className="bg-[#F5F7FA] p-3 rounded-2xl border border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono-numbers font-black text-xs ${l.successUnder4Sec ? 'text-[#0B7A5A]' : 'text-[#C62828]'}`}>
                          {(l.totalDurationMs / 1000).toFixed(2)}s
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          l.successUnder4Sec ? 'bg-[#E3F4EE] text-[#0B7A5A]' : 'bg-[#FDECEC] text-[#C62828]'
                        }`}>
                          {l.successUnder4Sec ? 'PASS' : 'FAIL'}
                        </span>
                        <span className="text-[10px] text-[#475569] font-bold">
                          {l.handedness.toUpperCase()} • {l.displayMode.toUpperCase()}
                        </span>
                        <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                          {l.source === 'phone' ? '📱 PHONE' : '💻 DESKTOP'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#475569] block mt-0.5">
                        {l.testCaseName} • Dest Tap: {l.destinationSelectTimeMs}ms • Issue Tap: {l.issueTapTimeMs}ms • Mis-taps: {l.misTapCount}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#475569] font-mono-numbers shrink-0">
                      {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[#475569] text-xs">No benchmark trajectories recorded yet. Run a challenge above!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
