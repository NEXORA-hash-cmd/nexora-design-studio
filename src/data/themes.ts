import { ThemeConfig, ThemeId } from '../types/project';

export const NEXORA_THEMES: Record<ThemeId, ThemeConfig> = {
  modern: {
    id: 'modern',
    name: 'Modern Venture',
    category: 'Technology & SaaS',
    description: 'Electric cyan and deep navy with high-contrast telemetry cards, rounded tech borders, and crisp data pills.',
    palette: {
      primary: '#0284C7', // Sky 600
      accent: '#00F2FE', // Neon Cyan
      background: '#070B14',
      surface: '#0E1526',
      cardBorder: 'border-sky-500/30',
      textPrimary: '#F8FAFC',
      textMuted: '#94A3B8',
      badgeBg: 'bg-sky-500/15',
      badgeText: 'text-sky-300',
    },
    typography: {
      headingFont: 'font-sans font-extrabold tracking-tight',
      bodyFont: 'font-sans',
      headingWeight: 'font-bold',
      styleClass: 'theme-modern',
    },
    pptx: {
      bgColor: '070B14',
      cardColor: '0E1526',
      primaryHex: '0284C7',
      accentHex: '00F2FE',
      textHex: 'F8FAFC',
      mutedHex: '94A3B8',
      fontFace: 'Arial',
    },
  },
  executive: {
    id: 'executive',
    name: 'Executive Platinum',
    category: 'Corporate & Advisory',
    description: 'Sophisticated platinum and obsidian corporate grid. Structured memo layouts, refined typography, and high-trust framing.',
    palette: {
      primary: '#3B82F6', // Blue 500
      accent: '#E2E8F0', // Platinum Slate
      background: '#0B0F19',
      surface: '#111728',
      cardBorder: 'border-slate-600/40',
      textPrimary: '#FFFFFF',
      textMuted: '#A0AEC0',
      badgeBg: 'bg-slate-700/40',
      badgeText: 'text-slate-200',
    },
    typography: {
      headingFont: 'font-serif font-semibold tracking-wide',
      bodyFont: 'font-sans',
      headingWeight: 'font-semibold',
      styleClass: 'theme-executive',
    },
    pptx: {
      bgColor: '0B0F19',
      cardColor: '111728',
      primaryHex: '3B82F6',
      accentHex: 'E2E8F0',
      textHex: 'FFFFFF',
      mutedHex: 'A0AEC0',
      fontFace: 'Georgia',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Nordic Minimal',
    category: 'Design & Consumer',
    description: 'Clean Scandinavian editorial layout with generous negative space, crisp hairline dividers, and distraction-free typography.',
    palette: {
      primary: '#71717A', // Zinc 500
      accent: '#F4F4F5', // Chalk White
      background: '#0F1115',
      surface: '#161920',
      cardBorder: 'border-zinc-800/80',
      textPrimary: '#FAFAFA',
      textMuted: '#A1A1AA',
      badgeBg: 'bg-zinc-800/60',
      badgeText: 'text-zinc-300',
    },
    typography: {
      headingFont: 'font-sans font-light tracking-normal',
      bodyFont: 'font-sans font-normal',
      headingWeight: 'font-light',
      styleClass: 'theme-minimal',
    },
    pptx: {
      bgColor: '0F1115',
      cardColor: '161920',
      primaryHex: '71717A',
      accentHex: 'F4F4F5',
      textHex: 'FAFAFA',
      mutedHex: 'A1A1AA',
      fontFace: 'Calibri',
    },
  },
  bold: {
    id: 'bold',
    name: 'Vanguard Bold',
    category: 'High-Impact & Startup',
    description: 'High-octane amber and obsidian with oversized typography, radiant metric callouts, and heavy commercial confidence.',
    palette: {
      primary: '#F59E0B', // Amber 500
      accent: '#FBBF24', // Warm Gold
      background: '#120F0C',
      surface: '#1E1712',
      cardBorder: 'border-amber-500/40',
      textPrimary: '#FFFDF5',
      textMuted: '#D97706',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
    },
    typography: {
      headingFont: 'font-sans font-black tracking-tight uppercase',
      bodyFont: 'font-sans',
      headingWeight: 'font-black',
      styleClass: 'theme-bold',
    },
    pptx: {
      bgColor: '120F0C',
      cardColor: '1E1712',
      primaryHex: 'F59E0B',
      accentHex: 'FBBF24',
      textHex: 'FFFDF5',
      mutedHex: 'D97706',
      fontFace: 'Trebuchet MS',
    },
  },
};

export function getTheme(themeId?: string): ThemeConfig {
  if (themeId && themeId in NEXORA_THEMES) {
    return NEXORA_THEMES[themeId as ThemeId];
  }
  return NEXORA_THEMES.modern;
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(NEXORA_THEMES);
}
