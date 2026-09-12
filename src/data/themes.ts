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
    structure: {
      layout: {
        coverStyle: 'split-hero',
        contentLayout: 'card-grid',
        cardRadius: 'rounded-xl',
        cardBorderWidth: 1,
        spacing: 'balanced',
      },
      shapes: {
        accentGeometry: 'pill',
        dividerStyle: 'gradient',
        decorations: true,
      },
      coverPage: {
        alignment: 'left',
        badgeStyle: 'bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full px-3 py-1',
        showMetaGrid: true,
        heroBannerHeight: 'h-auto',
      },
      contentPages: {
        tableHeaderBg: '#0E1526',
        gridGap: 'gap-4',
        cardPadding: 'p-4',
        sectionStyle: 'border-b border-sky-500/20 pb-2',
      },
      closingPage: {
        ctaStyle: 'hero-card',
        buttonColor: '#0284C7',
        buttonTextColor: '#FFFFFF',
        contactLayout: 'boxed-footer',
      },
      icons: {
        strokeWidth: 2,
        containerShape: 'rounded-lg',
      },
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
    structure: {
      layout: {
        coverStyle: 'classic-centered',
        contentLayout: 'structured-rows',
        cardRadius: 'rounded-none',
        cardBorderWidth: 1,
        spacing: 'spacious',
      },
      shapes: {
        accentGeometry: 'sharp',
        dividerStyle: 'solid',
        decorations: false,
      },
      coverPage: {
        alignment: 'center',
        badgeStyle: 'bg-slate-800 text-slate-200 border border-slate-600 px-3 py-1 uppercase tracking-wider',
        showMetaGrid: true,
        heroBannerHeight: 'h-auto',
      },
      contentPages: {
        tableHeaderBg: '#111728',
        gridGap: 'gap-6',
        cardPadding: 'p-5',
        sectionStyle: 'border-b border-slate-600/40 pb-3',
      },
      closingPage: {
        ctaStyle: 'executive-memo',
        buttonColor: '#3B82F6',
        buttonTextColor: '#FFFFFF',
        contactLayout: 'two-column',
      },
      icons: {
        strokeWidth: 1.5,
        containerShape: 'square',
      },
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
    structure: {
      layout: {
        coverStyle: 'minimal-editorial',
        contentLayout: 'asymmetric-split',
        cardRadius: 'rounded-lg',
        cardBorderWidth: 1,
        spacing: 'spacious',
      },
      shapes: {
        accentGeometry: 'pill',
        dividerStyle: 'hairline',
        decorations: false,
      },
      coverPage: {
        alignment: 'left',
        badgeStyle: 'bg-zinc-800/40 text-zinc-400 border border-zinc-700/50 rounded px-2.5 py-0.5',
        showMetaGrid: true,
        heroBannerHeight: 'h-auto',
      },
      contentPages: {
        tableHeaderBg: '#161920',
        gridGap: 'gap-5',
        cardPadding: 'p-5',
        sectionStyle: 'border-b border-zinc-800 pb-2.5',
      },
      closingPage: {
        ctaStyle: 'minimalist-center',
        buttonColor: '#F4F4F5',
        buttonTextColor: '#0F1115',
        contactLayout: 'horizontal-bar',
      },
      icons: {
        strokeWidth: 1.5,
        containerShape: 'circle',
      },
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
    structure: {
      layout: {
        coverStyle: 'bold-impact',
        contentLayout: 'high-contrast-blocks',
        cardRadius: 'rounded-2xl',
        cardBorderWidth: 2,
        spacing: 'compact',
      },
      shapes: {
        accentGeometry: 'sharp',
        dividerStyle: 'solid',
        decorations: true,
      },
      coverPage: {
        alignment: 'left',
        badgeStyle: 'bg-amber-500/30 text-amber-300 border-2 border-amber-500/50 rounded-lg px-3 py-1 font-black',
        showMetaGrid: true,
        heroBannerHeight: 'h-auto',
      },
      contentPages: {
        tableHeaderBg: '#1E1712',
        gridGap: 'gap-4',
        cardPadding: 'p-4',
        sectionStyle: 'border-b-2 border-amber-500/50 pb-2',
      },
      closingPage: {
        ctaStyle: 'action-banner',
        buttonColor: '#F59E0B',
        buttonTextColor: '#120F0C',
        contactLayout: 'boxed-footer',
      },
      icons: {
        strokeWidth: 2.5,
        containerShape: 'rounded-lg',
      },
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
