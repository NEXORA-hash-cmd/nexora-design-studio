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
  FileText,
  Maximize2
} from 'lucide-react';
import { NexoraProject, ThemeId, LicenseInfo } from '../types/project';
import { NEXORA_THEMES, getAllThemes, getTheme } from '../data/themes';
import { SlidePreview } from './SlidePreview';
import { SLIDE_TEMPLATES } from '../utils/slideModel';
import { PresentationPreviewModal } from './PresentationPreviewModal';
import { ActiveTab } from './Navigation';

interface ThemeSelectorModuleProps {
  project: NexoraProject;
  onThemeSelect: (themeId: ThemeId) => void;
  onUpdateProject: (updated: NexoraProject) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  license?: LicenseInfo;
  onOpenLicense?: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const ThemeSelectorModule: React.FC<ThemeSelectorModuleProps> = ({
  project,
  onThemeSelect,
  onUpdateProject,
  onNavigateTab,
  license,
  onOpenLicense,
  onShowToast,
}) => {
  const currentThemeId = project.theme || 'modern';
  const currentTheme = getTheme(currentThemeId);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId>(currentThemeId);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  
  // Full-screen Presentation Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [modalThemeId, setModalThemeId] = useState<ThemeId>(currentThemeId);

  const themes = getAllThemes();
  const categories = ['all', 'Technology & SaaS', 'Corporate & Advisory', 'Design & Consumer', 'High-Impact & Startup'];

  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(t => t.category === selectedCategory);

  const previewTheme = getTheme(previewThemeId);
  const fin = project.financials;

  const handleApplyTheme = (id: ThemeId, shouldRedirectToEditor: boolean = false) => {
    onThemeSelect(id);
    onShowToast('success', `Theme switched to "${NEXORA_THEMES[id].name}". Presentation & canvas updated.`);
    if (shouldRedirectToEditor && onNavigateTab) {
      onNavigateTab('pitch');
    }
  };

  const handleOpenPreview = (id: ThemeId, initialSlide: number = 0) => {
    setModalThemeId(id);
    setSelectedSlideIndex(initialSlide);
    setIsPreviewModalOpen(true);
  };

  return (
    <div id="module-theme-selector" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Fullscreen Presentation Preview Modal */}
      <PresentationPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        themeId={modalThemeId}
        project={project}
        license={license}
        initialSlideIndex={selectedSlideIndex}
        onUseTemplate={(id) => {
          setIsPreviewModalOpen(false);
          handleApplyTheme(id, true);
        }}
        onUnlock={onOpenLicense}
      />

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
              Choose Your Theme
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
                  {/* Two Primary Actions: [ Preview ] and [ Use Template ] */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`btn-preview-theme-${theme.id}`}
                      data-testid={`btn-preview-theme-${theme.id}`}
                      aria-label={`Preview ${theme.name} template`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPreview(theme.id, 0);
                      }}
                      className="py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/[0.12] hover:border-white/20 active:scale-[0.98]"
                      title={`Open interactive preview for ${theme.name}`}
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Preview</span>
                    </button>

                    <button
                      id={`btn-apply-theme-${theme.id}`}
                      data-testid={`btn-apply-theme-${theme.id}`}
                      aria-label={`Use ${theme.name} template`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyTheme(theme.id, true);
                      }}
                      className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md hover:shadow-sky-500/20'
                      }`}
                      title={isSelected ? 'Theme is currently active' : `Use ${theme.name} for this project`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <span>Use Template</span>
                          <ArrowRight className="w-3 h-3 shrink-0" />
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewThemeId(theme.id);
                    }}
                    className={`w-full py-1.5 text-[11px] font-medium rounded transition-colors text-center cursor-pointer ${
                      isInspecting ? 'text-sky-300 bg-sky-500/10' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isInspecting ? 'Currently Inspecting Below ↓' : 'Inspect Slides Below ↓'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Slide Preview Stage / Template Detail Header */}
      <div id="template-detail-section" className="bg-[#0B0F17] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-5">
        <div id="template-detail-header" className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md"
              style={{ backgroundColor: previewTheme.palette.primary, color: '#FFF' }}
            >
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Template Detail: {previewTheme.name}
                </span>
                {previewTheme.id === currentThemeId && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Active Template
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                <span>{previewTheme.name} Presentation Template</span>
              </h2>
              <p className="text-xs text-slate-400">
                {previewTheme.description} • Real commercial data preview
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prominent [ Preview Presentation ] and [ Use This Template ] actions */}
            <button
              id="btn-preview-presentation"
              data-testid="preview-presentation-button"
              aria-label="Preview Presentation"
              type="button"
              onClick={() => handleOpenPreview(previewTheme.id, selectedSlideIndex)}
              className="px-4 py-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 hover:text-white text-xs font-bold transition-all border border-sky-500/40 hover:border-sky-400/60 shadow-md cursor-pointer flex items-center gap-2 active:scale-[0.98]"
              title={`Preview ${previewTheme.name} presentation before committing`}
            >
              <Eye className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Preview Presentation</span>
            </button>

            <button
              id="btn-apply-inspected-theme"
              data-testid="use-template-button"
              aria-label="Use This Template"
              type="button"
              onClick={() => handleApplyTheme(previewTheme.id, true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-[0.98] ${
                previewTheme.id === currentThemeId
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{previewTheme.id === currentThemeId ? 'Active in Project' : `Use This Template`}</span>
            </button>

            {/* Slide Navigation Tabs */}
            <div className="flex items-center bg-[#111726] p-1 rounded-lg border border-white/[0.06] text-xs overflow-x-auto max-w-xs sm:max-w-md scrollbar-none">
              {SLIDE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedSlideIndex(tmpl.id)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedSlideIndex === tmpl.id
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 16:9 Standard Presentation Slide Viewport */}
        <div id="presentation-slide-viewport" className="w-full">
          <SlidePreview
            project={project}
            slideIndex={selectedSlideIndex}
            themeOverride={previewTheme}
            showControls={true}
            onSlideChange={setSelectedSlideIndex}
          />
        </div>
      </div>
    </div>
  );
};
