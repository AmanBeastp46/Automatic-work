import React from 'react';
import { 
  Terminal, 
  BookOpen, 
  BrainCircuit, 
  CheckSquare, 
  PlayCircle, 
  Bot, 
  Award, 
  Activity, 
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Calculator
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'courses' | 'ai_tutor' | 'lessons' | 'tasks' | 'automation';
  setActiveTab: (tab: 'dashboard' | 'courses' | 'ai_tutor' | 'lessons' | 'tasks' | 'automation') => void;
  openCertificateModal: () => void;
  openDiagnosticModal: () => void;
  openSubnetModal: () => void;
  isAiOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openCertificateModal,
  openDiagnosticModal,
  openSubnetModal,
  isAiOnline
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Command HUD', icon: Activity },
    { id: 'courses', label: 'Course Progress', icon: BookOpen },
    { id: 'ai_tutor', label: 'MEI AI Tutor', icon: BrainCircuit, badge: 'Gemini' },
    { id: 'lessons', label: 'Lessons & Media', icon: PlayCircle },
    { id: 'tasks', label: 'Assignments & Labs', icon: CheckSquare },
    { id: 'automation', label: 'Browser Runner', icon: Bot, badge: 'Permitted' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c051a]/90 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Agent Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-indigo-700 to-cyan-500 p-0.5 cyber-cut-sm">
              <div className="w-full h-full bg-[#0d061f] rounded-[6px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500">
                  MEI NETACAD
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded">
                  AGENT v2.5
                </span>
              </div>
              <p className="text-[11px] text-purple-300/70 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>Zero-Credential Safe • netacad.com</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative px-3.5 py-2 rounded-md font-medium text-xs tracking-wider transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-purple-950/80 text-cyan-300 border border-cyan-500/40 cyber-glow-cyan shadow-sm'
                      : 'text-slate-300 hover:text-cyan-200 hover:bg-purple-950/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-purple-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] uppercase px-1 py-0.2 bg-purple-900/80 text-purple-300 rounded border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools & Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Quick Subnet Calculator Trigger */}
            <button
              onClick={openSubnetModal}
              title="Quick CIDR Subnet Calculator"
              className="p-2 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
            >
              <Calculator className="w-4 h-4" />
            </button>

            {/* Official Certificate Readiness Trigger */}
            <button
              onClick={openCertificateModal}
              className="px-2.5 py-1.5 rounded bg-gradient-to-r from-purple-900/60 to-pink-950/60 border border-pink-500/30 text-pink-300 hover:text-pink-100 hover:border-pink-500 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Award className="w-4 h-4 text-pink-400" />
              <span>Certificates</span>
            </button>

            {/* System Status / Diagnostic Modal Trigger */}
            <button
              onClick={openDiagnosticModal}
              className="px-2.5 py-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <span className={`w-2 h-2 rounded-full ${isAiOnline ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>Status HUD</span>
            </button>

            {/* Official NetAcad Direct Launcher Link */}
            <a
              href="https://www.netacad.com/portal/learning"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-heading font-semibold text-xs tracking-wider flex items-center gap-1 shadow-md cyber-cut-sm transition-transform active:scale-95"
            >
              <span>NetAcad LMS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={openCertificateModal}
              className="p-2 rounded bg-pink-950/50 border border-pink-500/30 text-pink-400"
            >
              <Award className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-purple-950/80 border border-purple-500/40 text-cyan-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0621] border-b border-purple-500/30 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium ${
                  isActive
                    ? 'bg-purple-900/60 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-purple-950/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-purple-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase px-1.5 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-purple-500/20 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                openSubnetModal();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs rounded flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Subnet Tool</span>
            </button>
            <button
              onClick={() => {
                openDiagnosticModal();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs rounded flex items-center justify-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Diagnostics</span>
            </button>
          </div>

          <a
            href="https://www.netacad.com/portal/learning"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded text-center text-xs font-bold tracking-wider flex items-center justify-center gap-1.5"
          >
            <span>Open Cisco NetAcad Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
};
