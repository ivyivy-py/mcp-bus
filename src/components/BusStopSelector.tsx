import React, { useState } from 'react';
import { BusStop } from '../types/transit';
import { Search, MapPin, X, Compass, Train, ChevronDown } from 'lucide-react';

interface BusStopSelectorProps {
  stops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
}

export const BusStopSelector: React.FC<BusStopSelectorProps> = ({
  stops,
  selectedStop,
  onSelectStop,
}) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredStops = stops.filter((s) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      s.code.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.roadName.toLowerCase().includes(q) ||
      s.services.some((svc) => svc.toLowerCase() === q)
    );
  });

  const popularStops = [
    { code: '08057', label: 'Dhoby Ghaut' },
    { code: '09048', label: 'Orchard Rd' },
    { code: '04121', label: 'City Hall' },
    { code: '05139', label: 'Chinatown' },
    { code: '76191', label: 'Tampines' },
    { code: '28009', label: 'Jurong East' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#4D464D]/10 p-4 shadow-xs">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[#83727E] pointer-events-none">
            <Search className="w-5 h-5 text-[#6B126D]" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search bus stop (e.g. 08057), road (Orchard), or service (65)..."
            className="w-full h-12 pl-11 pr-10 bg-white border border-[#D4C1CF] rounded-lg text-sm font-medium text-[#1F1A20] placeholder-[#83727E] focus:outline-none focus:border-2 focus:border-[#6B126D] transition-all"
          />

          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsDropdownOpen(false);
              }}
              className="absolute right-3 p-1 rounded-full text-[#83727E] hover:text-[#1F1A20] hover:bg-[#F6EBF3]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="absolute right-3 p-1 text-[#83727E] hover:text-[#6B126D]"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D4C1CF] rounded-xl shadow-xl max-h-72 overflow-y-auto z-50 divide-y divide-[#4D464D]/10">
            {filteredStops.length > 0 ? (
              filteredStops.map((stop) => {
                const isSelected = stop.code === selectedStop.code;
                return (
                  <button
                    key={stop.code}
                    type="button"
                    onClick={() => {
                      onSelectStop(stop);
                      setIsDropdownOpen(false);
                      setQuery('');
                    }}
                    className={`w-full text-left p-3 flex items-center justify-between gap-3 hover:bg-[#F6EBF3] transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#FCF0F9]' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#6B126D] text-white">
                          {stop.code}
                        </span>
                        <span className="font-semibold text-sm text-[#1F1A20] truncate">
                          {stop.description}
                        </span>
                      </div>
                      <div className="text-xs text-[#50434E] mt-0.5 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#EB6B26]" />
                        <span>{stop.roadName}</span>
                        {stop.landmark && <span>• {stop.landmark}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {stop.mrtLines && stop.mrtLines.map((mrt) => (
                        <span
                          key={mrt}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#4B004E]/10 text-[#4B004E]"
                        >
                          {mrt}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-[#83727E]">
                No bus stops found matching &quot;{query}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset quick pills */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
        <span className="text-[11px] font-semibold text-[#83727E] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#EB6B26]" />
          Key Stops:
        </span>
        {popularStops.map((p) => {
          const matchStop = stops.find((s) => s.code === p.code);
          const isCurrent = selectedStop.code === p.code;
          return (
            <button
              key={p.code}
              type="button"
              onClick={() => matchStop && onSelectStop(matchStop)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#6B126D] text-white shadow-xs'
                  : 'bg-[#F6EBF3] text-[#4B004E] hover:bg-[#eadfe8]'
              }`}
            >
              {p.label} <span className="opacity-70 text-[10px]">({p.code})</span>
            </button>
          );
        })}
      </div>

      {/* Selected Stop Header Info */}
      <div className="mt-4 pt-4 border-t border-[#4D464D]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCF0F9] -mx-4 -mb-4 p-4 rounded-b-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#6B126D] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="font-display font-bold text-xs uppercase tracking-tight text-center leading-tight">
              B/S<br />{selectedStop.code}
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#1F1A20]">
                {selectedStop.description}
              </h2>
              {selectedStop.mrtLines && selectedStop.mrtLines.map((mrt) => (
                <span
                  key={mrt}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4B004E] text-white"
                >
                  <Train className="w-2.5 h-2.5" />
                  {mrt}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#50434E] flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#EB6B26]" />
              <span className="font-medium text-[#1F1A20]">{selectedStop.roadName}</span>
              {selectedStop.landmark && (
                <span className="text-[#83727E]">({selectedStop.landmark})</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#50434E]">
            <strong className="text-[#6B126D] font-bold">{selectedStop.services.length}</strong> bus services available
          </span>
        </div>
      </div>
    </div>
  );
};
