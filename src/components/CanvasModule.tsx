import React, { useState } from 'react';
import { Plus, Trash2, Tag, HelpCircle, Check, Sparkles } from 'lucide-react';
import { NexoraProject, BusinessCanvas, CanvasBlock, CanvasItem } from '../types/project';

interface CanvasModuleProps {
  project: NexoraProject;
  onChange: (updated: NexoraProject) => void;
}

type BlockKey = keyof BusinessCanvas;

export const CanvasModule: React.FC<CanvasModuleProps> = ({ project, onChange }) => {
  const [activePromptBlock, setActivePromptBlock] = useState<BlockKey | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({});

  const handleAddItem = (blockKey: BlockKey) => {
    const text = newItemTexts[blockKey]?.trim();
    if (!text) return;

    const newItem: CanvasItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text,
      category: 'primary',
    };

    const updatedCanvas = {
      ...project.canvas,
      [blockKey]: {
        ...project.canvas[blockKey],
        items: [...project.canvas[blockKey].items, newItem],
      },
    };

    onChange({ ...project, canvas: updatedCanvas });
    setNewItemTexts({ ...newItemTexts, [blockKey]: '' });
  };

  const handleDeleteItem = (blockKey: BlockKey, itemId: string) => {
    const updatedCanvas = {
      ...project.canvas,
      [blockKey]: {
        ...project.canvas[blockKey],
        items: project.canvas[blockKey].items.filter((i) => i.id !== itemId),
      },
    };
    onChange({ ...project, canvas: updatedCanvas });
  };

  const handleCycleCategory = (blockKey: BlockKey, itemId: string) => {
    const categories: CanvasItem['category'][] = ['primary', 'secondary', 'opportunity', 'risk'];
    const updatedItems = project.canvas[blockKey].items.map((item) => {
      if (item.id === itemId) {
        const currentIdx = categories.indexOf(item.category || 'primary');
        const nextIdx = (currentIdx + 1) % categories.length;
        return { ...item, category: categories[nextIdx] };
      }
      return item;
    });

    onChange({
      ...project,
      canvas: {
        ...project.canvas,
        [blockKey]: { ...project.canvas[blockKey], items: updatedItems },
      },
    });
  };

  const handleSaveEdit = (blockKey: BlockKey, itemId: string) => {
    if (!editingText.trim()) return;
    const updatedItems = project.canvas[blockKey].items.map((item) => {
      if (item.id === itemId) {
        return { ...item, text: editingText.trim() };
      }
      return item;
    });

    onChange({
      ...project,
      canvas: {
        ...project.canvas,
        [blockKey]: { ...project.canvas[blockKey], items: updatedItems },
      },
    });
    setEditingItemId(null);
  };

  const categoryBadgeStyles: Record<string, string> = {
    primary: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    secondary: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    opportunity: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    risk: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };

  const renderBlock = (blockKey: BlockKey, label: string, accentBorder = 'border-white/[0.08]') => {
    const block: CanvasBlock = project.canvas[blockKey];
    const isShowingPrompt = activePromptBlock === blockKey;

    return (
      <div 
        id={`canvas-block-${blockKey}`}
        className={`bg-[#0F1420] border ${accentBorder} rounded-xl p-3.5 flex flex-col justify-between shadow-lg relative min-h-[260px]`}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-1 pb-2 mb-2 border-b border-white/[0.06]">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {label}
              </h4>
              <p className="text-[10px] text-slate-400 leading-tight">
                {block.subtitle}
              </p>
            </div>
            <button
              id={`btn-help-${blockKey}`}
              onClick={() => setActivePromptBlock(isShowingPrompt ? null : blockKey)}
              className="p-1 rounded text-slate-500 hover:text-sky-400 hover:bg-white/[0.04] transition-colors"
              title="Strategic prompt"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Advice popup */}
          {isShowingPrompt && (
            <div className="bg-sky-950/80 border border-sky-500/30 rounded-lg p-2.5 mb-2 text-[11px] text-sky-200 animate-in fade-in">
              <div className="font-semibold text-sky-300 flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3" /> Expert Guidance
              </div>
              {block.description}
            </div>
          )}

          {/* Items List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
            {block.items.map((item) => {
              const isEditing = editingItemId === item.id;
              const catClass = categoryBadgeStyles[item.category || 'primary'];

              return (
                <div
                  key={item.id}
                  id={`canvas-item-${item.id}`}
                  className="bg-[#141B2B] hover:bg-[#182136] border border-white/[0.06] rounded-lg p-2 text-xs transition-colors group relative"
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(blockKey, item.id)}
                        className="w-full bg-[#0B0F17] border border-sky-500/50 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(blockKey, item.id)}
                        className="p-1 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/30"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p 
                        onClick={() => {
                          setEditingItemId(item.id);
                          setEditingText(item.text);
                        }}
                        className="text-slate-200 cursor-text leading-relaxed hover:text-white"
                        title="Click to edit"
                      >
                        {item.text}
                      </p>
                      <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-white/[0.04]">
                        <button
                          onClick={() => handleCycleCategory(blockKey, item.id)}
                          className={`text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded border ${catClass} flex items-center gap-1 cursor-pointer`}
                          title="Cycle item tag"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          <span>{item.category || 'primary'}</span>
                        </button>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            id={`btn-del-item-${item.id}`}
                            onClick={() => handleDeleteItem(blockKey, item.id)}
                            className="p-0.5 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete element"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {block.items.length === 0 && (
              <div className="text-center py-4 text-[11px] text-slate-400 italic">
                No elements defined yet
              </div>
            )}
          </div>
        </div>

        {/* Add item input */}
        <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center gap-1.5">
          <input
            id={`input-add-${blockKey}`}
            type="text"
            value={newItemTexts[blockKey] || ''}
            onChange={(e) => setNewItemTexts({ ...newItemTexts, [blockKey]: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(blockKey)}
            placeholder="Add point..."
            className="w-full bg-[#0B0F17] border border-white/[0.06] focus:border-sky-500/50 rounded px-2 py-1 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            id={`btn-add-${blockKey}`}
            onClick={() => handleAddItem(blockKey)}
            disabled={!newItemTexts[blockKey]?.trim()}
            className="p-1 rounded bg-white/[0.06] hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Add point"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="module-canvas" className="p-6 max-w-7xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Intro info bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Business Model Canvas</h2>
          <p className="text-xs text-slate-400">
            The foundational 9-block strategic blueprint. Click any text to edit inline. Click tag to cycle category.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Legend:</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30">Primary</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Opportunity</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">Risk</span>
        </div>
      </div>

      {/* Classical 5-column upper matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Col 1: Key Partners */}
        <div className="h-full">
          {renderBlock('keyPartners', 'Key Partners', 'border-indigo-500/20')}
        </div>

        {/* Col 2: Key Activities & Key Resources */}
        <div className="flex flex-col gap-3">
          {renderBlock('keyActivities', 'Key Activities', 'border-indigo-500/20')}
          {renderBlock('keyResources', 'Key Resources', 'border-indigo-500/20')}
        </div>

        {/* Col 3: Value Propositions (Center Core) */}
        <div className="h-full">
          {renderBlock('valuePropositions', 'Value Propositions', 'border-sky-500/40')}
        </div>

        {/* Col 4: Customer Relationships & Channels */}
        <div className="flex flex-col gap-3">
          {renderBlock('customerRelationships', 'Customer Relationships', 'border-emerald-500/20')}
          {renderBlock('channels', 'Channels', 'border-emerald-500/20')}
        </div>

        {/* Col 5: Customer Segments */}
        <div className="h-full">
          {renderBlock('customerSegments', 'Customer Segments', 'border-emerald-500/20')}
        </div>
      </div>

      {/* Bottom tier: Cost Structure & Revenue Streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {renderBlock('costStructure', 'Cost Structure (Overhead & COGS)', 'border-amber-500/30')}
        {renderBlock('revenueStreams', 'Revenue Streams (Pricing & Monetization)', 'border-emerald-500/30')}
      </div>
    </div>
  );
};
