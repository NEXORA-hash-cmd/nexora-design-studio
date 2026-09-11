import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  FileSpreadsheet, 
  Calendar,
  Wallet,
  Users
} from 'lucide-react';
import { NexoraProject, FinancialModel } from '../types/project';
import { exportFinancialsToCsv } from '../utils/exporter';

interface FinancialModuleProps {
  project: NexoraProject;
  onChange: (updated: NexoraProject) => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const FinancialModule: React.FC<FinancialModuleProps> = ({
  project,
  onChange,
  onShowToast,
}) => {
  const fin = project.financials;

  const updateFin = (fields: Partial<FinancialModel>) => {
    onChange({
      ...project,
      financials: { ...fin, ...fields },
    });
  };

  const updateFixedCost = (key: keyof FinancialModel['monthlyFixedCosts'], val: number) => {
    onChange({
      ...project,
      financials: {
        ...fin,
        monthlyFixedCosts: {
          ...fin.monthlyFixedCosts,
          [key]: val,
        },
      },
    });
  };

  // Calculations
  const price = fin.pricingPerUnit || 0;
  const cogs = fin.cogsPerUnit || 0;
  const grossProfit = price - cogs;
  const grossMargin = price > 0 ? ((grossProfit / price) * 100).toFixed(1) : '0';

  const lifespanMonths = fin.averageCustomerLifespanMonths || 1;
  const ltv = grossProfit * lifespanMonths;
  const cac = fin.cac || 1;
  const ltvCacRatio = cac > 0 ? (ltv / cac).toFixed(2) : '0.00';
  const ratioNum = parseFloat(ltvCacRatio);

  const totalFixedBurn = (fin.monthlyFixedCosts.payroll || 0) +
                         (fin.monthlyFixedCosts.softwareHosting || 0) +
                         (fin.monthlyFixedCosts.marketingBudget || 0) +
                         (fin.monthlyFixedCosts.officeMisc || 0);

  const breakevenUnits = grossProfit > 0 ? Math.ceil(totalFixedBurn / grossProfit) : 0;
  const breakevenRevenue = breakevenUnits * price;

  const currentMrr = (fin.currentCustomers || 0) * price;
  const currentGrossProfit = (fin.currentCustomers || 0) * grossProfit;
  const netMonthlyCashflow = currentGrossProfit - totalFixedBurn;

  const runwayMonths = netMonthlyCashflow < 0 && fin.startingCapital > 0
    ? (fin.startingCapital / Math.abs(netMonthlyCashflow)).toFixed(1)
    : netMonthlyCashflow >= 0 ? 'Self-Sustaining' : '0.0';

  // Generate 12-month projections
  const projections = [];
  let simCustomers = fin.currentCustomers || 10;
  let simCash = fin.startingCapital || 50000;
  const growthRate = (fin.projectedMonthlyGrowthRate || 10) / 100;

  for (let m = 1; m <= 12; m++) {
    const rev = simCustomers * price;
    const directCost = simCustomers * cogs;
    const gross = rev - directCost;
    const net = gross - totalFixedBurn;
    simCash += net;

    projections.push({
      month: m,
      customers: Math.round(simCustomers),
      revenue: Math.round(rev),
      cogs: Math.round(directCost),
      grossProfit: Math.round(gross),
      fixedBurn: totalFixedBurn,
      netCashflow: Math.round(net),
      endingCash: Math.round(simCash),
    });

    simCustomers = simCustomers * (1 + growthRate);
  }

  const handleExportCsv = async () => {
    const res = await exportFinancialsToCsv(project);
    if (res.success) {
      onShowToast('success', res.message);
    } else {
      onShowToast('error', res.message);
    }
  };

  return (
    <div id="module-financials" className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header & CSV Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Financial Model & Unit Economics</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Live Simulator
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Interactive calculations for unit profitability, burn rate, cash runway, and 12-month projections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-financials-csv"
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Margin */}
        <div className="bg-[#101624] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-xs text-slate-400 mb-1">Gross Margin</div>
          <div className="text-2xl font-bold text-white">{grossMargin}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Profit: <span className="text-emerald-400 font-medium">{fin.currencySymbol}{grossProfit.toLocaleString()}</span> / unit
          </div>
        </div>

        {/* KPI 2: LTV:CAC Ratio */}
        <div className="bg-[#101624] border border-white/[0.08] p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>LTV : CAC Ratio</span>
            {ratioNum >= 3 ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                <CheckCircle className="w-3 h-3" /> Healthy
              </span>
            ) : ratioNum >= 1.5 ? (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold bg-amber-500/20 px-1.5 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3" /> Moderate
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-rose-400 font-semibold bg-rose-500/20 px-1.5 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3" /> Unprofitable
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-white">{ltvCacRatio}x</div>
          <div className="text-[11px] text-slate-400 mt-1">
            LTV: {fin.currencySymbol}{Math.round(ltv).toLocaleString()} vs CAC: {fin.currencySymbol}{cac.toLocaleString()}
          </div>
        </div>

        {/* KPI 3: Breakeven Threshold */}
        <div className="bg-[#101624] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-xs text-slate-400 mb-1">Breakeven Volume</div>
          <div className="text-2xl font-bold text-white">{breakevenUnits} units</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Required Revenue: {fin.currencySymbol}{breakevenRevenue.toLocaleString()}/mo
          </div>
        </div>

        {/* KPI 4: Cash Runway */}
        <div className="bg-[#101624] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-xs text-slate-400 mb-1">Estimated Runway</div>
          <div className="text-2xl font-bold text-white">
            {runwayMonths === 'Self-Sustaining' ? (
              <span className="text-emerald-400">Profitable</span>
            ) : (
              `${runwayMonths} Months`
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cash: {fin.currencySymbol}{fin.startingCapital.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Unit Economics & Fixed Overhead */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Unit Economics Inputs */}
        <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-sky-400" />
              <span>Unit Economics Inputs</span>
            </h3>
            <span className="text-xs text-slate-400">Per Customer / Seat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Selling Price ({fin.currencySymbol})
              </label>
              <input
                id="input-price-unit"
                type="number"
                value={fin.pricingPerUnit || ''}
                onChange={(e) => updateFin({ pricingPerUnit: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Recurring price per unit/subscription</span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Direct COGS ({fin.currencySymbol})
              </label>
              <input
                id="input-cogs-unit"
                type="number"
                value={fin.cogsPerUnit || ''}
                onChange={(e) => updateFin({ cogsPerUnit: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Hosting, third-party APIs, direct delivery</span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Customer Acquisition Cost (CAC) ({fin.currencySymbol})
              </label>
              <input
                id="input-cac"
                type="number"
                value={fin.cac || ''}
                onChange={(e) => updateFin({ cac: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Marketing + sales expense per closed account</span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Avg Customer Lifespan (Months)
              </label>
              <input
                id="input-lifespan"
                type="number"
                value={fin.averageCustomerLifespanMonths || ''}
                onChange={(e) => updateFin({ averageCustomerLifespanMonths: parseFloat(e.target.value) || 1 })}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Duration before customer churns (e.g. 24 mo)</span>
            </div>
          </div>

          <div className="bg-[#0B0F17] p-3 rounded-lg border border-white/[0.06] text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Gross Profit per Unit:</span>
              <span className="text-slate-200 font-mono font-medium">{fin.currencySymbol}{grossProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Calculated Lifetime Value (LTV):</span>
              <span className="text-emerald-400 font-mono font-semibold">{fin.currencySymbol}{Math.round(ltv).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Fixed Overhead (Burn Rate) */}
        <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Monthly Fixed Overhead (Burn Rate)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total: <span className="font-mono text-emerald-400">{fin.currencySymbol}{totalFixedBurn.toLocaleString()}/mo</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Payroll & Core Talent ({fin.currencySymbol})
              </label>
              <input
                id="input-burn-payroll"
                type="number"
                value={fin.monthlyFixedCosts.payroll || ''}
                onChange={(e) => updateFixedCost('payroll', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Software, Tools & Hosting ({fin.currencySymbol})
              </label>
              <input
                id="input-burn-software"
                type="number"
                value={fin.monthlyFixedCosts.softwareHosting || ''}
                onChange={(e) => updateFixedCost('softwareHosting', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Marketing & Ad Spend ({fin.currencySymbol})
              </label>
              <input
                id="input-burn-marketing"
                type="number"
                value={fin.monthlyFixedCosts.marketingBudget || ''}
                onChange={(e) => updateFixedCost('marketingBudget', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Operations & Misc ({fin.currencySymbol})
              </label>
              <input
                id="input-burn-office"
                type="number"
                value={fin.monthlyFixedCosts.officeMisc || ''}
                onChange={(e) => updateFixedCost('officeMisc', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-[#0B0F17] p-3 rounded-lg border border-white/[0.06] text-xs flex items-center justify-between">
            <span className="text-slate-400">Current Monthly Net Cashflow:</span>
            <span className={`font-mono font-bold ${netMonthlyCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netMonthlyCashflow >= 0 ? '+' : ''}{fin.currencySymbol}{Math.round(netMonthlyCashflow).toLocaleString()}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Parameters */}
      <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Growth Simulation Controls</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Starting Cash in Bank ({fin.currencySymbol})
            </label>
            <input
              id="input-sim-cash"
              type="number"
              value={fin.startingCapital || ''}
              onChange={(e) => updateFin({ startingCapital: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Current Paying Customers
            </label>
            <input
              id="input-sim-customers"
              type="number"
              value={fin.currentCustomers || ''}
              onChange={(e) => updateFin({ currentCustomers: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Projected MoM Customer Growth (%)
            </label>
            <input
              id="input-sim-growth"
              type="number"
              value={fin.projectedMonthlyGrowthRate || ''}
              onChange={(e) => updateFin({ projectedMonthlyGrowthRate: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 12-Month Projections Table */}
      <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">
            12-Month Financial Forecast
          </h3>
          <span className="text-xs text-slate-400">
            End of Year 1 ARR: <span className="font-mono text-emerald-400 font-semibold">{fin.currencySymbol}{(projections[11].revenue * 12).toLocaleString()}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Customers</th>
                <th className="py-2.5 px-3">Revenue</th>
                <th className="py-2.5 px-3">Gross Profit</th>
                <th className="py-2.5 px-3">Fixed Burn</th>
                <th className="py-2.5 px-3">Net Cashflow</th>
                <th className="py-2.5 px-3 text-right">Ending Cash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono">
              {projections.map((row) => (
                <tr key={row.month} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 px-3 text-slate-300 font-sans font-medium">Month {row.month}</td>
                  <td className="py-2 px-3 text-slate-200">{row.customers}</td>
                  <td className="py-2 px-3 text-sky-300">{fin.currencySymbol}{row.revenue.toLocaleString()}</td>
                  <td className="py-2 px-3 text-slate-300">{fin.currencySymbol}{row.grossProfit.toLocaleString()}</td>
                  <td className="py-2 px-3 text-slate-400">{fin.currencySymbol}{row.fixedBurn.toLocaleString()}</td>
                  <td className={`py-2 px-3 font-semibold ${row.netCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.netCashflow >= 0 ? '+' : ''}{fin.currencySymbol}{row.netCashflow.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-200 font-bold">
                    {fin.currencySymbol}{row.endingCash.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
