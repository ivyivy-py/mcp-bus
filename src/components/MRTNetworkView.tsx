import React, { useState } from 'react';
import { MRT_LINES, TRANSIT_ALERTS } from '../data/transitData';
import { DisruptionCard } from './DisruptionCard';
import { Train, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';

export const MRTNetworkView: React.FC = () => {
  const [filterMode, setFilterMode] = useState<'all' | 'alerts' | 'sbst' | 'smrt'>('all');

  const filteredLines = MRT_LINES.filter((line) => {
    if (filterMode === 'sbst') return ['DTL', 'NEL'].includes(line.code);
    if (filterMode === 'smrt') return ['EWL', 'NSL', 'CCL', 'TEL'].includes(line.code);
    if (filterMode === 'alerts') return line.status !== 'Normal Service';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Network Overview Banner */}
      <div className="bg-gradient-to-r from-[#4B004E] via-[#6B126D] to-[#4B004E] rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B8A44] animate-ping" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#FFDBCC]">
                LTA Rail Operations Center
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Singapore Rapid Transit Network Status
            </h2>
            <p className="text-sm text-white/80 mt-1 max-w-xl">
              Real-time monitoring across 6 heavy rail lines and 140+ MRT stations. 5 lines running on standard schedule, 1 advisory active.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
            <div className="w-10 h-10 rounded-lg bg-[#1B8A44] text-white flex items-center justify-center font-bold text-lg">
              98%
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">Network Serviceability</div>
              <div className="text-white/70">Mean Distance Between Failures &gt; 2.1M train-km</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Civic Transit Alerts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EB6B26]" />
            <h3 className="font-display font-bold text-lg text-[#1F1A20]">
              Active Transit Advisories & Service Notices
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFF3EC] text-[#EB6B26] border border-[#EB6B26]/30">
            {TRANSIT_ALERTS.length} Notices Issued
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {TRANSIT_ALERTS.map((alert) => (
            <DisruptionCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

      {/* Line Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
        <span className="text-xs font-semibold text-[#83727E] uppercase tracking-wider shrink-0 mr-1">
          Filter Lines:
        </span>
        {[
          { id: 'all', label: 'All Rail Lines' },
          { id: 'alerts', label: 'With Advisories (1)' },
          { id: 'sbst', label: 'SBS Transit (DTL, NEL)' },
          { id: 'smrt', label: 'SMRT Lines' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilterMode(f.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
              filterMode === f.id
                ? 'bg-[#6B126D] text-white shadow-xs font-semibold'
                : 'bg-white border border-[#D4C1CF] text-[#4B004E] hover:bg-[#F6EBF3]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Individual Line Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLines.map((line) => {
          const isDelay = line.status !== 'Normal Service';
          return (
            <div
              key={line.code}
              className={`bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-xs hover:shadow-md ${
                isDelay ? 'border-[#EB6B26] bg-[#FFFBF8]' : 'border-[#4D464D]/10'
              }`}
            >
              {/* Line Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg shadow-inner shrink-0"
                    style={{ backgroundColor: line.colorHex, color: line.textColorHex }}
                  >
                    {line.code}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-[#1F1A20]">
                      {line.name}
                    </h4>
                    <span className="text-xs text-[#50434E]">
                      {line.stationsCount} Stations • Operating {line.firstTrain} - {line.lastTrain}
                    </span>
                  </div>
                </div>

                {/* Status pill */}
                <div className="shrink-0">
                  {isDelay ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFF4E5] text-[#E67E00] border border-[#E67E00]/30 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {line.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#1B8A44] border border-[#1B8A44]/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Normal
                    </span>
                  )}
                </div>
              </div>

              {/* Status Description */}
              <div className="mt-3.5 p-2.5 rounded-lg bg-[#F6EBF3]/60 text-xs text-[#50434E] leading-relaxed border border-[#4D464D]/5">
                {line.statusDescription}
              </div>

              {/* Frequency Stats */}
              <div className="mt-3 pt-3 border-t border-[#4D464D]/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#83727E] text-[10px] font-semibold uppercase block">
                    Peak Headway
                  </span>
                  <span className="font-display font-bold text-[#4B004E] text-sm">
                    {line.peakFrequency}
                  </span>
                </div>
                <div>
                  <span className="text-[#83727E] text-[10px] font-semibold uppercase block">
                    Off-Peak Headway
                  </span>
                  <span className="font-display font-bold text-[#50434E] text-sm">
                    {line.offPeakFrequency}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LRT Feeder Systems Information */}
      <div className="bg-white rounded-xl border border-[#4D464D]/10 p-4 sm:p-5">
        <h4 className="font-display font-bold text-base text-[#1F1A20] mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#6B126D]" />
          Light Rail Transit (LRT) Feeder Status
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#FCF0F9] border border-[#4D464D]/5">
            <div className="font-bold text-[#4B004E]">Bukit Panjang LRT (BPLRT)</div>
            <div className="text-[#1B8A44] font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Service A & B Normal
            </div>
            <div className="text-[11px] text-[#83727E] mt-0.5">Headway: 3-4 mins</div>
          </div>
          <div className="p-3 rounded-lg bg-[#FCF0F9] border border-[#4D464D]/5">
            <div className="font-bold text-[#4B004E]">Sengkang LRT (SKLRT)</div>
            <div className="text-[#1B8A44] font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> East & West Loops Normal
            </div>
            <div className="text-[11px] text-[#83727E] mt-0.5">Headway: 2.5-3.5 mins</div>
          </div>
          <div className="p-3 rounded-lg bg-[#FCF0F9] border border-[#4D464D]/5">
            <div className="font-bold text-[#4B004E]">Punggol LRT (PGLRT)</div>
            <div className="text-[#1B8A44] font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> East & West Loops Normal
            </div>
            <div className="text-[11px] text-[#83727E] mt-0.5">Headway: 3-4 mins</div>
          </div>
        </div>
      </div>
    </div>
  );
};
