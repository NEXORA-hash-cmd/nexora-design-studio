import html2canvas from 'html2canvas';
import { NexoraProject } from '../types/project';
import { sanitizeFilename } from './pptxExport';
import { getTheme } from '../data/themes';

export async function exportSlideToImage(
  project: NexoraProject,
  format: 'png' | 'jpg',
  targetElementId?: string,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; message: string; filename: string }> {
  try {
    onProgress?.(`Initializing high-resolution ${format.toUpperCase()} renderer...`);
    const ext = format === 'png' ? 'png' : 'jpg';
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const filename = `NEXORA_${sanitizeFilename(project.name)}_Slide.${ext}`;

    const element = targetElementId ? document.getElementById(targetElementId) : null;

    if (element) {
      onProgress?.(`Capturing slide canvas (${format.toUpperCase()})...`);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#070B14',
      });

      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: `High-resolution slide exported as "${filename}"`,
        filename,
      };
    }

    // Fallback: Synthesize an ultra-crisp 1920x1080 presentation slide canvas directly
    onProgress?.(`Synthesizing 1080p master slide in ${format.toUpperCase()}...`);
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }

    const theme = getTheme(project.theme);
    const pptxTheme = theme.pptx;

    // Draw background
    ctx.fillStyle = `#${pptxTheme.bgColor}`;
    ctx.fillRect(0, 0, 1920, 1080);

    // Accent top bar
    ctx.fillStyle = `#${pptxTheme.primaryHex}`;
    ctx.fillRect(0, 0, 1920, 18);

    // Decorative gradient banner
    const grad = ctx.createLinearGradient(0, 0, 1920, 0);
    grad.addColorStop(0, `rgba(${parseInt(pptxTheme.primaryHex.slice(0,2),16)}, ${parseInt(pptxTheme.primaryHex.slice(2,4),16)}, ${parseInt(pptxTheme.primaryHex.slice(4,6),16)}, 0.15)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1920, 400);

    // Badge
    ctx.fillStyle = `#${pptxTheme.accentHex}`;
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText(`NEXORA COMMERCIAL PORTFOLIO • THEME: ${theme.name.toUpperCase()}`, 120, 180);

    // Project Name
    ctx.fillStyle = `#${pptxTheme.textHex}`;
    ctx.font = 'bold 74px Arial, sans-serif';
    ctx.fillText(project.name, 120, 270);

    // Tagline
    ctx.fillStyle = `#${pptxTheme.mutedHex}`;
    ctx.font = '30px Arial, sans-serif';
    ctx.fillText(project.tagline || 'Business Architecture & Strategic Masterplan', 120, 340);

    // Cards Grid
    const cards = [
      { title: 'EXECUTIVE PROBLEM', body: project.pitch.problemSummary || 'Market fragmentation and manual bottlenecks.' },
      { title: 'STRATEGIC SOLUTION', body: project.pitch.solutionSummary || 'Proprietary automated workflow reducing friction.' },
      { title: 'UNIT ECONOMICS', body: `Price: ${project.financials.currencySymbol}${project.financials.pricingPerUnit} | COGS: ${project.financials.currencySymbol}${project.financials.cogsPerUnit} | CAC: ${project.financials.currencySymbol}${project.financials.cac}` },
      { title: 'CAPITAL ASK', body: `Funding: ${project.financials.currencySymbol}${project.pitch.capitalAsk.toLocaleString()} | Milestone: ${project.pitch.financialMilestone12mo}` },
    ];

    cards.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 120 + col * 860;
      const y = 430 + row * 260;
      const w = 820;
      const h = 220;

      ctx.fillStyle = `#${pptxTheme.cardColor}`;
      ctx.strokeStyle = `#${pptxTheme.primaryHex}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `#${pptxTheme.accentHex}`;
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillText(c.title, x + 36, y + 54);

      ctx.fillStyle = `#${pptxTheme.textHex}`;
      ctx.font = '22px Arial, sans-serif';
      
      // Wrap text
      const words = c.body.split(' ');
      let line = '';
      let textY = y + 100;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > w - 70 && n > 0) {
          ctx.fillText(line, x + 36, textY);
          line = words[n] + ' ';
          textY += 34;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x + 36, textY);
    });

    // Bottom Info Bar
    ctx.fillStyle = `#${pptxTheme.cardColor}`;
    ctx.fillRect(0, 1000, 1920, 80);
    ctx.fillStyle = `#${pptxTheme.mutedHex}`;
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText(
      `Industry: ${project.industry}    |    Stage: ${project.stage}    |    Date: ${new Date().toLocaleDateString()}    |    NEXORA Business Design Studio`,
      120,
      1048
    );

    const dataUrl = canvas.toDataURL(mimeType, 0.95);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      success: true,
      message: `Slide exported as "${filename}"`,
      filename,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown image export error';
    return {
      success: false,
      message: `Failed to export image: ${msg}`,
      filename: '',
    };
  }
}
