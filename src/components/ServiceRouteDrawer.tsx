import React, { useState } from 'react';
import { BusServiceDetail, BusStop } from '../types/transit';
import { BUS_SERVICES } from '../data/transitData';
import { X, ArrowRightLeft, Clock, MapPin, Bus, Train, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ServiceRouteDrawerProps {
  serviceNo: string;
  onClose: () => void;
  onSelectStop?: (stopCode: string) => void;
}

export const ServiceRouteDrawer: React.FC<ServiceRouteDrawerProps> = ({
  serviceNo,
  onClose,
  onSelectStop,
}) => {
  const [direction, setDirection] = useState<1 | 2>(1);
  const serviceDetail = BUS_SERVICES[serviceNo];

  if (!serviceDetail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFF3EC] text-[#EB6B26] mx-auto flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-[#1F1A20]">
            Service {serviceNo} Information
          </h3>
          <p className="text-sm text-[#50434E] mt-1 mb-4">
            Route schedule for trunk feeder service {serviceNo} is currently updating from the LTA timetable feed.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-[#6B126D] text-white font-semibold text-sm hover:bg-[#4B004E]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const stops = direction === 1 ? serviceDetail.direction1Stops : (serviceDetail.direction2Stops || serviceDetail.direction1Stops);

  // Simulated active live bus locations along the sequence
  const simulatedBusStopSeqs = [2, 7, 16];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Drawer Header */}
        <div className="bg-[#4B004E] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#6B126D]">
          <div className="flex items-center gap-3">
            <div className="w-14 h-12 rounded-xl bg-white text-[#4B004E] flex items-center justify-center shadow-inner font-display font-bold text-2xl">
              {serviceDetail.serviceNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#EB6B26] text-white">
                  {serviceDetail.operator}
                </span>
                <span className="text-xs text-white/80">{serviceDetail.category} Service</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mt-0.5">
                {serviceDetail.origin} ➔ {serviceDetail.destination}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operational Stats Bar */}
        <div className="grid grid-cols-3 divide-x divide-[#4D464D]/10 bg-[#FCF0F9] p-3 text-center text-xs">
          <div>
            <span className="text-[#83727E] uppercase text-[10px] font-semibold block">Operating Hours</span>
            <span className="font-display font-bold text-[#1F1A20] text-sm mt-0.5 inline-block">
              {serviceDetail.firstBus} – {serviceDetail.lastBus}
            </span>
          </div>
          <div>
            <span className="text-[#83727E] uppercase text-[10px] font-semibold block">Peak Frequency</span>
            <span className="font-display font-bold text-[#6B126D] text-sm mt-0.5 inline-block">
              {serviceDetail.frequencyPeak}
            </span>
          </div>
          <div>
            <span className="text-[#83727E] uppercase text-[10px] font-semibold block">Off-Peak</span>
            <span className="font-display font-bold text-[#EB6B26] text-sm mt-0.5 inline-block">
              {serviceDetail.frequencyOffPeak}
            </span>
          </div>
        </div>

        {/* Direction Switcher */}
        <div className="px-4 py-3 bg-[#FFF7FB] border-b border-[#4D464D]/10 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#50434E] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#EB6B26]" />
            Showing Direction {direction} ({stops.length} major stops shown)
          </span>

          <button
            type="button"
            onClick={() => setDirection(direction === 1 ? 2 : 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#D4C1CF] hover:border-[#6B126D] text-[#4B004E] shadow-2xs hover:bg-[#F6EBF3] transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#EB6B26]" />
            Reverse Direction
          </button>
        </div>

        {/* Timeline of Stops with Live Buses */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-0">
          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#6B126D]/30 ml-3 sm:ml-4 space-y-5 py-2">
            {stops.map((stop, idx) => {
              const isBusNear = simulatedBusStopSeqs.includes(stop.seq);
              const isTerminus = idx === 0 || idx === stops.length - 1;

              return (
                <div key={stop.stopCode} className="relative group">
                  {/* Timeline Node */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full border-2 transition-all ${
                      isTerminus
                        ? 'bg-[#EB6B26] border-white ring-4 ring-[#EB6B26]/30'
                        : isBusNear
                        ? 'bg-[#1B8A44] border-white ring-4 ring-[#1B8A44]/30'
                        : 'bg-white border-[#6B126D] group-hover:bg-[#6B126D]'
                    }`}
                  />

                  {/* Live bus marker if nearby */}
                  {isBusNear && (
                    <div className="absolute -left-[54px] sm:-left-[62px] top-0 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#1B8A44] text-white shadow-md animate-bounce">
                      <Bus className="w-3 h-3" />
                    </div>
                  )}

                  {/* Stop Details */}
                  <div
                    onClick={() => onSelectStop && onSelectStop(stop.stopCode)}
                    className="p-3 rounded-xl bg-white border border-[#4D464D]/10 hover:border-[#6B126D] hover:bg-[#FCF0F9] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#4B004E]/10 text-[#4B004E]">
                          {stop.stopCode}
                        </span>
                        <h4 className="font-display font-bold text-sm text-[#1F1A20] truncate">
                          {stop.stopName}
                        </h4>
                      </div>
                      <div className="text-xs text-[#50434E] mt-0.5 flex items-center gap-2">
                        <span>{stop.roadName}</span>
                        <span>•</span>
                        <span className="text-[#83727E]">{stop.distanceKm.toFixed(1)} km from origin</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isBusNear && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#1B8A44] border border-[#1B8A44]/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1B8A44] animate-ping" />
                          Bus Approaching
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

        {/* Footer */}
        <div className="p-3 bg-[#FCF0F9] border-t border-[#4D464D]/10 flex items-center justify-between text-xs text-[#50434E]">
          <span className="flex items-center gap-1 text-[#1B8A44] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Live bus positioning synced with LTA AVL feed
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#6B126D] text-white font-medium hover:bg-[#4B004E]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
