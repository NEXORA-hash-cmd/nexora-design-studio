import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Presentation, 
  FileSpreadsheet, 
  FileCode, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Settings2, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { NexoraProject } from '../types/project';
import { 
  exportProjectToPptx, 
  exportDocumentToPdf, 
  exportFinancialsToCsv, 
  exportProjectToJson,
  exportSlideToImage 
} from '../utils/exporter';
import { getTheme } from '../data/themes';
import { LicenseInfo } from '../types/project';

interface ExportCenterModuleProps {
  project: NexoraProject;
  license?: LicenseInfo;
  onOpenLicense?: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const ExportCenterModule: React.FC<ExportCenterModuleProps> = ({
  project,
  license,
  onOpenLicense,
  onShowToast,
}) => {
  const [activeExport, setActiveExport] = useState<string | null>(null);
  const [exportProgressStatus, setExportProgressStatus] = useState<string>('');
  const [lastExported, setLastExported] = useState<{ name: string; time: string } | null>(null);

  const theme = getTheme(project.theme);

  const handleExportPptx = async () => {
    setActiveExport('pptx');
    setExportProgressStatus('Initializing PowerPoint presentation engine...');
    const res = await exportProjectToPptx(project, (status) => setExportProgressStatus(status));
    setActiveExport(null);
    if (res.success) {
      setLastExported({ name: res.filename, time: new Date().toLocaleTimeString() });
      onShowToast('success', res.message);
    } else {
      onShowToast('error', res.message);
    }
  };

  const handleExportPdf = async () => {
    setActiveExport('pdf');
    setExportProgressStatus('Synthesizing multi-page PDF document...');
    const res = await exportDocumentToPdf(project, (status) => setExportProgressStatus(status));
    setActiveExport(null);
    if (res.success) {
      setLastExported({ name: `NEXORA_${project.name}_Summary.pdf`, time: new Date().toLocaleTimeString() });
      onShowToast('success', res.message);
    } else {
      onShowToast('error', res.message);
    }
  };

  const handleExportImage = async (format: 'png' | 'jpg') => {
    setActiveExport(format);
    setExportProgressStatus(`Rendering high-resolution ${format.toUpperCase()} slide...`);
    const res = await exportSlideToImage(project, format, undefined, (status) => setExportProgressStatus(status));
    setActiveExport(null);
    if (res.success) {
      setLastExported({ name: res.filename, time: new Date().toLocaleTimeString() });
      onShowToast('success', res.message);
    } else {
      onShowToast('error', res.message);
    }
  };

  const handleExportCsv = async () => {
    setActiveExport('csv');
    setExportProgressStatus('Compiling unit economics and 12-month cashflow forecast...');
    const res = await exportFinancialsToCsv(project);
    setActiveExport(null);
    if (res.success) {
      setLastExported({ name: `${project.name}_Financial_Model.csv`, time: new Date().toLocaleTimeString() });
      onShowToast('success', res.message);
    } else {
      onShowToast('error', res.message);
    }
  };

  const handleExportJson = async () => {
    setActiveExport('json');
    setExportProgressStatus('Packaging complete project JSON data...');
    const res = await exportProjectToJson(project);
    setActiveExport(null);
    if (res.success) {
      setLastExported({ name: `${project.name}_NEXORA.json`, time: new Date().toLocaleTimeString() });
      onShowToast('success', res.message);
    } else {
      onShowToast('error', res.message);
    }
  };

  return (
    <div id="module-export-center" className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111726] to-[#151D30] border border-white/[0.08] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Commercial Export Engine</span>
              </span>
              <span className="text-xs text-slate-400">
                Active Theme: <span className="font-semibold text-white">{theme.name}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Export Center & Portfolio Publisher
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Generate real presentation decks, multi-page executive memos, and spreadsheets ready for stakeholders, investors, and grant committees.
            </p>
          </div>

          {lastExported && (
            <div className="bg-[#0B0F17]/90 border border-emerald-500/30 p-3.5 rounded-xl shrink-0 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Last Generated</div>
                <div className="text-xs font-bold text-white max-w-[200px] truncate">{lastExported.name}</div>
                <div className="text-[10px] text-emerald-400">{lastExported.time}</div>
              </div>
            </div>
          )}
        </div>

        {/* Commercial Edition Status Bar */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
          {license?.tier === 'Pro Lifetime' ? (
            <div className="flex items-center gap-2 text-amber-300">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 font-bold font-mono">
                PRO LIFETIME ($19)
              </span>
              <span>Commercial License Active — All documents exported with full licensee rights.</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold font-mono">
                  FREE EDITION ($0)
                </span>
                <span>Decks and documents include standard NEXORA commercial attribution footer.</span>
              </div>
              {onOpenLicense && (
                <button
                  type="button"
                  onClick={onOpenLicense}
                  className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro ($19 Lifetime)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress / Loading Overlay */}
      {activeExport && (
        <div 
          id="export-progress-banner"
          className="bg-sky-950/60 border border-sky-500/40 rounded-xl p-4 flex items-center gap-4 text-sky-200 animate-pulse"
        >
          <Loader2 className="w-6 h-6 text-sky-400 animate-spin shrink-0" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Generating Export File...
            </div>
            <div className="text-xs text-sky-100 font-mono">
              {exportProgressStatus || 'Synthesizing file data and writing bytes...'}
            </div>
          </div>
        </div>
      )}

      {/* Primary Presentation & Document Exports */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span>Primary Deliverables</span>
          <span className="h-[1px] flex-1 bg-white/[0.08]" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PPTX Card */}
          <div 
            id="card-export-pptx"
            className="bg-[#0E1524] border border-white/[0.08] hover:border-purple-500/50 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Presentation className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 font-semibold">
                  .PPTX
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  PowerPoint Presentation Deck
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  10 professional slides formatted in 16:9 widescreen: Cover, Problem & Solution, 9-Block Canvas, Market Opportunity, Competitive Matrix, Financial Model, GTM Strategy, Milestones, and Capital Ask.
                </p>
              </div>

              <div className="bg-[#090D17] p-3 rounded-lg border border-white/[0.04] space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Applied Theme:</span>
                  <span className="text-slate-200 font-semibold">{theme.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Slide Standard:</span>
                  <span className="text-slate-200 font-mono">16:9 Widescreen (Native Vector)</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                id="btn-trigger-export-pptx"
                onClick={handleExportPptx}
                disabled={activeExport !== null}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
              >
                {activeExport === 'pptx' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Writing PowerPoint File...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export PowerPoint (.pptx)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PDF Card */}
          <div 
            id="card-export-pdf"
            className="bg-[#0E1524] border border-white/[0.08] hover:border-amber-500/50 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-semibold">
                  .PDF
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Executive Business Dossier
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Print-ready 4-page executive report in A4 format: Cover brief, 9-block business model architecture, addressable market & competitor matrix, unit economics, cash flow forecast, and capital deployment plan.
                </p>
              </div>

              <div className="bg-[#090D17] p-3 rounded-lg border border-white/[0.04] space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Document Format:</span>
                  <span className="text-slate-200 font-semibold">A4 Portrait (Multi-Page)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Typography:</span>
                  <span className="text-slate-200 font-mono">Precision Vector PDF</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                id="btn-trigger-export-pdf"
                onClick={handleExportPdf}
                disabled={activeExport !== null}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/20 cursor-pointer"
              >
                {activeExport === 'pdf' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating PDF Dossier...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export Business Dossier (.pdf)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media & Data Exports (PNG, JPG, CSV, JSON) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span>Media Graphics & Financial Models</span>
          <span className="h-[1px] flex-1 bg-white/[0.08]" />
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* PNG Slide Card */}
          <div className="bg-[#0E1524] border border-white/[0.08] hover:border-sky-500/40 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <ImageIcon className="w-5 h-5 text-sky-400" />
                <span className="text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded font-bold">.PNG</span>
              </div>
              <div className="font-bold text-sm text-white">Slide Graphic (PNG)</div>
              <p className="text-xs text-slate-400">High-resolution 1080p raster image for social teasers and investor emails.</p>
            </div>

            <button
              id="btn-trigger-export-png"
              onClick={() => handleExportImage('png')}
              disabled={activeExport !== null}
              className="w-full py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-sky-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PNG</span>
            </button>
          </div>

          {/* JPG Slide Card */}
          <div className="bg-[#0E1524] border border-white/[0.08] hover:border-sky-500/40 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <ImageIcon className="w-5 h-5 text-teal-400" />
                <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded font-bold">.JPG</span>
              </div>
              <div className="font-bold text-sm text-white">Slide Graphic (JPG)</div>
              <p className="text-xs text-slate-400">Compact web-optimized graphic file with universal compatibility.</p>
            </div>

            <button
              id="btn-trigger-export-jpg"
              onClick={() => handleExportImage('jpg')}
              disabled={activeExport !== null}
              className="w-full py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-teal-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JPG</span>
            </button>
          </div>

          {/* CSV Spreadsheet Card */}
          <div className="bg-[#0E1524] border border-white/[0.08] hover:border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">.CSV</span>
              </div>
              <div className="font-bold text-sm text-white">Financial Model</div>
              <p className="text-xs text-slate-400">Unit economics, fixed overhead, and 12-month month-by-month cashflow projections.</p>
            </div>

            <button
              id="btn-trigger-export-csv"
              onClick={handleExportCsv}
              disabled={activeExport !== null}
              className="w-full py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* JSON Backup Card */}
          <div className="bg-[#0E1524] border border-white/[0.08] hover:border-indigo-500/40 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded font-bold">.JSON</span>
              </div>
              <div className="font-bold text-sm text-white">Project Data Backup</div>
              <p className="text-xs text-slate-400">Complete raw project data snapshot to migrate, duplicate, or restore anywhere.</p>
            </div>

            <button
              id="btn-trigger-export-json"
              onClick={handleExportJson}
              disabled={activeExport !== null}
              className="w-full py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-indigo-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
