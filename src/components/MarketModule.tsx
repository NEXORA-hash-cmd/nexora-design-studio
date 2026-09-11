import React, { useState } from 'react';
import { 
  Users2, 
  Target, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Trophy, 
  Building,
  DollarSign
} from 'lucide-react';
import { NexoraProject, Competitor, CustomerPersona } from '../types/project';

interface MarketModuleProps {
  project: NexoraProject;
  onChange: (updated: NexoraProject) => void;
}

export const MarketModule: React.FC<MarketModuleProps> = ({ project, onChange }) => {
  const market = project.market;

  const updateMarket = (fields: Partial<typeof market>) => {
    onChange({
      ...project,
      market: { ...market, ...fields },
    });
  };

  const updateIcp = (fields: Partial<CustomerPersona>) => {
    onChange({
      ...project,
      market: {
        ...market,
        icp: { ...market.icp, ...fields },
      },
    });
  };

  const handleAddCompetitor = () => {
    const newComp: Competitor = {
      id: `comp_${Date.now()}`,
      name: 'New Competitor',
      pricing: '$99/mo',
      marketShare: '10%',
      strengths: 'Incumbent brand footprint',
      weaknesses: 'Slow development cycle, legacy architecture',
      differentiator: 'NEXORA provides instant setup and modern user experience',
    };

    updateMarket({
      competitors: [...market.competitors, newComp],
    });
  };

  const handleUpdateCompetitor = (id: string, fields: Partial<Competitor>) => {
    const updated = market.competitors.map((c) => (c.id === id ? { ...c, ...fields } : c));
    updateMarket({ competitors: updated });
  };

  const handleDeleteCompetitor = (id: string) => {
    const updated = market.competitors.filter((c) => c.id !== id);
    updateMarket({ competitors: updated });
  };

  return (
    <div id="module-market" className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Market Sizing & Competitor Matrix</h2>
        <p className="text-xs text-slate-400">
          Define addressable market opportunities, formulate ICP profiles, and map competitive moats.
        </p>
      </div>

      {/* Market Sizing: TAM / SAM / SOM */}
      <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Target className="w-4 h-4 text-sky-400" />
          <span>Market Sizing Pyramid (TAM / SAM / SOM)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TAM */}
          <div className="bg-[#0B0F17] border border-white/[0.06] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                TAM (Total Market)
              </span>
              <span className="text-[10px] text-slate-400">Overall demand</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono font-bold">$</span>
              <input
                id="input-market-tam"
                type="number"
                value={market.tamValue || ''}
                onChange={(e) => updateMarket({ tamValue: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#141A29] border border-white/[0.08] rounded px-2.5 py-1 text-base font-bold text-white font-mono focus:border-sky-500 focus:outline-none"
              />
              <span className="text-slate-400 text-xs font-bold">M</span>
            </div>
            <textarea
              id="textarea-market-tam-desc"
              value={market.tamDescription}
              onChange={(e) => updateMarket({ tamDescription: e.target.value })}
              rows={2}
              placeholder="Describe total market scope and macroeconomic industry figures..."
              className="w-full bg-transparent text-[11px] text-slate-300 placeholder:text-slate-400 focus:outline-none border-t border-white/[0.04] pt-2 resize-none"
            />
          </div>

          {/* SAM */}
          <div className="bg-[#0B0F17] border border-white/[0.06] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                SAM (Serviceable Market)
              </span>
              <span className="text-[10px] text-slate-400">Target segment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono font-bold">$</span>
              <input
                id="input-market-sam"
                type="number"
                value={market.samValue || ''}
                onChange={(e) => updateMarket({ samValue: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#141A29] border border-white/[0.08] rounded px-2.5 py-1 text-base font-bold text-white font-mono focus:border-sky-500 focus:outline-none"
              />
              <span className="text-slate-400 text-xs font-bold">M</span>
            </div>
            <textarea
              id="textarea-market-sam-desc"
              value={market.samDescription}
              onChange={(e) => updateMarket({ samDescription: e.target.value })}
              rows={2}
              placeholder="Describe the specific segment your business model can serve..."
              className="w-full bg-transparent text-[11px] text-slate-300 placeholder:text-slate-400 focus:outline-none border-t border-white/[0.04] pt-2 resize-none"
            />
          </div>

          {/* SOM */}
          <div className="bg-[#0B0F17] border border-sky-500/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                SOM (Obtainable Market)
              </span>
              <span className="text-[10px] text-sky-400">Near-term capture</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sky-400 font-mono font-bold">$</span>
              <input
                id="input-market-som"
                type="number"
                value={market.somValue || ''}
                onChange={(e) => updateMarket({ somValue: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#141A29] border border-sky-500/40 rounded px-2.5 py-1 text-base font-bold text-sky-300 font-mono focus:border-sky-500 focus:outline-none"
              />
              <span className="text-sky-400 text-xs font-bold">M</span>
            </div>
            <textarea
              id="textarea-market-som-desc"
              value={market.somDescription}
              onChange={(e) => updateMarket({ somDescription: e.target.value })}
              rows={2}
              placeholder="Realistic target market share captured in 3-5 year roadmap..."
              className="w-full bg-transparent text-[11px] text-slate-300 placeholder:text-slate-400 focus:outline-none border-t border-white/[0.04] pt-2 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Ideal Customer Persona (ICP) Builder */}
      <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Users2 className="w-4 h-4 text-emerald-400" />
          <span>Target Customer Persona (ICP Profile)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Target Decision Maker / Role</label>
            <input
              id="input-icp-role"
              type="text"
              value={market.icp.role}
              onChange={(e) => updateIcp({ role: e.target.value })}
              placeholder="e.g. VP of Engineering / Head of Product"
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Industry Sector</label>
            <input
              id="input-icp-industry"
              type="text"
              value={market.icp.industry}
              onChange={(e) => updateIcp({ industry: e.target.value })}
              placeholder="e.g. B2B SaaS, HealthTech, FinTech"
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Target Company Size</label>
            <input
              id="input-icp-size"
              type="text"
              value={market.icp.companySize}
              onChange={(e) => updateIcp({ companySize: e.target.value })}
              placeholder="e.g. 50 - 250 Employees ($5M - $25M ARR)"
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Critical Pain Point</label>
            <input
              id="input-icp-pain"
              type="text"
              value={market.icp.primaryPainPoint}
              onChange={(e) => updateIcp({ primaryPainPoint: e.target.value })}
              placeholder="e.g. High customer churn due to broken onboarding"
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Urgent Buying Trigger</label>
            <input
              id="input-icp-trigger"
              type="text"
              value={market.icp.buyingTrigger}
              onChange={(e) => updateIcp({ buyingTrigger: e.target.value })}
              placeholder="e.g. Expansion capital round, executive turnover"
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Primary Success Metric</label>
            <input
              id="input-icp-success"
              type="text"
              value={market.icp.successMetric}
              onChange={(e) => updateIcp({ successMetric: e.target.value })}
              placeholder="e.g. 50% faster time-to-value, 15% lower churn"
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Competitor Benchmarking Matrix */}
      <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Competitor Benchmarking Matrix</span>
          </h3>
          <button
            id="btn-add-competitor"
            onClick={handleAddCompetitor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Competitor</span>
          </button>
        </div>

        <div className="space-y-3">
          {market.competitors.map((comp) => (
            <div
              key={comp.id}
              id={`competitor-card-${comp.id}`}
              className="bg-[#0B0F17] border border-white/[0.06] rounded-lg p-4 space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.04]">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => handleUpdateCompetitor(comp.id, { name: e.target.value })}
                    className="font-bold text-slate-200 text-sm bg-transparent border-b border-transparent hover:border-white/20 focus:border-sky-400 focus:outline-none"
                    placeholder="Competitor Name"
                  />
                  <input
                    type="text"
                    value={comp.pricing}
                    onChange={(e) => handleUpdateCompetitor(comp.id, { pricing: e.target.value })}
                    className="text-slate-400 text-xs bg-transparent border-b border-transparent hover:border-white/20 focus:border-sky-400 focus:outline-none"
                    placeholder="Pricing Model"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={comp.marketShare}
                    onChange={(e) => handleUpdateCompetitor(comp.id, { marketShare: e.target.value })}
                    className="text-slate-400 text-xs bg-transparent border-b border-transparent hover:border-white/20 focus:border-sky-400 focus:outline-none w-28 text-right"
                    placeholder="Market Share"
                  />
                  <button
                    id={`btn-del-competitor-${comp.id}`}
                    onClick={() => handleDeleteCompetitor(comp.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove competitor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                    Their Strengths
                  </label>
                  <textarea
                    rows={2}
                    value={comp.strengths}
                    onChange={(e) => handleUpdateCompetitor(comp.id, { strengths: e.target.value })}
                    className="w-full bg-[#141A29] border border-white/[0.06] rounded p-2 text-slate-300 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                    Their Vulnerabilities & Gaps
                  </label>
                  <textarea
                    rows={2}
                    value={comp.weaknesses}
                    onChange={(e) => handleUpdateCompetitor(comp.id, { weaknesses: e.target.value })}
                    className="w-full bg-[#141A29] border border-white/[0.06] rounded p-2 text-slate-300 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-emerald-400 uppercase font-semibold block mb-1">
                    NEXORA Differentiator / Moat
                  </label>
                  <textarea
                    rows={2}
                    value={comp.differentiator}
                    onChange={(e) => handleUpdateCompetitor(comp.id, { differentiator: e.target.value })}
                    className="w-full bg-[#141A29] border border-emerald-500/30 rounded p-2 text-emerald-200 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
