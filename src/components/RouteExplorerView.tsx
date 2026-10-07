import React, { useState } from 'react';
import { BUS_SERVICES } from '../data/transitData';
import { BusServiceDetail, BusStop } from '../types/transit';
import { Bus, Clock, MapPin, ArrowRightLeft, Search, Layers, Train, CheckCircle2 } from 'lucide-react';

interface RouteExplorerViewProps {
  initialServiceNo?: string;
  onSelectStopCode: (stopCode: string) => void;
}

export const RouteExplorerView: React.FC<RouteExplorerViewProps> = ({
  initialServiceNo = '65',
  onSelectStopCode,
}) => {
  const [selectedServiceNo, setSelectedServiceNo] = useState<string>(initialServiceNo);
  const [direction, setDirection] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const service = BUS_SERVICES[selectedServiceNo] || BUS_SERVICES['65'];
  const allServicesList = Object.keys(BUS_SERVICES);

  const filteredServices = allServicesList.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stops = direction === 1 ? service.direction1Stops : (service.direction2Stops || service.direction1Stops);
  const simulatedActiveSeqs = [2, 7, 16];

  return (
    <div className="space-y-6">
      {/* Top Service Selector Card */}
      <div className="bg-white rounded-2xl border border-[#4D464D]/10 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl text-[#1F1A20] flex items-center gap-2">
              <Bus className="w-5 h-5 text-[#6B126D]" />
              Singapore Bus Service Explorer
            </h3>
            <p className="text-xs text-[#50434E]">
              Timetable schedules, stop-by-stop route topology, and active fleet tracking
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#83727E] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search service number..."
              className="w-full h-10 pl-9 pr-3 bg-[#FCF0F9] border border-[#D4C1CF] rounded-lg text-xs font-semibold focus:border-2 focus:border-[#6B126D] focus:outline-none"
            />
          </div>
        </div>

        {/* Available Service Badges */}
        <div className="mt-4 pt-3 border-t border-[#4D464D]/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-[#83727E] uppercase tracking-wider shrink-0 mr-1">
            Pick Service:
          </span>
          {filteredServices.map((svcNo) => {
            const isSelected = svcNo === selectedServiceNo;
            return (
              <button
                key={svcNo}
                type="button"
                onClick={() => setSelectedServiceNo(svcNo)}
                className={`min-w-[48px] h-10 px-3 rounded-lg font-display font-bold text-base transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#6B126D] text-white shadow-xs scale-105'
                    : 'bg-[#F6EBF3] text-[#4B004E] hover:bg-[#eadfe8]'
                }`}
              >
                {svcNo}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Service Card */}
      <div className="bg-white rounded-2xl border border-[#4D464D]/10 overflow-hidden shadow-sm">
        {/* Header Bar */}
        <div className="bg-[#4B004E] text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-14 rounded-xl bg-white text-[#4B004E] flex items-center justify-center font-display font-bold text-3xl shadow-sm">
              {service.serviceNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#EB6B26] text-white">
                  {service.operator}
                </span>
                <span className="text-xs text-white/80">{service.category} Service</span>
              </div>
              <h2 className="font-display font-bold text-xl text-white mt-1">
                {service.origin} ➔ {service.destination}
              </h2>
            </div>
          </div>

          {/* Direction toggle */}
          <button
            type="button"
            onClick={() => setDirection(direction === 1 ? 2 : 1)}
            className="self-start md:self-center inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs transition-all"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#EB6B26]" />
            <span>Switch Direction (Dir {direction})</span>
          </button>
        </div>

        {/* Operating Hours & Frequency Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#4D464D]/10 bg-[#FCF0F9] p-4 text-center text-xs">
          <div className="p-2">
            <span className="text-[#83727E] uppercase text-[10px] font-semibold block">First Bus</span>
            <span className="font-display font-bold text-[#1F1A20] text-base mt-0.5 inline-block">
              {service.firstBus} SGT
            </span>
          </div>
          <div className="p-2">
            <span className="text-[#83727E] uppercase text-[10px] font-semibold block">Last Bus</span>
            <span className="font-display font-bold text-[#1F1A20] text-base mt-0.5 inline-block">
              {service.lastBus} SGT
            </span>
          </div>
          <div className="p-2">
            <span className="text-[#83727E] uppercase text-[10px] font-semibold block">Peak Frequency</span>
            <span className="font-display font-bold text-[#6B126D] text-base mt-0.5 inline-block">
              {service.frequencyPeak}
            </span>
          </div>
          <div className="p-2">
            <span className="text-[#83727E] uppercase text-[10px] font-semibold block">Off-Peak Frequency</span>
            <span className="font-display font-bold text-[#EB6B26] text-base mt-0.5 inline-block">
              {service.frequencyOffPeak}
            </span>
          </div>
        </div>

        {/* Stop-by-Stop Timeline */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-base text-[#1F1A20]">
              Route Stops Timeline ({stops.length} major stops along route)
            </h4>
            <span className="text-xs text-[#83727E]">Tap any stop to see live arrivals</span>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#6B126D]/30 ml-3 sm:ml-4 space-y-4 py-2">
            {stops.map((stop, idx) => {
              const isBusNear = simulatedActiveSeqs.includes(stop.seq);
              const isTerminus = idx === 0 || idx === stops.length - 1;

              return (
                <div key={stop.stopCode} className="relative group">
                  {/* Node */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-2 w-4 h-4 rounded-full border-2 transition-all ${
                      isTerminus
                        ? 'bg-[#EB6B26] border-white ring-4 ring-[#EB6B26]/30'
                        : isBusNear
                        ? 'bg-[#1B8A44] border-white ring-4 ring-[#1B8A44]/30'
                        : 'bg-white border-[#6B126D] group-hover:bg-[#6B126D]'
                    }`}
                  />

                  {/* Stop row card */}
                  <div
                    onClick={() => onSelectStopCode(stop.stopCode)}
                    className="p-3.5 rounded-xl bg-white border border-[#4D464D]/10 hover:border-[#6B126D] hover:bg-[#FCF0F9] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#4B004E]/10 text-[#4B004E]">
                          {stop.stopCode}
                        </span>
                        <h5 className="font-display font-bold text-sm text-[#1F1A20] truncate">
                          {stop.stopName}
                        </h5>
                      </div>
                      <div className="text-xs text-[#50434E] mt-0.5 flex items-center gap-2">
                        <span>{stop.roadName}</span>
                        <span>•</span>
                        <span className="text-[#83727E]">{stop.distanceKm.toFixed(1)} km</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isBusNear && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#1B8A44] border border-[#1B8A44]/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1B8A44] animate-ping" />
                          Approaching
                        </span>
                      )}

                      {stop.hasMrtTransfer && (
                        <div className="flex items-center gap-1">
                          {stop.hasMrtTransfer.map((mrt) => (
                            <span
                              key={mrt}
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#6B126D] text-white"
                            >
                              {mrt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
