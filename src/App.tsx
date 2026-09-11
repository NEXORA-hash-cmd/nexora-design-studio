import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { Navigation, ActiveTab } from './components/Navigation';
import { OverviewModule } from './components/OverviewModule';
import { CanvasModule } from './components/CanvasModule';
import { FinancialModule } from './components/FinancialModule';
import { MarketModule } from './components/MarketModule';
import { GtmModule } from './components/GtmModule';
import { PitchModule } from './components/PitchModule';
import { ThemeSelectorModule } from './components/ThemeSelectorModule';
import { ExportCenterModule } from './components/ExportCenterModule';
import { ProjectModal } from './components/ProjectModal';
import { LicenseModal } from './components/LicenseModal';
import { AboutModal } from './components/AboutModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { NexoraProject, LicenseInfo, ThemeId } from './types/project';
import { 
  loadAllProjects, 
  saveProject, 
  getActiveProjectId, 
  setActiveProjectId, 
  duplicateProject, 
  deleteProject, 
  loadLicense, 
  saveLicense 
} from './utils/storage';
import { createEmptyProject, defaultProject } from './utils/defaultProject';
import { 
  exportProjectToJson, 
  exportFinancialsToCsv, 
  exportDocumentToPdf,
  exportProjectToPptx,
  exportSlideToImage,
  validateImportedProject 
} from './utils/exporter';

export default function App() {
  // Projects state
  const [projects, setProjects] = useState<NexoraProject[]>(() => loadAllProjects());
  const [activeProjectId, setCurActiveId] = useState<string>(() => getActiveProjectId());
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentLang, setCurrentLang] = useState<'en' | 'fr' | 'ar'>('en');

  // Modals state
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [license, setLicense] = useState<LicenseInfo>(() => loadLicense());

  // Hidden file input for browser file open fallback
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active project memoized or fallback
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || defaultProject;

  // Language & RTL setting
  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Toast Helper
  const showToast = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Update active project
  const handleUpdateActiveProject = (updated: NexoraProject) => {
    const nextProjects = projects.map((p) => (p.id === updated.id ? updated : p));
    setProjects(nextProjects);
    setHasUnsavedChanges(true);
    // Auto-persist immediately so user never loses data
    saveProject(updated);
  };

  // Switch project theme directly
  const handleThemeSelect = (themeId: ThemeId) => {
    const updated: NexoraProject = {
      ...activeProject,
      theme: themeId,
      updatedAt: new Date().toISOString(),
    };
    handleUpdateActiveProject(updated);
    showToast('success', `Active portfolio theme updated to ${themeId.toUpperCase()}`);
  };

  // Save active project locally
  const handleSave = useCallback(() => {
    saveProject(activeProject);
    setHasUnsavedChanges(false);
    showToast('success', `Saved "${activeProject.name}" successfully`);
  }, [activeProject, showToast]);

  // Save As Handler
  const handleSaveAs = useCallback(() => {
    const duplicated = duplicateProject(activeProject.id);
    const all = loadAllProjects();
    setProjects(all);
    setCurActiveId(duplicated.id);
    setActiveProjectId(duplicated.id);
    setHasUnsavedChanges(false);
    showToast('success', `Saved project copy as "${duplicated.name}"`);
  }, [activeProject, showToast]);

  // Export actions
  const handleExportPptx = useCallback(async () => {
    showToast('info', 'Generating PowerPoint presentation deck...');
    const res = await exportProjectToPptx(activeProject);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  }, [activeProject, showToast]);

  const handleExportPdf = useCallback(async () => {
    showToast('info', 'Generating Executive Business Dossier PDF...');
    const res = await exportDocumentToPdf(activeProject);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  }, [activeProject, showToast]);

  const handleExportPng = useCallback(async () => {
    showToast('info', 'Rendering high-resolution 1080p slide PNG...');
    const res = await exportSlideToImage(activeProject, 'png');
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  }, [activeProject, showToast]);

  const handleExportJpg = useCallback(async () => {
    showToast('info', 'Rendering slide graphic JPG...');
    const res = await exportSlideToImage(activeProject, 'jpg');
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  }, [activeProject, showToast]);

  const handleExportJson = useCallback(async () => {
    const res = await exportProjectToJson(activeProject);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  }, [activeProject, showToast]);

  const handleExportCsv = useCallback(async () => {
    const res = await exportFinancialsToCsv(activeProject);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  }, [activeProject, showToast]);

  // Import project
  const handleImport = useCallback(async () => {
    if (window.electronAPI?.openFile) {
      const res = await window.electronAPI.openFile({
        title: 'Open NEXORA Project File',
        filters: [
          { name: 'NEXORA Project', extensions: ['json', 'nexora'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (res.canceled) return;
      if (!res.success || !res.content) {
        showToast('error', res.error || 'Failed to read file');
        return;
      }

      try {
        const imported = validateImportedProject(res.content);
        setProjects((prev) => [...prev, imported]);
        setCurActiveId(imported.id);
        setActiveProjectId(imported.id);
        saveProject(imported);
        showToast('success', `Imported "${imported.name}" successfully`);
      } catch (err: unknown) {
        const errStr = err instanceof Error ? err.message : 'Invalid JSON format';
        showToast('error', `Import failed: ${errStr}`);
      }
    } else {
      // Fallback: trigger HTML5 file picker
      fileInputRef.current?.click();
    }
  }, [showToast]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = validateImportedProject(content);
        setProjects((prev) => [...prev, imported]);
        setCurActiveId(imported.id);
        setActiveProjectId(imported.id);
        saveProject(imported);
        showToast('success', `Imported "${imported.name}" successfully`);
      } catch (err: unknown) {
        const errStr = err instanceof Error ? err.message : 'Invalid JSON format';
        showToast('error', `Import failed: ${errStr}`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Project management handlers
  const handleSelectProject = (id: string) => {
    setCurActiveId(id);
    setActiveProjectId(id);
    setHasUnsavedChanges(false);
  };

  const handleCreateNewProject = (
    name: string,
    category?: string,
    theme?: ThemeId,
    currency?: string
  ) => {
    const newProj = createEmptyProject(undefined, name, category, theme, currency);
    const updated = [...projects, newProj];
    setProjects(updated);
    setCurActiveId(newProj.id);
    setActiveProjectId(newProj.id);
    saveProject(newProj);
    showToast('success', `Created new venture "${name}"`);
  };

  const handleDuplicateProject = (id: string) => {
    const duplicated = duplicateProject(id);
    setProjects(loadAllProjects());
    setCurActiveId(duplicated.id);
    showToast('success', `Duplicated "${duplicated.name}"`);
  };

  const handleDeleteProject = (id: string) => {
    const { remainingProjects, newActiveId } = deleteProject(id);
    setProjects(remainingProjects);
    setCurActiveId(newActiveId);
    showToast('info', 'Project deleted from storage');
  };

  // License & Currency handlers
  const handleSaveLicense = (updated: LicenseInfo) => {
    setLicense(updated);
    saveLicense(updated);
    showToast('success', 'License details updated');
  };

  const handleCurrencyChange = (code: string, symbol: string) => {
    handleUpdateActiveProject({
      ...activeProject,
      financials: {
        ...activeProject.financials,
        currency: code,
        currencySymbol: symbol,
      },
    });
    showToast('info', `Currency set to ${code} (${symbol})`);
  };

  // Connect Electron IPC Native Menu Action Listener
  useEffect(() => {
    if (window.electronAPI?.onMenuAction) {
      const unsubscribe = window.electronAPI.onMenuAction((action: string) => {
        switch (action) {
          case 'new-project':
            setIsProjectsModalOpen(true);
            break;
          case 'import-project':
            handleImport();
            break;
          case 'save-project':
            handleSave();
            break;
          case 'export-json':
            handleExportJson();
            break;
          case 'export-csv':
            handleExportCsv();
            break;
          case 'export-pdf':
            handleExportPdf();
            break;
          case 'open-license':
            setIsLicenseModalOpen(true);
            break;
          case 'open-about':
            setIsAboutModalOpen(true);
            break;
        }
      });
      return () => unsubscribe();
    }
  }, [handleSave, handleImport, handleExportJson, handleExportCsv, handleExportPdf]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsProjectsModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleImport();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setActiveTab('export');
      } else if (e.key === 'Escape') {
        setIsProjectsModalOpen(false);
        setIsLicenseModalOpen(false);
        setIsAboutModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleImport]);

  return (
    <div id="nexora-app-root" className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans antialiased select-auto">
      {/* Hidden browser file input fallback */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".json,.nexora"
        className="hidden"
      />

      {/* Top Application Bar */}
      <TitleBar
        project={activeProject}
        hasUnsavedChanges={hasUnsavedChanges}
        license={license}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onNewProject={() => setIsProjectsModalOpen(true)}
        onOpenProjects={() => setIsProjectsModalOpen(true)}
        onOpenThemeSelector={() => setActiveTab('themes')}
        onExportPptx={handleExportPptx}
        onExportPdf={handleExportPdf}
        onExportPng={handleExportPng}
        onExportJpg={handleExportJpg}
        onExportJson={handleExportJson}
        onExportCsv={handleExportCsv}
        onImport={handleImport}
        onOpenLicense={() => setIsLicenseModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
      />

      {/* Studio Navigation Tabs */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        lang={currentLang}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 overflow-y-auto pb-12">
        {activeTab === 'overview' && (
          <OverviewModule
            project={activeProject}
            onChange={handleUpdateActiveProject}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'canvas' && (
          <CanvasModule
            project={activeProject}
            onChange={handleUpdateActiveProject}
          />
        )}

        {activeTab === 'financials' && (
          <FinancialModule
            project={activeProject}
            onChange={handleUpdateActiveProject}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'market' && (
          <MarketModule
            project={activeProject}
            onChange={handleUpdateActiveProject}
          />
        )}

        {activeTab === 'gtm' && (
          <GtmModule
            project={activeProject}
            onChange={handleUpdateActiveProject}
          />
        )}

        {activeTab === 'pitch' && (
          <PitchModule
            project={activeProject}
            onChange={handleUpdateActiveProject}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'themes' && (
          <ThemeSelectorModule
            project={activeProject}
            onThemeSelect={handleThemeSelect}
            onUpdateProject={handleUpdateActiveProject}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'export' && (
          <ExportCenterModule
            project={activeProject}
            license={license}
            onOpenLicense={() => setIsLicenseModalOpen(true)}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Modals */}
      {isProjectsModalOpen && (
        <ProjectModal
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={handleSelectProject}
          onCreateNewProject={handleCreateNewProject}
          onDuplicateProject={handleDuplicateProject}
          onDeleteProject={handleDeleteProject}
          onImportProject={handleImport}
          onClose={() => setIsProjectsModalOpen(false)}
        />
      )}

      {isLicenseModalOpen && (
        <LicenseModal
          license={license}
          onSaveLicense={handleSaveLicense}
          currency={activeProject.financials.currency}
          currencySymbol={activeProject.financials.currencySymbol}
          onCurrencyChange={handleCurrencyChange}
          onClose={() => setIsLicenseModalOpen(false)}
        />
      )}

      {isAboutModalOpen && (
        <AboutModal
          license={license}
          onClose={() => setIsAboutModalOpen(false)}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
