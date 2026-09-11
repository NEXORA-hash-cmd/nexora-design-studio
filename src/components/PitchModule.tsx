import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Presentation, 
  DollarSign, 
  Target, 
  ShieldCheck, 
  Rocket 
} from 'lucide-react';
import { NexoraProject, PitchDeck } from '../types/project';
import { exportDocumentToPdf } from '../utils/exporter';

interface PitchModuleProps {
  project: NexoraProject;
  onChange: (updated: NexoraProject) => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const PitchModule: React.FC<PitchModuleProps> = ({
  project,
  onChange,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const pitch = project.pitch;
  const fin = project.financials;

  const updatePitch = (fields: Partial<PitchDeck>) => {
    onChange({
      ...project,
      pitch: { ...pitch, ...fields },
    });
  };

  const handleExportPdf = async () => {
    const res = await exportDocumentToPdf(project);
    if (res.success) {
      onShowToast('success', res.message);
    } else {
      onShowToast('error', res.message);
    }
  };

  const handleCopyText = () => {
    const fullText = `
NEXORA EXECUTIVE SUMMARY & PITCH MEMORANDUM
Project: ${project.name}
Industry: ${project.industry} | Stage: ${project.stage}
Positioning: ${project.tagline}

1. THE PROBLEM
${pitch.problemSummary}

2. THE SOLUTION & VALUE PROPOSITION
${pitch.solutionSummary}

3. MARKET TIMING & OPPORTUNITY
${pitch.marketTiming}
- TAM: $${project.market.tamValue}M | SAM: $${project.market.samValue}M | SOM: $${project.market.somValue}M

4. BUSINESS MODEL & MONETIZATION
${pitch.businessModelSummary}
- Unit Price: ${fin.currencySymbol}${fin.pricingPerUnit}/unit | Direct COGS: ${fin.currencySymbol}${fin.cogsPerUnit}
- Target Gross Margin: ${(( (fin.pricingPerUnit - fin.cogsPerUnit) / (fin.pricingPerUnit || 1) ) * 100).toFixed(0)}%

5. COMPETITIVE MOAT & DIFFERENTIATOR
${pitch.competitiveMoat}

6. FINANCIAL TRACTION & 12-MONTH MILESTONES
${pitch.financialMilestone12mo}

7. CAPITAL ALLOCATION & THE ASK
Ask: ${fin.currencySymbol}${pitch.capitalAsk.toLocaleString()}
Fund Allocation: ${pitch.fundAllocation}
`.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    onShowToast('success', 'Executive Summary copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="module-pitch" className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Presentation className="w-5 h-5 text-purple-400" />
            <span>Pitch Deck & Executive Summary</span>
          </h2>
          <p className="text-xs text-slate-400">
            A structured commercial narrative ready for investor memos, grant proposals, and advisory boards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-copy-pitch-text"
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            id="btn-export-pitch-pdf"
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export to PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Narrative Document */}
      <div 
        id="printable-pitch-document"
        className="bg-[#111726] border border-white/[0.08] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200 text-xs leading-relaxed"
      >
        {/* Document Header */}
        <div className="border-b border-white/[0.08] pb-4">
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-semibold">
            Confidential Executive Briefing
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">{project.name}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{project.tagline}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-400">
            <span>Industry: <strong className="text-slate-200">{project.industry}</strong></span>
            <span>Stage: <strong className="text-slate-200">{project.stage}</strong></span>
            <span>Date: <strong className="text-slate-200">{new Date().toLocaleDateString()}</strong></span>
          </div>
        </div>

        {/* Section 1: Problem */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
            1. The Problem Statement
          </h3>
          <textarea
            rows={3}
            value={pitch.problemSummary}
            onChange={(e) => updatePitch({ problemSummary: e.target.value })}
            className="w-full bg-[#0B0F17] border border-white/[0.06] rounded-lg p-3 text-xs text-slate-200 focus:border-rose-400/50 focus:outline-none resize-none"
            placeholder="What acute pain does your customer encounter daily? Quantify the cost of inaction..."
          />
        </div>

        {/* Section 2: Solution */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            2. Solution & Core Value Proposition
          </h3>
          <textarea
            rows={3}
            value={pitch.solutionSummary}
            onChange={(e) => updatePitch({ solutionSummary: e.target.value })}
            className="w-full bg-[#0B0F17] border border-white/[0.06] rounded-lg p-3 text-xs text-slate-200 focus:border-emerald-400/50 focus:outline-none resize-none"
            placeholder="How does your platform or service uniquely solve this problem?"
          />
        </div>

        {/* Section 3: Market Timing & Sizing */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
            3. Market Timing & Addressable Opportunity
          </h3>
          <textarea
            rows={2}
            value={pitch.marketTiming}
            onChange={(e) => updatePitch({ marketTiming: e.target.value })}
            className="w-full bg-[#0B0F17] border border-white/[0.06] rounded-lg p-3 text-xs text-slate-200 focus:border-sky-400/50 focus:outline-none resize-none"
            placeholder="Why is now the right catalyst moment for this company?"
          />
          <div className="grid grid-cols-3 gap-3 p-3 bg-[#0B0F17] rounded-lg border border-white/[0.04] text-[11px] text-center">
            <div>
              <div className="text-slate-400">TAM (Total Demand)</div>
              <div className="font-bold text-white text-sm">${project.market.tamValue}M</div>
            </div>
            <div>
              <div className="text-slate-400">SAM (Serviceable)</div>
              <div className="font-bold text-white text-sm">${project.market.samValue}M</div>
            </div>
            <div>
              <div className="text-slate-400">SOM (Obtainable)</div>
              <div className="font-bold text-sky-300 text-sm">${project.market.somValue}M</div>
            </div>
          </div>
        </div>

        {/* Section 4: Business Model & Monetization */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            4. Business Model & Unit Economics
          </h3>
          <textarea
            rows={2}
            value={pitch.businessModelSummary}
            onChange={(e) => updatePitch({ businessModelSummary: e.target.value })}
            className="w-full bg-[#0B0F17] border border-white/[0.06] rounded-lg p-3 text-xs text-slate-200 focus:border-amber-400/50 focus:outline-none resize-none"
            placeholder="Explain pricing, tiers, expansion loops, and unit margin structure..."
          />
        </div>

        {/* Section 5: Competitive Advantage */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            5. Competitive Moat & Unfair Advantage
          </h3>
          <textarea
            rows={2}
            value={pitch.competitiveMoat}
            onChange={(e) => updatePitch({ competitiveMoat: e.target.value })}
            className="w-full bg-[#0B0F17] border border-white/[0.06] rounded-lg p-3 text-xs text-slate-200 focus:border-indigo-400/50 focus:outline-none resize-none"
            placeholder="What prevents competitors or incumbents from replicating your capability?"
          />
        </div>

        {/* Section 6: Milestones */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
            6. 12-Month Financial & Operational Target
          </h3>
          <textarea
            rows={2}
            value={pitch.financialMilestone12mo}
            onChange={(e) => updatePitch({ financialMilestone12mo: e.target.value })}
            className="w-full bg-[#0B0F17] border border-white/[0.06] rounded-lg p-3 text-xs text-slate-200 focus:border-purple-400/50 focus:outline-none resize-none"
            placeholder="Revenue milestones, ARR goals, or product scale metrics for the next 12-18 months..."
          />
        </div>

        {/* Section 7: Capital Ask & Fund Allocation */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            7. Capital Allocation & Strategic Ask
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Target Capital Ask ({fin.currencySymbol})</label>
              <input
                type="number"
                value={pitch.capitalAsk || ''}
                onChange={(e) => updatePitch({ capitalAsk: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded p-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Resource Allocation Plan</label>
              <input
                type="text"
                value={pitch.fundAllocation}
                onChange={(e) => updatePitch({ fundAllocation: e.target.value })}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded p-2 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. 60% Engineering, 25% GTM Acquisition, 15% Reserves"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
