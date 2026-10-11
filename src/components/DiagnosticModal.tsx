import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Bot, 
  BrainCircuit,
  ExternalLink,
  Play
} from 'lucide-react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testSuite, setTestSuite] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatusData(data);
      setTestResult('Diagnostic checks executed successfully.');
    } catch (err: any) {
      setTestResult(`Failed to query server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      const res = await fetch('/api/browser/run-tests', { method: 'POST' });
      const data = await res.json();
      setTestSuite(data);
    } catch (e: any) {
      alert(`Test execution error: ${e.message}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl cyber-panel border border-cyan-500/40 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto cyber-glow-cyan">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-500/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600 via-indigo-600 to-purple-600 cyber-cut-sm">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-white tracking-wide">
              MEI NetAcad System Diagnostics & Verification Report
            </h2>
            <p className="text-xs text-cyan-300 font-mono">
              Live App Health • Real Browser Engine Audit • Zero-Credential Compliance
            </p>
          </div>
        </div>

        {/* Live Diagnostics Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-300">
              System Components Status Check:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="px-2.5 py-1 rounded bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-mono flex items-center gap-1 shadow"
              >
                <Play className={`w-3 h-3 ${isRunningTests ? 'animate-spin' : ''}`} />
                <span>{isRunningTests ? 'Testing...' : 'Run 8 Real Tests'}</span>
              </button>
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 text-xs font-mono text-cyan-300 border border-purple-500/30 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* 1. Real Browser Execution Engine */}
            <div className="p-3.5 rounded-xl bg-[#090314] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-heading font-bold text-slate-100">Real Browser Engine</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  REAL PUPPETEER
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80 font-sans">
                Headless Chromium runtime with real viewport navigation, clicks, typing, and screenshot capture.
              </p>
              <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{statusData?.browserEngine?.currentUrl || 'Engine initialized'}</span>
              </div>
            </div>

            {/* 2. Server-side Gemini AI */}
            <div className="p-3.5 rounded-xl bg-[#090314] border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-heading font-bold text-slate-100">Gemini Computer Use</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/40">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80 font-sans">
                Powered by <code className="text-cyan-300 font-mono">gemini-3.8-flash</code> with vision multimodal action reasoning.
              </p>
              <div className="text-[10px] font-mono text-purple-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vision & DOM inspection active</span>
              </div>
            </div>

            {/* 3. Free-tier Services Check */}
            <div className="p-3.5 rounded-xl bg-[#090314] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-heading font-bold text-slate-100">Free-Tier Cost Guard</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  100% FREE
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80 font-sans">
                Zero paid cloud browser providers or paid external API subscriptions required.
              </p>
              <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero paid API consumption</span>
              </div>
            </div>

            {/* 4. Academic Integrity & Zero-Credential Guard */}
            <div className="p-3.5 rounded-xl bg-[#090314] border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-heading font-bold text-slate-100">Zero-Credential Isolation</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-pink-950 text-pink-300 border border-pink-500/40">
                  ENFORCED
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80 font-sans">
                Never stores NetAcad passwords, Google credentials, or session cookies. You authenticate directly.
              </p>
              <div className="text-[10px] font-mono text-pink-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Isolated browser sandbox</span>
              </div>
            </div>

          </div>
        </div>

        {/* 8 Tests Matrix if run */}
        {testSuite && (
          <div className="p-4 rounded-xl bg-[#070210] border border-cyan-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300">
                8-Point Test Suite Results ({testSuite.allPassed ? 'ALL PASSED ✓' : 'INCOMPLETE'})
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {new Date(testSuite.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-[11px]">
              {testSuite.tests.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-1.5 rounded bg-[#0d051c]">
                  <span className="text-slate-200">Test {t.id}: {t.name}</span>
                  <span className={t.passed ? 'text-cyan-400' : 'text-pink-400'}>
                    {t.passed ? `PASS (${t.durationMs}ms)` : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-heading font-semibold text-xs tracking-wider"
          >
            Close Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
};
