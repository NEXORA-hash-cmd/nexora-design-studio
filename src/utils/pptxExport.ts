import pptxgen from 'pptxgenjs';
import { NexoraProject } from '../types/project';
import { getTheme } from '../data/themes';

// Sanitize filename for operating system safety
export function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'Project';
}

export async function exportProjectToPptx(
  project: NexoraProject,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; message: string; filename: string }> {
  try {
    onProgress?.('Initializing presentation engine...');
    const pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'NEXORA Business Design Studio';
    pres.company = project.name;
    pres.title = `${project.name} - Business Portfolio`;

    const theme = getTheme(project.theme);
    const pptxTheme = theme.pptx;

    // Palette shorthands
    const bg = pptxTheme.bgColor;
    const cardBg = pptxTheme.cardColor;
    const primary = pptxTheme.primaryHex;
    const accent = pptxTheme.accentHex;
    const text = pptxTheme.textHex;
    const muted = pptxTheme.mutedHex;
    const font = pptxTheme.fontFace;

    const fin = project.financials;
    const price = fin.pricingPerUnit || 0;
    const cogs = fin.cogsPerUnit || 0;
    const margin = price > 0 ? Math.round(((price - cogs) / price) * 100) : 0;
    const fixedBurn = (fin.monthlyFixedCosts.payroll || 0) +
                      (fin.monthlyFixedCosts.softwareHosting || 0) +
                      (fin.monthlyFixedCosts.marketingBudget || 0) +
                      (fin.monthlyFixedCosts.officeMisc || 0);

    // ==========================================
    // SLIDE 1: COVER SLIDE
    // ==========================================
    onProgress?.('Generating Slide 1: Cover Presentation...');
    const slide1 = pres.addSlide();
    slide1.background = { color: bg };

    // Brand accent bar top
    slide1.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.15,
      fill: { color: primary },
      line: { color: primary },
    });

    // Theme badge
    slide1.addText(`NEXORA COMMERCIAL PORTFOLIO • ${theme.name.toUpperCase()}`, {
      x: 1.0,
      y: 1.2,
      w: 11.33,
      h: 0.4,
      fontSize: 11,
      bold: true,
      color: accent,
      fontFace: font,
    });

    // Project Name
    slide1.addText(project.name, {
      x: 1.0,
      y: 1.8,
      w: 11.33,
      h: 1.4,
      fontSize: 44,
      bold: true,
      color: text,
      fontFace: font,
    });

    // Tagline / Mission
    slide1.addText(project.tagline || 'Business Architecture & Strategic Masterplan', {
      x: 1.0,
      y: 3.3,
      w: 11.33,
      h: 1.0,
      fontSize: 18,
      color: muted,
      fontFace: font,
    });

    // Decorative Card Bottom Info
    slide1.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 5.2,
      w: 11.33,
      h: 1.4,
      fill: { color: cardBg },
      line: { color: primary, width: 1 },
      rectRadius: 0.1,
    });

    slide1.addText(
      `INDUSTRY: ${project.industry || 'Technology'}    |    STAGE: ${project.stage}    |    DATE: ${new Date().toLocaleDateString()}    |    CURRENCY: ${fin.currency || 'USD'} (${fin.currencySymbol || '$'})`,
      {
        x: 1.3,
        y: 5.6,
        w: 10.7,
        h: 0.6,
        fontSize: 13,
        bold: true,
        color: text,
        fontFace: font,
      }
    );

    // ==========================================
    // SLIDE 2: EXECUTIVE SUMMARY & THESIS
    // ==========================================
    onProgress?.('Generating Slide 2: Executive Summary...');
    const slide2 = pres.addSlide();
    slide2.background = { color: bg };

    slide2.addText('01 / EXECUTIVE SUMMARY', {
      x: 1.0,
      y: 0.7,
      w: 11.33,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide2.addText('Strategic Problem & Solution Thesis', {
      x: 1.0,
      y: 1.1,
      w: 11.33,
      h: 0.6,
      fontSize: 26,
      bold: true,
      color: text,
      fontFace: font,
    });

    // Problem Card
    slide2.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 2.0,
      w: 5.4,
      h: 4.8,
      fill: { color: cardBg },
      line: { color: 'DC2626', width: 1 },
      rectRadius: 0.1,
    });
    slide2.addText('THE CORE PROBLEM', {
      x: 1.3,
      y: 2.3,
      w: 4.8,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: 'F87171',
      fontFace: font,
    });
    slide2.addText(
      project.pitch.problemSummary ||
      'Market participants currently suffer from fragmented operational workflows, prohibitive manual friction, and inefficient capital allocation.',
      {
        x: 1.3,
        y: 2.8,
        w: 4.8,
        h: 3.6,
        fontSize: 13,
        color: text,
        fontFace: font,
        lineSpacing: 22,
      }
    );

    // Solution Card
    slide2.addShape(pres.ShapeType.roundRect, {
      x: 6.9,
      y: 2.0,
      w: 5.4,
      h: 4.8,
      fill: { color: cardBg },
      line: { color: primary, width: 1 },
      rectRadius: 0.1,
    });
    slide2.addText('THE VALUE-DRIVEN SOLUTION', {
      x: 7.2,
      y: 2.3,
      w: 4.8,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide2.addText(
      project.pitch.solutionSummary ||
      `${project.name} delivers an integrated, structured platform that streamlines delivery, drives immediate cost savings, and ensures compounding returns.`,
      {
        x: 7.2,
        y: 2.8,
        w: 4.8,
        h: 3.6,
        fontSize: 13,
        color: text,
        fontFace: font,
        lineSpacing: 22,
      }
    );

    // ==========================================
    // SLIDE 3: BUSINESS MODEL CANVAS
    // ==========================================
    onProgress?.('Generating Slide 3: Business Model Canvas...');
    const slide3 = pres.addSlide();
    slide3.background = { color: bg };

    slide3.addText('02 / BUSINESS MODEL CANVAS', {
      x: 1.0,
      y: 0.6,
      w: 11.33,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide3.addText('Comprehensive 9-Block Strategic Blueprint', {
      x: 1.0,
      y: 0.9,
      w: 11.33,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
    });

    const blocks = [
      { title: 'Value Propositions', items: project.canvas.valuePropositions.items, x: 1.0, y: 1.6, w: 3.6, h: 2.5 },
      { title: 'Customer Segments', items: project.canvas.customerSegments.items, x: 4.8, y: 1.6, w: 3.6, h: 2.5 },
      { title: 'Revenue Streams', items: project.canvas.revenueStreams.items, x: 8.6, y: 1.6, w: 3.7, h: 2.5 },
      { title: 'Key Activities', items: project.canvas.keyActivities.items, x: 1.0, y: 4.3, w: 3.6, h: 2.5 },
      { title: 'Key Resources & Partners', items: [...project.canvas.keyResources.items, ...project.canvas.keyPartners.items], x: 4.8, y: 4.3, w: 3.6, h: 2.5 },
      { title: 'Cost Structure', items: project.canvas.costStructure.items, x: 8.6, y: 4.3, w: 3.7, h: 2.5 },
    ];

    blocks.forEach((b) => {
      slide3.addShape(pres.ShapeType.roundRect, {
        x: b.x,
        y: b.y,
        w: b.w,
        h: b.h,
        fill: { color: cardBg },
        line: { color: primary, width: 0.75 },
        rectRadius: 0.08,
      });
      slide3.addText(b.title.toUpperCase(), {
        x: b.x + 0.2,
        y: b.y + 0.15,
        w: b.w - 0.4,
        h: 0.3,
        fontSize: 11,
        bold: true,
        color: accent,
        fontFace: font,
      });

      const bulletTexts = b.items.length > 0 
        ? b.items.slice(0, 3).map((it) => `• ${it.text}`).join('\n')
        : '• Architecture definition in progress';

      slide3.addText(bulletTexts, {
        x: b.x + 0.2,
        y: b.y + 0.5,
        w: b.w - 0.4,
        h: b.h - 0.6,
        fontSize: 10.5,
        color: text,
        fontFace: font,
        lineSpacing: 18,
      });
    });

    // ==========================================
    // SLIDE 4: MARKET & TARGET ICP
    // ==========================================
    onProgress?.('Generating Slide 4: Market Opportunity...');
    const slide4 = pres.addSlide();
    slide4.background = { color: bg };

    slide4.addText('03 / MARKET SIZING & CUSTOMER PERSONA', {
      x: 1.0,
      y: 0.6,
      w: 11.33,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide4.addText('Addressable Market & Ideal Customer Profile', {
      x: 1.0,
      y: 0.9,
      w: 11.33,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
    });

    // TAM / SAM / SOM Metrics
    const markets = [
      { label: 'TAM (Total Addressable)', val: `$${project.market.tamValue}M`, desc: project.market.tamDescription || 'Total global market scope' },
      { label: 'SAM (Serviceable Addressable)', val: `$${project.market.samValue}M`, desc: project.market.samDescription || 'Accessible target market' },
      { label: 'SOM (Serviceable Obtainable)', val: `$${project.market.somValue}M`, desc: project.market.somDescription || '3-year target capture' },
    ];

    markets.forEach((m, idx) => {
      const xPos = 1.0 + idx * 3.9;
      slide4.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 1.7,
        w: 3.6,
        h: 2.1,
        fill: { color: cardBg },
        line: { color: primary, width: 1 },
        rectRadius: 0.1,
      });
      slide4.addText(m.label.toUpperCase(), {
        x: xPos + 0.2,
        y: 1.9,
        w: 3.2,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: muted,
        fontFace: font,
      });
      slide4.addText(m.val, {
        x: xPos + 0.2,
        y: 2.2,
        w: 3.2,
        h: 0.7,
        fontSize: 28,
        bold: true,
        color: accent,
        fontFace: font,
      });
      slide4.addText(m.desc, {
        x: xPos + 0.2,
        y: 2.9,
        w: 3.2,
        h: 0.7,
        fontSize: 10,
        color: text,
        fontFace: font,
      });
    });

    // Target ICP Card
    slide4.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 4.1,
      w: 11.33,
      h: 2.7,
      fill: { color: cardBg },
      line: { color: primary, width: 0.75 },
      rectRadius: 0.1,
    });
    slide4.addText('IDEAL CUSTOMER PROFILE (ICP)', {
      x: 1.3,
      y: 4.3,
      w: 10.7,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: accent,
      fontFace: font,
    });

    const icp = project.market.icp;
    slide4.addText(
      `• Target Role: ${icp.role || 'Executive Decision Maker'}\n` +
      `• Industry / Sector: ${icp.industry || project.industry}\n` +
      `• Primary Pain Point: ${icp.primaryPainPoint || 'Operational inefficiencies and high integration friction'}\n` +
      `• Buying Trigger: ${icp.buyingTrigger || 'Need for commercial scalability and cost reduction'}\n` +
      `• Success Metric: ${icp.successMetric || 'Measurable ROI and positive margin expansion'}`,
      {
        x: 1.3,
        y: 4.7,
        w: 10.7,
        h: 1.9,
        fontSize: 12,
        color: text,
        fontFace: font,
        lineSpacing: 22,
      }
    );

    // ==========================================
    // SLIDE 5: COMPETITIVE MATRIX
    // ==========================================
    onProgress?.('Generating Slide 5: Competitive Advantage...');
    const slide5 = pres.addSlide();
    slide5.background = { color: bg };

    slide5.addText('04 / COMPETITIVE LANDSCAPE', {
      x: 1.0,
      y: 0.6,
      w: 11.33,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide5.addText('Market Positioning & NEXORA Differentiator', {
      x: 1.0,
      y: 0.9,
      w: 11.33,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
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

    project.market.competitors.forEach((c) => {
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
      x: 1.0,
      y: 1.8,
      w: 11.33,
      fill: { color: cardBg },
      color: text,
      fontSize: 10.5,
      fontFace: font,
      border: { pt: 0.5, color: '334155' },
    });

    // ==========================================
    // SLIDE 6: FINANCIAL MODEL & UNIT ECONOMICS
    // ==========================================
    onProgress?.('Generating Slide 6: Financial Model...');
    const slide6 = pres.addSlide();
    slide6.background = { color: bg };

    slide6.addText('05 / FINANCIAL MODEL & UNIT ECONOMICS', {
      x: 1.0,
      y: 0.6,
      w: 11.33,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide6.addText('Core Margins, Cash Flow & Unit Economics', {
      x: 1.0,
      y: 0.9,
      w: 11.33,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
    });

    const finCards = [
      { label: 'Unit Selling Price', val: `${fin.currencySymbol}${price}`, sub: 'Standard commercial tier' },
      { label: 'COGS per Unit', val: `${fin.currencySymbol}${cogs}`, sub: 'Direct delivery costs' },
      { label: 'Gross Margin', val: `${margin}%`, sub: 'Unit profitability' },
      { label: 'Monthly Fixed Burn', val: `${fin.currencySymbol}${fixedBurn.toLocaleString()}`, sub: 'Payroll & overhead' },
    ];

    finCards.forEach((c, idx) => {
      const xPos = 1.0 + idx * 2.95;
      slide6.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 1.7,
        w: 2.7,
        h: 2.0,
        fill: { color: cardBg },
        line: { color: primary, width: 1 },
        rectRadius: 0.1,
      });
      slide6.addText(c.label.toUpperCase(), {
        x: xPos + 0.15,
        y: 1.9,
        w: 2.4,
        h: 0.3,
        fontSize: 9.5,
        bold: true,
        color: muted,
        fontFace: font,
      });
      slide6.addText(c.val, {
        x: xPos + 0.15,
        y: 2.2,
        w: 2.4,
        h: 0.6,
        fontSize: 24,
        bold: true,
        color: accent,
        fontFace: font,
      });
      slide6.addText(c.sub, {
        x: xPos + 0.15,
        y: 2.9,
        w: 2.4,
        h: 0.6,
        fontSize: 10,
        color: text,
        fontFace: font,
      });
    });

    // Breakeven & Runway Callout Box
    const grossPerUnit = price - cogs;
    const breakevenUnits = grossPerUnit > 0 ? Math.ceil(fixedBurn / grossPerUnit) : 0;
    slide6.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 4.1,
      w: 11.33,
      h: 2.6,
      fill: { color: cardBg },
      line: { color: primary, width: 0.75 },
      rectRadius: 0.1,
    });
    slide6.addText('BREAK-EVEN CAPACITY & CAPITAL POSITION', {
      x: 1.3,
      y: 4.3,
      w: 10.7,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide6.addText(
      `• Required Break-Even Volume: ${breakevenUnits} units/month (${fin.currencySymbol}${(breakevenUnits * price).toLocaleString()}/month in revenue)\n` +
      `• Current Active Customer Base: ${fin.currentCustomers} accounts yielding ${fin.currencySymbol}${(fin.currentCustomers * price).toLocaleString()} in MRR\n` +
      `• Starting Capital Reserve: ${fin.currencySymbol}${(fin.startingCapital || 0).toLocaleString()}\n` +
      `• Projected Monthly Growth Rate: ${fin.projectedMonthlyGrowthRate || 10}% compound growth`,
      {
        x: 1.3,
        y: 4.7,
        w: 10.7,
        h: 1.8,
        fontSize: 12,
        color: text,
        fontFace: font,
        lineSpacing: 22,
      }
    );

    // ==========================================
    // SLIDE 7: GO-TO-MARKET CHANNELS
    // ==========================================
    onProgress?.('Generating Slide 7: Go-To-Market Engine...');
    const slide7 = pres.addSlide();
    slide7.background = { color: bg };

    slide7.addText('06 / GO-TO-MARKET STRATEGY', {
      x: 1.0,
      y: 0.6,
      w: 11.33,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide7.addText('Customer Acquisition Engine & Channel Mix', {
      x: 1.0,
      y: 0.9,
      w: 11.33,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
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

    project.gtm.channels.forEach((ch) => {
      channelRows.push([
        { text: ch.name, options: { bold: true, color: text } },
        { text: ch.type, options: { color: text } },
        { text: `${fin.currencySymbol}${ch.estimatedCac}`, options: { color: accent } },
        { text: `${ch.projectedConversionRate}%`, options: { color: text } },
        { text: `${ch.priority} (${ch.status})`, options: { color: muted } },
      ]);
    });

    slide7.addTable(channelRows, {
      x: 1.0,
      y: 1.8,
      w: 11.33,
      fill: { color: cardBg },
      color: text,
      fontSize: 11,
      fontFace: font,
      border: { pt: 0.5, color: '334155' },
    });

    // ==========================================
    // SLIDE 8: STRATEGIC ROADMAP
    // ==========================================
    onProgress?.('Generating Slide 8: Execution Roadmap...');
    const slide8 = pres.addSlide();
    slide8.background = { color: bg };

    slide8.addText('07 / STRATEGIC ROADMAP', {
      x: 1.0,
      y: 0.6,
      w: 11.33,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide8.addText('Execution Timeline & Milestones', {
      x: 1.0,
      y: 0.9,
      w: 11.33,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
    });

    project.gtm.milestones.forEach((m, idx) => {
      const yPos = 1.8 + idx * 1.25;
      slide8.addShape(pres.ShapeType.roundRect, {
        x: 1.0,
        y: yPos,
        w: 11.33,
        h: 1.05,
        fill: { color: cardBg },
        line: { color: m.completed ? '10B981' : primary, width: 1 },
        rectRadius: 0.08,
      });

      slide8.addText(m.phase.toUpperCase(), {
        x: 1.3,
        y: yPos + 0.15,
        w: 3.5,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: m.completed ? '34D399' : accent,
        fontFace: font,
      });
      slide8.addText(m.title, {
        x: 1.3,
        y: yPos + 0.45,
        w: 7.5,
        h: 0.45,
        fontSize: 12,
        bold: true,
        color: text,
        fontFace: font,
      });
      slide8.addText(`Target: ${m.targetDate}  •  ${m.completed ? 'COMPLETED' : 'IN PROGRESS'}`, {
        x: 9.0,
        y: yPos + 0.35,
        w: 3.1,
        h: 0.4,
        fontSize: 11,
        align: 'right',
        bold: true,
        color: m.completed ? '34D399' : muted,
        fontFace: font,
      });
    });

    // ==========================================
    // SLIDE 9: CAPITAL ALLOCATION & THE ASK
    // ==========================================
    onProgress?.('Generating Slide 9: Capital Ask...');
    const slide9 = pres.addSlide();
    slide9.background = { color: bg };

    slide9.addText('08 / CAPITAL ALLOCATION & THE ASK', {
      x: 1.0,
      y: 0.6,
      w: 11.33,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide9.addText('Funding Requirements & Deployment Plan', {
      x: 1.0,
      y: 0.9,
      w: 11.33,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: text,
      fontFace: font,
    });

    // Big Capital Ask Box
    slide9.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 1.8,
      w: 4.5,
      h: 4.8,
      fill: { color: cardBg },
      line: { color: accent, width: 1.5 },
      rectRadius: 0.1,
    });
    slide9.addText('COMMERCIAL ASK', {
      x: 1.3,
      y: 2.1,
      w: 3.9,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: muted,
      fontFace: font,
    });
    slide9.addText(`${fin.currencySymbol}${project.pitch.capitalAsk.toLocaleString()}`, {
      x: 1.3,
      y: 2.6,
      w: 3.9,
      h: 1.2,
      fontSize: 40,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide9.addText(
      `18-Month Target Milestone:\n${project.pitch.financialMilestone12mo || 'Scale to $1M+ run rate with sustainable cash profitability'}`,
      {
        x: 1.3,
        y: 4.2,
        w: 3.9,
        h: 2.0,
        fontSize: 13,
        color: text,
        fontFace: font,
        lineSpacing: 22,
      }
    );

    // Fund Allocation Box
    slide9.addShape(pres.ShapeType.roundRect, {
      x: 6.0,
      y: 1.8,
      w: 6.33,
      h: 4.8,
      fill: { color: cardBg },
      line: { color: primary, width: 1 },
      rectRadius: 0.1,
    });
    slide9.addText('USE OF FUNDS', {
      x: 6.3,
      y: 2.1,
      w: 5.7,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide9.addText(project.pitch.fundAllocation || '60% Product Engineering, 25% Go-To-Market & Acquisition, 15% Reserves', {
      x: 6.3,
      y: 2.7,
      w: 5.7,
      h: 3.5,
      fontSize: 15,
      color: text,
      fontFace: font,
      lineSpacing: 24,
    });

    // ==========================================
    // SLIDE 10: CLOSING & CALL TO ACTION
    // ==========================================
    onProgress?.('Generating Slide 10: Conclusion...');
    const slide10 = pres.addSlide();
    slide10.background = { color: bg };

    slide10.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 7.35,
      w: 13.33,
      h: 0.15,
      fill: { color: primary },
      line: { color: primary },
    });

    slide10.addText('THANK YOU', {
      x: 1.0,
      y: 2.0,
      w: 11.33,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: accent,
      fontFace: font,
    });
    slide10.addText(`${project.name}`, {
      x: 1.0,
      y: 2.5,
      w: 11.33,
      h: 1.2,
      fontSize: 42,
      bold: true,
      color: text,
      fontFace: font,
    });
    slide10.addText(
      `Ready to structure, accelerate, and launch.\n` +
      `Powered by NEXORA Business Design Studio • Professional Edition\n\n` +
      `Contact & Inquiry: founder@nexora.studio`,
      {
        x: 1.0,
        y: 4.0,
        w: 11.33,
        h: 2.2,
        fontSize: 16,
        color: muted,
        fontFace: font,
        lineSpacing: 28,
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
