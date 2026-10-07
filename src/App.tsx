import React, { useState, useEffect, useCallback } from 'react';
import { BUS_STOPS, INITIAL_ARRIVALS_BY_STOP, TRANSIT_ALERTS } from './data/transitData';
import { BusStop, ServiceArrival } from './types/transit';
import { Header, ActiveTab } from './components/Header';
import { BusStopSelector } from './components/BusStopSelector';
import { BusArrivalCard } from './components/BusArrivalCard';
import { ServiceRouteDrawer } from './components/ServiceRouteDrawer';
import { RouteExplorerView } from './components/RouteExplorerView';
import { MRTNetworkView } from './components/MRTNetworkView';
import { JourneyPlanner } from './components/JourneyPlanner';
import { TransitMapView } from './components/TransitMapView';
import { SavedStopsView } from './components/SavedStopsView';
import { DisruptionCard } from './components/DisruptionCard';
import { ApiHealthModal } from './components/ApiHealthModal';
import { fetchBusArrivalFromApi } from './services/ltaApi';
import { Filter, Star, Clock, AlertTriangle, ArrowRight, Layers, Sparkles, CheckCircle2, Radio, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('arrivals');
  const [selectedStop, setSelectedStop] = useState<BusStop>(BUS_STOPS[0]); // Dhoby Ghaut
  const [arrivalsData, setArrivalsData] = useState<Record<string, ServiceArrival[]>>(INITIAL_ARRIVALS_BY_STOP);
  const [selectedServiceForDrawer, setSelectedServiceForDrawer] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'fav' | 'soon' | 'dd'>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(20); // 20s as specified by LTA DataMall
  const [showDisruptionBanner, setShowDisruptionBanner] = useState<boolean>(true);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isLiveFeed, setIsLiveFeed] = useState<boolean>(false);

  // Load arrivals from /api/bus-arrival
  const loadArrivals = useCallback(async (stopCode: string) => {
    setIsRefreshing(true);
    try {
      const result = await fetchBusArrivalFromApi(stopCode);
      if (result.arrivals && result.arrivals.length > 0) {
        setArrivalsData((prev) => ({
          ...prev,
          [stopCode]: result.arrivals,
        }));
        setIsLiveFeed(result.isLive);
      }
    } catch (err) {
      console.warn('Using local dataset for stop:', stopCode, err);
    } finally {
      setIsRefreshing(false);
      setRefreshCountdown(20);
    }
  }, []);

  // Fetch when stop changes
  useEffect(() => {
    loadArrivals(selectedStop.code);
  }, [selectedStop.code, loadArrivals]);

  // Live countdown timer ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setArrivalsData((prevData) => {
        const nextData = { ...prevData };
        Object.keys(nextData).forEach((stopCode) => {
          nextData[stopCode] = nextData[stopCode].map((arrival) => {
            let nextSec = arrival.nextBus.etaSeconds - 1;
            let subSec = arrival.subsequentBus ? arrival.subsequentBus.etaSeconds - 1 : undefined;
            let sub3Sec = arrival.subsequentBus3 ? arrival.subsequentBus3.etaSeconds - 1 : undefined;

            // Natural looping when bus arrives and leaves stop
            if (nextSec < 0) {
              nextSec = subSec || 360;
              subSec = sub3Sec || 720;
              sub3Sec = 1100;
            }

            return {
              ...arrival,
              nextBus: {
                ...arrival.nextBus,
                etaSeconds: Math.max(0, nextSec),
              },
              subsequentBus: subSec !== undefined ? {
                ...arrival.subsequentBus!,
                etaSeconds: Math.max(0, subSec),
              } : undefined,
              subsequentBus3: sub3Sec !== undefined ? {
                ...arrival.subsequentBus3!,
                etaSeconds: Math.max(0, sub3Sec),
              } : undefined,
            };
          });
        });
        return nextData;
      });

      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          // Trigger LTA 20-second refresh
          loadArrivals(selectedStop.code);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedStop.code, loadArrivals]);

  const handleManualRefresh = useCallback(() => {
    loadArrivals(selectedStop.code);
  }, [selectedStop.code, loadArrivals]);

  const handleToggleFavorite = (svcNo: string) => {
    setArrivalsData((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = next[key].map((a) =>
          a.serviceNo === svcNo ? { ...a, isFavorite: !a.isFavorite } : a
        );
      });
      return next;
    });
  };

  const handleSelectStopCode = (stopCode: string) => {
    const stop = BUS_STOPS.find((s) => s.code === stopCode);
    if (stop) {
      setSelectedStop(stop);
      setSelectedServiceForDrawer(null);
      setActiveTab('arrivals');
    }
  };

  const currentStopArrivals = arrivalsData[selectedStop.code] || [
    {
      serviceNo: '65',
      operator: 'SBST',
      destinationCode: '10018',
      destinationName: 'HarbourFront Int',
      nextBus: { etaSeconds: 120, occupancy: 'SEA', type: 'DD', wab: true },
      subsequentBus: { etaSeconds: 580, occupancy: 'SDA', type: 'DD', wab: true },
    },
    {
      serviceNo: '147',
      operator: 'SBST',
      destinationCode: '28009',
      destinationName: 'Jurong East Int',
      nextBus: { etaSeconds: 240, occupancy: 'SDA', type: 'DD', wab: true },
      subsequentBus: { etaSeconds: 720, occupancy: 'SEA', type: 'SD', wab: true },
    },
  ];

  const filteredArrivals = currentStopArrivals.filter((item) => {
    if (filterMode === 'fav') return item.isFavorite;
    if (filterMode === 'soon') return item.nextBus.etaSeconds <= 300;
    if (filterMode === 'dd') return item.nextBus.type === 'DD';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFF7FB] text-[#1F1A20] flex flex-col font-body">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRefresh={handleManualRefresh}
        onOpenApiHealth={() => setIsApiModalOpen(true)}
        isRefreshing={isRefreshing}
        refreshSeconds={refreshCountdown}
        alertCount={1}
      />

      {/* Civic Disruption Top Banner */}
      {showDisruptionBanner && (
        <div className="bg-[#FFF3EC] border-b border-[#EB6B26]/30 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#EB6B26] animate-ping shrink-0" />
              <span className="font-bold text-[#622300] uppercase tracking-wider shrink-0">
                Civic Transit Notice:
              </span>
              <span className="text-[#1F1A20] font-medium truncate">
                Circle Line (CCL) operating with +5-8 min delay between CC19 & CC21 due to track check.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => setActiveTab('mrt')}
                className="font-bold text-[#6B126D] hover:underline flex items-center gap-1"
              >
                View Advisory <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setShowDisruptionBanner(false)}
                className="text-[#83727E] hover:text-[#1F1A20] px-1"
                aria-label="Dismiss banner"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Live Arrivals */}
        {activeTab === 'arrivals' && (
          <div className="space-y-5">
            {/* Bus Stop Selector Card */}
            <BusStopSelector
              stops={BUS_STOPS}
              selectedStop={selectedStop}
              onSelectStop={setSelectedStop}
            />

            {/* Filter and View Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-xs font-semibold text-[#83727E] uppercase tracking-wider flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#6B126D]" />
                  Filter:
                </span>
                {[
                  { id: 'all', label: `All (${currentStopArrivals.length})` },
                  { id: 'fav', label: 'Starred' },
                  { id: 'soon', label: 'Arriving < 5m' },
                  { id: 'dd', label: 'Double Decker (DD)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterMode(f.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      filterMode === f.id
                        ? 'bg-[#6B126D] text-white shadow-xs'
                        : 'bg-white border border-[#D4C1CF] text-[#50434E] hover:bg-[#F6EBF3]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsApiModalOpen(true)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    isLiveFeed
                      ? 'bg-[#E8F5E9] text-[#1B8A44] border-[#1B8A44]/30'
                      : 'bg-[#FFF3EC] text-[#622300] border-[#EB6B26]/30'
                  }`}
                  title="Click to view API Health & Diagnostics"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isLiveFeed ? 'bg-[#1B8A44] animate-pulse' : 'bg-[#EB6B26]'
                    }`}
                  />
                  <span>
                    {isLiveFeed
                      ? 'Live LTA v3 (OBE GPS Synced)'
                      : 'LTA API Ready (Key Pending in Vercel)'}
                  </span>
                  <Activity className="w-3 h-3 text-[#EB6B26] ml-0.5" />
                </button>
                <div className="text-xs text-[#83727E] hidden sm:flex items-center gap-1">
                  <span>Refreshes in {refreshCountdown}s</span>
                </div>
              </div>
            </div>

            {/* Arrival Cards List */}
            <div className="space-y-3">
              {filteredArrivals.length > 0 ? (
                filteredArrivals.map((arrival) => (
                  <BusArrivalCard
                    key={arrival.serviceNo}
                    arrival={arrival}
                    onSelectService={(svcNo) => setSelectedServiceForDrawer(svcNo)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))
              ) : (
                <div className="bg-white rounded-xl border border-[#4D464D]/10 p-8 text-center">
                  <p className="text-sm text-[#50434E] font-medium">
                    No services matching current filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className="mt-2 text-xs font-bold text-[#6B126D] hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            {/* Live Occupancy Guide Card */}
            <div className="bg-white rounded-xl border border-[#4D464D]/10 p-4 text-xs">
              <div className="font-display font-bold text-sm text-[#1F1A20] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#EB6B26]" />
                LTA Passenger Load & Fleet Indicators
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#E8F5E9] border border-[#1B8A44]/20 text-[#1B8A44]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B8A44]" />
                  <span className="font-semibold">Seats Available</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FFF4E5] border border-[#E67E00]/20 text-[#E67E00]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E67E00]" />
                  <span className="font-semibold">Standing Available</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FFEBEE] border border-[#D32F2F]/20 text-[#D32F2F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D32F2F]" />
                  <span className="font-semibold">Limited Standing</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FCF0F9] border border-[#6B126D]/20 text-[#6B126D]">
                  <span className="font-bold font-mono">DD / WAB</span>
                  <span>Double Deck / Wheelchair</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Route Explorer */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <RouteExplorerView
              initialServiceNo="65"
              onSelectStopCode={handleSelectStopCode}
            />
          </div>
        )}

        {/* Tab 3: MRT Rail & Advisories */}
        {activeTab === 'mrt' && <MRTNetworkView />}

        {/* Tab 4: Journey & Fares */}
        {activeTab === 'journey' && <JourneyPlanner />}

        {/* Tab 5: Transit Map */}
        {activeTab === 'map' && (
          <TransitMapView
            selectedStop={selectedStop}
            onSelectStop={(stop) => {
              setSelectedStop(stop);
              setActiveTab('arrivals');
            }}
          />
        )}

        {/* Tab 6: Pinned Commutes */}
        {activeTab === 'saved' && (
          <SavedStopsView
            onSelectService={(svcNo) => setSelectedServiceForDrawer(svcNo)}
            onSelectStop={(stop) => {
              setSelectedStop(stop);
              setActiveTab('arrivals');
            }}
          />
        )}
      </main>

      {/* Route Timeline Modal / Drawer */}
      {selectedServiceForDrawer && (
        <ServiceRouteDrawer
          serviceNo={selectedServiceForDrawer}
          onClose={() => setSelectedServiceForDrawer(null)}
          onSelectStop={handleSelectStopCode}
        />
      )}

      {/* API Health & Diagnostics Modal */}
      <ApiHealthModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-[#4D464D]/10 py-5 mt-12 text-xs text-[#50434E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B126D]" />
            <span className="font-display font-bold text-[#4B004E]">
              Singapore Civic Transit
            </span>
            <span>• Powered by Land Transport Authority (LTA) DataMall Specifications</span>
          </div>
          <div className="flex items-center gap-4 text-[#83727E]">
            <span>SBS Transit • SMRT Trains • Go-Ahead • Tower Transit</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
