import pptxgen from 'pptxgenjs';
import { NexoraProject } from '../types/project';
import { getTheme } from '../data/themes';
import {
  SLIDE_W,
  SLIDE_H,
  LEFT_INCH,
  RIGHT_INCH,
  TOP_INCH,
  BOTTOM_INCH,
  SAFE_W_INCH,
  SAFE_H_INCH,
  computeTitleFontSize,
} from './slideModel';

// Sanitize filename for operating system safety
export function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'Project';
}

export async function exportProjectToPptx(
  project: NexoraProject,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; message: string; filename: string }> {
  try {
    onProgress?.('Initializing 16:9 widescreen presentation engine...');
    const pres = new pptxgen();
    // Use correct standard widescreen layout (13.333" x 7.5")
    pres.layout = 'LAYOUT_WIDE';
    pres.author = 'NEXORA Business Design Studio';
    pres.company = project.name;
    pres.title = `${project.name} - NEXORA Business Design Studio`;

    const theme = getTheme(project.theme);
    const pptxTheme = theme.pptx;

    // Palette shorthands
    const bg = pptxTheme.bgColor;
    const cardBg = pptxTheme.cardColor;
    const primary = pptxTheme.primaryHex;
    const accent = pptxTheme.accentHex;
    const text = pptxTheme.textHex;
    const muted = pptxTheme.mutedHex;
    const font = pptxTheme.fontFace || 'Arial';

    // Financial data extraction with safe fallbacks
    const fin = project.financials;
    const price = fin.pricingPerUnit || (fin as any).targetSellingPrice || 100;
    const cogs = fin.cogsPerUnit || 20;
    const margin = price > 0 ? Math.round(((price - cogs) / price) * 100) : 0;
    const fixedBurn =
      (fin.monthlyFixedCosts?.payroll || 0) +
      (fin.monthlyFixedCosts?.softwareHosting || 0) +
      (fin.monthlyFixedCosts?.marketingBudget || 0) +
      (fin.monthlyFixedCosts?.officeMisc || 0);

    // ==========================================
    // SLIDE 1: COVER SLIDE
    // ==========================================
    onProgress?.('Generating Slide 1: Cover Presentation...');
    const slide1 = pres.addSlide();
    slide1.background = { color: bg };

    // Brand accent bar top (edge-to-edge)
    slide1.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: SLIDE_W,
      h: 0.12,
      fill: { color: primary },
      line: { color: primary },
    });

    // Theme badge
    slide1.addText(`NEXORA COMMERCIAL PORTFOLIO • ${theme.name.toUpperCase()}`, {
      x: LEFT_INCH,
      y: 0.75,
      w: SAFE_W_INCH,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: accent,
      fontFace: font,
      wrap: true,
      fit: 'shrink',
    });

    // Project Name (Adaptive font sizing and shrink-to-fit to strictly prevent overflow)
    const titleSize = computeTitleFontSize(project.name, 40);
    slide1.addText(project.name, {
      x: LEFT_INCH,
      y: 1.25,
      w: SAFE_W_INCH,
      h: 1.30,
      fontSize: titleSize,
      bold: true,
      color: text,
      fontFace: font,
      wrap: true,
      fit: 'shrink',
    });

    // Tagline / Mission
    slide1.addText(project.tagline || 'Business Architecture, Financial Blueprint & Strategic Masterplan', {
      x: LEFT_INCH,
      y: 2.70,
      w: SAFE_W_INCH,
      h: 0.90,
      fontSize: 18,
      color: muted,
      fontFace: font,
      wrap: true,
      fit: 'shrink',
    });

    // Decorative Metadata Card
    slide1.addShape(pres.ShapeType.roundRect, {
      x: LEFT_INCH,
      y: 4.80,
      w: SAFE_W_INCH,
      h: 1.50,
      fill: { color: cardBg },
      line: { color: primary, width: 1 },
      rectRadius: 0.1,
    });

    // 4 Column Metadata Info inside card
    const metaColW = 2.90;
    const metaY = 4.95;
    const metaItems = [
      { label: 'INDUSTRY SECTOR', val: project.industry || 'Technology' },
      { label: 'COMMERCIAL STAGE', val: project.stage },
      { label: 'EFFECTIVE DATE', val: new Date().toLocaleDateString() },
      { label: 'FINANCIAL STANDARD', val: `${fin.currency || 'USD'} (${fin.currencySymbol || '$'})` },
    ];

    metaItems.forEach((m, idx) => {
      const xPos = LEFT_INCH + 0.20 + idx * (metaColW + 0.20);
      slide1.addText(m.label, {
        x: xPos,
        y: metaY,
        w: metaColW,
        h: 0.30,
        fontSize: 10,
        bold: true,
        color: muted,
        fontFace: font,
        align: 'center',
        fit: 'shrink',
      });
      slide1.addText(m.val, {
        x: xPos,
        y: metaY + 0.35,
        w: metaColW,
        h: 0.55,
        fontSize: 14,
        bold: true,
        color: idx === 3 ? accent : text,
        fontFace: font,
        align: 'center',
        wrap: true,
        fit: 'shrink',
      });
    });

    // Attribution Footer
    slide1.addText('Powered by NEXORA Business Design Studio • Professional Edition', {
      x: LEFT_INCH,
      y: 6.75,
      w: SAFE_W_INCH,
      h: 0.35,
      fontSize: 10,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });

    // ==========================================
    // SLIDE 2: EXECUTIVE SUMMARY & THESIS
    // ==========================================
    onProgress?.('Generating Slide 2: Executive Summary...');
    const slide2 = pres.addSlide();
    slide2.background = { color: bg };

    slide2.addText('01 / EXECUTIVE SUMMARY', {
      x: LEFT_INCH,
      y: 0.40,
      w: SAFE_W_INCH,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide2.addText('Strategic Problem & Solution Thesis', {
      x: LEFT_INCH,
      y: 0.70,
      w: SAFE_W_INCH,
      h: 0.50,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
      fit: 'shrink',
    });

    // Problem Card (Left Half)
    const cardW = 6.00;
    const cardH = 5.15;
    const cardY = 1.45;

    slide2.addShape(pres.ShapeType.roundRect, {
      x: LEFT_INCH,
      y: cardY,
      w: cardW,
      h: cardH,
      fill: { color: cardBg },
      line: { color: 'DC2626', width: 1 },
      rectRadius: 0.1,
    });
    slide2.addText('THE CORE PROBLEM', {
      x: LEFT_INCH + 0.25,
      y: cardY + 0.20,
      w: cardW - 0.50,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: 'F87171',
      fontFace: font,
      fit: 'shrink',
    });
    slide2.addText(
      project.pitch.problemSummary ||
      'Market participants currently suffer from fragmented operational workflows, prohibitive manual friction, and inefficient capital allocation that prevents sustainable scaling.',
      {
        x: LEFT_INCH + 0.25,
        y: cardY + 0.65,
        w: cardW - 0.50,
        h: cardH - 0.90,
        fontSize: 12.5,
        color: text,
        fontFace: font,
        lineSpacing: 20,
        wrap: true,
        fit: 'shrink',
      }
    );

    // Solution Card (Right Half)
    const solX = LEFT_INCH + cardW + 0.433; // 0.45 + 6.00 + 0.433 = 6.883 in (6.883 + 6.0 = 12.883 = SLIDE_W - 0.45)
    slide2.addShape(pres.ShapeType.roundRect, {
      x: solX,
      y: cardY,
      w: cardW,
      h: cardH,
      fill: { color: cardBg },
      line: { color: primary, width: 1 },
      rectRadius: 0.1,
    });
    slide2.addText('THE VALUE-DRIVEN SOLUTION', {
      x: solX + 0.25,
      y: cardY + 0.20,
      w: cardW - 0.50,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide2.addText(
      project.pitch.solutionSummary ||
      `${project.name} delivers an integrated, structured platform that streamlines delivery, drives immediate cost savings, and ensures compounding commercial returns.`,
      {
        x: solX + 0.25,
        y: cardY + 0.65,
        w: cardW - 0.50,
        h: cardH - 0.90,
        fontSize: 12.5,
        color: text,
        fontFace: font,
        lineSpacing: 20,
        wrap: true,
        fit: 'shrink',
      }
    );

    slide2.addText('Slide 2 of 10  •  NEXORA Business Design Studio', {
      x: LEFT_INCH,
      y: 6.80,
      w: SAFE_W_INCH,
      h: 0.30,
      fontSize: 9.5,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });

    // ==========================================
    // SLIDE 3: BUSINESS MODEL CANVAS
    // ==========================================
    onProgress?.('Generating Slide 3: Business Model Canvas...');
    const slide3 = pres.addSlide();
    slide3.background = { color: bg };

    slide3.addText('02 / BUSINESS MODEL CANVAS', {
      x: LEFT_INCH,
      y: 0.40,
      w: SAFE_W_INCH,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide3.addText('Comprehensive 9-Block Strategic Blueprint', {
      x: LEFT_INCH,
      y: 0.70,
      w: SAFE_W_INCH,
      h: 0.50,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
      fit: 'shrink',
    });

    const bmcColW = 3.96;
    const bmcRowH = 2.50;
    const bmcBlocks = [
      { title: 'Value Propositions', items: project.canvas.valuePropositions.items, x: LEFT_INCH, y: 1.45 },
      { title: 'Customer Segments', items: project.canvas.customerSegments.items, x: LEFT_INCH + bmcColW + 0.27, y: 1.45 },
      { title: 'Revenue Streams', items: project.canvas.revenueStreams.items, x: LEFT_INCH + (bmcColW + 0.27) * 2, y: 1.45 },
      { title: 'Key Activities', items: project.canvas.keyActivities.items, x: LEFT_INCH, y: 4.15 },
      { title: 'Key Resources & Partners', items: [...project.canvas.keyResources.items, ...project.canvas.keyPartners.items], x: LEFT_INCH + bmcColW + 0.27, y: 4.15 },
      { title: 'Cost Structure', items: project.canvas.costStructure.items, x: LEFT_INCH + (bmcColW + 0.27) * 2, y: 4.15 },
    ];

    bmcBlocks.forEach((b) => {
      slide3.addShape(pres.ShapeType.roundRect, {
        x: b.x,
        y: b.y,
        w: bmcColW,
        h: bmcRowH,
        fill: { color: cardBg },
        line: { color: primary, width: 0.75 },
        rectRadius: 0.08,
      });
      slide3.addText(b.title.toUpperCase(), {
        x: b.x + 0.20,
        y: b.y + 0.15,
        w: bmcColW - 0.40,
        h: 0.30,
        fontSize: 11,
        bold: true,
        color: accent,
        fontFace: font,
        fit: 'shrink',
      });

      const bulletTexts =
        b.items.length > 0
          ? b.items.slice(0, 4).map((it) => `• ${it.text}`).join('\n')
          : '• Architecture definition in progress';

      slide3.addText(bulletTexts, {
        x: b.x + 0.20,
        y: b.y + 0.50,
        w: bmcColW - 0.40,
        h: bmcRowH - 0.65,
        fontSize: 10,
        color: text,
        fontFace: font,
        lineSpacing: 16,
        wrap: true,
        fit: 'shrink',
      });
    });

    slide3.addText('Slide 3 of 10  •  NEXORA Business Design Studio', {
      x: LEFT_INCH,
      y: 6.80,
      w: SAFE_W_INCH,
      h: 0.30,
      fontSize: 9.5,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });

    // ==========================================
    // SLIDE 4: MARKET & TARGET ICP
    // ==========================================
    onProgress?.('Generating Slide 4: Market Opportunity...');
    const slide4 = pres.addSlide();
    slide4.background = { color: bg };

    slide4.addText('03 / MARKET SIZING & CUSTOMER PERSONA', {
      x: LEFT_INCH,
      y: 0.40,
      w: SAFE_W_INCH,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide4.addText('Addressable Market & Ideal Customer Profile', {
      x: LEFT_INCH,
      y: 0.70,
      w: SAFE_W_INCH,
      h: 0.50,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
      fit: 'shrink',
    });

    // TAM / SAM / SOM Metrics
    const marketColW = 3.96;
    const markets = [
      { label: 'TAM (TOTAL ADDRESSABLE)', val: `$${project.market.tamValue}M`, desc: project.market.tamDescription || 'Total global market scope' },
      { label: 'SAM (SERVICEABLE ADDRESSABLE)', val: `$${project.market.samValue}M`, desc: project.market.samDescription || 'Accessible target market' },
      { label: 'SOM (SERVICEABLE OBTAINABLE)', val: `$${project.market.somValue}M`, desc: project.market.somDescription || '3-year target capture' },
    ];

    markets.forEach((m, idx) => {
      const xPos = LEFT_INCH + idx * (marketColW + 0.27);
      slide4.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 1.45,
        w: marketColW,
        h: 2.00,
        fill: { color: cardBg },
        line: { color: primary, width: 1 },
        rectRadius: 0.1,
      });
      slide4.addText(m.label, {
        x: xPos + 0.20,
        y: 1.60,
        w: marketColW - 0.40,
        h: 0.25,
        fontSize: 9.5,
        bold: true,
        color: muted,
        fontFace: font,
        fit: 'shrink',
      });
      slide4.addText(m.val, {
        x: xPos + 0.20,
        y: 1.90,
        w: marketColW - 0.40,
        h: 0.65,
        fontSize: 28,
        bold: true,
        color: accent,
        fontFace: font,
        fit: 'shrink',
      });
      slide4.addText(m.desc, {
        x: xPos + 0.20,
        y: 2.60,
        w: marketColW - 0.40,
        h: 0.75,
        fontSize: 10,
        color: text,
        fontFace: font,
        wrap: true,
        fit: 'shrink',
      });
    });

    // Target ICP Card
    slide4.addShape(pres.ShapeType.roundRect, {
      x: LEFT_INCH,
      y: 3.70,
      w: SAFE_W_INCH,
      h: 2.95,
      fill: { color: cardBg },
      line: { color: primary, width: 0.75 },
      rectRadius: 0.1,
    });
    slide4.addText('IDEAL CUSTOMER PROFILE (ICP)', {
      x: LEFT_INCH + 0.25,
      y: 3.85,
      w: SAFE_W_INCH - 0.50,
      h: 0.30,
      fontSize: 12,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });

    const icp = project.market.icp;
    slide4.addText(
      `• Target Role: ${icp.role || 'Executive Decision Maker'}\n` +
      `• Industry / Sector: ${icp.industry || project.industry}\n` +
      `• Primary Pain Point: ${icp.primaryPainPoint || 'Operational inefficiencies and high integration friction'}\n` +
      `• Buying Trigger: ${icp.buyingTrigger || 'Need for commercial scalability and cost reduction'}\n` +
      `• Success Metric: ${icp.successMetric || 'Measurable ROI within 90 days and positive margin expansion'}`,
      {
        x: LEFT_INCH + 0.25,
        y: 4.25,
        w: SAFE_W_INCH - 0.50,
        h: 2.25,
        fontSize: 11.5,
        color: text,
        fontFace: font,
        lineSpacing: 20,
        wrap: true,
        fit: 'shrink',
      }
    );

    slide4.addText('Slide 4 of 10  •  NEXORA Business Design Studio', {
      x: LEFT_INCH,
      y: 6.80,
      w: SAFE_W_INCH,
      h: 0.30,
      fontSize: 9.5,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });

    // ==========================================
    // SLIDE 5: COMPETITIVE MATRIX
    // ==========================================
    onProgress?.('Generating Slide 5: Competitive Advantage...');
    const slide5 = pres.addSlide();
    slide5.background = { color: bg };

    slide5.addText('04 / COMPETITIVE LANDSCAPE', {
      x: LEFT_INCH,
      y: 0.40,
      w: SAFE_W_INCH,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide5.addText('Market Positioning & NEXORA Differentiator', {
      x: LEFT_INCH,
      y: 0.70,
      w: SAFE_W_INCH,
      h: 0.50,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
      fit: 'shrink',
    });

    const compRows: pptxgen.TableRow[] = [
      [
        { text: 'Competitor', options: { bold: true, fill: { color: primary }, color: 'FFFFFF' } },
        { text: 'Pricing Tier', options: { bold: true, fill: { color: primary }, color: 'FFFFFF' } },
        { text: 'Strengths', options: { bold: true, fill: { color: primary }, color: 'FFFFFF' } },
        { text: 'Weaknesses', options: { bold: true, fill: { color: primary }, color: 'FFFFFF' } },
        { text: `${project.name} Advantage`, options: { bold: true, fill: { color: accent }, color: '000000' } },
      ],
    ];

    project.market.competitors.slice(0, 5).forEach((c) => {
      compRows.push([
        { text: c.name, options: { bold: true, color: text } },
        { text: c.pricing || 'Custom quote', options: { color: text } },
        { text: c.strengths, options: { color: muted } },
        { text: c.weaknesses, options: { color: muted } },
        { text: c.differentiator, options: { bold: true, color: accent } },
      ]);
    });

    if (project.market.competitors.length === 0) {
      compRows.push([
        { text: 'Incumbent Alternatives', options: { color: text } },
        { text: 'High enterprise pricing', options: { color: text } },
        { text: 'Legacy brand trust', options: { color: muted } },
        { text: 'Slow manual deployment', options: { color: muted } },
        { text: '10x Faster onboarding & transparent pricing', options: { bold: true, color: accent } },
      ]);
    }

    slide5.addTable(compRows, {
      x: LEFT_INCH,
      y: 1.50,
      w: SAFE_W_INCH,
      colW: [2.2, 2.0, 2.6, 2.6, 3.033],
      fill: { color: cardBg },
      color: text,
      fontSize: 10,
      fontFace: font,
      border: { pt: 0.5, color: '334155' },
    });

    slide5.addText('Slide 5 of 10  •  NEXORA Business Design Studio', {
      x: LEFT_INCH,
      y: 6.80,
      w: SAFE_W_INCH,
      h: 0.30,
      fontSize: 9.5,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });

    // ==========================================
    // SLIDE 6: FINANCIAL MODEL & UNIT ECONOMICS
    // ==========================================
    onProgress?.('Generating Slide 6: Financial Model...');
    const slide6 = pres.addSlide();
    slide6.background = { color: bg };

    slide6.addText('05 / FINANCIAL MODEL & UNIT ECONOMICS', {
      x: LEFT_INCH,
      y: 0.40,
      w: SAFE_W_INCH,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide6.addText('Core Margins, Cash Flow & Unit Economics', {
      x: LEFT_INCH,
      y: 0.70,
      w: SAFE_W_INCH,
      h: 0.50,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
      fit: 'shrink',
    });

    const finCards = [
      { label: 'UNIT SELLING PRICE', val: `${fin.currencySymbol}${price}`, sub: 'Standard commercial tier' },
      { label: 'COGS PER UNIT', val: `${fin.currencySymbol}${cogs}`, sub: 'Direct delivery costs' },
      { label: 'GROSS MARGIN', val: `${margin}%`, sub: 'Unit profitability' },
      { label: 'MONTHLY FIXED BURN', val: `${fin.currencySymbol}${fixedBurn.toLocaleString()}`, sub: 'Payroll & overhead' },
    ];

    const finCardW = 2.93;
    finCards.forEach((c, idx) => {
      const xPos = LEFT_INCH + idx * (finCardW + 0.23);
      slide6.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 1.45,
        w: finCardW,
        h: 1.95,
        fill: { color: cardBg },
        line: { color: primary, width: 1 },
        rectRadius: 0.1,
      });
      slide6.addText(c.label, {
        x: xPos + 0.15,
        y: 1.60,
        w: finCardW - 0.30,
        h: 0.25,
        fontSize: 9,
        bold: true,
        color: muted,
        fontFace: font,
        fit: 'shrink',
      });
      slide6.addText(c.val, {
        x: xPos + 0.15,
        y: 1.85,
        w: finCardW - 0.30,
        h: 0.65,
        fontSize: 24,
        bold: true,
        color: accent,
        fontFace: font,
        fit: 'shrink',
      });
      slide6.addText(c.sub, {
        x: xPos + 0.15,
        y: 2.55,
        w: finCardW - 0.30,
        h: 0.65,
        fontSize: 9.5,
        color: text,
        fontFace: font,
        wrap: true,
        fit: 'shrink',
      });
    });

    // Breakeven & Runway Callout Box
    const grossPerUnit = price - cogs;
    const breakevenUnits = grossPerUnit > 0 ? Math.ceil(fixedBurn / grossPerUnit) : 0;
    slide6.addShape(pres.ShapeType.roundRect, {
      x: LEFT_INCH,
      y: 3.65,
      w: SAFE_W_INCH,
      h: 3.00,
      fill: { color: cardBg },
      line: { color: primary, width: 0.75 },
      rectRadius: 0.1,
    });
    slide6.addText('BREAK-EVEN CAPACITY & CAPITAL POSITION', {
      x: LEFT_INCH + 0.25,
      y: 3.80,
      w: SAFE_W_INCH - 0.50,
      h: 0.30,
      fontSize: 12,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide6.addText(
      `• Required Break-Even Volume: ${breakevenUnits} units/month (${fin.currencySymbol}${(breakevenUnits * price).toLocaleString()}/month in revenue)\n` +
      `• Current Active Customer Base: ${fin.currentCustomers} accounts yielding ${fin.currencySymbol}${(fin.currentCustomers * price).toLocaleString()} in MRR\n` +
      `• Starting Capital Reserve: ${fin.currencySymbol}${(fin.startingCapital || 0).toLocaleString()}\n` +
      `• Projected Monthly Growth Rate: ${fin.projectedMonthlyGrowthRate || 10}% compound growth`,
      {
        x: LEFT_INCH + 0.25,
        y: 4.20,
        w: SAFE_W_INCH - 0.50,
        h: 2.30,
        fontSize: 11.5,
        color: text,
        fontFace: font,
        lineSpacing: 20,
        wrap: true,
        fit: 'shrink',
      }
    );

    slide6.addText('Slide 6 of 10  •  NEXORA Business Design Studio', {
      x: LEFT_INCH,
      y: 6.80,
      w: SAFE_W_INCH,
      h: 0.30,
      fontSize: 9.5,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });

    // ==========================================
    // SLIDE 7: GO-TO-MARKET CHANNELS
    // ==========================================
    onProgress?.('Generating Slide 7: Go-To-Market Engine...');
    const slide7 = pres.addSlide();
    slide7.background = { color: bg };

    slide7.addText('06 / GO-TO-MARKET STRATEGY', {
      x: LEFT_INCH,
      y: 0.40,
      w: SAFE_W_INCH,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide7.addText('Customer Acquisition Engine & Channel Mix', {
      x: LEFT_INCH,
      y: 0.70,
      w: SAFE_W_INCH,
      h: 0.50,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
      fit: 'shrink',
    });

    const channelRows: pptxgen.TableRow[] = [
      [
        { text: 'Acquisition Channel', options: { bold: true, fill: { color: primary }, color: 'FFFFFF' } },
        { text: 'Type', options: { bold: true, fill: { color: primary }, color: 'FFFFFF' } },
        { text: 'Estimated CAC', options: { bold: true, fill: { color: primary }, color: 'FFFFFF' } },
        { text: 'Projected Conversion', options: { bold: true, fill: { color: primary }, color: 'FFFFFF' } },
        { text: 'Priority & Status', options: { bold: true, fill: { color: accent }, color: '000000' } },
      ],
    ];

    project.gtm.channels.slice(0, 5).forEach((ch) => {
      channelRows.push([
        { text: ch.name, options: { bold: true, color: text } },
        { text: ch.type, options: { color: text } },
        { text: `${fin.currencySymbol}${ch.estimatedCac}`, options: { color: accent } },
        { text: `${ch.projectedConversionRate}%`, options: { color: text } },
        { text: `${ch.priority} (${ch.status})`, options: { color: muted } },
      ]);
    });

    slide7.addTable(channelRows, {
      x: LEFT_INCH,
      y: 1.50,
      w: SAFE_W_INCH,
      colW: [2.8, 2.2, 2.2, 2.4, 2.833],
      fill: { color: cardBg },
      color: text,
      fontSize: 10.5,
      fontFace: font,
      border: { pt: 0.5, color: '334155' },
    });

    slide7.addText('Slide 7 of 10  •  NEXORA Business Design Studio', {
      x: LEFT_INCH,
      y: 6.80,
      w: SAFE_W_INCH,
      h: 0.30,
      fontSize: 9.5,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });

    // ==========================================
    // SLIDE 8: STRATEGIC ROADMAP
    // ==========================================
    onProgress?.('Generating Slide 8: Execution Roadmap...');
    const slide8 = pres.addSlide();
    slide8.background = { color: bg };

    slide8.addText('07 / STRATEGIC ROADMAP', {
      x: LEFT_INCH,
      y: 0.40,
      w: SAFE_W_INCH,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide8.addText('Execution Timeline & Milestones', {
      x: LEFT_INCH,
      y: 0.70,
      w: SAFE_W_INCH,
      h: 0.50,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
      fit: 'shrink',
    });

    const milestoneH = 1.05;
    const milestoneGap = 0.25;
    project.gtm.milestones.slice(0, 4).forEach((m, idx) => {
      const yPos = 1.45 + idx * (milestoneH + milestoneGap);
      slide8.addShape(pres.ShapeType.roundRect, {
        x: LEFT_INCH,
        y: yPos,
        w: SAFE_W_INCH,
        h: milestoneH,
        fill: { color: cardBg },
        line: { color: m.completed ? '10B981' : primary, width: 1 },
        rectRadius: 0.08,
      });

      slide8.addText(m.phase.toUpperCase(), {
        x: LEFT_INCH + 0.25,
        y: yPos + 0.12,
        w: 3.5,
        h: 0.25,
        fontSize: 10,
        bold: true,
        color: m.completed ? '34D399' : accent,
        fontFace: font,
        fit: 'shrink',
      });
      slide8.addText(m.title, {
        x: LEFT_INCH + 0.25,
        y: yPos + 0.42,
        w: 7.2,
        h: 0.45,
        fontSize: 12,
        bold: true,
        color: text,
        fontFace: font,
        fit: 'shrink',
      });
      slide8.addText(`Target: ${m.targetDate}  •  ${m.completed ? 'COMPLETED' : 'IN PROGRESS'}`, {
        x: LEFT_INCH + 7.5,
        y: yPos + 0.35,
        w: 4.68,
        h: 0.35,
        fontSize: 11,
        align: 'right',
        bold: true,
        color: m.completed ? '34D399' : muted,
        fontFace: font,
        fit: 'shrink',
      });
    });

    slide8.addText('Slide 8 of 10  •  NEXORA Business Design Studio', {
      x: LEFT_INCH,
      y: 6.80,
      w: SAFE_W_INCH,
      h: 0.30,
      fontSize: 9.5,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });

    // ==========================================
    // SLIDE 9: CAPITAL ALLOCATION & THE ASK
    // ==========================================
    onProgress?.('Generating Slide 9: Capital Ask...');
    const slide9 = pres.addSlide();
    slide9.background = { color: bg };

    slide9.addText('08 / CAPITAL ALLOCATION & THE ASK', {
      x: LEFT_INCH,
      y: 0.40,
      w: SAFE_W_INCH,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide9.addText('Funding Requirements & Deployment Plan', {
      x: LEFT_INCH,
      y: 0.70,
      w: SAFE_W_INCH,
      h: 0.50,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
      fit: 'shrink',
    });

    // Big Capital Ask Box
    const askW = 5.20;
    const askH = 5.15;
    slide9.addShape(pres.ShapeType.roundRect, {
      x: LEFT_INCH,
      y: 1.45,
      w: askW,
      h: askH,
      fill: { color: cardBg },
      line: { color: accent, width: 1.5 },
      rectRadius: 0.1,
    });
    slide9.addText('COMMERCIAL TARGET CAPITAL', {
      x: LEFT_INCH + 0.25,
      y: 1.65,
      w: askW - 0.50,
      h: 0.30,
      fontSize: 11,
      bold: true,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });
    slide9.addText(`${fin.currencySymbol}${project.pitch.capitalAsk.toLocaleString()}`, {
      x: LEFT_INCH + 0.25,
      y: 2.10,
      w: askW - 0.50,
      h: 1.10,
      fontSize: 38,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide9.addText(
      `18-Month Target Milestone:\n${project.pitch.financialMilestone12mo || 'Scale to $1M+ run rate with sustainable cash profitability'}`,
      {
        x: LEFT_INCH + 0.25,
        y: 3.50,
        w: askW - 0.50,
        h: 2.80,
        fontSize: 12.5,
        color: text,
        fontFace: font,
        lineSpacing: 20,
        wrap: true,
        fit: 'shrink',
      }
    );

    // Fund Allocation Box
    const allocX = LEFT_INCH + askW + 0.30;
    const allocW = SAFE_W_INCH - askW - 0.30; // 12.433 - 5.20 - 0.30 = 6.933 in
    slide9.addShape(pres.ShapeType.roundRect, {
      x: allocX,
      y: 1.45,
      w: allocW,
      h: askH,
      fill: { color: cardBg },
      line: { color: primary, width: 1 },
      rectRadius: 0.1,
    });
    slide9.addText('USE OF FUNDS', {
      x: allocX + 0.25,
      y: 1.65,
      w: allocW - 0.50,
      h: 0.30,
      fontSize: 11,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });
    slide9.addText(
      project.pitch.fundAllocation ||
      '• 60% Product Engineering & Scalable Infrastructure\n• 25% Go-To-Market, Customer Acquisition & Channel Partnerships\n• 15% Operational Working Capital & Governance Reserves',
      {
        x: allocX + 0.25,
        y: 2.20,
        w: allocW - 0.50,
        h: 4.10,
        fontSize: 14,
        color: text,
        fontFace: font,
        lineSpacing: 24,
        wrap: true,
        fit: 'shrink',
      }
    );

    slide9.addText('Slide 9 of 10  •  NEXORA Business Design Studio', {
      x: LEFT_INCH,
      y: 6.80,
      w: SAFE_W_INCH,
      h: 0.30,
      fontSize: 9.5,
      color: muted,
      fontFace: font,
      fit: 'shrink',
    });

    // ==========================================
    // SLIDE 10: CLOSING & CALL TO ACTION
    // ==========================================
    onProgress?.('Generating Slide 10: Conclusion...');
    const slide10 = pres.addSlide();
    slide10.background = { color: bg };

    slide10.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 7.38,
      w: SLIDE_W,
      h: 0.12,
      fill: { color: primary },
      line: { color: primary },
    });

    slide10.addText('THANK YOU', {
      x: LEFT_INCH,
      y: 1.50,
      w: SAFE_W_INCH,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: accent,
      fontFace: font,
      fit: 'shrink',
    });

    const closeTitleSize = computeTitleFontSize(project.name, 40);
    slide10.addText(`${project.name}`, {
      x: LEFT_INCH,
      y: 2.00,
      w: SAFE_W_INCH,
      h: 1.30,
      fontSize: closeTitleSize,
      bold: true,
      color: text,
      fontFace: font,
      wrap: true,
      fit: 'shrink',
    });

    slide10.addText(
      `Ready to structure, accelerate, and launch.\n` +
      `Powered by NEXORA Business Design Studio • Professional Edition\n\n` +
      `Contact & Inquiry: founder@nexora.studio`,
      {
        x: LEFT_INCH,
        y: 3.50,
        w: SAFE_W_INCH,
        h: 2.50,
        fontSize: 15,
        color: muted,
        fontFace: font,
        lineSpacing: 24,
        wrap: true,
        fit: 'shrink',
      }
    );

    // Save File
    const filename = `NEXORA_${sanitizeFilename(project.name)}.pptx`;
    onProgress?.('Finalizing and downloading PowerPoint presentation...');
    await pres.writeFile({ fileName: filename });

    return {
      success: true,
      message: `PowerPoint presentation saved as "${filename}"`,
      filename,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown PPTX generation error';
    return {
      success: false,
      message: `Failed to export PowerPoint: ${msg}`,
      filename: '',
    };
  }
}
