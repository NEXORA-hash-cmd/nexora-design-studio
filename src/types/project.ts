export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF';

export interface CanvasItem {
  id: string;
  text: string;
  category?: 'primary' | 'secondary' | 'opportunity' | 'risk';
}

export interface CanvasBlock {
  title: string;
  subtitle: string;
  description: string;
  items: CanvasItem[];
}

export interface BusinessCanvas {
  valuePropositions: CanvasBlock;
  customerSegments: CanvasBlock;
  channels: CanvasBlock;
  customerRelationships: CanvasBlock;
  revenueStreams: CanvasBlock;
  keyActivities: CanvasBlock;
  keyResources: CanvasBlock;
  keyPartners: CanvasBlock;
  costStructure: CanvasBlock;
}

export interface FinancialModel {
  currency: string;
  currencySymbol: string;
  pricingPerUnit: number;
  cogsPerUnit: number;
  cac: number;
  averageCustomerLifespanMonths: number;
  monthlyFixedCosts: {
    payroll: number;
    softwareHosting: number;
    marketingBudget: number;
    officeMisc: number;
  };
  startingCapital: number;
  currentCustomers: number;
  projectedMonthlyGrowthRate: number; // percentage, e.g. 10 for 10%
}

export interface Competitor {
  id: string;
  name: string;
  pricing: string;
  marketShare: string;
  strengths: string;
  weaknesses: string;
  differentiator: string;
}

export interface CustomerPersona {
  role: string;
  industry: string;
  companySize: string;
  primaryPainPoint: string;
  budgetOwner: string;
  buyingTrigger: string;
  successMetric: string;
}

export interface MarketAnalysis {
  tamValue: number; // Total Addressable Market in millions
  tamDescription: string;
  samValue: number; // Serviceable Addressable Market in millions
  samDescription: string;
  somValue: number; // Serviceable Obtainable Market in millions
  somDescription: string;
  icp: CustomerPersona;
  competitors: Competitor[];
}

export interface GtmChannel {
  id: string;
  name: string;
  type: 'Inbound' | 'Outbound' | 'Paid' | 'Product-Led' | 'Partnerships';
  priority: 'High' | 'Medium' | 'Low';
  estimatedCac: number;
  projectedConversionRate: number; // percentage
  status: 'Active' | 'Planned' | 'Testing';
}

export interface GtmMilestone {
  id: string;
  phase: 'Phase 1: Validation' | 'Phase 2: Beta Launch' | 'Phase 3: Commercial GTM' | 'Phase 4: Scale';
  title: string;
  targetDate: string;
  completed: boolean;
}

export interface GtmStrategy {
  channels: GtmChannel[];
  milestones: GtmMilestone[];
  targetAudienceMessage: string;
  coreHook: string;
}

export interface PitchDeck {
  problemSummary: string;
  solutionSummary: string;
  marketTiming: string;
  businessModelSummary: string;
  competitiveMoat: string;
  financialMilestone12mo: string;
  capitalAsk: number;
  fundAllocation: string;
}

export type ThemeId = 'executive' | 'modern' | 'minimal' | 'bold';

export interface ThemeStructure {
  layout: {
    coverStyle: 'split-hero' | 'classic-centered' | 'minimal-editorial' | 'bold-impact';
    contentLayout: 'card-grid' | 'structured-rows' | 'asymmetric-split' | 'high-contrast-blocks';
    cardRadius: string;
    cardBorderWidth: number;
    spacing: 'compact' | 'balanced' | 'spacious';
  };
  shapes: {
    accentGeometry: 'sharp' | 'curved' | 'pill' | 'chamfered';
    dividerStyle: 'solid' | 'dashed' | 'gradient' | 'hairline';
    decorations: boolean;
  };
  coverPage: {
    alignment: 'left' | 'center' | 'right';
    badgeStyle: string;
    showMetaGrid: boolean;
    heroBannerHeight: string;
  };
  contentPages: {
    tableHeaderBg: string;
    gridGap: string;
    cardPadding: string;
    sectionStyle: string;
  };
  closingPage: {
    ctaStyle: 'hero-card' | 'minimalist-center' | 'executive-memo' | 'action-banner';
    buttonColor: string;
    buttonTextColor: string;
    contactLayout: 'horizontal-bar' | 'two-column' | 'boxed-footer';
  };
  icons: {
    strokeWidth: number;
    containerShape: 'circle' | 'square' | 'rounded-lg' | 'none';
  };
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  category: string;
  description: string;
  palette: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    cardBorder: string;
    textPrimary: string;
    textMuted: string;
    badgeBg: string;
    badgeText: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingWeight: string;
    styleClass: string;
  };
  structure?: ThemeStructure;
  pptx: {
    bgColor: string;
    cardColor: string;
    primaryHex: string;
    accentHex: string;
    textHex: string;
    mutedHex: string;
    fontFace: string;
  };
}

export interface BrandInfo {
  founder?: string;
  teamSize?: string;
  foundedYear?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  mission?: string;
  vision?: string;
  coreValues?: string[];
  logoUrl?: string;
  primaryColor?: string;
  fontFamily?: string;
}

export interface NexoraProject {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  category?: string;
  theme?: ThemeId;
  brand?: BrandInfo;
  stage: 'Concept' | 'Validation' | 'MVP' | 'Growth' | 'Scaling';
  createdAt: string;
  updatedAt: string;
  canvas: BusinessCanvas;
  financials: FinancialModel;
  market: MarketAnalysis;
  gtm: GtmStrategy;
  pitch: PitchDeck;
  notes: string;
  exportSettings?: {
    watermark?: boolean;
    includeFinancials?: boolean;
    includeCompetitors?: boolean;
    includeCanvas?: boolean;
    includeGtm?: boolean;
    includePitch?: boolean;
    format?: string;
    resolution?: string;
  };
}

export interface LicenseInfo {
  status: 'active' | 'demo' | 'trial';
  licenseKey: string;
  tier: 'Free' | 'Pro Lifetime' | 'Commercial Desktop Edition' | 'Pro Studio' | 'Evaluation';
  activatedAt?: string;
  licensedTo: string;
}
