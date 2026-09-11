import { NexoraProject } from '../types/project';

// Dynamic export proxies to avoid heavy library evaluation on initial application load
export async function exportProjectToPptx(
  project: NexoraProject,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; message: string; filename: string }> {
  const { exportProjectToPptx: runPptx } = await import('./pptxExport');
  return runPptx(project, onProgress);
}

export async function exportSlideToImage(
  project: NexoraProject,
  format: 'png' | 'jpg',
  targetElementId?: string,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; message: string; filename: string }> {
  const { exportSlideToImage: runImage } = await import('./imageExport');
  return runImage(project, format, targetElementId, onProgress);
}

// Helper to trigger browser download
function triggerBrowserDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Export Project to JSON
export async function exportProjectToJson(project: NexoraProject): Promise<{ success: boolean; message: string }> {
  try {
    const filename = `${project.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_NEXORA.json`;
    const dataString = JSON.stringify(project, null, 2);

    if (window.electronAPI) {
      const res = await window.electronAPI.saveFile({
        title: 'Export NEXORA Project File',
        defaultPath: filename,
        filters: [
          { name: 'NEXORA Project JSON', extensions: ['json', 'nexora'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        data: dataString,
      });

      if (res.canceled) {
        return { success: false, message: 'Export canceled by user' };
      }
      if (!res.success) {
        throw new Error(res.error || 'Failed to write file');
      }
      return { success: true, message: `Project exported to ${res.filePath}` };
    } else {
      triggerBrowserDownload(filename, dataString, 'application/json');
      return { success: true, message: 'Project downloaded to your device' };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, message: `Could not export project: ${errorMsg}` };
  }
}

// Export Financials to CSV
export async function exportFinancialsToCsv(project: NexoraProject): Promise<{ success: boolean; message: string }> {
  try {
    const fin = project.financials;
    const price = fin.pricingPerUnit || 0;
    const cogs = fin.cogsPerUnit || 0;
    const grossProfit = price - cogs;
    const grossMargin = price > 0 ? ((grossProfit / price) * 100).toFixed(1) : '0';
    const ltv = grossProfit * (fin.averageCustomerLifespanMonths || 1);
    const cac = fin.cac || 1;
    const ltvCacRatio = (ltv / cac).toFixed(2);
    const fixedTotal = (fin.monthlyFixedCosts.payroll || 0) +
                       (fin.monthlyFixedCosts.softwareHosting || 0) +
                       (fin.monthlyFixedCosts.marketingBudget || 0) +
                       (fin.monthlyFixedCosts.officeMisc || 0);

    const breakevenUnits = grossProfit > 0 ? Math.ceil(fixedTotal / grossProfit) : 0;
    const breakevenRevenue = breakevenUnits * price;

    let csv = 'NEXORA BUSINESS DESIGN STUDIO - FINANCIAL MODEL EXPORT\n';
    csv += `Project,"${project.name.replace(/"/g, '""')}"\n`;
    csv += `Date,"${new Date().toLocaleDateString()}"\n`;
    csv += `Currency,"${fin.currency} (${fin.currencySymbol})"\n\n`;

    csv += 'UNIT ECONOMICS\n';
    csv += `Metric,Value\n`;
    csv += `Price Per Unit / Subscription,"${fin.currencySymbol}${price.toLocaleString()}"\n`;
    csv += `Direct COGS Per Unit,"${fin.currencySymbol}${cogs.toLocaleString()}"\n`;
    csv += `Gross Profit Per Unit,"${fin.currencySymbol}${grossProfit.toLocaleString()}"\n`;
    csv += `Gross Margin,"${grossMargin}%"\n`;
    csv += `Customer Acquisition Cost (CAC),"${fin.currencySymbol}${cac.toLocaleString()}"\n`;
    csv += `Avg Customer Lifespan,"${fin.averageCustomerLifespanMonths} Months"\n`;
    csv += `Customer Lifetime Value (LTV),"${fin.currencySymbol}${ltv.toLocaleString()}"\n`;
    csv += `LTV to CAC Ratio,"${ltvCacRatio}x"\n\n`;

    csv += 'MONTHLY FIXED OVERHEAD (BURN RATE)\n';
    csv += `Expense Category,Monthly Cost\n`;
    csv += `Payroll & Talent,"${fin.currencySymbol}${fin.monthlyFixedCosts.payroll.toLocaleString()}"\n`;
    csv += `Software & Infrastructure,"${fin.currencySymbol}${fin.monthlyFixedCosts.softwareHosting.toLocaleString()}"\n`;
    csv += `Marketing & Advertising,"${fin.currencySymbol}${fin.monthlyFixedCosts.marketingBudget.toLocaleString()}"\n`;
    csv += `Office & Operations,"${fin.currencySymbol}${fin.monthlyFixedCosts.officeMisc.toLocaleString()}"\n`;
    csv += `Total Monthly Fixed Burn,"${fin.currencySymbol}${fixedTotal.toLocaleString()}"\n`;
    csv += `Breakeven Volume,"${breakevenUnits} units/mo (${fin.currencySymbol}${breakevenRevenue.toLocaleString()}/mo)"\n\n`;

    csv += '12-MONTH FINANCIAL FORECAST\n';
    csv += 'Month,Active Customers,Monthly Revenue,Total COGS,Gross Profit,Fixed Burn,Net Monthly Cashflow,Ending Cash Balance\n';

    let currentCust = fin.currentCustomers || 10;
    let cashBalance = fin.startingCapital || 50000;
    const growthRate = (fin.projectedMonthlyGrowthRate || 10) / 100;

    for (let m = 1; m <= 12; m++) {
      const monthRev = currentCust * price;
      const monthCogs = currentCust * cogs;
      const monthGross = monthRev - monthCogs;
      const netCashflow = monthGross - fixedTotal;
      cashBalance += netCashflow;

      csv += `Month ${m},${Math.round(currentCust)},"${fin.currencySymbol}${Math.round(monthRev).toLocaleString()}","${fin.currencySymbol}${Math.round(monthCogs).toLocaleString()}","${fin.currencySymbol}${Math.round(monthGross).toLocaleString()}","${fin.currencySymbol}${Math.round(fixedTotal).toLocaleString()}","${fin.currencySymbol}${Math.round(netCashflow).toLocaleString()}","${fin.currencySymbol}${Math.round(cashBalance).toLocaleString()}"\n`;

      currentCust = currentCust * (1 + growthRate);
    }

    const filename = `${project.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_Financial_Model.csv`;

    if (window.electronAPI) {
      const res = await window.electronAPI.saveFile({
        title: 'Export Financial Model to CSV',
        defaultPath: filename,
        filters: [{ name: 'CSV Spreadsheets', extensions: ['csv'] }],
        data: csv,
      });
      if (res.canceled) return { success: false, message: 'CSV export canceled' };
      if (!res.success) throw new Error(res.error || 'Failed to write CSV file');
      return { success: true, message: `Financials exported to ${res.filePath}` };
    } else {
      triggerBrowserDownload(filename, csv, 'text/csv;charset=utf-8;');
      return { success: true, message: 'Financial CSV downloaded to your device' };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, message: `Could not export CSV: ${errorMsg}` };
  }
}

// Export Document / PDF
export async function exportDocumentToPdf(
  project: NexoraProject,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; message: string }> {
  try {
    if (window.electronAPI?.printToPDF) {
      const filename = `NEXORA_${project.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_Executive_Summary.pdf`;
      const res = await window.electronAPI.printToPDF({
        defaultPath: filename,
      });

      if (res.canceled) return { success: false, message: 'PDF export canceled' };
      if (!res.success) throw new Error(res.error || 'Failed to print PDF');
      return { success: true, message: `PDF report saved to ${res.filePath}` };
    } else {
      // Use direct client-side multi-page PDF generator
      const { exportProjectToPdf: generateDirectPdf } = await import('./pdfExport');
      const result = await generateDirectPdf(project, onProgress);
      return {
        success: result.success,
        message: result.message,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, message: `PDF generation: ${errorMsg}` };
  }
}

// Parse and validate imported project file
export function validateImportedProject(jsonContent: string): NexoraProject {
  const parsed = JSON.parse(jsonContent);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('File does not contain a valid JSON object');
  }
  if (!parsed.name || !parsed.canvas || !parsed.financials) {
    throw new Error('Selected file is missing required NEXORA business architecture schemas');
  }

  return {
    ...parsed,
    id: `proj_${Date.now()}`,
    name: `${parsed.name} (Imported)`,
    updatedAt: new Date().toISOString(),
  };
}
