import React, { useState } from 'react';
import { 
  NetAcadCourse, 
  TranscriptSummary 
} from '../types/netacad';
import { CORE_CISCO_TRANSCRIPTS } from '../data/netacadCourses';
import { 
  Play, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  Volume2, 
  Copy, 
  Check, 
  BookOpen, 
  Upload, 
  RotateCcw,
  Bot
} from 'lucide-react';

interface LessonAssistantViewProps {
  courses: NetAcadCourse[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'courses' | 'ai_tutor' | 'lessons' | 'tasks' | 'automation') => void;
}

export const LessonAssistantView: React.FC<LessonAssistantViewProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  onNavigateTab
}) => {
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<string>(CORE_CISCO_TRANSCRIPTS[0].id);
  const [customTranscriptText, setCustomTranscriptText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('Custom NetAcad Video Transcript');

  // AI Summary State
  const [summaryData, setSummaryData] = useState<TranscriptSummary | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Copy state
  const [copied, setCopied] = useState(false);

  const activeTranscript = CORE_CISCO_TRANSCRIPTS.find(t => t.id === selectedTranscriptId) || CORE_CISCO_TRANSCRIPTS[0];
  const currentContent = isCustomMode ? customTranscriptText : activeTranscript.content;
  const currentLessonTitle = isCustomMode ? customTitle : activeTranscript.title;

  const handleSummarize = async () => {
    if (!currentContent.trim() || isSummarizing) return;
    setIsSummarizing(true);
    setSummaryError(null);

    try {
      const res = await fetch('/api/ai/summarize-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcriptText: currentContent,
          lessonTitle: currentLessonTitle,
          courseTitle: activeTranscript.courseCode
        })
      });

      const data = await res.json();
      if (data.keyConcepts) {
        setSummaryData(data);
      } else {
        setSummaryError(data.error || 'Failed to generate transcript summary.');
      }
    } catch (err: any) {
      setSummaryError(err.message || 'Network error connecting to Gemini summarizer.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const copyNotes = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-xl cyber-panel border border-purple-500/30 p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">
                Cisco Media Player & Video Transcript Summarizer
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/80 font-sans">
              Watch Cisco video lectures with synchronized closed-captions and transcripts. Use Gemini AI to instantly extract key concepts, high-yield exam traps, and Packet Tracer CLI commands.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.netacad.com/portal/learning"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-heading font-semibold text-xs tracking-wider flex items-center gap-1.5 shadow-md"
            >
              <span>Launch NetAcad Video Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Preset Transcripts Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-purple-500/20">
          <span className="text-xs font-mono text-purple-300">NetAcad Lectures:</span>
          {CORE_CISCO_TRANSCRIPTS.map((t) => {
            const isSelected = !isCustomMode && t.id === selectedTranscriptId;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTranscriptId(t.id);
                  setIsCustomMode(false);
                  setSummaryData(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-900 text-cyan-300 border border-cyan-500/40 cyber-glow-cyan'
                    : 'bg-[#0d051c] text-slate-300 hover:text-white border border-purple-500/20'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">({t.videoLength})</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              setIsCustomMode(true);
              setSummaryData(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              isCustomMode
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                : 'bg-[#0d051c] text-purple-300 hover:text-white border border-purple-500/20'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Paste Custom Lecture / Subtitles</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Player & Transcript on Left, AI Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Video Lecture & Transcript Viewer */}
        <div className="space-y-4">
          <div className="rounded-xl cyber-panel border border-purple-500/30 overflow-hidden">
            {/* Mock Player Header */}
            <div className="p-4 bg-[#0c051a] border-b border-purple-500/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono text-cyan-400">
                  {isCustomMode ? 'CUSTOM INPUT LECTURE' : `${activeTranscript.courseCode} • ${activeTranscript.module}`}
                </span>
                <h3 className="font-heading font-bold text-base text-white">
                  {currentLessonTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
                  1080p HD
                </span>
              </div>
            </div>

            {/* Video Graphic HUD / Preview Canvas */}
            <div className="relative aspect-video bg-[#070210] border-b border-purple-500/20 flex flex-col items-center justify-center p-6 text-center cyber-grid">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c051a] via-transparent to-transparent opacity-80" />
              
              <div className="relative z-10 space-y-3 max-w-md">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5 mx-auto cyber-glow-cyan shadow-xl cursor-pointer hover:scale-105 transition-transform flex items-center justify-center">
                  <div className="w-full h-full bg-[#0a0316] rounded-full flex items-center justify-center">
                    <Play className="w-7 h-7 text-cyan-400 fill-cyan-400 ml-1" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-base text-white tracking-wide">
                    {currentLessonTitle}
                  </h4>
                  <p className="text-xs text-purple-200/70 font-sans">
                    Cisco Networking Academy Official Courseware Lesson
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Transcript Audio Synced</span>
                </div>
              </div>
            </div>

            {/* Transcript Text Box */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Accessible Video Transcript & Closed Captions:
                  </span>
                </div>

                <button
                  onClick={() => copyNotes(currentContent)}
                  className="text-[11px] font-mono text-purple-300 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              {isCustomMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Lesson Title..."
                    className="w-full bg-[#070210] border border-purple-500/30 rounded px-3 py-1.5 text-xs text-cyan-300 font-mono"
                  />
                  <textarea
                    value={customTranscriptText}
                    onChange={(e) => setCustomTranscriptText(e.target.value)}
                    rows={8}
                    placeholder="Paste accessible closed captions, video transcript, or NetAcad reading text here..."
                    className="w-full bg-[#070210] border border-purple-500/30 focus:border-cyan-400 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none"
                  />
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto p-3.5 rounded-lg bg-[#070210] border border-purple-500/20 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                  {activeTranscript.content}
                </div>
              )}

              {/* Summarize Trigger Button */}
              <button
                onClick={handleSummarize}
                disabled={isSummarizing || !currentContent.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 text-white font-heading font-semibold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg cyber-cut-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>
                  {isSummarizing ? 'Analyzing with Gemini AI...' : 'Summarize Transcript & Extract Packet Tracer Commands'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Structured Summary */}
        <div className="space-y-4">
          <div className="rounded-xl cyber-panel border border-cyan-500/30 p-5 space-y-4 min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  Gemini AI Lecture Intelligence
                </h3>
              </div>

              {summaryData && (
                <button
                  onClick={() => {
                    const fullText = JSON.stringify(summaryData, null, 2);
                    copyNotes(fullText);
                  }}
                  className="px-2.5 py-1 rounded bg-purple-950 text-xs font-mono text-purple-300 hover:text-cyan-300 flex items-center gap-1 border border-purple-500/30"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </button>
              )}
            </div>

            {isSummarizing && (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-cyan-300 font-mono">
                  Distilling lecture takeaways, CCNA exam traps, and Packet Tracer configuration commands...
                </p>
              </div>
            )}

            {summaryError && !isSummarizing && (
              <div className="p-4 rounded-lg bg-pink-950/60 border border-pink-500/40 text-xs text-pink-300 font-mono">
                Error: {summaryError}
              </div>
            )}

            {!summaryData && !isSummarizing && !summaryError && (
              <div className="py-24 text-center space-y-3">
                <FileText className="w-10 h-10 text-purple-400/60 mx-auto" />
                <p className="text-sm text-purple-200 font-mono">
                  No summary generated yet.
                </p>
                <p className="text-xs text-purple-300/60 max-w-xs mx-auto font-sans">
                  Click the "Summarize Transcript" button on the left to extract key concepts and Packet Tracer CLI commands.
                </p>
              </div>
            )}

            {summaryData && !isSummarizing && (
              <div className="space-y-4">
                
                {/* Key Concepts */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Key Conceptual Takeaways:</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-200 font-sans">
                    {summaryData.keyConcepts.map((concept, i) => (
                      <li key={i} className="flex items-start gap-2 p-2 rounded bg-[#090314] border border-purple-500/15">
                        <span className="text-cyan-400 font-mono shrink-0">›</span>
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Packet Tracer Commands Mentioned */}
                {summaryData.packetTracerCommands && summaryData.packetTracerCommands.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-purple-500/15">
                    <span className="text-xs font-mono font-bold text-pink-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-pink-400" />
                      <span>Packet Tracer / Cisco IOS CLI Commands:</span>
                    </span>
                    <div className="space-y-1.5">
                      {summaryData.packetTracerCommands.map((cmd, i) => (
                        <div key={i} className="p-2.5 rounded bg-[#070210] border border-pink-500/20 text-xs">
                          <code className="text-cyan-300 font-mono font-bold">{cmd.command}</code>
                          <p className="text-[11px] text-purple-200/80 mt-0.5 font-sans">{cmd.description}</p>
                          {cmd.mode && (
                            <span className="text-[9px] font-mono text-purple-400 mt-1 inline-block">
                              Mode: {cmd.mode}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam High-Yield Notes */}
                <div className="space-y-2 pt-2 border-t border-purple-500/15">
                  <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>NetAcad Module Quiz High-Yield Tips:</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                    {summaryData.examHighYieldNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 p-2 rounded bg-[#090314] border border-purple-500/15">
                        <span className="text-purple-400 font-mono shrink-0">★</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practice Scenarios */}
                {summaryData.practiceScenarios && summaryData.practiceScenarios.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-purple-500/15">
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Reinforcement Lab Practice:</span>
                    </span>
                    <div className="space-y-1 text-xs text-slate-300">
                      {summaryData.practiceScenarios.map((scen, i) => (
                        <div key={i} className="p-2 rounded bg-[#0e0724] border border-cyan-500/20 text-xs">
                          {scen}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onNavigateTab('ai_tutor')}
                  className="w-full py-2 rounded bg-purple-950/80 hover:bg-purple-900 text-cyan-300 text-xs font-mono border border-purple-500/30 flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask MEI AI Tutor about this topic →</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
