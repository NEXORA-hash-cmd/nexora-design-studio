import { NexoraProject, LicenseInfo } from '../types/project';
import { defaultProject, createEmptyProject } from './defaultProject';

const PROJECTS_KEY = 'nexora_studio_projects_v1';
const ACTIVE_PROJECT_ID_KEY = 'nexora_studio_active_id_v1';
const LICENSE_KEY = 'nexora_studio_license_v1';

export const defaultLicense: LicenseInfo = {
  status: 'active',
  licenseKey: '',
  tier: 'Free',
  licensedTo: '',
};

export function loadAllProjects(): NexoraProject[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) {
      // Seed with initial default project
      const initial = [defaultProject];
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(initial));
      localStorage.setItem(ACTIVE_PROJECT_ID_KEY, defaultProject.id);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((p: NexoraProject) => {
        let name = p.name;
        if (name === 'NexusFlow Business Studio' || name === 'NexusFlow') {
          name = 'NEXORA Business Design Studio';
        }
        return {
          ...p,
          name,
          theme: p.theme || 'modern',
          brand: p.brand || {
            primaryColor: '#0EA5E9',
            fontFamily: 'Inter',
          },
        };
      });
    }
    return [defaultProject];
  } catch {
    return [defaultProject];
  }
}

export function saveAllProjects(projects: NexoraProject[]): boolean {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return true;
  } catch {
    return false;
  }
}

export function getActiveProjectId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
    if (id) return id;
  } catch {
    // Fallback
  }
  return defaultProject.id;
}

export function setActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_ID_KEY, id);
  } catch {
    // Fallback
  }
}

export function saveProject(project: NexoraProject): boolean {
  const projects = loadAllProjects();
  const index = projects.findIndex(p => p.id === project.id);
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.push(updatedProject);
  }

  saveAllProjects(projects);
  setActiveProjectId(project.id);
  return true;
}

export function duplicateProject(projectId: string): NexoraProject {
  const projects = loadAllProjects();
  const target = projects.find(p => p.id === projectId) || defaultProject;
  const newId = `proj_${Date.now()}`;
  const duplicated: NexoraProject = {
    ...JSON.parse(JSON.stringify(target)),
    id: newId,
    name: `${target.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(duplicated);
  saveAllProjects(projects);
  setActiveProjectId(newId);
  return duplicated;
}

export function deleteProject(projectId: string): { remainingProjects: NexoraProject[]; newActiveId: string } {
  let projects = loadAllProjects().filter(p => p.id !== projectId);
  if (projects.length === 0) {
    const fresh = createEmptyProject(undefined, 'New Business Plan');
    projects = [fresh];
  }
  saveAllProjects(projects);
  const newActiveId = projects[0].id;
  setActiveProjectId(newActiveId);
  return { remainingProjects: projects, newActiveId };
}

export function loadLicense(): LicenseInfo {
  try {
    const raw = localStorage.getItem(LICENSE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const key = typeof parsed.licenseKey === 'string' ? parsed.licenseKey.trim() : '';
        // If it was the old demo placeholder key or empty, default to Free $0
        if (!key || key === 'NEXORA-COMMERCIAL-2026-STANDALONE' || parsed.tier === 'Free') {
          return {
            status: 'active',
            licenseKey: '',
            tier: 'Free',
            licensedTo: parsed.licensedTo === 'Registered Commercial Licensee' ? '' : (parsed.licensedTo || ''),
          };
        }
        return {
          status: 'active',
          licenseKey: key,
          tier: 'Pro Lifetime',
          licensedTo: parsed.licensedTo || '',
          activatedAt: parsed.activatedAt,
        };
      }
    }
  } catch {
    // Fallback to default Free license
  }
  return defaultLicense;
}

export function saveLicense(license: LicenseInfo): void {
  try {
    localStorage.setItem(LICENSE_KEY, JSON.stringify(license));
  } catch {
    // Graceful fallback
  }
}
