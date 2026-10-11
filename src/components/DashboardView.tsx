import React from 'react';
import { 
  NetAcadCourse, 
  CourseTask, 
  StudyPlanDay 
} from '../types/netacad';
import { 
  Zap, 
  Target, 
  Award, 
  BookOpen, 
  Play, 
  BrainCircuit, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ExternalLink, 
  Bot, 
  Cpu, 
  Terminal,
  ShieldAlert,
  Flame,
  CalendarCheck
} from 'lucide-react';

interface DashboardViewProps {
  courses: NetAcadCourse[];
  tasks: CourseTask[];
  onSelectCourse: (courseId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'courses' | 'ai_tutor' | 'lessons' | 'tasks' | 'automation') => void;
  onOpenCertificateModal: () => void;
  onOpenDiagnosticModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  courses,
  tasks,
  onSelectCourse,
  onNavigateTab,
  onOpenCertificateModal,
  onOpenDiagnosticModal
}) => {
  const enrolledCourses = courses.filter(c => c.enrolled);
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const criticalTasks = pendingTasks.filter(t => t.priority === 'critical');

  // Compute aggregate NetAcad completion statistics
  const totalModules = enrolledCourses.reduce((acc, c) => acc + c.totalModules, 0);
  const completedModules = enrolledCourses.reduce((acc, c) => acc + c.completedModules, 0);
  const overallPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const totalQuizzes = enrolledCourses.reduce((acc, c) => acc + c.quizzesTotal, 0);
  const completedQuizzes = enrolledCourses.reduce((acc, c) => acc + c.quizzesCompleted, 0);

  const totalLabs = enrolledCourses.reduce((acc, c) => acc + c.labsTotal, 0);
  const completedLabs = enrolledCourses.reduce((acc, c) => acc + c.labsCompleted, 0);

  // Daily study plan sample
  const dailyMission: StudyPlanDay = {
    date: '2026-10-12',
    dayLabel: "Today's NetAcad Directive",
    focusCourse: 'CCNA 1 (ITN)',
    tasks: [
      'Complete Module 14 Quiz (Transport Layer & TCP Handshake)',
      'Review Subnetting Magic Number video transcript & CLI notes',
      'Run verification on Packet Tracer Router-on-a-Stick lab'
    ],
    targetHours: 1.5,
    completed: false
  };

  return (
    <div className="space-y-6">
      
      {/* Top Cyberpunk Banner / Telemetry HUD */}
      <div className="relative overflow-hidden rounded-xl cyber-panel border border-purple-500/30 p-5 sm:p-7 cyber-cut">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>ACTIVE SYSTEM NODE: CISCO NETACAD ACADEMY AGENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide">
              Welcome back, Agent. Your CCNA Mastery HUD is live.
            </h1>
            <p className="text-sm text-purple-200/80 leading-relaxed font-sans">
              Managing coursework on <a href="https://www.netacad.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">netacad.com</a>. Real-time quiz tracking, verified Packet Tracer lab solver, transcript summarizer, and certificate eligibility monitoring.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onNavigateTab('automation')}
              className="flex-1 sm:flex-none px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-heading font-semibold text-sm flex items-center justify-center gap-2 cyber-cut-sm shadow-lg shadow-cyan-950/40 transition-all active:scale-95"
            >
              <Bot className="w-4 h-4 text-cyan-200" />
              <span>Launch Browser Runner</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai_tutor')}
              className="flex-1 sm:flex-none px-4 py-3 rounded-lg bg-purple-950/80 hover:bg-purple-900/90 border border-purple-500/40 text-purple-200 hover:text-white font-heading font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>Gemini AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Telemetry Stat Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-purple-500/20">
          <div className="p-3.5 rounded-lg bg-[#0e0621]/90 border border-purple-500/20">
            <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
              <span>Overall Progress</span>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-400">{overallPercentage}%</span>
              <span className="text-xs text-purple-300/70">{completedModules}/{totalModules} mods</span>
            </div>
            <div className="w-full bg-purple-950/80 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0e0621]/90 border border-purple-500/20">
            <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
              <span>Module Quizzes</span>
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-purple-300">{completedQuizzes}</span>
              <span className="text-xs text-purple-300/70">/ {totalQuizzes} passed</span>
            </div>
            <div className="w-full bg-purple-950/80 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0e0621]/90 border border-purple-500/20">
            <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
              <span>Packet Tracer Labs</span>
              <Cpu className="w-4 h-4 text-pink-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-pink-400">{completedLabs}</span>
              <span className="text-xs text-purple-300/70">/ {totalLabs} labs</span>
            </div>
            <div className="w-full bg-purple-950/80 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalLabs > 0 ? (completedLabs / totalLabs) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0e0621]/90 border border-purple-500/20">
            <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
              <span>Cert Readiness</span>
              <Award className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-300">Stage 3</span>
              <span className="text-[11px] text-amber-400">Feedback Pending</span>
            </div>
            <button
              onClick={onOpenCertificateModal}
              className="mt-2 text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono flex items-center gap-1"
            >
              <span>Verify requirements</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Courses + Study Plan & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Enrolled Cisco Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                Enrolled Cisco Academy Courses
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('courses')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All Modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {enrolledCourses.map((course) => {
              const courseProgress = Math.round((course.completedModules / course.totalModules) * 100);
              return (
                <div
                  key={course.id}
                  className="rounded-xl cyber-panel border border-purple-500/30 p-5 hover:border-cyan-500/40 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-900/60 text-purple-200 border border-purple-500/30">
                          {course.code}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                          {course.track}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Target: {course.targetCompletionDate}
                        </span>
                      </div>
                      <h3 className="text-lg font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-purple-200/70 font-sans">
                        {course.completedModules} of {course.totalModules} modules finished • {course.quizzesCompleted}/{course.quizzesTotal} quizzes passed • {course.labsCompleted}/{course.labsTotal} PTSA labs
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right font-mono">
                        <div className="text-xl font-bold text-cyan-400">{courseProgress}%</div>
                        <div className="text-[10px] text-slate-400">Progress</div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onSelectCourse(course.id);
                            onNavigateTab('courses');
                          }}
                          className="px-3 py-2 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-heading font-semibold"
                        >
                          Curriculum
                        </button>
                        <a
                          href={course.netacadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open official course in NetAcad"
                          className="p-2 rounded bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-400 border border-cyan-500/30"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 w-full bg-purple-950/90 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${courseProgress}%` }}
                    />
                  </div>

                  {/* Status badges */}
                  <div className="mt-3 pt-3 border-t border-purple-500/15 flex flex-wrap items-center justify-between text-xs font-mono text-purple-300/80 gap-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Survey: {course.courseFeedbackCompleted ? 'Completed' : 'Pending'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                        <span>Final Exam: {course.finalExamPassed ? 'Passed' : 'Pending'}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectCourse(course.id);
                        onNavigateTab('lessons');
                      }}
                      className="text-cyan-400 hover:text-cyan-200 flex items-center gap-1 text-[11px]"
                    >
                      <Play className="w-3 h-3 fill-cyan-400" />
                      <span>Resume Lesson 14.1</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Permitted Safe Integration Note */}
          <div className="p-4 rounded-lg bg-[#0e0724] border border-cyan-500/25 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-heading font-bold text-cyan-300 tracking-wider">
                ETHICAL NETACAD INTEGRATION PROTOCOL
              </span>
              <p className="text-purple-200/80 leading-relaxed font-sans">
                MEI Agent uses direct lesson deep-links, syllabus parsing, and browser companion scripts. We never store student credentials or bypass assessments. All completion metrics are logged toward authentic Cisco certificates and Credly badges.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Study Plan & Pending Tasks */}
        <div className="space-y-6">
          
          {/* Daily Study Directive */}
          <div className="rounded-xl cyber-panel border border-cyan-500/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-bold text-white text-base">
                  Daily Study Directive
                </h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                1.5 hrs target
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0d051e] border border-purple-500/20 space-y-2">
              <div className="text-xs font-mono text-purple-300 flex items-center justify-between">
                <span>Focus Track:</span>
                <span className="text-cyan-300 font-bold">{dailyMission.focusCourse}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200 font-sans">
                {dailyMission.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-mono mt-0.5">›</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onNavigateTab('tasks')}
              className="w-full py-2.5 rounded bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-heading font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <CalendarCheck className="w-4 h-4 text-cyan-400" />
              <span>Open Study Scheduler</span>
            </button>
          </div>

          {/* Pending Critical Deadlines */}
          <div className="rounded-xl cyber-panel border border-purple-500/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <h3 className="font-heading font-bold text-white text-base">
                  Pending Coursework
                </h3>
              </div>
              <span className="text-xs font-mono text-pink-400">
                {criticalTasks.length} critical
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg bg-[#0e0621] border border-purple-500/20 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        task.priority === 'critical' ? 'bg-pink-500 animate-pulse' :
                        task.priority === 'high' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`} />
                      <span className="text-[10px] font-mono text-purple-300">
                        {task.courseName} • Due {task.dueDate}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 line-clamp-1">
                      {task.title}
                    </p>
                  </div>

                  <a
                    href={task.directNetAcadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded bg-purple-900/60 hover:bg-purple-800 text-cyan-300 shrink-0"
                    title="Open in NetAcad"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('tasks')}
              className="w-full text-center text-xs font-mono text-purple-300 hover:text-cyan-300 transition-colors"
            >
              Manage all {tasks.length} assignments →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
