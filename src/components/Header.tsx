import React, { useState, useEffect } from 'react';
import { Bus, Train, Map, Navigation, Bookmark, RefreshCw, Radio, Bell, Activity } from 'lucide-react';

export type ActiveTab = 'arrivals' | 'routes' | 'mrt' | 'journey' | 'map' | 'saved';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onRefresh: () => void;
  onOpenApiHealth?: () => void;
  isRefreshing: boolean;
  refreshSeconds: number;
  alertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onRefresh,
  onOpenApiHealth,
  isRefreshing,
  refreshSeconds,
  alertCount,
}) => {
  const [sgTime, setSgTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Singapore SGT format
      const timeStr = now.toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setSgTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'arrivals', label: 'Live Arrivals', icon: Bus },
    { id: 'routes', label: 'Route Explorer', icon: Navigation },
    { id: 'mrt', label: 'Rail & Advisories', icon: Train, badge: alertCount },
    { id: 'journey', label: 'Journey & Fares', icon: Navigation },
    { id: 'map', label: 'Transit Map', icon: Map },
    { id: 'saved', label: 'Pinned Commutes', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#4B004E] text-white shadow-md border-b border-[#6B126D]">
      {/* Top Banner / Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#EB6B26] to-[#D81B60] flex items-center justify-center shadow-inner text-white">
            <Bus className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight leading-none text-white">
                Singapore Civic Transit
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#EB6B26] text-white">
                LTA DataMall Live
              </span>
            </div>
            <p className="text-[11px] text-white/70 leading-tight hidden xs:block mt-0.5">
              Real-time bus & rail commuter intelligence • Republic of Singapore
            </p>
          </div>
        </div>

        {/* Live Status & Refresh Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* API Health Monitor Link */}
          {onOpenApiHealth && (
            <button
              type="button"
              onClick={onOpenApiHealth}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/15"
              title="Monitor API status & /api/health"
            >
              <Activity className="w-3.5 h-3.5 text-[#1B8A44]" />
              <span className="hidden sm:inline">API Status</span>
            </button>
          )}

          {/* Real-time Clock */}
          <div className="hidden md:flex items-center gap-2 bg-[#6B126D]/50 border border-white/15 px-3 py-1 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-[#1B8A44] animate-pulse" />
            <span className="font-mono text-white/90 font-medium">SGT {sgTime}</span>
          </div>

          {/* Refresh button with countdown */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EB6B26] hover:bg-[#d05917] active:scale-95 text-white font-medium text-xs sm:text-sm shadow-xs transition-all"
            title="Refresh arrival countdowns"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="text-[10px] opacity-80 font-mono">({refreshSeconds}s)</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1.5 no-scrollbar text-xs sm:text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#4B004E] shadow-sm font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#6B126D]' : 'text-white/80'}`} />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#EB6B26] text-white' : 'bg-[#EB6B26] text-white'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
