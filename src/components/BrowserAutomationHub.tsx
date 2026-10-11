import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Terminal, 
  ShieldCheck, 
  Globe, 
  MousePointer, 
  ArrowDown, 
  ArrowUp, 
  Keyboard, 
  Camera, 
  Sparkles, 
  Clock, 
  ListOrdered, 
  Trash2, 
  Check, 
  Maximize2,
  Lock,
  Layers,
  Search,
  Activity
} from 'lucide-react';
import { NetAcadCourse } from '../types/netacad';

interface BrowserAutomationHubProps {
  courses: NetAcadCourse[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onVerificationSuccess: (courseId: string, moduleId: string) => void;
}

export const BrowserAutomationHub: React.FC<BrowserAutomationHubProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  onVerificationSuccess
}) => {
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Browser state from server
  const [browserState, setBrowserState] = useState<{
    isRunning: boolean;
    isPaused: boolean;
    currentUrl: string;
    currentTitle: string;
    recentScreenshot?: string;
    queueLength: number;
    activeTaskId?: string;
    logs: string[];
    queue?: any[];
  }>({
    isRunning: false,
    isPaused: false,
    currentUrl: 'about:blank',
    currentTitle: '',
    queueLength: 0,
    logs: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [navUrl, setNavUrl] = useState('https://www.netacad.com');
  const [typeText, setTypeText] = useState('');
  const [typeSelector, setTypeSelector] = useState('input[type="text"], input[type="email"]');
  const [aiGoal, setAiGoal] = useState('Explore active NetAcad course curriculum');
  const [isAiReasoning, setIsAiReasoning] = useState(false);
  const [lastAiDecision, setLastAiDecision] = useState<any>(null);

  // Test suite state
  const [testResults, setTestResults] = useState<{
    timestamp: string;
    allPassed: boolean;
    tests: Array<{ id: number; name: string; passed: boolean; details: string; durationMs: number }>;
  } | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Auto-refresh interval
  const [autoRefresh, setAutoRefresh] = useState(true);
  const viewfinderRef = useRef<HTMLDivElement>(null);

  const fetchBrowserState = async () => {
    try {
      const res = await fetch('/api/browser/state');
      if (res.ok) {
        const data = await res.json();
        setBrowserState(data);
      }
    } catch (e) {
      // Server might be busy
    }
  };

  useEffect(() => {
    fetchBrowserState();
    let interval: any;
    if (autoRefresh) {
      interval = setInterval(fetchBrowserState, 3000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Actions
  const handleStartBrowser = async (urlToOpen?: string) => {
    setIsLoading(true);
    try {
      const target = urlToOpen || navUrl;
      const res = await fetch('/api/browser/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });
      await res.json();
      await fetchBrowserState();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopBrowser = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/browser/stop', { method: 'POST' });
      await fetchBrowserState();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseResume = async () => {
    try {
      if (browserState.isPaused) {
        await fetch('/api/browser/resume', { method: 'POST' });
      } else {
        await fetch('/api/browser/pause', { method: 'POST' });
      }
      await fetchBrowserState();
    } catch (e) {}
  };

  const handleDirectAction = async (action: any) => {
    setIsLoading(true);
    try {
      await fetch('/api/browser/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });
      await fetchBrowserState();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiStep = async () => {
    setIsAiReasoning(true);
    try {
      const res = await fetch('/api/browser/ai-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: aiGoal })
      });
      const data = await res.json();
      if (data.result?.decision) {
        setLastAiDecision(data.result.decision);
      }
      await fetchBrowserState();
    } finally {
      setIsAiReasoning(false);
    }
  };

  const handleViewfinderClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewfinderRef.current || !browserState.isRunning) return;
    const rect = viewfinderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Scale to headless 1280x800 viewport
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;

    const scaledX = Math.round(clickX * scaleX);
    const scaledY = Math.round(clickY * scaleY);

    await handleDirectAction({
      type: 'click_coord',
      x: scaledX,
      y: scaledY
    });
  };

  const handleRunAllTests = async () => {
    setIsRunningTests(true);
    try {
      const res = await fetch('/api/browser/run-tests', { method: 'POST' });
      const data = await res.json();
      setTestResults(data);
      await fetchBrowserState();
    } catch (e: any) {
      alert(`Test suite error: ${e.message}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleClearQueue = async () => {
    await fetch('/api/browser/clear-queue', { method: 'POST' });
    await fetchBrowserState();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Cyberpunk Banner */}
      <div className="rounded-xl cyber-panel border border-cyan-500/40 p-5 sm:p-6 space-y-4 cyber-cut">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono">
              <span className={`w-2 h-2 rounded-full ${browserState.isRunning ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
              <span>REAL BROWSER EXECUTION SERVICE: {browserState.isRunning ? 'RUNNING (PUPPETEER)' : 'STANDBY'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wide">
              Live Cisco NetAcad Browser Execution Hub
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 font-sans leading-relaxed">
              Real headless Chromium instance executing navigation, viewport clicks, DOM inspections, and Gemini Computer Use action planning. Secure zero-credential session isolation enforced.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {!browserState.isRunning ? (
              <button
                onClick={() => handleStartBrowser()}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-heading font-semibold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg cyber-cut-sm active:scale-95"
              >
                <Play className="w-4 h-4 text-cyan-200" />
                <span>Launch Chromium Engine</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePauseResume}
                  className={`px-3 py-2 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors ${
                    browserState.isPaused 
                      ? 'bg-amber-950 border-amber-500/50 text-amber-300' 
                      : 'bg-purple-950 border-purple-500/40 text-purple-200'
                  }`}
                >
                  {browserState.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{browserState.isPaused ? 'Resume Queue' : 'Pause'}</span>
                </button>

                <button
                  onClick={handleStopBrowser}
                  disabled={isLoading}
                  className="px-3 py-2 rounded-lg bg-pink-950/80 hover:bg-pink-900 border border-pink-500/40 text-pink-300 text-xs font-mono flex items-center gap-1.5"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop Engine</span>
                </button>
              </div>
            )}

            <button
              onClick={handleRunAllTests}
              disabled={isRunningTests}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 border border-purple-500/40 text-cyan-300 font-heading font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5"
            >
              <Activity className={`w-4 h-4 ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Running Tests 1-8...' : 'Run 8-Point Validation'}</span>
            </button>
          </div>
        </div>

        {/* Browser Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-purple-500/20 text-xs font-mono">
          <div className="p-2.5 rounded bg-[#090314] border border-purple-500/20">
            <span className="text-purple-300 text-[10px]">Active URL:</span>
            <div className="text-xs text-cyan-300 truncate mt-0.5" title={browserState.currentUrl}>
              {browserState.currentUrl || 'about:blank'}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#090314] border border-purple-500/20">
            <span className="text-purple-300 text-[10px]">Page Title:</span>
            <div className="text-xs text-slate-100 truncate mt-0.5" title={browserState.currentTitle}>
              {browserState.currentTitle || 'No page loaded'}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#090314] border border-purple-500/20">
            <span className="text-purple-300 text-[10px]">Queue Pending:</span>
            <div className="text-xs text-cyan-400 font-bold mt-0.5">
              {browserState.queue?.filter(t => t.status === 'pending').length || 0} tasks
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#090314] border border-purple-500/20 flex items-center justify-between">
            <div>
              <span className="text-purple-300 text-[10px]">Live Stream:</span>
              <div className="text-xs text-cyan-300 mt-0.5">
                {autoRefresh ? '3s Sync ON' : 'Paused'}
              </div>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-[10px] text-purple-400 hover:text-cyan-300 underline"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Interactive Viewfinder on Left, Control Deck & Queue on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Browser Viewfinder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl cyber-panel border border-cyan-500/40 overflow-hidden shadow-xl">
            
            {/* Viewfinder Navigation Bar */}
            <div className="p-3 bg-[#0a0316] border-b border-purple-500/25 flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-[200px] flex items-center gap-1.5 bg-[#120726] border border-purple-500/30 rounded-lg px-2.5 py-1.5 text-xs font-mono">
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={navUrl}
                  onChange={(e) => setNavUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDirectAction({ type: 'navigate', url: navUrl })}
                  placeholder="https://www.netacad.com"
                  className="w-full bg-transparent text-slate-100 focus:outline-none placeholder-purple-300/40 text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDirectAction({ type: 'navigate', url: navUrl })}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  <span>Go</span>
                </button>

                <button
                  onClick={() => handleDirectAction({ type: 'screenshot' })}
                  title="Capture fresh screenshot"
                  className="p-1.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 hover:text-cyan-300"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDirectAction({ type: 'scroll', scrollAmount: 350 })}
                  title="Scroll Down"
                  className="p-1.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 hover:text-cyan-300"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDirectAction({ type: 'scroll', scrollAmount: -350 })}
                  title="Scroll Up"
                  className="p-1.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 hover:text-cyan-300"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Target Presets Bar */}
            <div className="px-3 py-1.5 bg-[#070210] border-b border-purple-500/20 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
              <span className="text-purple-400 shrink-0">NetAcad Targets:</span>
              <button
                onClick={() => {
                  setNavUrl('https://www.netacad.com');
                  handleDirectAction({ type: 'navigate', url: 'https://www.netacad.com' });
                }}
                className="px-2 py-0.5 rounded bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-cyan-300 border border-purple-500/30 shrink-0"
              >
                NetAcad Home
              </button>
              <button
                onClick={() => {
                  setNavUrl('https://www.netacad.com/portal/learning');
                  handleDirectAction({ type: 'navigate', url: 'https://www.netacad.com/portal/learning' });
                }}
                className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 shrink-0"
              >
                Direct Student Login
              </button>
              <button
                onClick={() => {
                  setNavUrl('https://skillsforall.com');
                  handleDirectAction({ type: 'navigate', url: 'https://skillsforall.com' });
                }}
                className="px-2 py-0.5 rounded bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-cyan-300 border border-purple-500/30 shrink-0"
              >
                Skills for All Hub
              </button>
              <button
                onClick={() => {
                  setNavUrl('https://example.com');
                  handleDirectAction({ type: 'navigate', url: 'https://example.com' });
                }}
                className="px-2 py-0.5 rounded bg-[#100722] text-slate-300 hover:text-white border border-purple-500/20 shrink-0"
              >
                Authorized Test Page
              </button>
            </div>

            {/* Viewfinder Canvas (Interactive click-to-browse) */}
            <div
              ref={viewfinderRef}
              onClick={handleViewfinderClick}
              className="relative aspect-[16/10] bg-[#05010b] flex items-center justify-center cursor-crosshair overflow-hidden group select-none"
            >
              {browserState.recentScreenshot ? (
                <img
                  src={`data:image/jpeg;base64,${browserState.recentScreenshot}`}
                  alt="Live Browser Viewport"
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-950/80 border border-purple-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-mono text-purple-300">
                    No active viewport frame. Click "Launch Chromium Engine" to start.
                  </p>
                </div>
              )}

              {/* Crosshair HUD Overlay */}
              <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/75 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 pointer-events-none flex items-center gap-1.5 opacity-90">
                <MousePointer className="w-3 h-3 text-cyan-400" />
                <span>Click viewport to interact (1280x800 mapped)</span>
              </div>
            </div>

            {/* Direct Input Deck (Typing into focused input on phone/desktop) */}
            <div className="p-3 bg-[#0a0316] border-t border-purple-500/25 flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-[200px] flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-purple-400 shrink-0" />
                <input
                  type="text"
                  value={typeText}
                  onChange={(e) => setTypeText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleDirectAction({ type: 'type', selector: typeSelector, text: typeText });
                      setTypeText('');
                    }
                  }}
                  placeholder="Type text directly into active input..."
                  className="flex-1 bg-[#120726] border border-purple-500/30 rounded px-2.5 py-1.5 text-xs text-slate-100 font-sans focus:outline-none focus:border-cyan-400"
                />
              </div>

              <input
                type="text"
                value={typeSelector}
                onChange={(e) => setTypeSelector(e.target.value)}
                placeholder="CSS Selector (e.g. input[type=email])"
                className="w-48 bg-[#120726] border border-purple-500/30 rounded px-2 py-1.5 text-[11px] text-cyan-300 font-mono focus:outline-none"
              />

              <button
                onClick={() => {
                  handleDirectAction({ type: 'type', selector: typeSelector, text: typeText });
                  setTypeText('');
                }}
                className="px-3 py-1.5 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-heading font-semibold"
              >
                Send Keystrokes
              </button>
            </div>
          </div>

          {/* Gemini Computer Use Reasoning Deck */}
          <div className="rounded-xl cyber-panel border border-purple-500/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-bold text-sm text-white">
                  Gemini Computer Vision & Action Reasoner
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                gemini-3.8-flash Multimodal
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                placeholder="Target objective (e.g. Navigate to Chapter 14 video lesson and verify transcript)"
                className="flex-1 bg-[#0d051c] border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-slate-100 font-sans focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleAiStep}
                disabled={isAiReasoning || !browserState.isRunning}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 text-white font-heading font-semibold text-xs tracking-wider flex items-center gap-1.5 shrink-0"
              >
                {isAiReasoning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Reasoning...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5" />
                    <span>Analyze & Execute Next Step</span>
                  </>
                )}
              </button>
            </div>

            {lastAiDecision && (
              <div className="p-3 rounded-lg bg-[#0e0724] border border-cyan-500/30 text-xs space-y-1.5 font-sans">
                <div className="flex items-center justify-between font-mono text-[11px] text-cyan-300">
                  <span>Decision: <strong className="text-white uppercase">{lastAiDecision.action}</strong></span>
                  <span>Verified Requirement: {lastAiDecision.verificationRequirement}</span>
                </div>
                <p className="text-purple-200/80 leading-relaxed">
                  Reasoning: {lastAiDecision.reasoning}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Task Queue & Live Telemetry Logs */}
        <div className="space-y-4">
          
          {/* Task Queue Deck */}
          <div className="rounded-xl cyber-panel border border-purple-500/30 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-sm text-white">Execution Task Queue</h3>
              </div>
              <button
                onClick={handleClearQueue}
                className="text-[10px] font-mono text-purple-300 hover:text-pink-400 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2">
              {!browserState.queue || browserState.queue.length === 0 ? (
                <div className="py-6 text-center text-xs font-mono text-purple-300/60">
                  Queue is empty. Enqueue tasks or run automated steps.
                </div>
              ) : (
                browserState.queue.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded bg-[#090314] border border-purple-500/20 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-100">{task.name}</span>
                      <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ${
                        task.status === 'completed' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' :
                        task.status === 'failed' ? 'bg-pink-950 text-pink-300 border border-pink-500/40' :
                        task.status === 'running' ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40' :
                        'bg-purple-950 text-purple-300'
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-300/70">
                      <span>Type: {task.type}</span>
                      <span>Retries: {task.retries}/{task.maxRetries}</span>
                    </div>

                    {task.error && (
                      <p className="text-[10px] text-pink-400 font-mono">
                        Error: {task.error}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Real Terminal Telemetry Logs */}
          <div className="rounded-xl cyber-panel border border-purple-500/30 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-bold text-sm text-white">Browser Execution Telemetry</h3>
              </div>
            </div>

            <div className="h-64 overflow-y-auto bg-[#06020e] border border-purple-500/20 rounded-lg p-3 space-y-1 font-mono text-[11px] text-cyan-300/90 leading-tight">
              {browserState.logs.map((log, index) => (
                <div key={index} className="flex items-start gap-1.5">
                  <span className="text-purple-500 select-none">›</span>
                  <span className={log.includes('ERROR') || log.includes('FAILED') ? 'text-pink-400' : log.includes('SUCCESS') ? 'text-cyan-300 font-semibold' : ''}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 8-Point Integration Test Results Matrix */}
      {testResults && (
        <div className="rounded-xl cyber-panel border border-cyan-500/40 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-base text-white">
                Live 8-Point Real Browser Validation Test Results
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                testResults.allPassed ? 'bg-cyan-950 text-cyan-300 border border-cyan-400' : 'bg-amber-950 text-amber-300 border border-amber-400'
              }`}>
                {testResults.allPassed ? 'ALL 8 TESTS PASSED (100%)' : 'SOME TESTS FAILED'}
              </span>
              <span className="text-[11px] font-mono text-purple-300">
                Timestamp: {new Date(testResults.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testResults.tests.map((test) => (
              <div
                key={test.id}
                className={`p-3.5 rounded-lg border text-xs font-sans space-y-1 ${
                  test.passed 
                    ? 'bg-[#090314] border-cyan-500/30' 
                    : 'bg-pink-950/40 border-pink-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-slate-100">
                    Test {test.id}: {test.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-purple-300">{test.durationMs}ms</span>
                    {test.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-pink-400 shrink-0" />
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-purple-200/80 font-mono">
                  {test.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security & Authentication Protocol Card */}
      <div className="p-4 rounded-lg bg-[#0e0724] border border-cyan-500/30 flex items-start gap-3">
        <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs font-sans">
          <span className="font-heading font-bold text-cyan-300 tracking-wider">
            AUTHENTICATION & ZERO-CREDENTIAL STORAGE ARCHITECTURE
          </span>
          <p className="text-purple-200/80 leading-relaxed">
            MEI AI Agent never collects or saves NetAcad passwords, Google passwords, or session cookies in the application database or local storage. You interact directly with the sandboxed browser viewfinder to sign in on Cisco's official authentication domains (<code className="text-cyan-300 font-mono">login.cisco.com</code> / <code className="text-cyan-300 font-mono">id.cisco.com</code>). Signing into MEI does not sign you into NetAcad — the sessions remain strictly separated.
          </p>
        </div>
      </div>

    </div>
  );
};
