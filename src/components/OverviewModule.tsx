import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  DollarSign, 
  Compass, 
  BarChart3, 
  Briefcase, 
  Calendar, 
  Sparkles,
  TrendingUp 
} from 'lucide-react';
import { NexoraProject, CanvasBlock } from '../types/project';
import { ActiveTab } from './Navigation';

interface OverviewModuleProps {
  project: NexoraProject;
  onChange: (updated: NexoraProject) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  project,
  onChange,
  onNavigateTab,
}) => {
  const fin = project.financials;
  const price = fin.pricingPerUnit || 0;
  const cogs = fin.cogsPerUnit || 0;
  const grossProfit = price - cogs;
  const grossMargin = price > 0 ? ((grossProfit / price) * 100).toFixed(0) : '0';
  const ltv = grossProfit * (fin.averageCustomerLifespanMonths || 1);
  const cac = fin.cac || 1;
  const ltvCacRatio = (ltv / cac).toFixed(1);

  const fixedBurn = (fin.monthlyFixedCosts.payroll || 0) +
                    (fin.monthlyFixedCosts.softwareHosting || 0) +
                    (fin.monthlyFixedCosts.marketingBudget || 0) +
                    (fin.monthlyFixedCosts.officeMisc || 0);

  const currentMrr = (fin.currentCustomers || 0) * price;
  const currentArr = currentMrr * 12;
  const netMonthlyCash = (fin.currentCustomers * grossProfit) - fixedBurn;
  const runwayMonths = netMonthlyCash < 0 && fin.startingCapital > 0 
    ? (fin.startingCapital / Math.abs(netMonthlyCash)).toFixed(1)
    : netMonthlyCash >= 0 ? 'Profitable' : '0.0';

  // Calculate readiness score
  let score = 0;
  if (project.name && project.name !== 'Untitled Business Venture') score += 15;
  const canvasBlocks = Object.values(project.canvas) as CanvasBlock[];
  const canvasItemCount = canvasBlocks.reduce((acc: number, block: CanvasBlock) => acc + (block.items?.length || 0), 0);
  if (canvasItemCount >= 9) score += 25;
  if (price > 0 && cac > 0) score += 20;
  if (project.market.competitors.length > 0) score += 15;
  if (project.gtm.channels.length > 0) score += 15;
  if (project.pitch.problemSummary && project.pitch.solutionSummary) score += 10;

  return (
    <div id="module-overview" className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111726] to-[#151D30] border border-white/[0.08] rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-sky-500/20 border border-sky-500/30 text-sky-300">
                Studio Workspace
              </span>
              <span className="text-xs text-slate-400">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <input
                id="input-project-name"
                type="text"
                value={project.name}
                onChange={(e) => onChange({ ...project, name: e.target.value })}
                className="text-2xl sm:text-3xl font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-sky-400 focus:outline-none transition-colors w-full"
                placeholder="Enter Venture Name..."
              />
              <input
                id="input-project-tagline"
                type="text"
                value={project.tagline}
                onChange={(e) => onChange({ ...project, tagline: e.target.value })}
                className="text-sm text-slate-400 bg-transparent border-b border-transparent hover:border-white/20 focus:border-sky-400 focus:outline-none transition-colors w-full"
                placeholder="Add a concise one-line mission or positioning..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.06]">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Industry:</span>
                <input
                  id="input-project-industry"
                  type="text"
                  value={project.industry}
                  onChange={(e) => onChange({ ...project, industry: e.target.value })}
                  className="bg-transparent text-slate-200 focus:outline-none font-medium w-36"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.06]">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Stage:</span>
                <select
                  id="select-project-stage"
                  value={project.stage}
                  onChange={(e) => onChange({ ...project, stage: e.target.value as NexoraProject['stage'] })}
                  className="bg-transparent text-slate-200 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="Concept" className="bg-[#121826]">Concept</option>
                  <option value="Validation" className="bg-[#121826]">Validation</option>
                  <option value="MVP" className="bg-[#121826]">MVP</option>
                  <option value="Growth" className="bg-[#121826]">Growth</option>
                  <option value="Scaling" className="bg-[#121826]">Scaling</option>
                </select>
              </div>
            </div>
          </div>

          {/* Readiness Score dial */}
          <div className="bg-[#0B0F17]/80 border border-white/[0.08] p-4 rounded-xl shrink-0 flex items-center gap-4 min-w-[210px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#1E293B"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#0EA5E9"
                  strokeWidth="5"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 - (163.36 * score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute text-sm font-bold text-white">{score}%</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Business Readiness</div>
              <div className="text-[11px] text-slate-400">
                {score >= 80 ? 'Investment Ready' : score >= 50 ? 'In Development' : 'Initial Architecture'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Financial & Market Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          id="stat-card-mrr"
          onClick={() => onNavigateTab('financials')}
          className="bg-[#111622] hover:bg-[#151C2C] border border-white/[0.06] hover:border-sky-500/40 p-4 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Projected Annual Run-Rate</span>
            <DollarSign className="w-4 h-4 text-sky-400 opacity-80 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-white">
            {fin.currencySymbol}{Math.round(currentArr).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>MRR: {fin.currencySymbol}{Math.round(currentMrr).toLocaleString()}</span>
            <span className="text-sky-400/80">({fin.currentCustomers} customers)</span>
          </div>
        </div>

        <div 
          id="stat-card-unit-economics"
          onClick={() => onNavigateTab('financials')}
          className="bg-[#111622] hover:bg-[#151C2C] border border-white/[0.06] hover:border-emerald-500/40 p-4 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Unit Economics (LTV:CAC)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400 opacity-80 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-emerald-400">
            {ltvCacRatio}x
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Gross Margin: <span className="text-slate-200 font-medium">{grossMargin}%</span>
          </div>
        </div>

        <div 
          id="stat-card-runway"
          onClick={() => onNavigateTab('financials')}
          className="bg-[#111622] hover:bg-[#151C2C] border border-white/[0.06] hover:border-amber-500/40 p-4 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Runway Horizon</span>
            <Calendar className="w-4 h-4 text-amber-400 opacity-80 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-white">
            {typeof runwayMonths === 'string' && runwayMonths === 'Profitable' ? 'Profitable' : `${runwayMonths} Mo`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Monthly Burn: {fin.currencySymbol}{Math.round(fixedBurn).toLocaleString()}
          </div>
        </div>

        <div 
          id="stat-card-tam"
          onClick={() => onNavigateTab('market')}
          className="bg-[#111622] hover:bg-[#151C2C] border border-white/[0.06] hover:border-indigo-500/40 p-4 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Target Market (SOM / TAM)</span>
            <BarChart3 className="w-4 h-4 text-indigo-400 opacity-80 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-white">
            ${project.market.somValue}M <span className="text-xs text-slate-400 font-normal">/ ${project.market.tamValue}M</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {project.market.somDescription || 'Target Obtainable Segment'}
          </div>
        </div>
      </div>

      {/* Main Studio Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Module 1: Business Canvas */}
        <div 
          id="card-nav-canvas"
          onClick={() => onNavigateTab('canvas')}
          className="bg-[#111622] border border-white/[0.06] hover:border-sky-500/40 p-5 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-3 text-sky-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
              Business Model Canvas
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Design the 9 fundamental operational blocks: Value Props, Segments, Channels, Revenue, and Cost Structure.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-4 text-xs font-medium text-sky-400">
            <span>{canvasItemCount} Core Elements Defined</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 2: Financial Model */}
        <div 
          id="card-nav-financials"
          onClick={() => onNavigateTab('financials')}
          className="bg-[#111622] border border-white/[0.06] hover:border-emerald-500/40 p-5 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
              Financial Projections
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Model unit margins, fixed burn rate, cash runway, and simulate a complete 12-month revenue forecast.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-4 text-xs font-medium text-emerald-400">
            <span>Breakeven: {fin.pricingPerUnit > fin.cogsPerUnit ? Math.ceil(fixedBurn / (fin.pricingPerUnit - fin.cogsPerUnit)) : 0} units</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 3: Market & Competitors */}
        <div 
          id="card-nav-market"
          onClick={() => onNavigateTab('market')}
          className="bg-[#111622] border border-white/[0.06] hover:border-indigo-500/40 p-5 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
              Market & Competitor Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Calculate TAM/SAM/SOM sizing, construct targeted Customer Personas (ICP), and benchmark against incumbents.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-4 text-xs font-medium text-indigo-400">
            <span>{project.market.competitors.length} Competitors Tracked</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 4: GTM Engine */}
        <div 
          id="card-nav-gtm"
          onClick={() => onNavigateTab('gtm')}
          className="bg-[#111622] border border-white/[0.06] hover:border-amber-500/40 p-5 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 text-amber-400 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors">
              Go-To-Market Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Prioritize multi-channel customer acquisition strategies, define conversion funnel targets, and execute launch phases.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-4 text-xs font-medium text-amber-400">
            <span>{project.gtm.channels.length} Acquisition Channels</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 5: Pitch Deck & Executive Summary */}
        <div 
          id="card-nav-pitch"
          onClick={() => onNavigateTab('pitch')}
          className="bg-[#111622] border border-white/[0.06] hover:border-purple-500/40 p-5 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3 text-purple-400 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
              Pitch Deck & Executive Summary
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Generate a structured commercial pitch narrative, problem/solution slides, and export clean presentation PDFs.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-4 text-xs font-medium text-purple-400">
            <span>Ask: {fin.currencySymbol}{project.pitch.capitalAsk.toLocaleString()}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Strategic Notes & Direct Action Box */}
        <div className="bg-[#111622] border border-white/[0.06] p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-200">Executive Notes</h3>
              <span className="text-[10px] text-slate-500 uppercase font-mono">Auto-saved</span>
            </div>
            <textarea
              id="textarea-overview-notes"
              value={project.notes}
              onChange={(e) => onChange({ ...project, notes: e.target.value })}
              rows={4}
              placeholder="Record strategic priorities, investor feedback, or action items for this venture..."
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 resize-none"
            />
          </div>
          <div className="text-[11px] text-slate-400 pt-3 border-t border-white/[0.06]">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 font-mono">Ctrl+S</kbd> anytime to save.
          </div>
        </div>
      </div>
    </div>
  );
};
