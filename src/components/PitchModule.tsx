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
  Rocket,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layout,
  Eye
} from 'lucide-react';
import { NexoraProject, PitchDeck, LicenseInfo, ThemeId } from '../types/project';
import { exportDocumentToPdf } from '../utils/exporter';
import { exportProjectToPptx } from '../utils/pptxExport';
import { SlidePreview } from './SlidePreview';
import { SLIDE_TEMPLATES } from '../utils/slideModel';
import { PresentationPreviewModal } from './PresentationPreviewModal';

interface PitchModuleProps {
  project: NexoraProject;
  license?: LicenseInfo;
  onOpenLicense?: () => void;
  onChange: (updated: NexoraProject) => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const PitchModule: React.FC<PitchModuleProps> = ({
  project,
  license,
  onOpenLicense,
  onChange,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [viewMode, setViewMode] = useState<'both' | 'slides' | 'memo'>('both');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

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

  const handleExportPptx = async () => {
    setIsExportingPptx(true);
    onShowToast('info', 'Compiling 16:9 PowerPoint widescreen presentation...');
    const res = await exportProjectToPptx(project);
    setIsExportingPptx(false);
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
- Target Gross Margin: ${(((fin.pricingPerUnit - fin.cogsPerUnit) / (fin.pricingPerUnit || 1)) * 100).toFixed(0)}%

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
    <div id="module-pitch" className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Full-Screen Presentation Preview Modal */}
      <PresentationPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        themeId={project.theme}
        project={project}
        license={license}
        initialSlideIndex={selectedSlide}
        onUseTemplate={(newThemeId) => {
          setIsPreviewModalOpen(false);
          onChange({
            ...project,
            theme: newThemeId,
          });
          onShowToast('success', `Theme updated to ${newThemeId}`);
        }}
        onUnlock={onOpenLicense}
      />

      {/* Module Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center gap-1.5">
              <Presentation className="w-3.5 h-3.5" />
              <span>Pitch Deck & Presentation Workspace</span>
            </span>
            <span className="text-xs text-slate-400">
              12-Slide Standard Commercial Widescreen
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pitch Deck & Strategic Executive Memo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Preview, navigate, and edit your commercial slide deck alongside the executive memo. Fully synchronized with your business model canvas and financial metrics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Prominent Preview Presentation Button */}
          <button
            id="btn-pitch-preview-presentation"
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            title="Open Full-Screen Presentation Preview"
          >
            <Eye className="w-4 h-4 text-sky-300 shrink-0" />
            <span>👁 Preview Presentation</span>
          </button>

          {/* View Filter Toggles */}
          <div className="flex items-center bg-[#111726] p-1 rounded-xl border border-white/[0.08] text-xs">
            <button
              type="button"
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'both' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('slides')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'slides' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Slides Only
            </button>
            <button
              type="button"
              onClick={() => setViewMode('memo')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'memo' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Memo Only
            </button>
          </div>

          <button
            id="btn-copy-pitch-text"
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 border border-white/[0.08] transition-colors cursor-pointer"
            title="Copy Executive Summary to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Memo'}</span>
          </button>

          <button
            id="btn-export-pitch-pptx"
            onClick={handleExportPptx}
            disabled={isExportingPptx}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            title="Download PowerPoint Presentation"
          >
            <Presentation className="w-3.5 h-3.5 text-purple-300" />
            <span>{isExportingPptx ? 'Exporting...' : 'Download PPTX'}</span>
          </button>

          <button
            id="btn-export-pitch-pdf"
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Export Executive Dossier as PDF"
          >
            <Download className="w-3.5 h-3.5 text-sky-300" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RESTORED PRESENTATION SLIDE PREVIEW AREA IN WORKSPACE */}
      {/* ======================================================== */}
      {(viewMode === 'both' || viewMode === 'slides') && (
        <section id="presentation-slide-preview-area" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                16:9 Presentation Stage
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                ({SLIDE_TEMPLATES[selectedSlide].name})
              </span>
            </div>

            {/* Quick Slide Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={selectedSlide <= 0}
                onClick={() => setSelectedSlide(Math.max(0, selectedSlide - 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <span className="px-2 text-xs font-semibold text-slate-300 font-mono">
                {selectedSlide + 1} / {SLIDE_TEMPLATES.length}
              </span>
              <button
                type="button"
                disabled={selectedSlide >= SLIDE_TEMPLATES.length - 1}
                onClick={() => setSelectedSlide(Math.min(SLIDE_TEMPLATES.length - 1, selectedSlide + 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Selector Carousel / Thumbnail Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
            {SLIDE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedSlide(tmpl.id)}
                className={`px-3 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer border ${
                  selectedSlide === tmpl.id
                    ? 'bg-purple-950/70 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-[#111726]/60 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-70">
                  Slide {tmpl.number}
                </div>
                <div className="text-xs font-bold whitespace-nowrap mt-0.5">
                  {tmpl.name}
                </div>
              </button>
            ))}
          </div>

          {/* Live Responsive 16:9 Presentation Canvas */}
          <div className="relative">
            <SlidePreview
              project={project}
              slideIndex={selectedSlide}
              showControls={true}
              onSlideChange={setSelectedSlide}
            />
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* PRINTABLE NARRATIVE MEMORANDUM & EDITABLE BRIEFING */}
      {/* ======================================================== */}
      {(viewMode === 'both' || viewMode === 'memo') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Executive Dossier Memorandum & Briefing
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Edits automatically update presentation slides & PDF exports
            </span>
          </div>

          <div 
            id="printable-pitch-document"
            className="bg-[#111726] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200 text-xs leading-relaxed"
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
        </section>
      )}
    </div>
  );
};
