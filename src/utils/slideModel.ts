import { NexoraProject, ThemeConfig, ThemeId } from '../types/project';
import { getTheme } from '../data/themes';

/**
 * Normalized 16:9 Slide Coordinate System
 * Exact 1-to-1 mapping between Logical Screen Canvas (1600x900 px)
 * and Standard Widescreen PowerPoint Layout (13.333 x 7.5 inches)
 * 
 * 1600 px / 13.333 in = 120 px/inch
 * 900 px  / 7.5 in    = 120 px/inch
 */
export const LOGICAL_W = 1600;
export const LOGICAL_H = 900;

export const SLIDE_W = 13.333;
export const SLIDE_H = 7.5;

// Margins / Safe area in inches (per user specification)
export const LEFT_INCH = 0.45;
export const RIGHT_INCH = 0.45;
export const TOP_INCH = 0.35;
export const BOTTOM_INCH = 0.35;

export const SAFE_W_INCH = SLIDE_W - LEFT_INCH - RIGHT_INCH; // 12.433 inches
export const SAFE_H_INCH = SLIDE_H - TOP_INCH - BOTTOM_INCH; // 6.800 inches

// Margins in logical pixels (120 px per inch)
export const LEFT_PX = Math.round(LEFT_INCH * 120);     // 54 px
export const RIGHT_PX = Math.round(RIGHT_INCH * 120);   // 54 px
export const TOP_PX = Math.round(TOP_INCH * 120);       // 42 px
export const BOTTOM_PX = Math.round(BOTTOM_INCH * 120); // 42 px

export const SAFE_W_PX = LOGICAL_W - LEFT_PX - RIGHT_PX; // 1492 px
export const SAFE_H_PX = LOGICAL_H - TOP_PX - BOTTOM_PX; // 816 px

// Coordinate conversion helpers
export function toPptxX(px: number): number {
  return Number(((px / LOGICAL_W) * SLIDE_W).toFixed(3));
}

export function toPptxY(px: number): number {
  return Number(((px / LOGICAL_H) * SLIDE_H).toFixed(3));
}

export function toPptxW(px: number): number {
  return Number(((px / LOGICAL_W) * SLIDE_W).toFixed(3));
}

export function toPptxH(px: number): number {
  return Number(((px / LOGICAL_H) * SLIDE_H).toFixed(3));
}

/**
 * Adaptive font size computation ensuring titles never overflow their bounding box
 */
export function computeTitleFontSize(text: string, baseSize: number = 44): number {
  const len = (text || '').trim().length;
  if (len <= 18) return baseSize;
  if (len <= 28) return Math.round(baseSize * 0.85); // e.g. 37pt
  if (len <= 40) return Math.round(baseSize * 0.72); // e.g. 32pt
  if (len <= 60) return Math.round(baseSize * 0.60); // e.g. 26pt
  return Math.max(20, Math.round(baseSize * 0.50));
}

export interface SlideDescriptor {
  id: number;
  slug: string;
  number: string;
  name: string;
  subtitle: string;
}

export const SLIDE_TEMPLATES: SlideDescriptor[] = [
  { id: 0, slug: 'cover', number: '01', name: 'Cover', subtitle: 'Executive Presentation & Vision' },
  { id: 1, slug: 'overview', number: '02', name: 'Business Overview', subtitle: 'Executive Summary & Thesis' },
  { id: 2, slug: 'problem', number: '03', name: 'Problem', subtitle: 'Market Friction & Inefficiencies' },
  { id: 3, slug: 'solution', number: '04', name: 'Solution', subtitle: 'Value Proposition & Innovation' },
  { id: 4, slug: 'customer', number: '05', name: 'Target Customer', subtitle: 'Ideal Customer Profile (ICP)' },
  { id: 5, slug: 'market', number: '06', name: 'Market', subtitle: 'TAM / SAM / SOM Opportunity' },
  { id: 6, slug: 'canvas', number: '07', name: 'Business Model', subtitle: '9-Block Strategic Blueprint' },
  { id: 7, slug: 'gtm', number: '08', name: 'Marketing Strategy', subtitle: 'Go-To-Market & Acquisition' },
  { id: 8, slug: 'operations', number: '09', name: 'Operations', subtitle: 'Key Activities & Delivery' },
  { id: 9, slug: 'financials', number: '10', name: 'Financial Plan', subtitle: 'Unit Economics & Economics' },
  { id: 10, slug: 'roadmap', number: '11', name: 'Roadmap', subtitle: 'Strategic Milestones & Growth' },
  { id: 11, slug: 'cta', number: '12', name: 'Final / Call to Action', subtitle: 'Capital Ask, Deployment & Next Steps' },
];
