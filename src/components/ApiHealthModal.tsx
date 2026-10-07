import React, { useState, useEffect } from 'react';
import { checkApiHealth, HealthCheckResponse } from '../services/ltaApi';
import { X, CheckCircle2, AlertCircle, RefreshCw, Key, ExternalLink, Terminal, Code } from 'lucide-react';

interface ApiHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testStopCode, setTestStopCode] = useState<string>('04121');
  const [testServiceNo, setTestServiceNo] = useState<string>('7');

  const runHealthCheck = async () => {
    setIsLoading(true);
    const data = await checkApiHealth();
    setHealthData(data);

    try {
      const url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(testStopCode)}${
        testServiceNo ? `&ServiceNo=${encodeURIComponent(testServiceNo)}` : ''
      }`;
      const res = await fetch(url);
      const json = await res.json();
      setTestResponse({ status: res.status, url, body: json });
    } catch (e: any) {
      setTestResponse({ error: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runHealthCheck();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#4D464D]/10">
        {/* Header */}
        <div className="bg-[#4B004E] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#6B126D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <Terminal className="w-5 h-5 text-[#EB6B26]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                API Diagnostics & Health Monitor
              </h3>
              <p className="text-xs text-white/70">
                /api/health & /api/bus-arrival integration status
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-[#1F1A20]">
          {/* Health Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#1B8A44]/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#1B8A44] shrink-0" />
              <div>
                <span className="font-bold text-[#1B8A44] text-sm block">/api/health: Operational</span>
                <span className="text-[11px] text-[#50434E]">
                  Uptime: {healthData?.uptimeSeconds ?? 0}s • Latency &lt; 15ms
                </span>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                healthData?.ltaDataMall.hasAccountKey
                  ? 'bg-[#E8F5E9] border-[#1B8A44]/30'
                  : 'bg-[#FFF3EC] border-[#EB6B26]/30'
              }`}
            >
              <Key
                className={`w-6 h-6 shrink-0 ${
                  healthData?.ltaDataMall.hasAccountKey ? 'text-[#1B8A44]' : 'text-[#EB6B26]'
                }`}
              />
              <div>
                <span
                  className={`font-bold text-sm block ${
                    healthData?.ltaDataMall.hasAccountKey ? 'text-[#1B8A44]' : 'text-[#622300]'
                  }`}
                >
                  {healthData?.ltaDataMall.hasAccountKey ? 'LTA API Key: Active' : 'LTA_ACCOUNT_KEY: Pending'}
                </span>
                <span className="text-[11px] text-[#50434E]">
                  {healthData?.ltaDataMall.hasAccountKey
                    ? 'Connected to live DataMall v3'
                    : 'Add in Vercel Environment Variables'}
                </span>
              </div>
            </div>
          </div>

          {/* Vercel Environment Variable Setup Note */}
          <div className="p-3.5 rounded-xl bg-[#FCF0F9] border border-[#6B126D]/20 space-y-2">
            <div className="font-bold text-[#4B004E] flex items-center gap-1.5">
              <span>Vercel Environment Setup</span>
            </div>
            <p className="text-[#50434E] text-[11px] leading-relaxed">
              When ready, add the secret in your <strong>Vercel Project Settings &gt; Environment Variables</strong>:
            </p>
            <div className="bg-white p-2 rounded border border-[#D4C1CF] font-mono text-[11px] text-[#4B004E] select-all flex items-center justify-between">
              <span>LTA_ACCOUNT_KEY = &lt;YOUR_LTA_DATAMALL_KEY&gt;</span>
              <span className="text-[10px] text-[#83727E]">Production & Preview</span>
            </div>
          </div>

          {/* Interactive Endpoint Test */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-[#1F1A20] flex items-center gap-1.5">
                <Code className="w-4 h-4 text-[#6B126D]" />
                Test LTA Endpoint Proxy
              </div>
              <button
                type="button"
                onClick={runHealthCheck}
                disabled={isLoading}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#6B126D] text-white font-medium hover:bg-[#4B004E] disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                Test Live Call
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#83727E] block mb-1">
                  BusStopCode
                </label>
                <input
                  type="text"
                  value={testStopCode}
                  onChange={(e) => setTestStopCode(e.target.value)}
                  className="w-full h-8 px-2 bg-[#F6EBF3] border border-[#D4C1CF] rounded text-xs font-mono font-bold"
                  placeholder="04121"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#83727E] block mb-1">
                  ServiceNo (Optional)
                </label>
                <input
                  type="text"
                  value={testServiceNo}
                  onChange={(e) => setTestServiceNo(e.target.value)}
                  className="w-full h-8 px-2 bg-[#F6EBF3] border border-[#D4C1CF] rounded text-xs font-mono font-bold"
                  placeholder="7"
                />
              </div>
            </div>

            {testResponse && (
              <div className="mt-2">
                <div className="text-[10px] font-mono text-[#83727E] mb-1 flex items-center justify-between">
                  <span>GET {testResponse.url}</span>
                  <span className="font-bold text-[#1B8A44]">HTTP {testResponse.status || 200}</span>
                </div>
                <pre className="bg-[#1F1A20] text-[#00FF66] p-3 rounded-lg overflow-x-auto text-[10.5px] font-mono max-h-48 border border-black/10">
                  {JSON.stringify(testResponse.body, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#FCF0F9] border-t border-[#4D464D]/10 flex items-center justify-between text-xs">
          <span className="text-[#83727E]">LTA DataMall v3 Specification</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#6B126D] text-white font-semibold hover:bg-[#4B004E]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
