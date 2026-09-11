import React from 'react';
import { 
  LayoutDashboard, 
  Grid3X3, 
  TrendingUp, 
  Users2, 
  Rocket, 
  Presentation,
  Palette,
  Download
} from 'lucide-react';

export type ActiveTab = 'overview' | 'canvas' | 'financials' | 'market' | 'gtm' | 'pitch' | 'themes' | 'export';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  lang?: 'en' | 'fr' | 'ar';
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'canvas' as ActiveTab, label: 'Business Model Canvas', icon: Grid3X3 },
    { id: 'financials' as ActiveTab, label: 'Financials & Economics', icon: TrendingUp },
    { id: 'market' as ActiveTab, label: 'Market & Competitors', icon: Users2 },
    { id: 'gtm' as ActiveTab, label: 'Go-To-Market', icon: Rocket },
    { id: 'pitch' as ActiveTab, label: 'Pitch Deck', icon: Presentation },
    { id: 'themes' as ActiveTab, label: 'Design & Themes', icon: Palette },
    { id: 'export' as ActiveTab, label: 'Export Center', icon: Download },
  ];

  return (
    <nav 
      id="nexora-main-nav"
      className="bg-[#0D121D] border-b border-white/[0.06] px-4 flex items-center gap-1 overflow-x-auto select-none shrink-0"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-3 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'border-sky-500 text-sky-300 bg-sky-500/[0.04]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

