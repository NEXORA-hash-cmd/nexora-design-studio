import React, { useRef, useState, useEffect } from 'react';
import { NexoraProject, ThemeConfig } from '../types/project';
import { getTheme } from '../data/themes';
import {
  LOGICAL_W,
  LOGICAL_H,
  computeTitleFontSize,
  SLIDE_TEMPLATES,
  LEFT_PX,
  RIGHT_PX,
  TOP_PX,
  BOTTOM_PX,
  SAFE_W_PX,
  SAFE_H_PX,
} from '../utils/slideModel';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  TrendingUp,
  Target,
  Users,
  Layers,
  DollarSign,
  Compass,
} from 'lucide-react';

interface SlidePreviewProps {
  project: NexoraProject;
  slideIndex: number;
  themeOverride?: ThemeConfig;
  id?: string;
  className?: string;
  showControls?: boolean;
  onSlideChange?: (index: number) => void;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({
  project,
  slideIndex,
  themeOverride,
  id = 'presentation-slide-canvas',
  className = '',
  showControls = false,
  onSlideChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    measure();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });

    observer.observe(el);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const activeTheme = themeOverride || getTheme(project.theme);
  const pptx = {
    bgColor: activeTheme.pptx.bgColor,
    cardBg: activeTheme.pptx.cardColor,
    cardColor: activeTheme.pptx.cardColor,
    primaryColor: activeTheme.pptx.primaryHex,
    primaryHex: activeTheme.pptx.primaryHex,
    accentColor: activeTheme.pptx.accentHex,
    accentHex: activeTheme.pptx.accentHex,
    textColor: activeTheme.pptx.textHex,
    textHex: activeTheme.pptx.textHex,
    mutedColor: activeTheme.pptx.mutedHex,
    mutedHex: activeTheme.pptx.mutedHex,
    fontFace: activeTheme.pptx.fontFace || 'Arial',
  };

  // Exact 16:9 responsive scale factor
  const scale =
    containerSize.width > 0 && containerSize.height > 0
      ? Math.min(containerSize.width / LOGICAL_W, containerSize.height / LOGICAL_H)
      : 0.5;

  const renderedWidth = Math.max(1, Math.round(LOGICAL_W * scale));
  const renderedHeight = Math.max(1, Math.round(LOGICAL_H * scale));

  const fin = project.financials;
  const price = fin.pricingPerUnit || 100;
  const cogs = fin.cogsPerUnit || 20;
  const margin = price > 0 ? Math.round(((price - cogs) / price) * 100) : 0;
  const fixedBurn =
    (fin.monthlyFixedCosts?.payroll || 0) +
    (fin.monthlyFixedCosts?.softwareHosting || 0) +
    (fin.monthlyFixedCosts?.marketingBudget || 0) +
    (fin.monthlyFixedCosts?.officeMisc || 0);
  const grossPerUnit = price - cogs;
  const breakevenUnits = grossPerUnit > 0 ? Math.ceil(fixedBurn / grossPerUnit) : 0;

  const currentTemplate = SLIDE_TEMPLATES[slideIndex] || SLIDE_TEMPLATES[0];

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {/* 16:9 Responsive Viewport Container */}
      <div
        ref={containerRef}
        id="presentation-slide-viewport"
        className="w-full relative flex items-center justify-center overflow-hidden rounded-2xl bg-[#070B14]/80 border border-white/[0.08] shadow-2xl p-2 sm:p-4"
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          maxHeight: '75vh',
        }}
      >
        {/* Rendered Slide Scaled Boundary */}
        <div
          style={{
            width: `${renderedWidth}px`,
            height: `${renderedHeight}px`,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '10px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          }}
        >
          {/* Canonical 1600x900 Logical Canvas */}
          <div
            id={id}
            data-slide-index={slideIndex}
            style={{
              width: `${LOGICAL_W}px`,
              height: `${LOGICAL_H}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: `#${pptx.bgColor}`,
              color: `#${pptx.textColor}`,
              fontFamily: activeTheme.typography?.bodyFont || 'system-ui, -apple-system, sans-serif',
              userSelect: 'none',
            }}
          >
            {/* ========================================== */}
            {/* SLIDE 0: COVER PRESENTATION */}
            {/* ========================================== */}
            {slideIndex === 0 && (
              <div className="w-full h-full relative overflow-hidden flex flex-col justify-between">
                {/* Top Accent Line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '14px',
                    backgroundColor: `#${pptx.primaryColor}`,
                  }}
                />

                {/* Main Content Area */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '90px',
                    width: `${SAFE_W_PX}px`,
                  }}
                >
                  {/* Eyebrow / Tag */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      border: `1px solid #${pptx.primaryColor}55`,
                      backgroundColor: `#${pptx.primaryColor}20`,
                      color: `#${pptx.accentColor}`,
                      fontSize: '15px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '28px',
                    }}
                  >
                    <span>NEXORA COMMERCIAL PORTFOLIO • {activeTheme.name.toUpperCase()}</span>
                  </div>

                  {/* Adaptive Project Name */}
                  <h1
                    style={{
                      fontSize: `${computeTitleFontSize(project.name, 56)}px`,
                      fontWeight: 900,
                      color: `#${pptx.textColor}`,
                      lineHeight: 1.15,
                      letterSpacing: '-0.03em',
                      marginBottom: '20px',
                      maxWidth: '1400px',
                      wordBreak: 'break-word',
                    }}
                  >
                    {project.name}
                  </h1>

                  {/* Mission / Tagline */}
                  <p
                    style={{
                      fontSize: '24px',
                      color: `#${pptx.mutedColor}`,
                      lineHeight: 1.5,
                      maxWidth: '1200px',
                    }}
                  >
                    {project.tagline ||
                      'Strategic Business Model, Unit Economics & Commercial Execution Architecture.'}
                  </p>
                </div>

                {/* Bottom Metadata Card */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    bottom: `${BOTTOM_PX + 48}px`,
                    width: `${SAFE_W_PX}px`,
                    height: '140px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: `1px solid #${pptx.primaryColor}66`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '0 40px',
                  }}
                >
                  <div className="text-center">
                    <div style={{ fontSize: '13px', color: `#${pptx.mutedColor}`, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Industry Sector
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: `#${pptx.textColor}`, marginTop: '6px' }}>
                      {project.industry || 'Technology'}
                    </div>
                  </div>

                  <div style={{ width: '1px', height: '60px', backgroundColor: `#${pptx.primaryColor}40` }} />

                  <div className="text-center">
                    <div style={{ fontSize: '13px', color: `#${pptx.mutedColor}`, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Commercial Stage
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: `#${pptx.textColor}`, marginTop: '6px' }}>
                      {project.stage}
                    </div>
                  </div>

                  <div style={{ width: '1px', height: '60px', backgroundColor: `#${pptx.primaryColor}40` }} />

                  <div className="text-center">
                    <div style={{ fontSize: '13px', color: `#${pptx.mutedColor}`, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Effective Date
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: `#${pptx.textColor}`, marginTop: '6px' }}>
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ width: '1px', height: '60px', backgroundColor: `#${pptx.primaryColor}40` }} />

                  <div className="text-center">
                    <div style={{ fontSize: '13px', color: `#${pptx.mutedColor}`, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Financial Standard
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: `#${pptx.accentColor}`, marginTop: '6px' }}>
                      {fin.currency || 'USD'} ({fin.currencySymbol || '$'})
                    </div>
                  </div>
                </div>

                {/* Standard Attribution Footer */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    bottom: `${BOTTOM_PX}px`,
                    width: `${SAFE_W_PX}px`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    color: `#${pptx.mutedColor}`,
                    fontWeight: 600,
                  }}
                >
                  <span>NEXORA Business Design Studio • Professional Widescreen Dossier</span>
                  <span>CONFIDENTIAL & PROPRIETARY</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 1: BUSINESS OVERVIEW */}
            {/* ========================================== */}
            {slideIndex === 1 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    02 / BUSINESS OVERVIEW
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Executive Summary & Strategic Thesis
                  </h2>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '175px',
                    width: `${SAFE_W_PX}px`,
                    height: '240px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: `1.5px solid #${pptx.primaryColor}`,
                    borderRadius: '16px',
                    padding: '32px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    CORE VALUE PROPOSITION & STRATEGIC POSITIONING
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: `#${pptx.textColor}`, lineHeight: 1.4 }}>
                    {project.tagline || `${project.name} delivers an integrated, structured platform designed for sustainable commercial scale.`}
                  </div>
                  <div style={{ fontSize: '15px', color: `#${pptx.mutedColor}`, marginTop: '12px', lineHeight: 1.6 }}>
                    {project.brand?.mission || project.pitch.solutionSummary || 'Architected to streamline operational execution, drive rapid margin expansion, and build long-term enterprise value.'}
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '445px',
                    width: `${SAFE_W_PX}px`,
                    height: '360px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '24px',
                  }}
                >
                  {[
                    { label: 'Industry & Sector', val: project.industry || 'Technology', desc: `Operating in the ${project.stage} stage of commercialization.` },
                    { label: 'Target Gross Margin', val: `${margin}%`, desc: `Unit price ${fin.currencySymbol}${price} vs ${fin.currencySymbol}${cogs} COGS.` },
                    { label: 'Total Addressable Market', val: `$${project.market.tamValue}M`, desc: `SAM: $${project.market.samValue}M with high growth velocity.` },
                    { label: 'Competitive Moat', val: 'Proprietary', desc: project.pitch.competitiveMoat ? project.pitch.competitiveMoat.slice(0, 75) + '...' : 'Defensible workflow integration & customer switching barriers.' },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: `#${pptx.cardBg}`,
                        border: `1px solid #${pptx.primaryColor}66`,
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: `#${pptx.mutedColor}`, textTransform: 'uppercase' }}>
                          {p.label}
                        </div>
                        <div style={{ fontSize: '26px', fontWeight: 900, color: `#${pptx.accentColor}`, marginTop: '8px' }}>
                          {p.val}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: `#${pptx.textColor}`, lineHeight: 1.5 }}>
                        {p.desc}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 2 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 2: THE PROBLEM */}
            {/* ========================================== */}
            {slideIndex === 2 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    03 / THE PROBLEM
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Market Friction & Core Inefficiencies
                  </h2>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '175px',
                    width: '720px',
                    height: '630px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: '1.5px solid #EF444466',
                    borderRadius: '16px',
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#F87171', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      THE CORE PROBLEM STATEMENT
                    </span>
                  </div>
                  <div style={{ fontSize: '18px', color: `#${pptx.textColor}`, lineHeight: 1.8, flex: 1, overflowY: 'auto' }}>
                    {project.pitch.problemSummary ||
                      'Market participants currently suffer from fragmented operational workflows, prohibitive manual friction, and inefficient capital allocation that prevents sustainable scaling.'}
                  </div>
                  <div style={{ borderTop: '1px solid #EF444433', paddingTop: '16px', marginTop: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#F87171', textTransform: 'uppercase' }}>
                      Customer Impact:
                    </div>
                    <div style={{ fontSize: '14px', color: `#${pptx.mutedColor}`, marginTop: '4px' }}>
                      {project.market.icp.primaryPainPoint || 'Prolonged cycle times, manual reconciliation, and unpredictable unit margins.'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: '826px',
                    top: '175px',
                    width: '720px',
                    height: '630px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  {[
                    { title: 'Fragmented Tech Stacks & Silos', desc: 'Organizations rely on disparate legacy software packages that do not share unified data, creating severe operational bottlenecks.' },
                    { title: 'High Integration & Overhead Costs', desc: 'Custom enterprise integration typically requires months of development and tens of thousands in consultant fees before proving value.' },
                    { title: 'Lack of Real-Time Commercial Visibility', desc: 'Decision-makers operate with lagging financial indicators, leading to mispriced contracts and premature cash burn.' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        backgroundColor: `#${pptx.cardBg}`,
                        border: '1px solid #EF444444',
                        borderRadius: '14px',
                        padding: '24px 28px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#FCA5A5' }}>
                        {idx + 1}. {item.title}
                      </div>
                      <div style={{ fontSize: '14px', color: `#${pptx.textColor}`, marginTop: '8px', lineHeight: 1.6 }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 3 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 3: THE SOLUTION */}
            {/* ========================================== */}
            {slideIndex === 3 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    04 / THE SOLUTION
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Value Proposition & Innovative Delivery
                  </h2>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '175px',
                    width: '720px',
                    height: '630px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: `1.5px solid #${pptx.primaryColor}`,
                    borderRadius: '16px',
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: `#${pptx.accentColor}` }} />
                    <span style={{ fontSize: '16px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      THE VALUE-DRIVEN SOLUTION
                    </span>
                  </div>
                  <div style={{ fontSize: '18px', color: `#${pptx.textColor}`, lineHeight: 1.8, flex: 1, overflowY: 'auto' }}>
                    {project.pitch.solutionSummary ||
                      `${project.name} delivers an integrated, structured platform that streamlines delivery, drives immediate cost savings, and ensures compounding commercial returns.`}
                  </div>
                  <div style={{ borderTop: `1px solid #${pptx.primaryColor}40`, paddingTop: '16px', marginTop: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: `#${pptx.accentColor}`, textTransform: 'uppercase' }}>
                      Primary Success Metric:
                    </div>
                    <div style={{ fontSize: '14px', color: `#${pptx.textColor}`, marginTop: '4px' }}>
                      {project.market.icp.successMetric || 'Measurable operational ROI within 90 days of implementation.'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: '826px',
                    top: '175px',
                    width: '720px',
                    height: '630px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  {[
                    { title: 'Unified Modern Workflow Engine', desc: 'Centralizes fragmented operations into a cohesive system, removing friction and reducing manual input by up to 70%.' },
                    { title: 'Automated Economics & Cost Visibility', desc: 'Live unit margins, cash burn tracking, and automated reporting deliver clarity for executive decision-makers.' },
                    { title: 'Rapid Time-to-Value Architecture', desc: 'Designed for immediate onboarding without long consulting contracts, ensuring rapid client adoption and low churn.' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        backgroundColor: `#${pptx.cardBg}`,
                        border: `1.5px solid #${pptx.primaryColor}88`,
                        borderRadius: '14px',
                        padding: '24px 28px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 800, color: `#${pptx.accentColor}` }}>
                        ✓ {item.title}
                      </div>
                      <div style={{ fontSize: '14px', color: `#${pptx.textColor}`, marginTop: '8px', lineHeight: 1.6 }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 4 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 4: TARGET CUSTOMER */}
            {/* ========================================== */}
            {slideIndex === 4 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    05 / TARGET CUSTOMER
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Ideal Customer Profile (ICP) & Persona
                  </h2>
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: '175px', width: `${SAFE_W_PX}px`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                  {[
                    { label: 'Target Decision Maker', val: project.market.icp.role || 'Executive Leader / Director' },
                    { label: 'Primary Target Sector', val: project.market.icp.industry || project.industry || 'B2B Enterprise' },
                    { label: 'Average Contract Value', val: `${fin.currencySymbol}${price} / unit` },
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: `#${pptx.cardBg}`,
                        border: `1.5px solid #${pptx.primaryColor}`,
                        borderRadius: '16px',
                        padding: '24px 32px',
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 700, color: `#${pptx.mutedColor}`, textTransform: 'uppercase' }}>
                        {card.label}
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: `#${pptx.accentColor}`, marginTop: '8px' }}>
                        {card.val}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '345px',
                    width: `${SAFE_W_PX}px`,
                    height: '460px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: `1px solid #${pptx.primaryColor}88`,
                    borderRadius: '16px',
                    padding: '36px 44px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase' }}>
                    IDEAL CUSTOMER PROFILE (ICP) CHARACTERISTICS
                  </div>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-base">
                    <div>
                      <span style={{ fontWeight: 700, color: `#${pptx.mutedColor}` }}>Primary Pain Point: </span>
                      <p style={{ color: `#${pptx.textColor}`, marginTop: '4px', lineHeight: 1.5 }}>
                        {project.market.icp.primaryPainPoint || 'Operational inefficiencies and high integration friction across business workflows.'}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: `#${pptx.mutedColor}` }}>Commercial Buying Trigger: </span>
                      <p style={{ color: `#${pptx.textColor}`, marginTop: '4px', lineHeight: 1.5 }}>
                        {project.market.icp.buyingTrigger || 'Executive mandate to expand gross margins and streamline delivery timeline.'}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: `#${pptx.mutedColor}` }}>Primary Success Metric: </span>
                      <p style={{ color: `#${pptx.accentColor}`, fontWeight: 700, marginTop: '4px', lineHeight: 1.5 }}>
                        {project.market.icp.successMetric || 'Measurable operational ROI within 90 days of deployment.'}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: `#${pptx.mutedColor}` }}>Target Account Size: </span>
                      <p style={{ color: `#${pptx.textColor}`, marginTop: '4px', lineHeight: 1.5 }}>
                        Mid-Market to Enterprise ($10M - $250M revenue tier).
                      </p>
                    </div>
                  </div>
                  <div style={{ borderTop: `1px solid #${pptx.primaryColor}40`, paddingTop: '16px', fontSize: '14px', color: `#${pptx.mutedColor}` }}>
                    Targeted customer acquisition motion: Direct outbound account-based marketing & category ecosystem partnerships.
                  </div>
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 5 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 5: MARKET */}
            {/* ========================================== */}
            {slideIndex === 5 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    06 / MARKET OPPORTUNITY
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    TAM / SAM / SOM Sizing & Growth Dynamics
                  </h2>
                </div>

                {[
                  { label: 'Total Addressable Market (TAM)', val: `$${project.market.tamValue}M`, desc: 'Total global annual expenditure in this category', x: LEFT_PX },
                  { label: 'Serviceable Addressable Market (SAM)', val: `$${project.market.samValue}M`, desc: 'Segment reachable with current commercial offering', x: 562 },
                  { label: 'Serviceable Obtainable Market (SOM)', val: `$${project.market.somValue}M`, desc: 'Target obtainable market share within 36 months', x: 1071 },
                ].map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${m.x}px`,
                      top: '175px',
                      width: '475px',
                      height: '240px',
                      backgroundColor: `#${pptx.cardBg}`,
                      border: `1.5px solid #${pptx.primaryColor}`,
                      borderRadius: '16px',
                      padding: '30px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 700, color: `#${pptx.mutedColor}`, textTransform: 'uppercase' }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: '46px', fontWeight: 900, color: `#${pptx.accentColor}` }}>
                      {m.val}
                    </div>
                    <div style={{ fontSize: '14px', color: `#${pptx.textColor}` }}>
                      {m.desc}
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '445px',
                    width: `${SAFE_W_PX}px`,
                    height: '360px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: `1px solid #${pptx.primaryColor}88`,
                    borderRadius: '16px',
                    padding: '36px 44px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase' }}>
                    MARKET TIMING & STRATEGIC TAILWINDS
                  </div>
                  <div style={{ fontSize: '18px', color: `#${pptx.textColor}`, lineHeight: 1.8, flex: 1, overflowY: 'auto' }}>
                    {project.pitch.marketTiming ||
                      'The convergence of cloud infrastructure maturity, heightened demand for automation, and pressure on enterprise margins has created an urgent window for commercial adoption.'}
                  </div>
                  <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10 text-sm">
                    <div>
                      <span className="font-bold block" style={{ color: `#${pptx.accentColor}` }}>Compound Category Growth</span>
                      <span style={{ color: `#${pptx.mutedColor}` }}>18.4% projected CAGR through 2030</span>
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: `#${pptx.accentColor}` }}>Regulatory Drivers</span>
                      <span style={{ color: `#${pptx.mutedColor}` }}>Standardized compliance and audit mandates</span>
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: `#${pptx.accentColor}` }}>Technology Readiness</span>
                      <span style={{ color: `#${pptx.mutedColor}` }}>Zero-friction API integration frameworks</span>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 6 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 6: BUSINESS MODEL */}
            {/* ========================================== */}
            {slideIndex === 6 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    07 / BUSINESS MODEL CANVAS
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Comprehensive 9-Block Strategic Blueprint
                  </h2>
                </div>

                {[
                  { title: 'Value Propositions', items: project.canvas.valuePropositions.items, x: LEFT_PX, y: 175, w: 475, h: 300 },
                  { title: 'Customer Segments', items: project.canvas.customerSegments.items, x: 562, y: 175, w: 475, h: 300 },
                  { title: 'Revenue Streams', items: project.canvas.revenueStreams.items, x: 1071, y: 175, w: 475, h: 300 },
                  { title: 'Key Activities', items: project.canvas.keyActivities.items, x: LEFT_PX, y: 505, w: 475, h: 300 },
                  { title: 'Key Resources & Partners', items: [...project.canvas.keyResources.items, ...project.canvas.keyPartners.items], x: 562, y: 505, w: 475, h: 300 },
                  { title: 'Cost Structure', items: project.canvas.costStructure.items, x: 1071, y: 505, w: 475, h: 300 },
                ].map((block, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${block.x}px`,
                      top: `${block.y}px`,
                      width: `${block.w}px`,
                      height: `${block.h}px`,
                      backgroundColor: `#${pptx.cardBg}`,
                      border: `1px solid #${pptx.primaryColor}77`,
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase', marginBottom: '12px' }}>
                      {block.title}
                    </div>
                    <div style={{ fontSize: '14px', color: `#${pptx.textColor}`, lineHeight: 1.6, flex: 1, overflowY: 'hidden' }}>
                      {block.items.length > 0 ? (
                        block.items.slice(0, 4).map((it, i) => (
                          <div key={i} className="flex items-start gap-2 mb-2">
                            <span style={{ color: `#${pptx.accentColor}` }}>•</span>
                            <span>{it.text}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: `#${pptx.mutedColor}` }}>• Architecture definition in progress</div>
                      )}
                    </div>
                  </div>
                ))}

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 7 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 7: MARKETING STRATEGY */}
            {/* ========================================== */}
            {slideIndex === 7 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    08 / MARKETING STRATEGY
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Customer Acquisition Engine & Channel Mix
                  </h2>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '180px',
                    width: `${SAFE_W_PX}px`,
                    height: '620px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: `1px solid #${pptx.primaryColor}66`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: `#${pptx.primaryColor}30`, borderBottom: `2px solid #${pptx.primaryColor}` }}>
                        <th className="p-4 text-sm font-bold uppercase tracking-wider" style={{ color: `#${pptx.textColor}`, width: '25%' }}>Channel Name</th>
                        <th className="p-4 text-sm font-bold uppercase tracking-wider" style={{ color: `#${pptx.textColor}`, width: '20%' }}>Type</th>
                        <th className="p-4 text-sm font-bold uppercase tracking-wider" style={{ color: `#${pptx.textColor}`, width: '18%' }}>Estimated CAC</th>
                        <th className="p-4 text-sm font-bold uppercase tracking-wider" style={{ color: `#${pptx.textColor}`, width: '18%' }}>Conversion Rate</th>
                        <th className="p-4 text-sm font-bold uppercase tracking-wider" style={{ color: `#${pptx.accentColor}`, width: '19%' }}>Priority & Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-sm">
                      {project.gtm.channels.slice(0, 5).map((ch, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="p-4 font-bold" style={{ color: `#${pptx.textColor}` }}>{ch.name}</td>
                          <td className="p-4" style={{ color: `#${pptx.mutedColor}` }}>{ch.type}</td>
                          <td className="p-4 font-bold" style={{ color: `#${pptx.accentColor}` }}>{fin.currencySymbol}{ch.estimatedCac}</td>
                          <td className="p-4" style={{ color: `#${pptx.textColor}` }}>{ch.projectedConversionRate}%</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10" style={{ color: `#${pptx.textColor}` }}>
                              {ch.priority} • {ch.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 8 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 8: OPERATIONS */}
            {/* ========================================== */}
            {slideIndex === 8 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    09 / OPERATIONS & DELIVERY
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Core Capabilities, Infrastructure & Key Activities
                  </h2>
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: '180px', width: `${SAFE_W_PX}px`, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <div
                    style={{
                      height: '290px',
                      backgroundColor: `#${pptx.cardBg}`,
                      border: `1.5px solid #${pptx.primaryColor}`,
                      borderRadius: '16px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase', marginBottom: '14px' }}>
                      KEY OPERATIONAL ACTIVITIES
                    </div>
                    <div className="space-y-3 text-sm flex-1 overflow-y-auto">
                      {project.canvas.keyActivities.items.slice(0, 4).map((it, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span style={{ color: `#${pptx.accentColor}` }}>•</span>
                          <span style={{ color: `#${pptx.textColor}` }}>{it.text}</span>
                        </div>
                      ))}
                      {project.canvas.keyActivities.items.length === 0 && (
                        <div style={{ color: `#${pptx.mutedColor}` }}>• Core platform engineering & automated customer onboarding workflows.</div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      height: '290px',
                      backgroundColor: `#${pptx.cardBg}`,
                      border: `1.5px solid #${pptx.primaryColor}`,
                      borderRadius: '16px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase', marginBottom: '14px' }}>
                      TECHNOLOGY & INFRASTRUCTURE
                    </div>
                    <div className="space-y-3 text-sm flex-1 overflow-y-auto">
                      {project.canvas.keyResources.items.slice(0, 4).map((it, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span style={{ color: `#${pptx.accentColor}` }}>•</span>
                          <span style={{ color: `#${pptx.textColor}` }}>{it.text}</span>
                        </div>
                      ))}
                      {project.canvas.keyResources.items.length === 0 && (
                        <div style={{ color: `#${pptx.mutedColor}` }}>• High-availability cloud infrastructure with enterprise-grade data security.</div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      height: '290px',
                      backgroundColor: `#${pptx.cardBg}`,
                      border: `1.5px solid #${pptx.primaryColor}`,
                      borderRadius: '16px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase', marginBottom: '14px' }}>
                      STRATEGIC PARTNERS & ECOSYSTEM
                    </div>
                    <div className="space-y-3 text-sm flex-1 overflow-y-auto">
                      {project.canvas.keyPartners.items.slice(0, 4).map((it, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span style={{ color: `#${pptx.accentColor}` }}>•</span>
                          <span style={{ color: `#${pptx.textColor}` }}>{it.text}</span>
                        </div>
                      ))}
                      {project.canvas.keyPartners.items.length === 0 && (
                        <div style={{ color: `#${pptx.mutedColor}` }}>• Specialized distribution partners and industry certification authorities.</div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      height: '290px',
                      backgroundColor: `#${pptx.cardBg}`,
                      border: `1.5px solid #${pptx.primaryColor}`,
                      borderRadius: '16px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase', marginBottom: '14px' }}>
                      OPERATIONAL COST STRUCTURE & LEVERAGE
                    </div>
                    <div className="space-y-3 text-sm flex-1 overflow-y-auto">
                      {project.canvas.costStructure.items.slice(0, 4).map((it, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span style={{ color: `#${pptx.accentColor}` }}>•</span>
                          <span style={{ color: `#${pptx.textColor}` }}>{it.text}</span>
                        </div>
                      ))}
                      {project.canvas.costStructure.items.length === 0 && (
                        <div style={{ color: `#${pptx.mutedColor}` }}>• Lean operational burn with variable cost structures tied to user adoption.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 9 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 9: FINANCIAL PLAN */}
            {/* ========================================== */}
            {slideIndex === 9 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    10 / FINANCIAL PLAN & UNIT ECONOMICS
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Core Margins, Cash Flow & Unit Economics
                  </h2>
                </div>

                {[
                  { label: 'Unit Selling Price', val: `${fin.currencySymbol}${price}`, sub: 'Standard commercial tier', x: LEFT_PX },
                  { label: 'COGS per Unit', val: `${fin.currencySymbol}${cogs}`, sub: 'Direct fulfillment costs', x: 434 },
                  { label: 'Gross Margin', val: `${margin}%`, sub: 'Unit profitability ratio', x: 814 },
                  { label: 'Monthly Fixed Burn', val: `${fin.currencySymbol}${fixedBurn.toLocaleString()}`, sub: 'Payroll & operations', x: 1194 },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${item.x}px`,
                      top: '175px',
                      width: '352px',
                      height: '230px',
                      backgroundColor: `#${pptx.cardBg}`,
                      border: `1.5px solid #${pptx.primaryColor}`,
                      borderRadius: '16px',
                      padding: '24px',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, color: `#${pptx.mutedColor}`, textTransform: 'uppercase' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '38px', fontWeight: 900, color: `#${pptx.accentColor}`, marginTop: '10px' }}>
                      {item.val}
                    </div>
                    <div style={{ fontSize: '13px', color: `#${pptx.textColor}`, marginTop: '8px' }}>
                      {item.sub}
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '435px',
                    width: `${SAFE_W_PX}px`,
                    height: '370px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: `1px solid #${pptx.primaryColor}88`,
                    borderRadius: '16px',
                    padding: '32px 40px',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase', marginBottom: '20px' }}>
                    BREAK-EVEN CAPACITY & CAPITAL POSITION
                  </div>
                  <div className="space-y-4 text-base">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>
                        <strong style={{ color: `#${pptx.textColor}` }}>Required Break-Even Volume: </strong>
                        <span style={{ color: `#${pptx.accentColor}`, fontWeight: 800 }}>{breakevenUnits} units/month</span>
                        <span style={{ color: `#${pptx.mutedColor}` }}> ({fin.currencySymbol}${(breakevenUnits * price).toLocaleString()}/month in revenue)</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>
                        <strong style={{ color: `#${pptx.textColor}` }}>Current Active Customer Base: </strong>
                        <span style={{ color: `#${pptx.textColor}` }}>{fin.currentCustomers} accounts producing {fin.currencySymbol}${(fin.currentCustomers * price).toLocaleString()} MRR</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>
                        <strong style={{ color: `#${pptx.textColor}` }}>Starting Capital Reserve: </strong>
                        <span style={{ color: `#${pptx.textColor}` }}>{fin.currencySymbol}${(fin.startingCapital || 0).toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>
                        <strong style={{ color: `#${pptx.textColor}` }}>Projected Compound Monthly Growth: </strong>
                        <span style={{ color: `#${pptx.accentColor}`, fontWeight: 700 }}>{fin.projectedMonthlyGrowthRate || 10}%</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 10 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 10: ROADMAP */}
            {/* ========================================== */}
            {slideIndex === 10 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    11 / STRATEGIC ROADMAP
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Execution Timeline & Commercial Milestones
                  </h2>
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: '180px', width: `${SAFE_W_PX}px`, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {project.gtm.milestones.slice(0, 4).map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '100%',
                        height: '130px',
                        backgroundColor: `#${pptx.cardBg}`,
                        border: `1.5px solid ${m.completed ? '#10B981' : `#${pptx.primaryColor}`}`,
                        borderRadius: '14px',
                        padding: '24px 32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: m.completed ? '#34D399' : `#${pptx.accentColor}`, textTransform: 'uppercase' }}>
                          {m.phase}
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: `#${pptx.textColor}`, marginTop: '6px' }}>
                          {m.title}
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontSize: '14px', color: `#${pptx.mutedColor}` }}>
                          Target Date: <strong style={{ color: `#${pptx.textColor}` }}>{m.targetDate}</strong>
                        </div>
                        <div style={{ marginTop: '6px' }}>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: m.completed ? '#10B98125' : '#3B82F625',
                              color: m.completed ? '#34D399' : '#60A5FA',
                              border: `1px solid ${m.completed ? '#10B98155' : '#3B82F655'}`,
                            }}
                          >
                            {m.completed ? 'COMPLETED' : 'IN PROGRESS'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 11 of 12</span>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* SLIDE 11: FINAL / CALL TO ACTION */}
            {/* ========================================== */}
            {slideIndex === 11 && (
              <div className="w-full h-full relative overflow-hidden p-12">
                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, top: `${TOP_PX}px`, width: `${SAFE_W_PX}px` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    12 / CAPITAL ALLOCATION & THE ASK
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: `#${pptx.textColor}`, marginTop: '4px' }}>
                    Funding Requirements & Deployment Plan
                  </h2>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: `${LEFT_PX}px`,
                    top: '175px',
                    width: '620px',
                    height: '630px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: `2px solid #${pptx.accentColor}`,
                    borderRadius: '16px',
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.mutedColor}`, textTransform: 'uppercase' }}>
                      COMMERCIAL TARGET CAPITAL
                    </div>
                    <div style={{ fontSize: '64px', fontWeight: 900, color: `#${pptx.accentColor}`, marginTop: '16px' }}>
                      {fin.currencySymbol}{project.pitch.capitalAsk.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ borderTop: `1px solid #${pptx.primaryColor}40`, paddingTop: '24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: `#${pptx.mutedColor}`, textTransform: 'uppercase' }}>
                      18-Month Target Milestone
                    </div>
                    <div style={{ fontSize: '18px', color: `#${pptx.textColor}`, marginTop: '8px', lineHeight: 1.6 }}>
                      {project.pitch.financialMilestone12mo || 'Scale to $1M+ run rate with sustainable unit positive margins.'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: '704px',
                    top: '175px',
                    width: '842px',
                    height: '630px',
                    backgroundColor: `#${pptx.cardBg}`,
                    border: `1.5px solid #${pptx.primaryColor}`,
                    borderRadius: '16px',
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase', marginBottom: '20px' }}>
                      USE OF FUNDS & ALLOCATION
                    </div>
                    <div style={{ fontSize: '20px', color: `#${pptx.textColor}`, lineHeight: 1.8, flex: 1, overflowY: 'auto' }}>
                      {project.pitch.fundAllocation ||
                        '• 60% Core Product Engineering & Platform Infrastructure\n• 25% Go-To-Market, Customer Acquisition & Enterprise Sales\n• 15% Operational Working Capital & Governance Reserves'}
                    </div>
                  </div>

                  <div style={{ borderTop: `1px solid #${pptx.primaryColor}40`, paddingTop: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: `#${pptx.accentColor}`, textTransform: 'uppercase', marginBottom: '8px' }}>
                      EXECUTIVE CONTACT & NEXT STEPS
                    </div>
                    <div style={{ fontSize: '16px', color: `#${pptx.textColor}`, lineHeight: 1.6 }}>
                      <div><strong>Project:</strong> {project.name} • {project.industry}</div>
                      <div><strong>Direct Inquiry:</strong> {project.brand?.email || 'founder@nexora.studio'}</div>
                      <div><strong>Platform:</strong> NEXORA Business Design Studio • Professional Widescreen Dossier</div>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'absolute', left: `${LEFT_PX}px`, bottom: `${BOTTOM_PX}px`, width: `${SAFE_W_PX}px`, display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: `#${pptx.mutedColor}` }}>
                  <span>NEXORA Business Design Studio</span>
                  <span>Slide 12 of 12</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive In-Preview Navigation Toolbar */}
      {showControls && (
        <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-3 bg-[#0B0F17] border border-white/[0.08] rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={slideIndex <= 0}
              onClick={() => onSlideChange?.(Math.max(0, slideIndex - 1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-300 font-mono">
              Slide {slideIndex + 1} of {SLIDE_TEMPLATES.length}
            </span>
            <button
              type="button"
              disabled={slideIndex >= SLIDE_TEMPLATES.length - 1}
              onClick={() => onSlideChange?.(Math.min(SLIDE_TEMPLATES.length - 1, slideIndex + 1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
            {currentTemplate.number} • {currentTemplate.name}: <span className="text-slate-400 font-normal">{currentTemplate.subtitle}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="hidden sm:inline">16:9 Standard Presentation</span>
          </div>
        </div>
      )}
    </div>
  );
};
