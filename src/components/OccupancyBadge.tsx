import React from 'react';
import { OccupancyLevel, BusVehicleType } from '../types/transit';
import { Accessibility, Layers } from 'lucide-react';

interface OccupancyBadgeProps {
  occupancy: OccupancyLevel;
  showText?: boolean;
  size?: 'sm' | 'md';
}

export const OccupancyBadge: React.FC<OccupancyBadgeProps> = ({
  occupancy,
  showText = true,
  size = 'md',
}) => {
  const config = {
    SEA: {
      label: 'Seats Available',
      shortLabel: 'Seats',
      bgColor: 'bg-[#E8F5E9]',
      textColor: 'text-[#1B8A44]',
      dotColor: 'bg-[#1B8A44]',
      borderColor: 'border-[#1B8A44]/30',
    },
    SDA: {
      label: 'Standing Available',
      shortLabel: 'Standing',
      bgColor: 'bg-[#FFF4E5]',
      textColor: 'text-[#E67E00]',
      dotColor: 'bg-[#E67E00]',
      borderColor: 'border-[#E67E00]/30',
    },
    LSD: {
      label: 'Limited Standing',
      shortLabel: 'Crowded',
      bgColor: 'bg-[#FFEBEE]',
      textColor: 'text-[#D32F2F]',
      dotColor: 'bg-[#D32F2F]',
      borderColor: 'border-[#D32F2F]/30',
    },
  }[occupancy] || {
    label: 'Seats Available',
    shortLabel: 'Seats',
    bgColor: 'bg-[#E8F5E9]',
    textColor: 'text-[#1B8A44]',
    dotColor: 'bg-[#1B8A44]',
    borderColor: 'border-[#1B8A44]/30',
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all ${
        config.bgColor
      } ${config.textColor} ${config.borderColor} ${
        isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      title={config.label}
    >
      <span className={`rounded-full shrink-0 animate-pulse ${config.dotColor} ${isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      {showText && <span>{isSmall ? config.shortLabel : config.label}</span>}
    </span>
  );
};

export const VehicleTypeBadge: React.FC<{ type: BusVehicleType; wab?: boolean }> = ({ type, wab = true }) => {
  return (
    <div className="inline-flex items-center gap-1">
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${
          type === 'DD'
            ? 'bg-[#6B126D]/10 text-[#6B126D] border border-[#6B126D]/20'
            : 'bg-[#50434E]/10 text-[#50434E] border border-[#50434E]/15'
        }`}
        title={type === 'DD' ? 'Double Decker Bus' : type === 'BD' ? 'Bendy Bus' : 'Single Decker Bus'}
      >
        <Layers className="w-2.5 h-2.5" />
        {type}
      </span>
      {wab && (
        <span
          className="inline-flex items-center justify-center w-4 h-4 rounded text-[#0277BD] bg-[#0277BD]/10 border border-[#0277BD]/25"
          title="Wheelchair Accessible Bus (WAB)"
        >
          <Accessibility className="w-2.5 h-2.5" />
        </span>
      )}
    </div>
  );
};
