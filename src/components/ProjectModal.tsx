import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Copy, 
  Trash2, 
  FolderKanban, 
  Check, 
  Upload, 
  AlertTriangle,
  Palette,
  Calendar,
  Layers,
  ArrowRight,
  Search,
  Sparkles
} from 'lucide-react';
import { NexoraProject, ThemeId } from '../types/project';
import { NEXORA_THEMES, getTheme } from '../data/themes';
import { INDUSTRY_PACKS } from '../data/industryPacks';

interface ProjectModalProps {
  projects: NexoraProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateNewProject: (name: string, category?: string, theme?: ThemeId, currency?: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onImportProject: () => void;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateNewProject,
  onDuplicateProject,
  onDeleteProject,
  onImportProject,
  onClose,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<NexoraProject | null>(null);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SaaS / Software');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('modern');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateNewProject(newProjectName.trim(), selectedCategory, selectedTheme, selectedCurrency);
    setNewProjectName('');
    setIsCreating(false);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.industry || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="modal-projects-overlay" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-projects-container"
        className="bg-[#101626] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0C1220] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Project Workspace Dashboard</h2>
              <p className="text-xs text-slate-400">Saved ventures, blueprints, and portfolio templates.</p>
            </div>
          </div>
          <button
            id="btn-close-project-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls & Search */}
        <div className="p-6 pb-2 border-b border-white/[0.06] bg-[#0E1524] space-y-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                id="btn-trigger-new-project"
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-sky-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Business Venture</span>
              </button>

              <button
                id="btn-import-project-file"
                onClick={onImportProject}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Import Backup</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ventures..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          {/* New Project Guided Form */}
          {isCreating && (
            <form 
              id="form-create-new-project"
              onSubmit={handleCreateSubmit}
              className="bg-[#121B2F] border border-sky-500/30 rounded-xl p-4 space-y-4 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Configure New Business Venture</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Venture Name *</label>
                  <input
                    id="input-new-venture-name"
                    type="text"
                    required
                    autoFocus
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Apex Workflow Systems"
                    className="w-full px-3 py-2 rounded-lg bg-[#090D17] border border-white/10 text-xs text-white focus:outline-none focus:border-sky-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Business Category / Industry</label>
                  <select
                    id="select-new-venture-category"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      const pack = INDUSTRY_PACKS.find(p => p.name === e.target.value);
                      if (pack) setSelectedTheme(pack.recommendedTheme);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D17] border border-white/10 text-xs text-white focus:outline-none focus:border-sky-400 transition-colors cursor-pointer"
                  >
                    {INDUSTRY_PACKS.map(pack => (
                      <option key={pack.id} value={pack.name} className="bg-[#121826]">
                        {pack.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Design Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(NEXORA_THEMES).map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
                          selectedTheme === theme.id
                            ? 'bg-sky-500/20 border-sky-400 text-white'
                            : 'bg-[#090D17] border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: theme.palette.primary }} 
                        />
                        <span className="truncate">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Base Currency</label>
                  <select
                    id="select-new-venture-currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D17] border border-white/10 text-xs text-white focus:outline-none focus:border-sky-400 transition-colors cursor-pointer"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="CAD">CAD ($) - Canadian Dollar</option>
                    <option value="AUD">AUD ($) - Australian Dollar</option>
                    <option value="DZD">DZD (د.ج) - Algerian Dinar</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                    <option value="SAR">SAR (﷼) - Saudi Riyal</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create & Open Venture</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Project Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FolderKanban className="w-8 h-8 mx-auto opacity-40 text-slate-500" />
              <div className="text-sm font-semibold text-slate-300">No matching projects found</div>
              <p className="text-xs text-slate-500">Create a new business venture to get started.</p>
            </div>
          ) : (
            filteredProjects.map((p) => {
              const isActive = p.id === activeProjectId;
              const projectTheme = getTheme(p.theme);
              const lastUpdated = new Date(p.updatedAt || p.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={p.id}
                  id={`project-card-${p.id}`}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-sky-500/[0.08] border-sky-500/40 shadow-md'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06]'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white truncate max-w-[280px]">
                        {p.name}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Current Active</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 truncate max-w-lg">
                      {p.tagline || 'Business Architecture System'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-300">
                        {p.category || p.industry || 'Business'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: projectTheme.palette.primary }} 
                        />
                        <span>{projectTheme.name}</span>
                      </div>

                      <span className="text-slate-500">Stage: {p.stage}</span>
                      <span className="text-slate-500">Updated: {lastUpdated}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!isActive && (
                      <button
                        id={`btn-open-project-${p.id}`}
                        onClick={() => {
                          onSelectProject(p.id);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Open Venture</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      id={`btn-duplicate-project-${p.id}`}
                      onClick={() => onDuplicateProject(p.id)}
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {projects.length > 1 && (
                      <button
                        id={`btn-delete-project-${p.id}`}
                        onClick={() => setProjectToDelete(p)}
                        className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/[0.06] transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Delete Confirmation Modal Overlay */}
        {projectToDelete && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-in fade-in">
            <div className="bg-[#141B2D] border border-red-500/40 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Business Venture?</h3>
                  <p className="text-xs text-slate-400">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Are you sure you want to permanently delete <strong className="text-white">"{projectToDelete.name}"</strong>? All associated financial models, canvas items, and market research will be removed.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-delete-project"
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
