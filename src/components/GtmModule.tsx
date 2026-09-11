import React from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Radio, 
  Calendar 
} from 'lucide-react';
import { NexoraProject, GtmStrategy, GtmChannel, GtmMilestone } from '../types/project';

interface GtmModuleProps {
  project: NexoraProject;
  onChange: (updated: NexoraProject) => void;
}

export const GtmModule: React.FC<GtmModuleProps> = ({ project, onChange }) => {
  const gtm = project.gtm;

  const updateGtm = (fields: Partial<GtmStrategy>) => {
    onChange({
      ...project,
      gtm: { ...gtm, ...fields },
    });
  };

  const handleToggleMilestone = (id: string) => {
    const updated = gtm.milestones.map((m) =>
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    updateGtm({ milestones: updated });
  };

  const handleAddMilestone = () => {
    const newM: GtmMilestone = {
      id: `m_${Date.now()}`,
      phase: 'Phase 3: Commercial GTM',
      title: 'New Commercial Launch Objective',
      targetDate: 'Next Quarter',
      completed: false,
    };
    updateGtm({ milestones: [...gtm.milestones, newM] });
  };

  const handleDeleteMilestone = (id: string) => {
    updateGtm({ milestones: gtm.milestones.filter((m) => m.id !== id) });
  };

  const handleAddChannel = () => {
    const newCh: GtmChannel = {
      id: `ch_${Date.now()}`,
      name: 'New Acquisition Channel',
      type: 'Inbound',
      priority: 'Medium',
      estimatedCac: 250,
      projectedConversionRate: 3.5,
      status: 'Planned',
    };
    updateGtm({ channels: [...gtm.channels, newCh] });
  };

  const handleUpdateChannel = (id: string, fields: Partial<GtmChannel>) => {
    const updated = gtm.channels.map((ch) => (ch.id === id ? { ...ch, ...fields } : ch));
    updateGtm({ channels: updated });
  };

  const handleDeleteChannel = (id: string) => {
    updateGtm({ channels: gtm.channels.filter((ch) => ch.id !== id) });
  };

  const priorityStyles: Record<string, string> = {
    High: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };

  return (
    <div id="module-gtm" className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Go-To-Market (GTM) Strategy</h2>
        <p className="text-xs text-slate-400">
          Establish multi-channel acquisition funnels and execute phased milestone roadmaps.
        </p>
      </div>

      {/* Positioning & Core Messaging */}
      <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Radio className="w-4 h-4 text-sky-400" />
          <span>Core Positioning & Messaging Hook</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-medium block mb-1">Target Audience Proposition</label>
            <textarea
              rows={3}
              id="textarea-gtm-message"
              value={gtm.targetAudienceMessage}
              onChange={(e) => updateGtm({ targetAudienceMessage: e.target.value })}
              placeholder="How do you articulate the transformation to your customer?"
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg p-2.5 text-slate-200 focus:border-sky-500 focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-slate-400 font-medium block mb-1">Unfair Differentiator Hook</label>
            <textarea
              rows={3}
              id="textarea-gtm-hook"
              value={gtm.coreHook}
              onChange={(e) => updateGtm({ coreHook: e.target.value })}
              placeholder="The sharpest one-liner hook used in sales demos and outbound campaigns."
              className="w-full bg-[#0B0F17] border border-white/[0.08] rounded-lg p-2.5 text-slate-200 focus:border-sky-500 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Acquisition Channels Matrix */}
      <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Customer Acquisition Channels</span>
          </h3>
          <button
            id="btn-add-gtm-channel"
            onClick={handleAddChannel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Channel</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Channel Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Est. CAC</th>
                <th className="py-2.5 px-3">Conv. Rate</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {gtm.channels.map((ch) => (
                <tr key={ch.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={ch.name}
                      onChange={(e) => handleUpdateChannel(ch.id, { name: e.target.value })}
                      className="bg-transparent text-slate-200 font-medium focus:outline-none border-b border-transparent focus:border-sky-500 w-full"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <select
                      value={ch.type}
                      onChange={(e) => handleUpdateChannel(ch.id, { type: e.target.value as GtmChannel['type'] })}
                      className="bg-[#0B0F17] border border-white/[0.08] rounded px-2 py-1 text-slate-300 focus:outline-none"
                    >
                      <option value="Inbound">Inbound</option>
                      <option value="Outbound">Outbound</option>
                      <option value="Paid">Paid</option>
                      <option value="Product-Led">Product-Led</option>
                      <option value="Partnerships">Partnerships</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-3">
                    <select
                      value={ch.priority}
                      onChange={(e) => handleUpdateChannel(ch.id, { priority: e.target.value as GtmChannel['priority'] })}
                      className={`border rounded px-2 py-1 text-[11px] font-semibold uppercase ${priorityStyles[ch.priority]}`}
                    >
                      <option value="High" className="bg-[#111622] text-rose-300">High</option>
                      <option value="Medium" className="bg-[#111622] text-amber-300">Medium</option>
                      <option value="Low" className="bg-[#111622] text-slate-300">Low</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1 font-mono text-slate-300">
                      <span>$</span>
                      <input
                        type="number"
                        value={ch.estimatedCac || ''}
                        onChange={(e) => handleUpdateChannel(ch.id, { estimatedCac: parseFloat(e.target.value) || 0 })}
                        className="bg-transparent border-b border-transparent focus:border-sky-500 w-16 focus:outline-none font-mono"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1 font-mono text-slate-300">
                      <input
                        type="number"
                        value={ch.projectedConversionRate || ''}
                        onChange={(e) => handleUpdateChannel(ch.id, { projectedConversionRate: parseFloat(e.target.value) || 0 })}
                        className="bg-transparent border-b border-transparent focus:border-sky-500 w-14 focus:outline-none font-mono"
                      />
                      <span>%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <select
                      value={ch.status}
                      onChange={(e) => handleUpdateChannel(ch.id, { status: e.target.value as GtmChannel['status'] })}
                      className="bg-[#0B0F17] border border-white/[0.08] rounded px-2 py-1 text-slate-300 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Planned">Planned</option>
                      <option value="Testing">Testing</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleDeleteChannel(ch.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove channel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4-Phase Roadmap & Milestones */}
      <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-amber-400" />
            <span>Phased Launch Roadmap & Milestones</span>
          </h3>
          <button
            id="btn-add-gtm-milestone"
            onClick={handleAddMilestone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {gtm.milestones.map((m) => (
            <div
              key={m.id}
              id={`gtm-milestone-${m.id}`}
              className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                m.completed
                  ? 'bg-[#0D1815] border-emerald-500/30'
                  : 'bg-[#0B0F17] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => handleToggleMilestone(m.id)}
                  className="cursor-pointer"
                  title="Toggle completion"
                >
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 hover:text-slate-300 shrink-0" />
                  )}
                </button>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/[0.04] text-slate-400 border border-white/[0.06] shrink-0">
                    {m.phase}
                  </span>
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => {
                      const updated = gtm.milestones.map((x) =>
                        x.id === m.id ? { ...x, title: e.target.value } : x
                      );
                      updateGtm({ milestones: updated });
                    }}
                    className={`bg-transparent text-slate-200 font-medium focus:outline-none flex-1 ${
                      m.completed ? 'line-through text-slate-400' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={m.targetDate}
                  onChange={(e) => {
                    const updated = gtm.milestones.map((x) =>
                      x.id === m.id ? { ...x, targetDate: e.target.value } : x
                    );
                    updateGtm({ milestones: updated });
                  }}
                  className="bg-transparent text-slate-400 text-right w-24 focus:outline-none text-[11px]"
                  placeholder="Target Date"
                />
                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
