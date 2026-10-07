import React, { useState } from 'react';
import { BusStop, ServiceArrival } from '../types/transit';
import { BUS_STOPS, INITIAL_ARRIVALS_BY_STOP } from '../data/transitData';
import { BusArrivalCard } from './BusArrivalCard';
import { Star, Bell, Plus, MapPin, Sparkles, Clock, Trash2, CheckCircle2 } from 'lucide-react';

interface SavedStopsViewProps {
  onSelectService: (serviceNo: string) => void;
  onSelectStop: (stop: BusStop) => void;
}

export const SavedStopsView: React.FC<SavedStopsViewProps> = ({
  onSelectService,
  onSelectStop,
}) => {
  const [activeCommute, setActiveCommute] = useState<'morning' | 'evening'>('morning');
  const [alertEnabled, setAlertEnabled] = useState<boolean>(true);
  const [favoriteList, setFavoriteList] = useState<string[]>(['65', '147', '190']);

  const dhobyGhautStop = BUS_STOPS.find((s) => s.code === '08057')!;
  const cityHallStop = BUS_STOPS.find((s) => s.code === '04121')!;

  const arrivalsDhoby = INITIAL_ARRIVALS_BY_STOP['08057'] || [];
  const arrivalsCityHall = INITIAL_ARRIVALS_BY_STOP['04121'] || [];

  const handleToggleFav = (svcNo: string) => {
    setFavoriteList((prev) =>
      prev.includes(svcNo) ? prev.filter((s) => s !== svcNo) : [...prev, svcNo]
    );
  };

  return (
    <div className="space-y-6">
      {/* Commute Routine Header */}
      <div className="bg-white rounded-2xl border border-[#4D464D]/10 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EB6B26]" />
            <h3 className="font-display font-bold text-xl text-[#1F1A20]">
              Personal Commute Dashboard
            </h3>
          </div>
          <p className="text-xs text-[#50434E]">
            One-tap arrival boards for your daily home-work transit routes
          </p>
        </div>

        {/* Morning / Evening Toggle */}
        <div className="flex items-center bg-[#FCF0F9] p-1 rounded-xl border border-[#D4C1CF]">
          <button
            type="button"
            onClick={() => setActiveCommute('morning')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCommute === 'morning'
                ? 'bg-[#6B126D] text-white shadow-xs'
                : 'text-[#4B004E] hover:bg-[#eadfe8]'
            }`}
          >
            🌅 Morning Routine
          </button>
          <button
            type="button"
            onClick={() => setActiveCommute('evening')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCommute === 'evening'
                ? 'bg-[#6B126D] text-white shadow-xs'
                : 'text-[#4B004E] hover:bg-[#eadfe8]'
            }`}
          >
            🌇 Evening Return
          </button>
        </div>
      </div>

      {/* Proximity Alert Card */}
      <div className="bg-[#FFF3EC] border border-[#EB6B26]/30 rounded-xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EB6B26] text-white flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-[#1F1A20]">
              Proximity Arrival Alert (2-Minute Warning)
            </div>
            <div className="text-xs text-[#622300]">
              Get notified when your pinned bus (e.g. 65, 147) is within 500m of the stop.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAlertEnabled(!alertEnabled)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            alertEnabled
              ? 'bg-[#1B8A44] text-white shadow-xs'
              : 'bg-white border border-[#D4C1CF] text-[#83727E]'
          }`}
        >
          {alertEnabled ? 'Active ✓' : 'Disabled'}
        </button>
      </div>

      {/* Routine Stop 1: Dhoby Ghaut */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#6B126D]" />
            <h4 className="font-display font-bold text-base text-[#1F1A20]">
              {dhobyGhautStop.description} ({dhobyGhautStop.code})
            </h4>
            <span className="text-xs text-[#83727E]">Plaza Singapura / Orchard Rd</span>
          </div>

          <button
            type="button"
            onClick={() => onSelectStop(dhobyGhautStop)}
            className="text-xs font-semibold text-[#6B126D] hover:underline"
          >
            View full stop →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {arrivalsDhoby
            .filter((a) => favoriteList.includes(a.serviceNo))
            .map((arrival) => (
              <BusArrivalCard
                key={arrival.serviceNo}
                arrival={{ ...arrival, isFavorite: true }}
                onSelectService={onSelectService}
                onToggleFavorite={handleToggleFav}
              />
            ))}
        </div>
      </div>

      {/* Routine Stop 2: City Hall / Hill St */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#EB6B26]" />
            <h4 className="font-display font-bold text-base text-[#1F1A20]">
              {cityHallStop.description} ({cityHallStop.code})
            </h4>
            <span className="text-xs text-[#83727E]">Hill St / Funan</span>
          </div>

          <button
            type="button"
            onClick={() => onSelectStop(cityHallStop)}
            className="text-xs font-semibold text-[#EB6B26] hover:underline"
          >
            View full stop →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {arrivalsCityHall
            .filter((a) => favoriteList.includes(a.serviceNo))
            .map((arrival) => (
              <BusArrivalCard
                key={arrival.serviceNo}
                arrival={{ ...arrival, isFavorite: true }}
                onSelectService={onSelectService}
                onToggleFavorite={handleToggleFav}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
