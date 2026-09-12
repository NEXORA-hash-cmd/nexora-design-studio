import { jsPDF } from 'jspdf';
import { NexoraProject } from '../types/project';
import { sanitizeFilename } from './pptxExport';
import { getTheme } from '../data/themes';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  if (clean.length === 6 && !isNaN(bigint)) {
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }
  return [14, 165, 233];
}

export async function exportProjectToPdf(
  project: NexoraProject,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; message: string; filename: string }> {
  try {
    onProgress?.('Preparing PDF document generator...');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const theme = getTheme(project.theme);
    const [pR, pG, pB] = hexToRgb(theme.palette.primary);
    const [aR, aG, aB] = hexToRgb(theme.palette.accent);
    const fin = project.financials;
    const price = fin.pricingPerUnit || 0;
    const cogs = fin.cogsPerUnit || 0;
    const grossMargin = price > 0 ? (((price - cogs) / price) * 100).toFixed(0) : '0';
    const fixedBurn = (fin.monthlyFixedCosts.payroll || 0) +
                      (fin.monthlyFixedCosts.softwareHosting || 0) +
                      (fin.monthlyFixedCosts.marketingBudget || 0) +
                      (fin.monthlyFixedCosts.officeMisc || 0);

    // Helpers
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    const drawHeader = (pageTitle: string, pageNum: number, totalPages: number) => {
      // Top accent bar
      doc.setFillColor(pR, pG, pB);
      doc.rect(margin, 12, contentWidth, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('NEXORA BUSINESS DESIGN STUDIO • STRATEGIC DOSSIER', margin, 18);
      doc.text(pageTitle.toUpperCase(), pageWidth - margin, 18, { align: 'right' });

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`${project.name} | Confidential Strategic Plan`, margin, pageHeight - 10);
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    };

    // ==========================================
    // PAGE 1: COVER & EXECUTIVE OVERVIEW
    // ==========================================
    onProgress?.('Writing Page 1: Cover & Executive Brief...');
    // Dark cover header banner
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(margin, 25, contentWidth, 70, 'F');

    doc.setFillColor(pR, pG, pB);
    doc.rect(margin, 25, 4, 70, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(aR, aG, aB);
    doc.text(`THEME: ${theme.name.toUpperCase()} (${theme.category.toUpperCase()})`, margin + 10, 38);

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(project.name, margin + 10, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(203, 213, 225);
    const taglineLines = doc.splitTextToSize(project.tagline || 'Strategic Business Masterplan', contentWidth - 20);
    doc.text(taglineLines, margin + 10, 60);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Industry: ${project.industry}   |   Stage: ${project.stage}   |   Generated: ${new Date().toLocaleDateString()}`,
      margin + 10,
      85
    );

    // Section 1: Executive Summary
    let yPos = 108;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('1. Executive Problem & Solution Thesis', margin, yPos);

    yPos += 8;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, yPos, contentWidth, 38, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text('The Market Problem:', margin + 4, yPos + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const probLines = doc.splitTextToSize(project.pitch.problemSummary || 'Problem overview in progress...', contentWidth - 8);
    doc.text(probLines, margin + 4, yPos + 12);

    yPos += 44;
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(204, 251, 241);
    doc.rect(margin, yPos, contentWidth, 38, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(13, 148, 136);
    doc.text('The Value Proposition & Solution:', margin + 4, yPos + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const solLines = doc.splitTextToSize(project.pitch.solutionSummary || 'Solution overview in progress...', contentWidth - 8);
    doc.text(solLines, margin + 4, yPos + 12);

    // Key Stats Grid Page 1
    yPos += 46;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Core Operational Metrics', margin, yPos);

    yPos += 7;
    const statBoxWidth = (contentWidth - 6) / 3;
    const stats = [
      { label: 'Unit Price', val: `${fin.currencySymbol}${price}` },
      { label: 'Target Gross Margin', val: `${grossMargin}%` },
      { label: 'Active Customer Base', val: `${fin.currentCustomers} Units` },
    ];

    stats.forEach((st, idx) => {
      const xOffset = margin + idx * (statBoxWidth + 3);
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.rect(xOffset, yPos, statBoxWidth, 22, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(st.label.toUpperCase(), xOffset + 4, yPos + 6);

      doc.setFontSize(13);
      doc.setTextColor(pR, pG, pB);
      doc.text(st.val, xOffset + 4, yPos + 15);
    });

    drawHeader('Executive Summary', 1, 4);

    // ==========================================
    // PAGE 2: BUSINESS MODEL CANVAS
    // ==========================================
    onProgress?.('Writing Page 2: Business Model Canvas...');
    doc.addPage();
    drawHeader('Business Model Canvas', 2, 4);

    yPos = 28;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('3. The 9-Block Business Architecture', margin, yPos);

    yPos += 6;
    const canvasBlocks = [
      { title: 'Value Propositions', items: project.canvas.valuePropositions.items },
      { title: 'Customer Segments', items: project.canvas.customerSegments.items },
      { title: 'Channels', items: project.canvas.channels.items },
      { title: 'Customer Relationships', items: project.canvas.customerRelationships.items },
      { title: 'Revenue Streams', items: project.canvas.revenueStreams.items },
      { title: 'Key Activities', items: project.canvas.keyActivities.items },
      { title: 'Key Resources', items: project.canvas.keyResources.items },
      { title: 'Key Partners', items: project.canvas.keyPartners.items },
      { title: 'Cost Structure', items: project.canvas.costStructure.items },
    ];

    const boxW = (contentWidth - 6) / 2;
    const boxH = 44;

    canvasBlocks.slice(0, 8).forEach((blk, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xB = margin + col * (boxW + 6);
      const yB = yPos + row * (boxH + 4);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(xB, yB, boxW, boxH, 'FD');

      doc.setFillColor(pR, pG, pB);
      doc.rect(xB, yB, boxW, 5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(blk.title.toUpperCase(), xB + 3, yB + 3.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);

      const itemsText = blk.items.length > 0
        ? blk.items.map(it => `• ${it.text}`).join('\n')
        : '• Blueprint definition in progress';

      const splitTxt = doc.splitTextToSize(itemsText, boxW - 6);
      doc.text(splitTxt, xB + 3, yB + 9);
    });

    // Cost Structure wide box at bottom
    const costBlk = canvasBlocks[8];
    const yCost = yPos + 4 * (boxH + 4);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, yCost, contentWidth, 24, 'FD');

    doc.setFillColor(220, 38, 38);
    doc.rect(margin, yCost, contentWidth, 4.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('COST STRUCTURE & OPERATING OVERHEAD', margin + 3, yCost + 3.4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const costText = costBlk.items.length > 0
      ? costBlk.items.map(it => `• ${it.text}`).join('   |   ')
      : '• Direct production, marketing, and operational salaries';
    const splitCost = doc.splitTextToSize(costText, contentWidth - 6);
    doc.text(splitCost, margin + 3, yCost + 9);

    // ==========================================
    // PAGE 3: MARKET & COMPETITORS
    // ==========================================
    onProgress?.('Writing Page 3: Market & Competitors...');
    doc.addPage();
    drawHeader('Market & Competition', 3, 4);

    yPos = 28;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('4. Addressable Market Sizing', margin, yPos);

    yPos += 7;
    const marketCards = [
      { label: 'TAM (Total Addressable)', val: `$${project.market.tamValue}M`, desc: project.market.tamDescription },
      { label: 'SAM (Serviceable Addressable)', val: `$${project.market.samValue}M`, desc: project.market.samDescription },
      { label: 'SOM (Serviceable Obtainable)', val: `$${project.market.somValue}M`, desc: project.market.somDescription },
    ];

    marketCards.forEach((mc, idx) => {
      const xOffset = margin + idx * (statBoxWidth + 3);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(xOffset, yPos, statBoxWidth, 32, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(mc.label.toUpperCase(), xOffset + 4, yPos + 6);

      doc.setFontSize(16);
      doc.setTextColor(pR, pG, pB);
      doc.text(mc.val, xOffset + 4, yPos + 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      const splitDesc = doc.splitTextToSize(mc.desc || 'Market segment description', statBoxWidth - 8);
      doc.text(splitDesc, xOffset + 4, yPos + 21);
    });

    // ICP Profile Box
    yPos += 40;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('5. Ideal Customer Profile (ICP)', margin, yPos);

    yPos += 7;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, yPos, contentWidth, 40, 'FD');

    const icp = project.market.icp;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const icpLines = [
      `Target Role: ${icp.role || 'Key Operational Decision Maker'}`,
      `Industry Segment: ${icp.industry || project.industry}`,
      `Company Size: ${icp.companySize || '50-500 employees'}`,
      `Primary Friction / Pain: ${icp.primaryPainPoint || 'Manual workflow fragmentation and high onboarding cost'}`,
      `Buying Trigger: ${icp.buyingTrigger || 'Need to increase velocity and reduce churn'}`,
      `Core Success Metric: ${icp.successMetric || '50% faster turnaround and positive unit margin'}`,
    ];
    icpLines.forEach((ln, idx) => {
      doc.text(`• ${ln}`, margin + 5, yPos + 7 + idx * 5.5);
    });

    // Competitor Matrix Table
    yPos += 48;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('6. Competitive Advantage Matrix', margin, yPos);

    yPos += 7;
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, yPos, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('COMPETITOR', margin + 3, yPos + 4.2);
    doc.text('PRICING', margin + 40, yPos + 4.2);
    doc.text('MARKET STRENGTH', margin + 75, yPos + 4.2);
    doc.text('NEXORA DIFFERENTIATOR', margin + 120, yPos + 4.2);

    yPos += 6;
    project.market.competitors.forEach((c) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, yPos, contentWidth, 16, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(c.name, margin + 3, yPos + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(c.pricing || 'Custom', margin + 40, yPos + 5);

      const splitStr = doc.splitTextToSize(c.strengths, 42);
      doc.text(splitStr, margin + 75, yPos + 5);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(pR, pG, pB);
      const splitDiff = doc.splitTextToSize(c.differentiator, 56);
      doc.text(splitDiff, margin + 120, yPos + 5);

      yPos += 18;
    });

    // ==========================================
    // PAGE 4: FINANCIALS, ROADMAP & ASK
    // ==========================================
    onProgress?.('Writing Page 4: Financial Plan & Capital Ask...');
    doc.addPage();
    drawHeader('Financials & Execution', 4, 4);

    yPos = 28;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('7. Unit Economics & Cashflow Architecture', margin, yPos);

    yPos += 7;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, yPos, contentWidth, 42, 'FD');

    const grossUnit = price - cogs;
    const beUnits = grossUnit > 0 ? Math.ceil(fixedBurn / grossUnit) : 0;
    const finLines = [
      `Unit Pricing: ${fin.currencySymbol}${price}   |   Direct COGS: ${fin.currencySymbol}${cogs}   |   Gross Profit: ${fin.currencySymbol}${grossUnit} (${grossMargin}%)`,
      `Customer Acquisition Cost (CAC): ${fin.currencySymbol}${fin.cac}   |   Avg Lifespan: ${fin.averageCustomerLifespanMonths} months`,
      `Customer Lifetime Value (LTV): ${fin.currencySymbol}${grossUnit * fin.averageCustomerLifespanMonths}   |   LTV:CAC Ratio: ${((grossUnit * fin.averageCustomerLifespanMonths) / (fin.cac || 1)).toFixed(1)}x`,
      `Monthly Fixed Operational Burn: ${fin.currencySymbol}${fixedBurn.toLocaleString()} (Payroll, Hosting, Marketing, Overhead)`,
      `Monthly Break-Even Requirement: ${beUnits} active units (${fin.currencySymbol}${(beUnits * price).toLocaleString()}/month)`,
      `Starting Capital Reserve: ${fin.currencySymbol}${fin.startingCapital.toLocaleString()}   |   Projected Monthly Growth: ${fin.projectedMonthlyGrowthRate}%`,
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    finLines.forEach((fl, idx) => {
      doc.text(`• ${fl}`, margin + 5, yPos + 7 + idx * 5.8);
    });

    // Milestones Roadmap
    yPos += 50;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('8. Strategic Execution Milestones', margin, yPos);

    yPos += 7;
    project.gtm.milestones.forEach((m) => {
      doc.setFillColor(m.completed ? 240 : 248, m.completed ? 253 : 250, m.completed ? 244 : 252);
      doc.setDrawColor(m.completed ? 187 : 226, m.completed ? 247 : 232, m.completed ? 208 : 240);
      doc.rect(margin, yPos, contentWidth, 14, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(m.completed ? 16 : 14, m.completed ? 185 : 165, m.completed ? 129 : 233);
      doc.text(`${m.phase.toUpperCase()}  [${m.targetDate}]`, margin + 4, yPos + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(m.title, margin + 4, yPos + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(m.completed ? 16 : 100, m.completed ? 185 : 116, m.completed ? 129 : 139);
      doc.text(m.completed ? 'COMPLETED' : 'IN PROGRESS', pageWidth - margin - 4, yPos + 7.5, { align: 'right' });

      yPos += 17;
    });

    // The Ask Box
    yPos += 4;
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, yPos, contentWidth, 38, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(aR, aG, aB);
    doc.text('CAPITAL ALLOCATION & THE COMMERCIAL ASK', margin + 6, yPos + 8);

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(`${fin.currencySymbol}${project.pitch.capitalAsk.toLocaleString()}`, margin + 6, yPos + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    const askLines = doc.splitTextToSize(
      `Deployment: ${project.pitch.fundAllocation || '60% Engineering, 25% GTM & Customer Acquisition, 15% Reserves'}\n` +
      `Target: ${project.pitch.financialMilestone12mo || 'Scale to sustainable profitability within 18 months'}`,
      contentWidth - 12
    );
    doc.text(askLines, margin + 6, yPos + 25);

    // Save File
    const filename = `NEXORA_${sanitizeFilename(project.name)}.pdf`;
    onProgress?.('Finalizing and downloading PDF...');
    doc.save(filename);

    return {
      success: true,
      message: `PDF Dossier saved as "${filename}"`,
      filename,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown PDF generation error';
    return {
      success: false,
      message: `Failed to export PDF: ${msg}`,
      filename: '',
    };
  }
}
