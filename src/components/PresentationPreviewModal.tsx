import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  Eye, 
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Palette
} from 'lucide-react';
import { NexoraProject, ThemeId, LicenseInfo } from '../types/project';
import { getTheme, NEXORA_THEMES, getAllThemes } from '../data/themes';
import { SLIDE_TEMPLATES } from '../utils/slideModel';
import { SlidePreview } from './SlidePreview';

interface PresentationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeId?: ThemeId;
  project: NexoraProject;
  license?: LicenseInfo;
  initialSlideIndex?: number;
  onUseTemplate: (themeId: ThemeId) => void;
  onUnlock?: () => void;
}

export const PresentationPreviewModal: React.FC<PresentationPreviewModalProps> = ({
  isOpen,
  onClose,
  themeId,
  project,
  license,
  initialSlideIndex = 0,
  onUseTemplate,
  onUnlock,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(themeId || project.theme || 'modern');
  const [currentSlide, setCurrentSlide] = useState<number>(initialSlideIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Sync theme if prop changes
  useEffect(() => {
    if (themeId) {
      setSelectedThemeId(themeId);
    }
  }, [themeId]);

  // Sync slide index if initial changes
  useEffect(() => {
    setCurrentSlide(Math.max(0, Math.min(SLIDE_TEMPLATES.length - 1, initialSlideIndex)));
  }, [initialSlideIndex, isOpen]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!modalContainerRef.current) return;

    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => Math.min(SLIDE_TEMPLATES.length - 1, prev + 1));
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          onClose();
        }
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, toggleFullscreen]);

  if (!isOpen) return null;

  const currentTheme = getTheme(selectedThemeId);
  const isFreeTier = !license || license.tier === 'Free';
  const isSelectedThemeActive = project.theme === selectedThemeId;
  const isPremiumTheme = selectedThemeId === 'bold' || selectedThemeId === 'executive';
  const showLockedExportNotice = isFreeTier;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.7, Number((z - 0.1).toFixed(2))));
  const handleResetZoom = () => setZoomLevel(1);

  const handleApply = () => {
    onUseTemplate(selectedThemeId);
  };

  return (
    <div
      id="modal-presentation-preview-overlay"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-0 md:p-3 overflow-hidden animate-in fade-in duration-200"
    >
      <div
        ref={modalContainerRef}
        id="modal-presentation-preview-container"
        className="w-full h-full max-w-[1720px] bg-[#0A0E17] border border-white/10 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* ======================================================== */}
        {/* TOP BAR / HEADER */}
        {/* ======================================================== */}
        <header className="px-4 py-3 bg-[#0D1322] border-b border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          {/* Brand & Presentation Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black tracking-wider text-sky-400 uppercase">NEXORA</span>
                <span className="text-xs font-semibold text-white truncate">Presentation Preview</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300 font-medium">
                  {currentTheme.name}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  • {currentTheme.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden md:block">
                True 16:9 widescreen presentation layout with real template styling and financial metrics.
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Free/Pro Notice */}
            {showLockedExportNotice && (
              <div 
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-medium"
                title="Preview is 100% free and interactive. Upgrading enables unlimited 16:9 PPTX and PDF exports."
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Preview is free — upgrade to export</span>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-0.5">
              <button
                id="btn-preview-zoom-out"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.7}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                id="btn-preview-zoom-reset"
                onClick={handleResetZoom}
                className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
                title="Reset Zoom to 100%"
              >
                {Math.round(zoomLevel * 100)}%
              </button>

              <button
                id="btn-preview-zoom-in"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 1.5}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              id="btn-preview-fullscreen-toggle"
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen (F / Esc)' : 'Enter Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              id="btn-preview-use-template"
              onClick={handleApply}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isSelectedThemeActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
              }`}
            >
              {isSelectedThemeActive ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Active in Project</span>
                  <span className="sm:hidden">Active</span>
                </>
              ) : isPremiumTheme && isFreeTier ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unlock & Use Template</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Use This Template</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              id="btn-preview-close"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] transition-colors cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* MAIN BODY: THUMBNAILS + REAL PRESENTATION STAGE */}
        {/* ======================================================== */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative">
          {/* SLIDE THUMBNAILS SIDEBAR (Desktop: Left Column, Mobile: Top/Bottom Horizontal Scroll) */}
          <aside className="w-full md:w-64 bg-[#090D16] border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-row md:flex-col shrink-0 overflow-x-auto md:overflow-y-auto p-3 gap-2.5">
            <div className="hidden md:flex items-center justify-between pb-2 mb-1 border-b border-white/[0.06] shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Slides ({SLIDE_TEMPLATES.length})</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">16:9 HD</span>
            </div>

            {/* Thumbnail Cards */}
            {SLIDE_TEMPLATES.map((slide, idx) => {
              const isCurrent = currentSlide === idx;
              return (
                <button
                  key={slide.id}
                  id={`btn-thumbnail-slide-${idx}`}
                  onClick={() => setCurrentSlide(idx)}
                  className={`group relative text-left rounded-xl transition-all cursor-pointer p-2 shrink-0 flex flex-col md:flex-row items-center md:items-start gap-2 border ${
                    isCurrent
                      ? 'bg-sky-500/10 border-sky-400/80 shadow-md shadow-sky-500/10'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.15]'
                  }`}
                  style={{
                    width: 'auto',
                    minWidth: '120px',
                  }}
                >
                  {/* Miniature Visual Aspect Ratio Card */}
                  <div 
                    className="w-16 sm:w-20 md:w-24 aspect-video rounded-lg relative overflow-hidden shrink-0 border border-white/10 flex flex-col justify-between p-1.5"
                    style={{ backgroundColor: `#${currentTheme.pptx.bgColor}` }}
                  >
                    {/* Top Accent Stripe */}
                    <div 
                      className="w-full h-1 rounded-full" 
                      style={{ backgroundColor: `#${currentTheme.pptx.primaryHex}` }} 
                    />
                    
                    {/* Mini Content Mock */}
                    <div className="space-y-0.5">
                      <div 
                        className="w-3/4 h-1 rounded-full" 
                        style={{ backgroundColor: `#${currentTheme.pptx.textHex}` }} 
                      />
                      <div 
                        className="w-1/2 h-0.5 rounded-full" 
                        style={{ backgroundColor: `#${currentTheme.pptx.mutedHex}` }} 
                      />
                    </div>

                    {/* Bottom Slide Badge */}
                    <div className="flex justify-between items-center text-[8px] font-mono font-bold" style={{ color: `#${currentTheme.pptx.accentHex}` }}>
                      <span>{slide.number}</span>
                    </div>
                  </div>

                  {/* Thumbnail Info */}
                  <div className="min-w-0 flex-1 w-full md:w-auto text-center md:text-left">
                    <div className="flex items-center gap-1.5 justify-center md:justify-start">
                      <span className="text-[10px] font-mono font-bold text-sky-400">
                        {slide.number}
                      </span>
                      <span className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                        {slide.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate hidden md:block mt-0.5">
                      {slide.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* REAL SLIDE DISPLAY STAGE */}
          <section className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden relative bg-[#070A12]">
            {/* Scaled Presentation Viewport */}
            <div 
              className="w-full h-full flex items-center justify-center relative overflow-auto transition-transform duration-150"
              style={{
                transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined,
                transformOrigin: 'center center',
              }}
            >
              <div className="w-full max-w-6xl aspect-video relative flex items-center justify-center">
                <SlidePreview
                  project={project}
                  slideIndex={currentSlide}
                  themeOverride={currentTheme}
                  id="preview-modal-active-slide-canvas"
                  className="w-full h-full"
                  showControls={false}
                />
              </div>
            </div>

            {/* Floating Navigation Hint for quick click on slide sides */}
            <button
              id="btn-preview-stage-prev"
              disabled={currentSlide <= 0}
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-xs transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer hidden md:flex items-center justify-center shadow-xl"
              title="Previous Slide (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              id="btn-preview-stage-next"
              disabled={currentSlide >= SLIDE_TEMPLATES.length - 1}
              onClick={() => setCurrentSlide((prev) => Math.min(SLIDE_TEMPLATES.length - 1, prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-xs transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer hidden md:flex items-center justify-center shadow-xl"
              title="Next Slide (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </section>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM CONTROLS & STATUS BAR */}
        {/* ======================================================== */}
        <footer className="px-4 py-3 bg-[#0D1322] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Active Template Selector Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
              <Palette className="w-3.5 h-3.5 text-sky-400" />
              <span>Theme:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {getAllThemes().map((th) => (
                <button
                  key={th.id}
                  id={`btn-preview-switch-theme-${th.id}`}
                  onClick={() => setSelectedThemeId(th.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedThemeId === th.id
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50'
                      : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: th.palette.primary }}
                  />
                  <span>{th.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Center: Previous / Slide Counter / Next Controls */}
          <div className="flex items-center gap-3">
            <button
              id="btn-preview-nav-prev"
              type="button"
              disabled={currentSlide <= 0}
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold border border-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/10 font-mono text-xs">
              <span className="font-bold text-sky-400">{currentSlide + 1}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{SLIDE_TEMPLATES.length}</span>
            </div>

            <button
              id="btn-preview-nav-next"
              type="button"
              disabled={currentSlide >= SLIDE_TEMPLATES.length - 1}
              onClick={() => setCurrentSlide((prev) => Math.min(SLIDE_TEMPLATES.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold border border-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Template Action CTA */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="btn-preview-bottom-close"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/[0.08] cursor-pointer transition-colors"
            >
              Close Preview
            </button>

            <button
              id="btn-preview-bottom-use-template"
              onClick={handleApply}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isSelectedThemeActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
              }`}
            >
              {isSelectedThemeActive ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Use Template (Active)</span>
                </>
              ) : (
                <>
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
