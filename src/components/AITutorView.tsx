import React, { useState } from 'react';
import { 
  NetAcadCourse, 
  CourseModule, 
  QuizQuestion 
} from '../types/netacad';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Terminal, 
  FileText, 
  Calculator, 
  Layers, 
  RotateCcw, 
  Copy, 
  Check, 
  Flame,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface AITutorViewProps {
  courses: NetAcadCourse[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  preloadedTopic?: string;
  preloadedModule?: CourseModule;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  preloadedTopic = '',
  preloadedModule
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'explain' | 'solve' | 'notes' | 'quiz'>('chat');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; content: string; timestamp: string }>>([
    {
      role: 'model',
      content: "Greetings, Agent. I am MEI, your Cisco Networking Academy intelligence unit. I'm connected to your CCNA curriculum. Ask me to break down complex topics like Subnetting, OSPF, STP, VLANs, or paste a Packet Tracer error and we'll resolve it.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Explain state
  const [explainTopic, setExplainTopic] = useState(preloadedTopic || 'IPv4 Subnetting using Magic Number Method');
  const [explainResult, setExplainResult] = useState('');
  const [isExplainLoading, setIsExplainLoading] = useState(false);

  // Solve practice problem state
  const [problemType, setProblemType] = useState('Subnetting & CIDR');
  const [problemQuestion, setProblemQuestion] = useState('Given the IP address 172.16.35.123 with subnet mask 255.255.240.0 (/20), find: 1) Network Address, 2) Broadcast Address, 3) First Usable Host, 4) Last Usable Host, 5) Number of usable hosts.');
  const [studentAttempt, setStudentAttempt] = useState('');
  const [solveResult, setSolveResult] = useState('');
  const [isSolveLoading, setIsSolveLoading] = useState(false);

  // Notes state
  const [notesModuleTitle, setNotesModuleTitle] = useState(preloadedModule?.title || 'Module 8: Network Layer & Subnetting');
  const [notesCustom, setNotesCustom] = useState('');
  const [notesResult, setNotesResult] = useState('');
  const [isNotesLoading, setIsNotesLoading] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // Clipboard copy helper
  const [copiedText, setCopiedText] = useState(false);

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Handlers
  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userText = chatInput.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setChatMessages(prev => [...prev, { role: 'user', content: userText, timestamp: time }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          contextCourse: currentCourse.title,
          contextModule: preloadedModule?.title || 'General',
          history: chatMessages.slice(-6)
        })
      });

      const data = await res.json();
      if (data.reply) {
        setChatMessages(prev => [...prev, { 
          role: 'model', 
          content: data.reply, 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
      } else if (data.error) {
        setChatMessages(prev => [...prev, { 
          role: 'model', 
          content: `⚠️ Error: ${data.error}`, 
          timestamp: time 
        }]);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { 
        role: 'model', 
        content: `Connection error: ${err.message}`, 
        timestamp: time 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!explainTopic.trim() || isExplainLoading) return;
    setIsExplainLoading(true);
    setExplainResult('');

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: explainTopic,
          courseCode: currentCourse.code
        })
      });
      const data = await res.json();
      setExplainResult(data.explanation || data.error || 'No explanation generated.');
    } catch (err: any) {
      setExplainResult(`Error: ${err.message}`);
    } finally {
      setIsExplainLoading(false);
    }
  };

  const handleSolvePractice = async () => {
    if (!problemQuestion.trim() || isSolveLoading) return;
    setIsSolveLoading(true);
    setSolveResult('');

    try {
      const res = await fetch('/api/ai/solve-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemType,
          question: problemQuestion,
          userAttempt: studentAttempt
        })
      });
      const data = await res.json();
      setSolveResult(data.solution || data.error || 'No solution generated.');
    } catch (err: any) {
      setSolveResult(`Error: ${err.message}`);
    } finally {
      setIsSolveLoading(false);
    }
  };

  const handleGenerateNotes = async () => {
    if (isNotesLoading) return;
    setIsNotesLoading(true);
    setNotesResult('');

    try {
      const res = await fetch('/api/ai/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: currentCourse.title,
          moduleNumber: preloadedModule?.moduleNumber || 8,
          moduleTitle: notesModuleTitle,
          customNotes: notesCustom
        })
      });
      const data = await res.json();
      setNotesResult(data.notes || data.error || 'No notes generated.');
    } catch (err: any) {
      setNotesResult(`Error: ${err.message}`);
    } finally {
      setIsNotesLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (isQuizLoading) return;
    setIsQuizLoading(true);
    setQuizQuestions([]);
    setSelectedAnswers({});
    setIsQuizSubmitted(false);

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: currentCourse.title,
          moduleTitle: notesModuleTitle,
          count: 5
        })
      });
      const data = await res.json();
      if (Array.isArray(data.questions)) {
        setQuizQuestions(data.questions);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Quick preset topic clicker
  const quickTopics = [
    'Subnetting Magic Number Method',
    '802.1Q Router-on-a-Stick Inter-VLAN',
    'STP Root Bridge Election & BID',
    'TCP 3-Way Handshake vs UDP',
    'Cisco IOS SSH Hardening Commands',
    'Standard vs Extended IPv4 ACLs'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Sub-mode Switcher */}
      <div className="rounded-xl cyber-panel border border-purple-500/30 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 cyber-cut-sm">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">
                  MEI Cisco Academic AI Mentor
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs text-purple-200/70 font-sans">
                Active Context: <span className="text-cyan-400 font-mono">{currentCourse.title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-300 hidden sm:inline">Active Course:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => onSelectCourse(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#0e0621] border border-purple-500/30 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-mode Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-500/20">
          {[
            { id: 'chat', label: 'Interactive AI Chat', icon: Terminal },
            { id: 'explain', label: 'Concept Explainer', icon: Lightbulb },
            { id: 'solve', label: 'Practice Problem Solver', icon: Calculator },
            { id: 'notes', label: 'High-Yield Notes Generator', icon: FileText },
            { id: 'quiz', label: 'Exam Readiness Quizzer', icon: Layers },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={`px-3 py-2 rounded-lg font-heading text-xs sm:text-sm tracking-wider flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-purple-900/90 text-cyan-300 border border-cyan-500/40 cyber-glow-cyan'
                    : 'bg-[#0e0621] text-slate-300 hover:text-white border border-purple-500/20 hover:bg-purple-950/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-purple-400'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODE 1: INTERACTIVE CHAT */}
      {activeMode === 'chat' && (
        <div className="rounded-xl cyber-panel border border-purple-500/30 flex flex-col h-[650px] overflow-hidden">
          {/* Quick suggestions header */}
          <div className="p-3 bg-[#0c051a] border-b border-purple-500/20 flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <span className="text-purple-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask MEI:</span>
            </span>
            {quickTopics.slice(0, 4).map((topic, i) => (
              <button
                key={i}
                onClick={() => setChatInput(`Can you explain ${topic} with Cisco IOS commands and NetAcad exam tips?`)}
                className="px-2.5 py-1 rounded bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-cyan-300 shrink-0 border border-purple-500/30 text-[11px]"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser 
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' 
                      : 'bg-purple-950 text-purple-300 border border-purple-500/40'
                  }`}>
                    {isUser ? <Terminal className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] rounded-xl p-4 text-xs sm:text-sm font-sans space-y-1.5 leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-slate-100 border border-cyan-500/40'
                      : 'bg-[#0f0724] text-slate-200 border border-purple-500/25 whitespace-pre-wrap'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-300/70 pb-1 mb-1 border-b border-purple-500/15">
                      <span>{isUser ? 'Agent Student' : 'MEI NetAcad AI'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              );
            })}

            {isChatLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-950 text-cyan-400 border border-purple-500/40 flex items-center justify-center animate-pulse">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-xl bg-[#0f0724] border border-purple-500/30 text-xs text-cyan-300 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>MEI is analyzing Cisco curriculum database...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat input box */}
          <div className="p-3.5 bg-[#0b0416] border-t border-purple-500/20">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                placeholder="Ask about subnetting, Packet Tracer commands, VLANs, exam tips..."
                className="flex-1 bg-[#13082a] border border-purple-500/30 focus:border-cyan-400 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none placeholder-purple-300/40 font-sans"
              />
              <button
                onClick={handleSendChat}
                disabled={isChatLoading || !chatInput.trim()}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-heading font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: CONCEPT EXPLAINER */}
      {activeMode === 'explain' && (
        <div className="space-y-4">
          <div className="rounded-xl cyber-panel border border-purple-500/30 p-5 space-y-4">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-cyan-400" />
              <span>Deep Cisco NetAcad Conceptual Breakdown</span>
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-purple-300">Target Concept / Topic:</label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="text"
                  value={explainTopic}
                  onChange={(e) => setExplainTopic(e.target.value)}
                  placeholder="e.g. Spanning Tree Protocol Root Bridge Election, Subnetting with /27..."
                  className="flex-1 bg-[#0d051c] border border-purple-500/30 focus:border-cyan-400 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none font-sans"
                />
                <button
                  onClick={handleExplain}
                  disabled={isExplainLoading || !explainTopic.trim()}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-heading font-semibold text-xs tracking-wider flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Explain Topic</span>
                </button>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] font-mono text-purple-400">Popular:</span>
              {quickTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setExplainTopic(topic);
                  }}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/30"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {isExplainLoading && (
            <div className="p-8 text-center rounded-xl cyber-panel border border-purple-500/30 space-y-3">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-cyan-300 font-mono">
                Generating architectural breakdown with Packet Tracer CLI syntax...
              </p>
            </div>
          )}

          {explainResult && !isExplainLoading && (
            <div className="rounded-xl cyber-panel border border-cyan-500/40 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                <span className="text-xs font-mono text-cyan-300">
                  Concept Breakdown: {explainTopic}
                </span>
                <button
                  onClick={() => copyToClipboard(explainResult)}
                  className="px-2.5 py-1 rounded bg-purple-950 text-xs font-mono text-purple-300 hover:text-cyan-300 flex items-center gap-1 border border-purple-500/30"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                {explainResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: PRACTICE PROBLEM SOLVER */}
      {activeMode === 'solve' && (
        <div className="space-y-4">
          <div className="rounded-xl cyber-panel border border-purple-500/30 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span>Cisco NetAcad Practice Problem Solver</span>
              </h3>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-300">Type:</span>
                <select
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value)}
                  className="px-2.5 py-1 rounded bg-[#0d051c] border border-purple-500/30 text-xs font-mono text-cyan-300"
                >
                  <option value="Subnetting & CIDR">Subnetting & CIDR</option>
                  <option value="Access Control Lists (ACL)">Access Control Lists (ACL)</option>
                  <option value="Router-on-a-Stick CLI">Router-on-a-Stick CLI</option>
                  <option value="Spanning Tree Root Port">Spanning Tree Root Port</option>
                  <option value="Packet Tracer Debugging">Packet Tracer Debugging</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-purple-300">Problem Statement / Scenario:</label>
              <textarea
                value={problemQuestion}
                onChange={(e) => setProblemQuestion(e.target.value)}
                rows={4}
                className="w-full bg-[#0d051c] border border-purple-500/30 focus:border-cyan-400 rounded-lg p-3 text-xs sm:text-sm text-slate-100 focus:outline-none font-mono"
                placeholder="Paste your Cisco module practice problem, subnet mask calculation, or CLI error..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-purple-300">Your Initial Attempt / Hypothesis (Optional):</label>
              <input
                type="text"
                value={studentAttempt}
                onChange={(e) => setStudentAttempt(e.target.value)}
                placeholder="e.g. I think the Magic Number is 16 and the broadcast address is 172.16.47.255..."
                className="w-full bg-[#0d051c] border border-purple-500/30 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none font-sans"
              />
            </div>

            <button
              onClick={handleSolvePractice}
              disabled={isSolveLoading || !problemQuestion.trim()}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-heading font-semibold text-xs tracking-wider flex items-center justify-center gap-2"
            >
              <BrainCircuit className="w-4 h-4 text-cyan-200" />
              <span>Solve & Verify Step-by-Step with Gemini</span>
            </button>
          </div>

          {isSolveLoading && (
            <div className="p-8 text-center rounded-xl cyber-panel border border-purple-500/30 space-y-3">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-cyan-300 font-mono">
                Calculating block size, binary bits, and Packet Tracer verification commands...
              </p>
            </div>
          )}

          {solveResult && !isSolveLoading && (
            <div className="rounded-xl cyber-panel border border-cyan-500/40 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Verified Problem Solution & Logic Breakdown</span>
                </span>
                <button
                  onClick={() => copyToClipboard(solveResult)}
                  className="px-2.5 py-1 rounded bg-purple-950 text-xs font-mono text-purple-300 hover:text-cyan-300 flex items-center gap-1 border border-purple-500/30"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                {solveResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: GENERATE NOTES & CHEAT SHEET */}
      {activeMode === 'notes' && (
        <div className="space-y-4">
          <div className="rounded-xl cyber-panel border border-purple-500/30 p-5 space-y-4">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>High-Yield Module Notes & CLI Cheat Sheet Generator</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-purple-300">Module Title / Topic:</label>
                <input
                  type="text"
                  value={notesModuleTitle}
                  onChange={(e) => setNotesModuleTitle(e.target.value)}
                  placeholder="e.g. Module 3: VLANs and Inter-VLAN Routing"
                  className="w-full bg-[#0d051c] border border-purple-500/30 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-purple-300">Custom Emphasis (Optional):</label>
                <input
                  type="text"
                  value={notesCustom}
                  onChange={(e) => setNotesCustom(e.target.value)}
                  placeholder="e.g. focus on Packet Tracer verification commands and trap questions"
                  className="w-full bg-[#0d051c] border border-purple-500/30 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none font-sans"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateNotes}
              disabled={isNotesLoading || !notesModuleTitle.trim()}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-heading font-semibold text-xs tracking-wider flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-200" />
              <span>Generate Comprehensive Revision Sheet</span>
            </button>
          </div>

          {isNotesLoading && (
            <div className="p-8 text-center rounded-xl cyber-panel border border-purple-500/30 space-y-3">
              <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-purple-300 font-mono">
                Compiling standards, port numbers, CLI syntax tables, and NetAcad trap alerts...
              </p>
            </div>
          )}

          {notesResult && !isNotesLoading && (
            <div className="rounded-xl cyber-panel border border-purple-500/40 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                <span className="text-xs font-mono text-cyan-300">
                  Revision Notes: {notesModuleTitle}
                </span>
                <button
                  onClick={() => copyToClipboard(notesResult)}
                  className="px-2.5 py-1 rounded bg-purple-950 text-xs font-mono text-purple-300 hover:text-cyan-300 flex items-center gap-1 border border-purple-500/30"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                {notesResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 5: EXAM READINESS QUIZZER */}
      {activeMode === 'quiz' && (
        <div className="space-y-4">
          <div className="rounded-xl cyber-panel border border-purple-500/30 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>Module Exam Readiness Quiz Simulator</span>
                </h3>
                <p className="text-xs text-purple-200/70 font-sans">
                  Targeted questions generated by Gemini matching authentic Cisco NetAcad assessment style.
                </p>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={isQuizLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-heading font-semibold text-xs tracking-wider flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{quizQuestions.length > 0 ? 'Generate New Quiz' : 'Start Practice Quiz'}</span>
              </button>
            </div>
          </div>

          {isQuizLoading && (
            <div className="p-8 text-center rounded-xl cyber-panel border border-purple-500/30 space-y-3">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-cyan-300 font-mono">
                Generating 5 NetAcad assessment questions with scenario topologies...
              </p>
            </div>
          )}

          {quizQuestions.length > 0 && !isQuizLoading && (
            <div className="space-y-4">
              {quizQuestions.map((q, qIndex) => {
                const studentAns = selectedAnswers[q.id];
                const isAnswered = studentAns !== undefined;
                const isCorrect = isAnswered && studentAns === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id || qIndex}
                    className="rounded-xl cyber-panel border border-purple-500/30 p-5 space-y-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        Question {qIndex + 1} • {q.topicTag}
                      </span>

                      {isQuizSubmitted && (
                        <span className={`text-xs font-mono font-bold flex items-center gap-1 ${
                          isCorrect ? 'text-cyan-400' : 'text-pink-400'
                        }`}>
                          {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          <span>{isCorrect ? 'Correct (+1)' : 'Incorrect'}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-slate-100 font-sans">
                      {q.question}
                    </p>

                    {/* Options list */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        const isChosen = studentAns === optIndex;
                        const isTheCorrectOption = q.correctAnswerIndex === optIndex;

                        let optClass = 'bg-[#0a0416] border-purple-500/25 text-slate-300 hover:border-cyan-400/50';

                        if (isQuizSubmitted) {
                          if (isTheCorrectOption) {
                            optClass = 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-bold';
                          } else if (isChosen && !isTheCorrectOption) {
                            optClass = 'bg-pink-950/60 border-pink-500 text-pink-300 line-through';
                          }
                        } else if (isChosen) {
                          optClass = 'bg-purple-900/60 border-cyan-400 text-cyan-300';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={isQuizSubmitted}
                            onClick={() => {
                              setSelectedAnswers(prev => ({ ...prev, [q.id]: optIndex }));
                            }}
                            className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm font-sans flex items-center justify-between transition-all ${optClass}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 rounded flex items-center justify-center font-mono text-[11px] bg-purple-950 border border-purple-500/30 shrink-0">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            {isQuizSubmitted && isTheCorrectOption && (
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submission */}
                    {isQuizSubmitted && (
                      <div className="p-3.5 rounded-lg bg-[#0e0724] border border-cyan-500/25 space-y-2 text-xs font-sans">
                        <div className="text-cyan-300 font-mono font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Detailed Explanation:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {q.explanation}
                        </p>
                        {q.packetTracerTip && (
                          <div className="text-[11px] text-pink-300 font-mono flex items-center gap-1.5 pt-1">
                            <span>Packet Tracer Tip:</span>
                            <span className="text-slate-300">{q.packetTracerTip}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit Quiz Bar */}
              <div className="p-4 rounded-xl cyber-panel border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-purple-300">
                    Answered: {Object.keys(selectedAnswers).length} / {quizQuestions.length}
                  </span>
                </div>

                {!isQuizSubmitted ? (
                  <button
                    onClick={() => setIsQuizSubmitted(true)}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-heading font-semibold text-xs tracking-wider"
                  >
                    Submit Answers & Calculate Score
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    {(() => {
                      const score = quizQuestions.reduce((acc, q) => {
                        return acc + (selectedAnswers[q.id] === q.correctAnswerIndex ? 1 : 0);
                      }, 0);
                      const pct = Math.round((score / quizQuestions.length) * 100);
                      const passed = pct >= 70;
                      return (
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-mono font-bold ${passed ? 'text-cyan-400' : 'text-pink-400'}`}>
                            Score: {score}/{quizQuestions.length} ({pct}%) {passed ? '— PASSED ✓' : '— REVIEW NEEDED'}
                          </span>
                          <button
                            onClick={handleGenerateQuiz}
                            className="px-3 py-1.5 rounded bg-purple-900 text-purple-200 text-xs font-mono"
                          >
                            Retry New Set
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          {quizQuestions.length === 0 && !isQuizLoading && (
            <div className="p-8 text-center rounded-xl cyber-panel border border-purple-500/20 space-y-3">
              <Layers className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="text-sm text-purple-200 font-mono">
                Click "Start Practice Quiz" to generate 5 scenario questions on {notesModuleTitle}.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
