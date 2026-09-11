import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderKanban, 
  Save, 
  Download, 
  Upload, 
  ShieldCheck, 
  Info, 
  Minus, 
  Square, 
  X, 
  ChevronDown, 
  FileSpreadsheet, 
  FileText, 
  FileCode,
  Check,
  Palette,
  Presentation,
  Image as ImageIcon,
  Plus,
  Copy,
  Languages,
  Award
} from 'lucide-react';
import { NexoraProject, LicenseInfo } from '../types/project';
import { getTheme } from '../data/themes';

interface TitleBarProps {
  project: NexoraProject;
  hasUnsavedChanges: boolean;
  license?: LicenseInfo;
  onSave: () => void;
  onSaveAs?: () => void;
  onNewProject?: () => void;
  onOpenProjects: () => void;
  onOpenThemeSelector: () => void;
  onExportPptx: () => void;
  onExportPdf: () => void;
  onExportPng: () => void;
  onExportJpg: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onImport: () => void;
  onOpenLicense: () => void;
  onOpenAbout: () => void;
  currentLang?: 'en' | 'fr' | 'ar';
  onLangChange?: (lang: 'en' | 'fr' | 'ar') => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  project,
  hasUnsavedChanges,
  license,
  onSave,
  onSaveAs,
  onNewProject,
  onOpenProjects,
  onOpenThemeSelector,
  onExportPptx,
  onExportPdf,
  onExportPng,
  onExportJpg,
  onExportJson,
  onExportCsv,
  onImport,
  onOpenLicense,
  onOpenAbout,
  currentLang = 'en',
  onLangChange,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const isElectron = Boolean(window.electronAPI?.isElectron);
  const activeTheme = getTheme(project.theme);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => window.electronAPI?.maximize();
  const handleClose = () => window.electronAPI?.close();

  return (
    <header 
      id="nexora-titlebar"
      className="bg-[#0B0F17] border-b border-white/[0.08] text-slate-200 select-none flex items-center justify-between px-3 h-12 shrink-0 z-40"
    >
      {/* Left: Branding & Project Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          {/* Logo mark */}
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-sky-500 via-indigo-500 to-emerald-500 p-[1px] shadow-sm">
            <div className="w-full h-full bg-[#0E1524] rounded-[5px] flex items-center justify-center">
              <span className="font-extrabold text-xs tracking-tight bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                N
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold tracking-wide text-sm text-slate-100">
              NEXORA
            </span>
            <span className="text-[11px] text-slate-400 font-normal hidden lg:inline">
              Business Design Studio
            </span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-white/10 mx-0.5 hidden sm:block" />

        {/* Current Project Switcher Badge */}
        <button
          id="btn-open-projects-switcher"
          onClick={onOpenProjects}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Open Project Workspace Manager"
        >
          <FolderKanban className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="font-medium max-w-[130px] sm:max-w-[170px] truncate">{project.name}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 opacity-80 shrink-0" />
        </button>

        {/* Theme Badge Switcher */}
        <button
          id="btn-quick-theme-switch"
          onClick={onOpenThemeSelector}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Change portfolio theme and layout"
        >
          <div 
            className="w-2.5 h-2.5 rounded-full shadow-xs shrink-0"
            style={{ backgroundColor: activeTheme.palette.primary }}
          />
          <span className="text-slate-400">Theme:</span>
          <span className="font-medium text-slate-200">{activeTheme.name}</span>
        </button>

        {/* Save Status Badge */}
        <div className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded text-slate-400 hidden xl:flex">
          {hasUnsavedChanges ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300/90 font-medium">Unsaved</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-slate-400">Saved</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Action Controls */}
      <div className="flex items-center gap-1.5">
        {/* New Project Button */}
        {onNewProject && (
          <button
            id="btn-titlebar-new"
            onClick={onNewProject}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer hidden sm:flex"
            title="Create a new business venture"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">New</span>
          </button>
        )}

        {/* Save Project Button */}
        <button
          id="btn-quick-save"
          onClick={onSave}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
            hasUnsavedChanges
              ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] border border-white/[0.08]'
          }`}
          title="Save project locally (Ctrl+S / Cmd+S)"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>

        {/* Save As Button */}
        {onSaveAs && (
          <button
            id="btn-titlebar-save-as"
            onClick={onSaveAs}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors cursor-pointer hidden lg:flex"
            title="Save copy with a new name"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Save As</span>
          </button>
        )}

        {/* Export Dropdown */}
        <div className="relative" ref={exportDropdownRef}>
          <button
            id="btn-export-dropdown"
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/[0.06] transition-colors cursor-pointer"
            title="Export files (PPTX, PDF, PNG, JPG, CSV, JSON)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {exportOpen && (
            <div 
              id="export-menu-popover"
              className="absolute right-0 top-full mt-1.5 w-60 bg-[#121826] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in zoom-in-95 duration-100"
            >
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Export As
              </div>

              {/* PPTX */}
              <button
                id="menu-btn-export-pptx"
                onClick={() => {
                  setExportOpen(false);
                  onExportPptx();
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-white/[0.06] text-slate-200 cursor-pointer transition-colors"
              >
                <Presentation className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-100">PowerPoint Deck (.pptx)</div>
                  <div className="text-[10px] text-slate-400">10 slides with {activeTheme.name}</div>
                </div>
              </button>

              {/* PDF */}
              <button
                id="menu-btn-export-pdf"
                onClick={() => {
                  setExportOpen(false);
                  onExportPdf();
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-white/[0.06] text-slate-200 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-100">Executive Dossier (.pdf)</div>
                  <div className="text-[10px] text-slate-400">Print-ready multi-page report</div>
                </div>
              </button>

              {/* PNG */}
              <button
                id="menu-btn-export-png"
                onClick={() => {
                  setExportOpen(false);
                  onExportPng();
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-white/[0.06] text-slate-200 cursor-pointer transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-100">Slide Image (.png)</div>
                  <div className="text-[10px] text-slate-400">High-resolution 1080p slide</div>
                </div>
              </button>

              {/* JPG */}
              <button
                id="menu-btn-export-jpg"
                onClick={() => {
                  setExportOpen(false);
                  onExportJpg();
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-white/[0.06] text-slate-200 cursor-pointer transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-100">Slide Graphic (.jpg)</div>
                  <div className="text-[10px] text-slate-400">Compact web-optimized graphic</div>
                </div>
              </button>

              <div className="h-[1px] bg-white/10 my-1 mx-2" />

              {/* CSV */}
              <button
                id="menu-btn-export-csv"
                onClick={() => {
                  setExportOpen(false);
                  onExportCsv();
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-white/[0.06] text-slate-200 cursor-pointer transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-100">Financial Model (.csv)</div>
                  <div className="text-[10px] text-slate-400">12-month unit economics model</div>
                </div>
              </button>

              {/* JSON */}
              <button
                id="menu-btn-export-json"
                onClick={() => {
                  setExportOpen(false);
                  onExportJson();
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-white/[0.06] text-slate-200 cursor-pointer transition-colors"
              >
                <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-100">Project Backup (.json)</div>
                  <div className="text-[10px] text-slate-400">Complete studio data snapshot</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        {onLangChange && (
          <div className="relative" ref={langDropdownRef}>
            <button
              id="btn-lang-switcher"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Change Language (English / French / Arabic)"
            >
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span className="uppercase font-mono text-[11px] font-semibold">{currentLang}</span>
            </button>

            {langOpen && (
              <div 
                id="lang-menu-popover"
                className="absolute right-0 top-full mt-1.5 w-36 bg-[#121826] border border-white/10 rounded-lg shadow-2xl py-1 z-50 text-xs animate-in zoom-in-95 duration-100"
              >
                {[
                  { code: 'en' as const, label: 'English 🇬🇧' },
                  { code: 'fr' as const, label: 'Français 🇫🇷' },
                  { code: 'ar' as const, label: 'العربية 🇸🇦' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onLangChange(item.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-white/[0.06] cursor-pointer ${
                      currentLang === item.code ? 'text-sky-400 font-bold bg-sky-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{item.label}</span>
                    {currentLang === item.code && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Import Button */}
        <button
          id="btn-import-project"
          onClick={onImport}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="Import project from .json file"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
        </button>

        <div className="h-4 w-[1px] bg-white/10 mx-0.5 hidden sm:block" />

        {/* License & Activate Button */}
        {license?.tier === 'Pro Lifetime' ? (
          <button
            id="btn-open-license"
            onClick={onOpenLicense}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
            title="Pro Lifetime Commercial License Active"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline text-[11px] font-bold">Pro Lifetime</span>
          </button>
        ) : (
          <button
            id="btn-open-license"
            onClick={onOpenLicense}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="NEXORA Free Edition ($0) • Upgrade to Pro ($19 Lifetime)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden xl:inline text-[11px] font-medium">Free ($0)</span>
            <span className="hidden md:inline text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-bold">Pro $19</span>
          </button>
        )}

        {/* About Dialog Button */}
        <button
          id="btn-open-about"
          onClick={onOpenAbout}
          className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="About NEXORA Business Design Studio"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {/* Native Windows Controls (if running in Electron) */}
        {isElectron && (
          <div className="flex items-center ml-2 border-l border-white/10 pl-2">
            <button
              id="btn-win-minimize"
              onClick={handleMinimize}
              className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-slate-100 transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-win-maximize"
              onClick={handleMaximize}
              className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-slate-100 transition-colors"
              title="Maximize"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              id="btn-win-close"
              onClick={handleClose}
              className="p-1.5 hover:bg-red-500/80 rounded text-slate-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
