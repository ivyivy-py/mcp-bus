import React, { useState, useEffect } from 'react';
import { BUS_STOPS } from '../data/transitData';
import { BusStop } from '../types/transit';
import { Bus, MapPin, ZoomIn, ZoomOut, Compass, Navigation, Layers, Info, Check } from 'lucide-react';

interface TransitMapViewProps {
  onSelectStop: (stop: BusStop) => void;
  selectedStop: BusStop;
}

export const TransitMapView: React.FC<TransitMapViewProps> = ({
  onSelectStop,
  selectedStop,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeBus, setActiveBus] = useState<{ serviceNo: string; plate: string; speed: string; occupancy: string } | null>(null);
  const [busProgress, setBusProgress] = useState<number>(0);

  // Animated bus motion along transit corridor
  useEffect(() => {
    const timer = setInterval(() => {
      setBusProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // Bus 65 moving from Tampines (670, 270) to Dhoby Ghaut (450, 350) to HarbourFront (380, 460)
  const calcBus65Pos = () => {
    const ratio = busProgress / 100;
    if (ratio < 0.6) {
      // Tampines to Dhoby Ghaut
      const subRatio = ratio / 0.6;
      return {
        x: 670 - subRatio * (670 - 450),
        y: 270 + subRatio * (350 - 270),
      };
    } else {
      // Dhoby Ghaut to HarbourFront
      const subRatio = (ratio - 0.6) / 0.4;
      return {
        x: 450 - subRatio * (450 - 380),
        y: 350 + subRatio * (460 - 350),
      };
    }
  };

  // Bus 147 moving from Jurong East (220, 310) to Chinatown (440, 400)
  const calcBus147Pos = () => {
    const ratio = ((busProgress + 50) % 100) / 100;
    return {
      x: 220 + ratio * (440 - 220),
      y: 310 + ratio * (400 - 310),
    };
  };

  const bus65Pos = calcBus65Pos();
  const bus147Pos = calcBus147Pos();

  return (
    <div className="bg-white rounded-2xl border border-[#4D464D]/10 overflow-hidden shadow-sm relative flex flex-col">
      {/* Map Control Toolbar */}
      <div className="p-3 bg-[#FCF0F9] border-b border-[#4D464D]/10 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#6B126D] text-white flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#1F1A20]">
              Singapore Civic Transit Cartography
            </h3>
            <span className="text-[11px] text-[#50434E]">
              Interactive SVG grid with live AVL positioning
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-[#D4C1CF] hover:bg-[#F6EBF3] text-[#4B004E]"
          >
            Reset View
          </button>

          <div className="flex items-center bg-white border border-[#D4C1CF] rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
              className="p-1.5 hover:bg-[#F6EBF3] text-[#4B004E]"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-medium">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
              className="p-1.5 hover:bg-[#F6EBF3] text-[#4B004E]"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full h-[520px] bg-[#F8F7FA] overflow-hidden select-none cursor-grab active:cursor-grabbing">
        <svg
          viewBox="100 150 720 380"
          className="w-full h-full transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            <linearGradient id="singaporeLand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F6EBF3" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Singapore Island Outline Representation */}
          <path
            d="M 160 300 Q 220 220 380 230 Q 560 210 740 260 Q 800 300 780 340 Q 640 400 480 430 Q 340 480 250 420 Q 150 360 160 300 Z"
            fill="url(#singaporeLand)"
            stroke="#D4C1CF"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* Johor Strait / Surrounding Water Label */}
          <text x="320" y="210" fill="#83727E" fontSize="12" fontWeight="600" opacity="0.5" fontFamily="Space Grotesk">
            JOHOR STRAIT (NORTH)
          </text>
          <text x="420" y="490" fill="#83727E" fontSize="12" fontWeight="600" opacity="0.5" fontFamily="Space Grotesk">
            SINGAPORE STRAIT (SOUTH)
          </text>

          {/* MRT Lines Tracks */}
          {/* EWL Green */}
          <path
            d="M 180 320 L 220 310 L 360 380 L 470 380 L 620 310 L 670 270 L 740 280"
            fill="none"
            stroke="#009645"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* NSL Red */}
          <path
            d="M 220 310 L 320 220 L 420 230 L 400 330 L 450 350 L 470 380 L 480 420"
            fill="none"
            stroke="#D42E12"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* NEL Purple */}
          <path
            d="M 380 460 L 440 400 L 450 385 L 450 350 L 520 280 L 600 240"
            fill="none"
            stroke="#8F1A95"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* DTL Blue */}
          <path
            d="M 300 240 L 360 290 L 450 350 L 490 340 L 580 320 L 670 270"
            fill="none"
            stroke="#005EC4"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="5 3"
            opacity="0.75"
          />

          {/* Trunk Bus Route 65 Path */}
          <path
            d="M 670 270 Q 560 300 450 350 T 400 330 Q 390 400 380 460"
            fill="none"
            stroke="#EB6B26"
            strokeWidth="3"
            strokeDasharray="6 4"
            opacity="0.9"
          />

          {/* Bus Stops Pins */}
          {BUS_STOPS.map((stop) => {
            const isSelected = stop.code === selectedStop.code;
            return (
              <g
                key={stop.code}
                onClick={() => onSelectStop(stop)}
                className="cursor-pointer group"
                transform={`translate(${stop.coordinates.x}, ${stop.coordinates.y})`}
              >
                {/* Pulse ring for selected */}
                {isSelected && (
                  <circle
                    r="16"
                    fill="none"
                    stroke="#6B126D"
                    strokeWidth="2.5"
                    className="animate-ping"
                    opacity="0.5"
                  />
                )}

                {/* Stop marker pin */}
                <circle
                  r={isSelected ? "9" : "6.5"}
                  fill={isSelected ? "#6B126D" : "#4B004E"}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  filter="url(#shadow)"
                  className="transition-all group-hover:scale-125"
                />

                {/* Stop Code Badge */}
                <rect
                  x="-28"
                  y="-26"
                  width="56"
                  height="16"
                  rx="4"
                  fill={isSelected ? "#4B004E" : "#1F1A20"}
                  opacity="0.9"
                />
                <text
                  x="0"
                  y="-15"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="Space Grotesk"
                >
                  {stop.code}
                </text>

                {/* Stop Name Label */}
                <text
                  x="0"
                  y="18"
                  textAnchor="middle"
                  fill="#1F1A20"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="Inter"
                  className="bg-white/80"
                >
                  {stop.description.replace(' Stn', '').replace(' Interchange', ' Int')}
                </text>
              </g>
            );
          })}

          {/* Live Bus 65 Vehicle Indicator */}
          <g
            transform={`translate(${bus65Pos.x}, ${bus65Pos.y})`}
            className="cursor-pointer"
            onClick={() =>
              setActiveBus({
                serviceNo: '65',
                plate: 'SBS 3288L',
                speed: '38 km/h',
                occupancy: 'Seats Available',
              })
            }
          >
            <circle r="12" fill="#EB6B26" stroke="#FFFFFF" strokeWidth="2" filter="url(#shadow)" />
            <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">
              65
            </text>
          </g>

          {/* Live Bus 147 Vehicle Indicator */}
          <g
            transform={`translate(${bus147Pos.x}, ${bus147Pos.y})`}
            className="cursor-pointer"
            onClick={() =>
              setActiveBus({
                serviceNo: '147',
                plate: 'SBS 3991K',
                speed: '42 km/h',
                occupancy: 'Standing Available',
              })
            }
          >
            <circle r="12" fill="#6B126D" stroke="#FFFFFF" strokeWidth="2" filter="url(#shadow)" />
            <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">
              147
            </text>
          </g>
        </svg>

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#4D464D]/15 shadow-md text-xs space-y-1.5 pointer-events-auto">
          <div className="font-bold text-[#1F1A20] text-[11px] uppercase tracking-wider mb-1">
            Map Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#6B126D] border border-white" />
            <span className="text-[#50434E]">Bus Stop / Station</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EB6B26] border border-white" />
            <span className="text-[#50434E]">Live Bus 65 (En Route)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-[#009645] rounded-full" />
            <span className="text-[#50434E]">East-West Line (EWL)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-[#8F1A95] rounded-full" />
            <span className="text-[#50434E]">North East Line (NEL)</span>
          </div>
        </div>

        {/* Selected Bus Floating Popover */}
        {activeBus && (
          <div className="absolute top-3 right-3 bg-white p-3.5 rounded-xl border border-[#EB6B26] shadow-xl max-w-xs z-20 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-display font-bold text-sm text-[#EB6B26]">
                Service {activeBus.serviceNo} ({activeBus.plate})
              </span>
              <button
                type="button"
                onClick={() => setActiveBus(null)}
                className="text-[#83727E] hover:text-[#1F1A20] text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-[#50434E] space-y-1">
              <div>Telemetry Speed: <strong>{activeBus.speed}</strong></div>
              <div>Passenger Load: <strong className="text-[#1B8A44]">{activeBus.occupancy}</strong></div>
              <div className="text-[11px] text-[#83727E] pt-1 border-t border-[#4D464D]/10">
                Transmitting real-time GPS coordinates via LTA On-Bus Equipment (OBE).
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Stop Quick Bar */}
      <div className="p-3 bg-white border-t border-[#4D464D]/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#EB6B26]" />
          <span className="text-xs font-semibold text-[#1F1A20]">
            Selected: <strong className="text-[#6B126D]">{selectedStop.code}</strong> - {selectedStop.description}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelectStop(selectedStop)}
          className="px-3 py-1 rounded-lg bg-[#6B126D] text-white text-xs font-semibold hover:bg-[#4B004E]"
        >
          View Live Arrivals
        </button>
      </div>
    </div>
  );
};
