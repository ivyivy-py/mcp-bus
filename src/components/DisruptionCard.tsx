import React from 'react';
import { TransitAlert } from '../types/transit';
import { AlertTriangle, Clock, MapPin, Info } from 'lucide-react';

interface DisruptionCardProps {
  alert: TransitAlert;
  compact?: boolean;
}

export const DisruptionCard: React.FC<DisruptionCardProps> = ({ alert, compact = false }) => {
  return (
    <div className="bg-[#FFF3EC] border-l-4 border-[#EB6B26] rounded-r-xl p-4 sm:p-5 shadow-xs relative transition-all">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#EB6B26]/15 text-[#EB6B26] flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-[#EB6B26] text-white">
              {alert.type}
            </span>
            <span className="text-xs font-semibold text-[#622300]">
              {alert.lineOrService}
            </span>
            <span className="text-xs text-[#83727E] ml-auto flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alert.timestamp}
            </span>
          </div>

          <h4 className="font-display font-bold text-base sm:text-lg text-[#1F1A20] leading-snug mt-1">
            {alert.title}
          </h4>

          <div className="flex items-center gap-1.5 text-xs text-[#622300] font-medium mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#EB6B26] shrink-0" />
            <span>{alert.affectedRoute}</span>
          </div>

          {!compact && (
            <p className="font-body text-sm text-[#50434E] mt-2.5 leading-relaxed bg-white/70 p-3 rounded-lg border border-[#EB6B26]/20">
              {alert.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
