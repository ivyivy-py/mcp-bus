import React, { useState } from 'react';
import { SAMPLE_JOURNEYS, BUS_STOPS } from '../data/transitData';
import { JourneyItinerary } from '../types/transit';
import { ArrowRightLeft, MapPin, Footprints, Bus, Train, Clock, DollarSign, ChevronRight, Navigation2, CheckCircle2 } from 'lucide-react';

export const JourneyPlanner: React.FC = () => {
  const [origin, setOrigin] = useState<string>('08057 - Dhoby Ghaut Stn (Plaza Singapura)');
  const [destination, setDestination] = useState<string>('76191 - Tampines Stn / Int');
  const [selectedItinerary, setSelectedItinerary] = useState<JourneyItinerary>(SAMPLE_JOURNEYS[0]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="space-y-6">
      {/* Planner Controls Card */}
      <div className="bg-white rounded-2xl border border-[#4D464D]/10 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6B126D] text-white flex items-center justify-center">
              <Navigation2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1F1A20]">
                Singapore Journey & Fare Calculator
              </h3>
              <p className="text-xs text-[#50434E]">
                Distance-based integrated transit fares with SimplyGo / EZ-Link support
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F5E9] text-[#1B8A44]">
            Fare Rules: LTA 2026/2027 Structure
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin */}
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#83727E] mb-1">
              Origin (Starting Point)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#1B8A44] absolute left-3 top-3.5" />
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-[#FCF0F9] border border-[#D4C1CF] rounded-lg text-xs sm:text-sm font-semibold text-[#1F1A20] focus:border-2 focus:border-[#6B126D] focus:outline-none"
              >
                {BUS_STOPS.map((s) => (
                  <option key={s.code} value={`${s.code} - ${s.description}`}>
                    {s.code} - {s.description} ({s.roadName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap button */}
          <div className="md:col-span-2 flex justify-center pt-4 md:pt-4">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-[#F6EBF3] hover:bg-[#6B126D] hover:text-white text-[#4B004E] transition-all border border-[#D4C1CF] shadow-xs active:scale-95"
              title="Swap origin and destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#83727E] mb-1">
              Destination
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#D32F2F] absolute left-3 top-3.5" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-[#FCF0F9] border border-[#D4C1CF] rounded-lg text-xs sm:text-sm font-semibold text-[#1F1A20] focus:border-2 focus:border-[#6B126D] focus:outline-none"
              >
                {BUS_STOPS.map((s) => (
                  <option key={s.code} value={`${s.code} - ${s.description}`}>
                    {s.code} - {s.description} ({s.roadName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Itineraries */}
      <div className="space-y-4">
        <h4 className="font-display font-bold text-base text-[#1F1A20] flex items-center gap-2">
          <span>Recommended Route Options</span>
          <span className="text-xs font-normal text-[#83727E]">({SAMPLE_JOURNEYS.length} routes calculated)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_JOURNEYS.map((item) => {
            const isSelected = selectedItinerary.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItinerary(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#6B126D] bg-[#FCF0F9] shadow-md ring-1 ring-[#6B126D]'
                    : 'border-[#4D464D]/10 bg-white hover:border-[#6B126D]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.tag === 'Fastest'
                        ? 'bg-[#1B8A44] text-white'
                        : item.tag === 'Direct Bus'
                        ? 'bg-[#EB6B26] text-white'
                        : 'bg-[#6B126D] text-white'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <div className="flex items-center gap-1 font-display font-bold text-[#1F1A20] text-lg">
                    <Clock className="w-4 h-4 text-[#83727E]" />
                    {item.totalDurationMin} min
                  </div>
                </div>

                <div className="font-display font-semibold text-sm text-[#1F1A20] mb-2">
                  {item.title}
                </div>

                <div className="flex items-center justify-between text-xs text-[#50434E] pt-2 border-t border-[#4D464D]/10">
                  <div className="font-semibold text-[#6B126D]">
                    ${item.adultFareSGD.toFixed(2)} SGD
                  </div>
                  <div>
                    {item.transfers === 0 ? 'Direct ride' : `${item.transfers} transfer`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Itinerary Step-by-Step Breakdown */}
      <div className="bg-white rounded-2xl border border-[#4D464D]/10 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4D464D]/10 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-[#1F1A20]">
                {selectedItinerary.title}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#EB6B26] text-white">
                Total: {selectedItinerary.totalDurationMin} mins
              </span>
            </div>
            <p className="text-xs text-[#50434E] mt-0.5">
              Distance: ~13.8 km • Walking: {selectedItinerary.walkDistanceMeters}m
            </p>
          </div>

          {/* Fares breakdown cards */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[#FCF0F9] border border-[#6B126D]/20 text-center">
              <span className="text-[10px] text-[#83727E] block font-semibold">Adult Card</span>
              <span className="font-display font-bold text-sm text-[#6B126D]">
                ${selectedItinerary.adultFareSGD.toFixed(2)}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#FFF4E5] border border-[#EB6B26]/20 text-center">
              <span className="text-[10px] text-[#83727E] block font-semibold">Concession</span>
              <span className="font-display font-bold text-sm text-[#E67E00]">
                ${selectedItinerary.concessionFareSGD.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mt-6 space-y-4 relative pl-6 border-l-2 border-[#6B126D]/30 ml-3">
          {selectedItinerary.steps.map((step, idx) => {
            const isWalk = step.type === 'walk';
            const isBus = step.type === 'bus';
            const isMrt = step.type === 'mrt';

            return (
              <div key={idx} className="relative group">
                <div
                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                    isWalk
                      ? 'border-[#83727E]'
                      : isBus
                      ? 'border-[#EB6B26] ring-2 ring-[#EB6B26]/20'
                      : 'border-[#6B126D] ring-2 ring-[#6B126D]/20'
                  }`}
                />

                <div className="p-3.5 rounded-xl bg-[#FFF7FB] border border-[#4D464D]/10">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isWalk && <Footprints className="w-4 h-4 text-[#83727E]" />}
                      {isBus && <Bus className="w-4 h-4 text-[#EB6B26]" />}
                      {isMrt && <Train className="w-4 h-4 text-[#6B126D]" />}
                      <span className="font-display font-bold text-sm text-[#1F1A20]">
                        {step.instruction}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#83727E]">
                      {step.durationMinutes} min
                    </span>
                  </div>

                  <p className="text-xs text-[#50434E] mt-1 pl-6">
                    {step.detail}
                  </p>

                  {step.lineOrService && (
                    <div className="mt-2 pl-6 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#6B126D] text-white">
                        {step.lineOrService}
                      </span>
                      {step.stopsCount && (
                        <span className="text-[#83727E] text-[11px]">
                          Ride {step.stopsCount} stops
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-3 rounded-lg bg-[#E8F5E9] border border-[#1B8A44]/20 flex items-center gap-2 text-xs text-[#1B8A44] font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Transfer rebate applies automatically if subsequent boarding is made within 45 minutes.
          </span>
        </div>
      </div>
    </div>
  );
};
