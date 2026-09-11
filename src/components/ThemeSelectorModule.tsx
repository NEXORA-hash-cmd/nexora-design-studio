import React, { useState } from 'react';
import { 
  Palette, 
  Check, 
  Sparkles, 
  Layout, 
  Eye, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  FileText
} from 'lucide-react';
import { NexoraProject, ThemeId } from '../types/project';
import { NEXORA_THEMES, getAllThemes, getTheme } from '../data/themes';

interface ThemeSelectorModuleProps {
  project: NexoraProject;
  onThemeSelect: (themeId: ThemeId) => void;
  onUpdateProject: (updated: NexoraProject) => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const ThemeSelectorModule: React.FC<ThemeSelectorModuleProps> = ({
  project,
  onThemeSelect,
  onUpdateProject,
  onShowToast,
}) => {
  const currentThemeId = project.theme || 'modern';
  const currentTheme = getTheme(currentThemeId);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId>(currentThemeId);
  const [activeSlideTab, setActiveSlideTab] = useState<'cover' | 'problem' | 'canvas' | 'financials' | 'ask'>('cover');

  const themes = getAllThemes();
  const categories = ['all', 'Technology & SaaS', 'Corporate & Advisory', 'Design & Consumer', 'High-Impact & Startup'];

  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(t => t.category === selectedCategory);

  const previewTheme = getTheme(previewThemeId);
  const fin = project.financials;

  const handleApplyTheme = (id: ThemeId) => {
    onThemeSelect(id);
    onShowToast('success', `Theme switched to "${NEXORA_THEMES[id].name}". Project design updated.`);
  };

  return (
    <div id="module-theme-selector" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111726] to-[#151D30] border border-white/[0.08] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>NEXORA Design System</span>
              </span>
              <span className="text-xs text-slate-400">
                Active: <span className="font-semibold text-white">{currentTheme.name}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Choose Your Portfolio Theme
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Switching themes transforms your visual layout, typography, and presentation slides while keeping all business data, model blocks, and financials 100% intact.
            </p>
          </div>

          <div className="bg-[#0B0F17]/80 border border-white/[0.08] p-3.5 rounded-xl shrink-0 flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-md"
              style={{ backgroundColor: currentTheme.palette.primary, color: '#FFFFFF' }}
            >
              {currentTheme.name.charAt(0)}
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Design</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{currentTheme.name}</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {cat === 'all' ? 'All Themes (4)' : cat}
          </button>
        ))}
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredThemes.map((theme) => {
          const isSelected = theme.id === currentThemeId;
          const isInspecting = theme.id === previewThemeId;

          return (
            <div
              key={theme.id}
              id={`theme-card-${theme.id}`}
              className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative group cursor-pointer ${
                isSelected
                  ? 'border-sky-400 shadow-lg shadow-sky-500/10 bg-[#12192C]'
                  : 'border-white/[0.08] hover:border-white/20 bg-[#0E1424]'
              }`}
              onClick={() => setPreviewThemeId(theme.id)}
            >
              {/* Card Top: Live Mini Slide Preview */}
              <div 
                className="p-5 h-44 flex flex-col justify-between relative overflow-hidden transition-all"
                style={{ backgroundColor: theme.palette.background }}
              >
                {/* Accent top line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5" 
                  style={{ backgroundColor: theme.palette.primary }} 
                />

                <div className="flex items-center justify-between">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ backgroundColor: theme.palette.surface, color: theme.palette.textMuted }}
                  >
                    {theme.category}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1 my-auto">
                  <div 
                    className={`text-lg leading-tight truncate ${theme.typography.headingFont}`}
                    style={{ color: theme.palette.textPrimary }}
                  >
                    {project.name}
                  </div>
                  <div 
                    className="text-[11px] truncate"
                    style={{ color: theme.palette.textMuted }}
                  >
                    {project.tagline || 'Business Architecture System'}
                  </div>
                </div>

                {/* Palette Swatches */}
                <div className="flex items-center gap-1.5 pt-2">
                  <div className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: theme.palette.primary }} title="Primary" />
                  <div className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: theme.palette.accent }} title="Accent" />
                  <div className="w-3.5 h-3.5 rounded-full shadow-xs border border-white/20" style={{ backgroundColor: theme.palette.surface }} title="Surface" />
                  <span className="text-[10px] text-slate-400 ml-1 font-mono">
                    {theme.pptx.fontFace}
                  </span>
                </div>
              </div>

              {/* Card Body & Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between border-t border-white/[0.06]">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">{theme.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">16:9 HD</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    id={`btn-apply-theme-${theme.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyTheme(theme.id);
                    }}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md hover:shadow-sky-500/20'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Theme Active</span>
                      </>
                    ) : (
                      <>
                        <span>Use This Theme</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewThemeId(theme.id);
                    }}
                    className={`w-full py-1.5 text-[11px] font-medium rounded transition-colors text-center cursor-pointer ${
                      isInspecting ? 'text-sky-300 bg-sky-500/10' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Inspect Slide Previews ↓
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Slide Preview Stage */}
      <div className="bg-[#0B0F17] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: previewTheme.palette.primary, color: '#FFF' }}
            >
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Real Presentation Canvas: {previewTheme.name}</span>
                {previewTheme.id === currentThemeId && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                    Current Active Selection
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Interactive preview rendering real project data with {previewTheme.name} styling.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {previewTheme.id !== currentThemeId && (
              <button
                id="btn-apply-inspected-theme"
                onClick={() => handleApplyTheme(previewTheme.id)}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply {previewTheme.name}</span>
              </button>
            )}

            {/* Slide Navigation Tabs */}
            <div className="flex items-center bg-[#111726] p-1 rounded-lg border border-white/[0.06] text-xs">
              {(['cover', 'problem', 'canvas', 'financials', 'ask'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSlideTab(tab)}
                  className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer ${
                    activeSlideTab === tab
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Viewport Stage */}
        <div 
          id="presentation-slide-viewport"
          className="rounded-xl p-8 min-h-[380px] shadow-2xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between border"
          style={{ 
            backgroundColor: previewTheme.palette.background,
            borderColor: previewTheme.palette.primary + '40'
          }}
        >
          {/* Accent Header Bar */}
          <div 
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: previewTheme.palette.primary }}
          />

          {/* SLIDE: COVER */}
          {activeSlideTab === 'cover' && (
            <div className="space-y-6 animate-in fade-in duration-200 my-auto">
              <div className="flex items-center gap-2">
                <span 
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded"
                  style={{ backgroundColor: previewTheme.palette.surface, color: previewTheme.palette.accent }}
                >
                  NEXORA COMMERCIAL DOSSIER • {previewTheme.name.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                <h1 
                  className={`text-3xl sm:text-5xl font-black ${previewTheme.typography.headingFont}`}
                  style={{ color: previewTheme.palette.textPrimary }}
                >
                  {project.name}
                </h1>
                <p 
                  className="text-base sm:text-lg max-w-3xl"
                  style={{ color: previewTheme.palette.textMuted }}
                >
                  {project.tagline || 'Business Architecture & Strategic Masterplan'}
                </p>
              </div>

              <div 
                className="p-4 rounded-xl border flex flex-wrap items-center gap-6 text-xs font-medium"
                style={{ 
                  backgroundColor: previewTheme.palette.surface, 
                  borderColor: previewTheme.palette.primary + '30',
                  color: previewTheme.palette.textPrimary 
                }}
              >
                <div>
                  <span className="opacity-60">Industry:</span> <span className="font-bold">{project.industry}</span>
                </div>
                <div>
                  <span className="opacity-60">Stage:</span> <span className="font-bold">{project.stage}</span>
                </div>
                <div>
                  <span className="opacity-60">Currency:</span> <span className="font-bold">{fin.currency} ({fin.currencySymbol})</span>
                </div>
                <div>
                  <span className="opacity-60">Standard:</span> <span className="font-bold">NEXORA Commercial v1.0</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE: PROBLEM & SOLUTION */}
          {activeSlideTab === 'problem' && (
            <div className="space-y-6 animate-in fade-in duration-200 my-auto">
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: previewTheme.palette.accent }}>
                01 / Strategic Problem & Solution
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="p-5 rounded-xl border space-y-3"
                  style={{ backgroundColor: previewTheme.palette.surface, borderColor: '#EF444440' }}
                >
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">The Market Problem</span>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: previewTheme.palette.textPrimary }}>
                    {project.pitch.problemSummary || 'Detailed operational pain points currently unsolved in the target industry.'}
                  </p>
                </div>

                <div 
                  className="p-5 rounded-xl border space-y-3"
                  style={{ backgroundColor: previewTheme.palette.surface, borderColor: previewTheme.palette.primary + '60' }}
                >
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: previewTheme.palette.accent }}>
                    The Value Proposition
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: previewTheme.palette.textPrimary }}>
                    {project.pitch.solutionSummary || 'Proprietary automated workflow delivering measurable ROI and margin expansion.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE: CANVAS BLOCKS */}
          {activeSlideTab === 'canvas' && (
            <div className="space-y-4 animate-in fade-in duration-200 my-auto">
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: previewTheme.palette.accent }}>
                02 / 9-Block Strategic Blueprint
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: 'Value Propositions', items: project.canvas.valuePropositions.items },
                  { title: 'Customer Segments', items: project.canvas.customerSegments.items },
                  { title: 'Revenue Streams', items: project.canvas.revenueStreams.items },
                ].map((b, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border space-y-2"
                    style={{ backgroundColor: previewTheme.palette.surface, borderColor: previewTheme.palette.primary + '40' }}
                  >
                    <div className="text-xs font-bold uppercase" style={{ color: previewTheme.palette.accent }}>
                      {b.title}
                    </div>
                    <ul className="text-xs space-y-1.5" style={{ color: previewTheme.palette.textPrimary }}>
                      {b.items.slice(0, 2).map((it, i) => (
                        <li key={i} className="line-clamp-2">• {it.text}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE: FINANCIALS */}
          {activeSlideTab === 'financials' && (
            <div className="space-y-6 animate-in fade-in duration-200 my-auto">
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: previewTheme.palette.accent }}>
                03 / Unit Economics & Margins
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Unit Price', val: `${fin.currencySymbol}${fin.pricingPerUnit}` },
                  { label: 'Unit COGS', val: `${fin.currencySymbol}${fin.cogsPerUnit}` },
                  { label: 'Gross Margin', val: `${fin.pricingPerUnit > 0 ? (((fin.pricingPerUnit - fin.cogsPerUnit) / fin.pricingPerUnit) * 100).toFixed(0) : 0}%` },
                  { label: 'Active Customers', val: `${fin.currentCustomers} Units` },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border space-y-1"
                    style={{ backgroundColor: previewTheme.palette.surface, borderColor: previewTheme.palette.primary + '40' }}
                  >
                    <div className="text-[10px] uppercase font-bold" style={{ color: previewTheme.palette.textMuted }}>
                      {item.label}
                    </div>
                    <div className="text-xl font-bold" style={{ color: previewTheme.palette.accent }}>
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE: CAPITAL ASK */}
          {activeSlideTab === 'ask' && (
            <div className="space-y-6 animate-in fade-in duration-200 my-auto">
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: previewTheme.palette.accent }}>
                04 / Capital Allocation & The Ask
              </div>
              <div 
                className="p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6"
                style={{ backgroundColor: previewTheme.palette.surface, borderColor: previewTheme.palette.primary + '50' }}
              >
                <div className="space-y-1">
                  <span className="text-xs uppercase font-bold" style={{ color: previewTheme.palette.textMuted }}>
                    Target Capital Deployment
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold" style={{ color: previewTheme.palette.accent }}>
                    {fin.currencySymbol}{project.pitch.capitalAsk.toLocaleString()}
                  </div>
                  <p className="text-xs max-w-md pt-2" style={{ color: previewTheme.palette.textPrimary }}>
                    {project.pitch.financialMilestone12mo}
                  </p>
                </div>

                <div className="max-w-xs text-xs space-y-2 p-4 rounded-xl bg-black/20">
                  <div className="font-bold" style={{ color: previewTheme.palette.accent }}>Fund Allocation</div>
                  <div style={{ color: previewTheme.palette.textMuted }}>{project.pitch.fundAllocation}</div>
                </div>
              </div>
            </div>
          )}

          {/* Slide Footer */}
          <div className="pt-6 flex items-center justify-between text-[11px] border-t border-white/[0.06] mt-4" style={{ color: previewTheme.palette.textMuted }}>
            <span>NEXORA Business Design Studio</span>
            <span>Slide Theme: {previewTheme.name} (16:9 Widescreen)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
