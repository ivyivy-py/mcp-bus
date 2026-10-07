import React from 'react';
import { ServiceArrival } from '../types/transit';
import { OccupancyBadge, VehicleTypeBadge } from './OccupancyBadge';
import { formatEta } from '../utils/formatEta';
import { Star, ChevronRight, Navigation, Sparkles } from 'lucide-react';

interface BusArrivalCardProps {
  arrival: ServiceArrival;
  onSelectService: (serviceNo: string) => void;
  onToggleFavorite?: (serviceNo: string) => void;
}

export const BusArrivalCard: React.FC<BusArrivalCardProps> = ({
  arrival,
  onSelectService,
  onToggleFavorite,
}) => {
  const nextEta = formatEta(arrival.nextBus.etaSeconds);
  const subEta = arrival.subsequentBus ? formatEta(arrival.subsequentBus.etaSeconds) : null;
  const sub3Eta = arrival.subsequentBus3 ? formatEta(arrival.subsequentBus3.etaSeconds) : null;

  const isExpress = ['36', '502', '518', '857'].includes(arrival.serviceNo);
  const badgeBg = isExpress ? 'bg-[#EB6B26]' : 'bg-[#6B126D]';

  return (
    <div
      onClick={() => onSelectService(arrival.serviceNo)}
      className="group relative bg-white border border-[#4D464D]/10 hover:border-[#6B126D]/40 rounded-xl p-3.5 sm:p-4 transition-all duration-200 hover:shadow-md cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelectService(arrival.serviceNo);
        }
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left tier: Service Number Shield & Destination */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="relative">
            <div
              className={`w-14 h-11 sm:w-16 sm:h-12 rounded-lg ${badgeBg} text-white flex items-center justify-center shadow-sm shrink-0`}
            >
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white">
                {arrival.serviceNo}
              </span>
            </div>
            {arrival.isFavorite && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#EB6B26] text-white rounded-full flex items-center justify-center shadow-xs">
                <Star className="w-2.5 h-2.5 fill-current" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-[#50434E]">
              <span className="font-semibold text-[#6B126D] uppercase tracking-wider">
                {arrival.operator}
              </span>
              <span>•</span>
              <span className="truncate">to {arrival.destinationName}</span>
            </div>
            <div className="text-sm font-semibold text-[#1F1A20] truncate flex items-center gap-1 mt-0.5">
              <span>Terminating at {arrival.destinationName}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <VehicleTypeBadge type={arrival.nextBus.type} wab={arrival.nextBus.wab} />
              {arrival.nextBus.vehiclePlate && (
                <span className="text-[10px] text-[#83727E] font-mono hidden md:inline">
                  [{arrival.nextBus.vehiclePlate}]
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right tier: Consecutive arrival estimates */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3.5 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-[#4D464D]/10">
          {/* Next Bus */}
          <div className="flex flex-col items-center min-w-[70px] sm:min-w-[84px] bg-[#FFF7FB] sm:bg-transparent rounded-lg p-1.5 sm:p-0">
            <span className="text-[10px] uppercase font-semibold text-[#83727E] tracking-wider mb-0.5">
              Next
            </span>
            <div
              className={`font-display font-bold text-lg sm:text-2xl leading-none tracking-tight flex items-center gap-1 ${
                nextEta.isArriving
                  ? 'text-[#1B8A44] animate-pulse'
                  : 'text-[#4B004E]'
              }`}
            >
              {nextEta.text}
              {nextEta.isArriving && (
                <Sparkles className="w-3.5 h-3.5 text-[#1B8A44]" />
              )}
            </div>
            <div className="mt-1.5">
              <OccupancyBadge occupancy={arrival.nextBus.occupancy} size="sm" />
            </div>
          </div>

          {/* 2nd Bus */}
          <div className="flex flex-col items-center min-w-[62px] sm:min-w-[76px] opacity-90">
            <span className="text-[10px] uppercase font-semibold text-[#83727E] tracking-wider mb-0.5">
              2nd
            </span>
            <div className="font-display font-bold text-base sm:text-xl leading-none text-[#50434E]">
              {subEta ? subEta.text : '—'}
            </div>
            <div className="mt-1.5">
              {arrival.subsequentBus ? (
                <OccupancyBadge occupancy={arrival.subsequentBus.occupancy} size="sm" />
              ) : (
                <span className="text-[10px] text-[#83727E]">—</span>
              )}
            </div>
          </div>

          {/* 3rd Bus */}
          <div className="hidden xs:flex flex-col items-center min-w-[62px] sm:min-w-[76px] opacity-75">
            <span className="text-[10px] uppercase font-semibold text-[#83727E] tracking-wider mb-0.5">
              3rd
            </span>
            <div className="font-display font-bold text-base sm:text-xl leading-none text-[#83727E]">
              {sub3Eta ? sub3Eta.text : '—'}
            </div>
            <div className="mt-1.5">
              {arrival.subsequentBus3 ? (
                <OccupancyBadge occupancy={arrival.subsequentBus3.occupancy} size="sm" />
              ) : (
                <span className="text-[10px] text-[#83727E]">—</span>
              )}
            </div>
          </div>

          {/* Action chevron & Favorite */}
          <div className="flex items-center gap-1 pl-1">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(arrival.serviceNo);
                }}
                className={`p-1.5 rounded-full hover:bg-[#F6EBF3] transition-colors ${
                  arrival.isFavorite ? 'text-[#EB6B26]' : 'text-[#83727E] hover:text-[#4B004E]'
                }`}
                aria-label={arrival.isFavorite ? 'Unfavorite' : 'Favorite'}
              >
                <Star className={`w-4 h-4 ${arrival.isFavorite ? 'fill-[#EB6B26]' : ''}`} />
              </button>
            )}
            <ChevronRight className="w-5 h-5 text-[#83727E] group-hover:text-[#6B126D] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};
