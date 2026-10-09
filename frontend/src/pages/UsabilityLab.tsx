import React, { useState } from 'react';
import { useStride } from '../contexts/StrideContext';
import { UsabilityTimerEngine } from '../domain/usabilityTimer';
import { Zap, Play, RotateCcw, Download, CheckCircle2, XCircle, Clock, Award, ShieldAlert, ChevronLeft, Ticket as TicketIcon } from 'lucide-react';
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

  const stats = UsabilityTimerEngine.calculateStats();
  const logs = UsabilityTimerEngine.getLogs();

  const handleStartChallenge = () => {
    setSelectedDestination(null);
    setPassengerCount(3);
    usabilityEngine.startTimer();
    setTestState('running');
    toast.info('Timer started with no destination. Tap a destination, then Issue.');
  };

  const handleDestinationTap = (stop: any) => {
    setSelectedDestination(stop);
    usabilityEngine.recordDestinationTap();
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
      const log = usabilityEngine.stopAndLog('Nielsen 3-Passenger Challenge', 3, settings.handedness, settings.displayMode);
      setLastResult(log);
      setTestState('completed');
      setSelectedDestination(null);

      if (log?.successUnder4Sec) {
        toast.success(`PASSED! Issued 3-Pax Ticket in ${(log.totalDurationMs / 1000).toFixed(2)}s!`);
      } else {
        toast.error(`EXCEEDED 4.0s TARGET! Took ${(log ? log.totalDurationMs / 1000 : 0).toFixed(2)}s`);
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
    link.setAttribute('download', `stride_usability_lab_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Usability Lab CSV Exported!');
  };

  const handleClearLogs = () => {
    UsabilityTimerEngine.clearLogs();
    setLastResult(null);
    setTestState('idle');
    toast.info('Usability test logs reset.');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0F172A] p-4 sm:p-6 space-y-6 max-w-5xl mx-auto font-sans">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 bg-white p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-xl bg-[#F5F7FA] text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0]">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0B7A5A]" />
              <h1 className="font-extrabold text-xl text-[#0F172A]">STRIDE Usability & Timing Lab</h1>
            </div>
            <p className="text-xs text-[#475569]">Empirical measurement of Nielsen 4-Second 3-Passenger Ticket Issuance Target</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#0B7A5A] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handleClearLogs}
            className="px-3 py-2 rounded-xl bg-[#F5F7FA] text-[#475569] hover:text-[#0F172A] text-xs font-bold border border-[#E2E8F0] flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Main Benchmark Test Workbench Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Test Control Card */}
        <div className="md:col-span-1 bg-white border border-[#E2E8F0] p-5 rounded-3xl space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="font-extrabold text-sm text-[#0F172A] uppercase tracking-wider">Nielsen Challenge Rule</h3>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed bg-[#F5F7FA] p-3 rounded-2xl border border-[#E2E8F0]">
              The conductor must select a destination stop and issue a ticket for <strong>3 passengers</strong> in under <strong>4.0 seconds</strong> using one hand.
            </p>

            {/* Test Status Indicator */}
            <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-[#E2E8F0] space-y-2 text-center">
              <span className="text-[10px] text-[#475569] uppercase font-bold tracking-widest block">TEST STATUS</span>
              <span className={`text-xl font-black block ${
                testState === 'running'
                  ? 'text-[#F59E0B] animate-pulse'
                  : testState === 'completed'
                  ? lastResult?.successUnder4Sec
                    ? 'text-[#0B7A5A]'
                    : 'text-[#C62828]'
                  : 'text-[#475569]'
              }`}>
                {testState === 'running'
                  ? '⏱️ TIMER RUNNING...'
                  : testState === 'completed'
                  ? lastResult?.successUnder4Sec
                    ? '✓ PASSED (<4.0s)'
                    : '✗ FAILED (>4.0s)'
                  : 'READY TO START'}
              </span>
            </div>
          </div>

          {/* Start Test Trigger Button */}
          <button
            onClick={handleStartChallenge}
            disabled={testState === 'running'}
            className="w-full py-4 rounded-2xl bg-[#0B7A5A] hover:bg-[#09664b] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-white" />
            START 4-SECOND CHALLENGE
          </button>
        </div>

        {/* Right 2 Columns: Live Interactive Simulation Frame & Statistics */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Key Empirical Metrics Bar */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#475569] font-bold uppercase block">Tests Run</span>
              <span className="text-xl font-mono-numbers font-black text-[#0F172A]">{stats.count}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#475569] font-bold uppercase block">Median Time</span>
              <span className="text-xl font-mono-numbers font-black text-[#0B7A5A]">{stats.medianMs ? `${(stats.medianMs / 1000).toFixed(2)}s` : 'N/A'}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#475569] font-bold uppercase block">Fastest</span>
              <span className="text-xl font-mono-numbers font-black text-[#F59E0B]">{stats.fastestMs ? `${(stats.fastestMs / 1000).toFixed(2)}s` : 'N/A'}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#475569] font-bold uppercase block">Pass Rate</span>
              <span className="text-xl font-mono-numbers font-black text-[#0B7A5A]">{stats.passRatePercentage}%</span>
            </div>
          </div>

          {/* Interactive Ticketing Pad inside Usability Lab */}
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Fast Ticketing Action Workbench</span>
              <span className="text-xs text-[#0B7A5A] font-bold bg-[#E3F4EE] px-2.5 py-0.5 rounded-full border border-[#0B7A5A]/30">
                Preset: 3 Passengers
              </span>
            </div>

            {/* Stop Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {activeRoute.stops.filter((s) => s.stageNumber > currentStop.stageNumber).slice(0, 4).map((stop) => {
                const isSelected = selectedDestination?.id === stop.id;
                return (
                  <button
                    key={stop.id}
                    onClick={() => handleDestinationTap(stop)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#0B7A5A] text-white font-bold border-[#0B7A5A] shadow-md'
                        : 'bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#0F172A] border-[#E2E8F0]'
                    }`}
                  >
                    <span className={`text-[10px] uppercase block ${isSelected ? 'text-white/80' : 'text-[#475569]'}`}>STAGE {stop.stageNumber}</span>
                    <span className="text-xs font-bold">{stop.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Massive Issue Button */}
            <button
              onClick={handleIssueTap}
              disabled={!selectedDestination || testState !== 'running'}
              className={`w-full py-4 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 transition-all ${
                selectedDestination && testState === 'running'
                  ? 'bg-[#0B7A5A] hover:bg-[#09664b] text-white'
                  : 'bg-[#E2E8F0] text-[#475569] cursor-not-allowed'
              }`}
            >
              <TicketIcon className="w-5 h-5 fill-white" />
              {selectedDestination ? 'ISSUE 3-PASSENGER TICKET (STOP TIMER)' : 'SELECT A DESTINATION FIRST'}
            </button>
          </div>

          {/* Detailed Empirical Log Table */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-3xl space-y-3 shadow-xs">
            <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider block">Recorded Benchmark Trajectory Logs</span>
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {logs.length > 0 ? (
                logs.map((l) => (
                  <div key={l.id} className="bg-[#F5F7FA] p-3 rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono-numbers font-black text-xs ${l.successUnder4Sec ? 'text-[#0B7A5A]' : 'text-[#C62828]'}`}>
                          {(l.totalDurationMs / 1000).toFixed(2)}s
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          l.successUnder4Sec ? 'bg-[#E3F4EE] text-[#0B7A5A]' : 'bg-[#FDECEC] text-[#C62828]'
                        }`}>
                          {l.successUnder4Sec ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#475569] block mt-0.5">Dest tap: {l.destinationSelectTimeMs}ms • Issue tap: {l.issueTapTimeMs}ms</span>
                    </div>
                    <span className="text-[10px] text-[#475569] font-mono-numbers">{new Date(l.timestamp).toLocaleTimeString()}</span>
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
