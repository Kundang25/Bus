import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, Hand, Zap, Sun, Award, BarChart3, WifiOff, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const StrideCaseStudyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0F172A] p-4 sm:p-8 max-w-4xl mx-auto space-y-8 leading-relaxed font-sans">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 bg-white p-4 rounded-2xl shadow-xs">
        <Link to="/" className="flex items-center gap-2 text-xs font-bold text-[#475569] hover:text-[#0F172A] transition-all">
          <ChevronLeft className="w-4 h-4" /> Back to App
        </Link>
        <span className="text-xs text-[#0B7A5A] font-extrabold bg-[#E3F4EE] px-3 py-1 rounded-full border border-[#0B7A5A]/30 uppercase tracking-wider">
          NIELSEN PRODUCT DESIGN CASE STUDY
        </span>
      </div>

      {/* Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#E3F4EE] text-[#0B7A5A] px-3 py-1 rounded-full text-xs font-extrabold border border-[#0B7A5A]/30">
          <Zap className="w-4 h-4" /> PRODUCT DESIGN CASE STUDY
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
          STRIDE — The Conductor's Digital Companion
        </h1>
        <p className="text-lg text-[#475569] font-medium leading-relaxed">
          Transforming traditional thermal-printer ticketing machines into an exceptional, high-contrast, one-handed mobile ticketing experience for bus conductors in unpredictable physical environments.
        </p>
      </div>

      {/* Section 1: Problem Statement & Physical Environment */}
      <section className="bg-white border border-[#E2E8F0] p-6 rounded-3xl space-y-4 shadow-xs">
        <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
          <Hand className="w-5 h-5 text-[#0B7A5A]" /> 1. Problem & Physical Context
        </h2>
        <p className="text-xs text-[#475569] leading-relaxed">
          Traditional transport ticketing hardware (used across BMTC and BEST) suffers from heavy weight, worn physical keypads, unreadable low-resolution screens, and slow transaction times. Conductor operational conditions include:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#475569]">
          <li className="bg-[#F5F7FA] p-3 rounded-2xl border border-[#E2E8F0] font-medium flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0B7A5A] mt-1.5 shrink-0"></span>
            <span><strong>One-Handed Limit:</strong> Conductor holds cash/change in one hand while operating phone with the other thumb.</span>
          </li>
          <li className="bg-[#F5F7FA] p-3 rounded-2xl border border-[#E2E8F0] font-medium flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0B7A5A] mt-1.5 shrink-0"></span>
            <span><strong>Vehicle Motion & Shock:</strong> Frequent sudden braking, sway, and road vibrations increase mis-taps.</span>
          </li>
          <li className="bg-[#F5F7FA] p-3 rounded-2xl border border-[#E2E8F0] font-medium flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0B7A5A] mt-1.5 shrink-0"></span>
            <span><strong>Sunlight & Glare:</strong> Open bus windows cause extreme glare requiring bold typography & contrast.</span>
          </li>
          <li className="bg-[#F5F7FA] p-3 rounded-2xl border border-[#E2E8F0] font-medium flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0B7A5A] mt-1.5 shrink-0"></span>
            <span><strong>Urgency & Crowd Density:</strong> Serving dozens of standing passengers per stop under high time pressure.</span>
          </li>
        </ul>
      </section>

      {/* Section 2: Thumb Reachability Strategy */}
      <section className="bg-white border border-[#E2E8F0] p-6 rounded-3xl space-y-4 shadow-xs">
        <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#0B7A5A]" /> 2. Thumb Reachability Ergonomics
        </h2>
        <p className="text-xs text-[#475569] leading-relaxed">
          STRIDE adheres strictly to physical ergonomics: 85% of primary interactions are placed inside the bottom <strong>Natural Thumb Zone (Green Area)</strong>. Top zones are reserved strictly for static route metadata.
        </p>

        <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
          <div className="bg-[#E3F4EE] border border-[#0B7A5A]/30 p-3 rounded-2xl text-[#0B7A5A]">
            <span className="text-[10px] block uppercase">Bottom Zone</span>
            <span className="text-base font-black block">Natural Thumb</span>
            <span className="text-[10px] font-normal">Primary Ticket Action & Presets</span>
          </div>
          <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 p-3 rounded-2xl text-[#92400E]">
            <span className="text-[10px] block uppercase">Middle Zone</span>
            <span className="text-base font-black block">Stretch Zone</span>
            <span className="text-[10px] font-normal">Destination Stop Pickers</span>
          </div>
          <div className="bg-[#FDECEC] border border-[#C62828]/30 p-3 rounded-2xl text-[#C62828]">
            <span className="text-[10px] block uppercase">Top Zone</span>
            <span className="text-base font-black block">Hard Reach</span>
            <span className="text-[10px] font-normal">Static Route Info & Headers</span>
          </div>
        </div>
      </section>

      {/* Section 3: The 4-Second Interaction Flow */}
      <section className="bg-white border border-[#E2E8F0] p-6 rounded-3xl space-y-4 shadow-xs">
        <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#0B7A5A]" /> 3. Nielsen &lt; 4-Second Flow Design
        </h2>
        <p className="text-xs text-[#475569] leading-relaxed">
          To achieve ticket issuance in under 4 seconds, STRIDE eliminates modals, multi-step wizards, and redundant confirmations:
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
          <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-[#E2E8F0] w-full text-center space-y-1">
            <span className="text-[10px] text-[#0B7A5A] uppercase block">Step 1 (Pre-configured)</span>
            <span className="text-sm font-extrabold text-[#0F172A]">Shift Active & 3 Pax Preselected</span>
          </div>
          <ArrowRight className="w-5 h-5 text-[#475569] shrink-0 hidden sm:block" />
          <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-[#E2E8F0] w-full text-center space-y-1">
            <span className="text-[10px] text-[#F59E0B] uppercase block">Step 2 (1 Tap)</span>
            <span className="text-sm font-extrabold text-[#0F172A]">Tap Frequent Destination</span>
          </div>
          <ArrowRight className="w-5 h-5 text-[#475569] shrink-0 hidden sm:block" />
          <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-[#E2E8F0] w-full text-center space-y-1">
            <span className="text-[10px] text-[#0B7A5A] uppercase block">Step 3 (1 Tap)</span>
            <span className="text-sm font-extrabold text-[#0F172A]">Tap ISSUE TICKET Button</span>
          </div>
        </div>
      </section>

      {/* Footer Link to Interactive App */}
      <div className="pt-4 text-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#0B7A5A] hover:bg-[#09664b] text-white font-black text-sm shadow-xl transition-all"
        >
          <Zap className="w-5 h-5 fill-white" /> LAUNCH INTERACTIVE STRIDE PROTOTYPE
        </Link>
      </div>
    </div>
  );
};
