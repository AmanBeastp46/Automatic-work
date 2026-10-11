import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CourseTrackerView } from './components/CourseTrackerView';
import { AITutorView } from './components/AITutorView';
import { LessonAssistantView } from './components/LessonAssistantView';
import { TaskManagerView } from './components/TaskManagerView';
import { BrowserAutomationHub } from './components/BrowserAutomationHub';
import { CertificateModal } from './components/CertificateModal';
import { DiagnosticModal } from './components/DiagnosticModal';
import { SubnetCalculatorModal } from './components/SubnetCalculatorModal';

import { 
  NetAcadCourse, 
  CourseModule, 
  CourseTask 
} from './types/netacad';
import { 
  INITIAL_NETACAD_COURSES, 
  INITIAL_TASKS 
} from './data/netacadCourses';

import { 
  Activity, 
  BookOpen, 
  BrainCircuit, 
  PlayCircle, 
  CheckSquare, 
  Bot, 
  Award, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'ai_tutor' | 'lessons' | 'tasks' | 'automation'>('dashboard');

  // Persistence for Courses
  const [courses, setCourses] = useState<NetAcadCourse[]>(() => {
    try {
      const saved = localStorage.getItem('mei_netacad_courses');
      return saved ? JSON.parse(saved) : INITIAL_NETACAD_COURSES;
    } catch {
      return INITIAL_NETACAD_COURSES;
    }
  });

  // Persistence for Tasks
  const [tasks, setTasks] = useState<CourseTask[]>(() => {
    try {
      const saved = localStorage.getItem('mei_netacad_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>('ccna-itn');
  const [preloadedTopic, setPreloadedTopic] = useState<string>('');
  const [preloadedModule, setPreloadedModule] = useState<CourseModule | undefined>();

  // Modals state
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isDiagModalOpen, setIsDiagModalOpen] = useState(false);
  const [isSubnetModalOpen, setIsSubnetModalOpen] = useState(false);
  const [isAiOnline, setIsAiOnline] = useState(true);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('mei_netacad_courses', JSON.stringify(courses));
    } catch (e) {
      console.error(e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem('mei_netacad_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  // Initial health check
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setIsAiOnline(Boolean(data.geminiConfigured));
      })
      .catch(() => {
        setIsAiOnline(false);
      });
  }, []);

  // Course handlers
  const handleToggleModuleQuiz = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id !== courseId) return course;

      let quizzesPassedCount = 0;
      let completedModsCount = 0;

      const updatedModules = course.modules.map(mod => {
        if (mod.id === moduleId) {
          const newQuizPassed = !mod.quizPassed;
          const newStatus = newQuizPassed ? 'completed' as const : 'in_progress' as const;
          return {
            ...mod,
            quizPassed: newQuizPassed,
            quizScore: newQuizPassed ? 90 : undefined,
            status: newStatus
          };
        }
        return mod;
      });

      updatedModules.forEach(m => {
        if (m.quizPassed) quizzesPassedCount++;
        if (m.status === 'completed') completedModsCount++;
      });

      return {
        ...course,
        modules: updatedModules,
        quizzesCompleted: quizzesPassedCount,
        completedModules: Math.max(course.completedModules, completedModsCount)
      };
    }));
  };

  const handleToggleModuleLab = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id !== courseId) return course;

      let labsDoneCount = 0;
      const updatedModules = course.modules.map(mod => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            packetTracerCompleted: !mod.packetTracerCompleted
          };
        }
        return mod;
      });

      updatedModules.forEach(m => {
        if (m.packetTracerCompleted) labsDoneCount++;
      });

      return {
        ...course,
        modules: updatedModules,
        labsCompleted: Math.max(course.labsCompleted, labsDoneCount)
      };
    }));
  };

  const handleToggleFeedback = (courseId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, courseFeedbackCompleted: !c.courseFeedbackCompleted } : c));
  };

  const handleToggleFinalExam = (courseId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? {
      ...c,
      finalExamPassed: !c.finalExamPassed,
      finalExamScore: !c.finalExamPassed ? 88 : undefined,
      letterOfMeritQualified: !c.finalExamPassed,
      digitalBadgeEarned: !c.finalExamPassed
    } : c));
  };

  const handleEnrollCourse = (courseId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolled: true } : c));
  };

  // Jump to AI Tutor with preloaded module
  const handleOpenNotesGenerator = (course: NetAcadCourse, module: CourseModule) => {
    setSelectedCourseId(course.id);
    setPreloadedTopic(module.title);
    setPreloadedModule(module);
    setActiveTab('ai_tutor');
  };

  const handleOpenQuizGenerator = (course: NetAcadCourse, module: CourseModule) => {
    setSelectedCourseId(course.id);
    setPreloadedTopic(module.title);
    setPreloadedModule(module);
    setActiveTab('ai_tutor');
  };

  // Task handlers
  const handleAddTask = (newTask: Omit<CourseTask, 'id'>) => {
    const task: CourseTask = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [task, ...prev]);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: t.status === 'completed' ? 'pending' : 'completed'
        };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleImportTasks = (importedTasks: CourseTask[]) => {
    setTasks(importedTasks);
  };

  const handleVerificationSuccess = (courseId: string, moduleId: string) => {
    handleToggleModuleQuiz(courseId, moduleId);
  };

  return (
    <div className="min-h-screen bg-[#080312] text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-black">
      
      {/* Subtle Scanlines and Grid */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 scanlines pointer-events-none" />

      {/* Top Cyber HUD Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCertificateModal={() => setIsCertModalOpen(true)}
        openDiagnosticModal={() => setIsDiagModalOpen(true)}
        openSubnetModal={() => setIsSubnetModalOpen(true)}
        isAiOnline={isAiOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 relative z-10">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            courses={courses}
            tasks={tasks}
            onSelectCourse={setSelectedCourseId}
            onNavigateTab={setActiveTab}
            onOpenCertificateModal={() => setIsCertModalOpen(true)}
            onOpenDiagnosticModal={() => setIsDiagModalOpen(true)}
          />
        )}

        {activeTab === 'courses' && (
          <CourseTrackerView
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            onToggleModuleQuiz={handleToggleModuleQuiz}
            onToggleModuleLab={handleToggleModuleLab}
            onToggleFeedback={handleToggleFeedback}
            onToggleFinalExam={handleToggleFinalExam}
            onOpenNotesGenerator={handleOpenNotesGenerator}
            onOpenQuizGenerator={handleOpenQuizGenerator}
            onOpenCertificateModal={() => setIsCertModalOpen(true)}
            onEnrollCourse={handleEnrollCourse}
          />
        )}

        {activeTab === 'ai_tutor' && (
          <AITutorView
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            preloadedTopic={preloadedTopic}
            preloadedModule={preloadedModule}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonAssistantView
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManagerView
            tasks={tasks}
            courses={courses}
            onAddTask={handleAddTask}
            onToggleTaskStatus={handleToggleTaskStatus}
            onDeleteTask={handleDeleteTask}
            onImportTasks={handleImportTasks}
          />
        )}

        {activeTab === 'automation' && (
          <BrowserAutomationHub
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}

      </main>

      {/* Mobile Bottom Thumb Navigation Bar (Optimized for Android / Mobile screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0316]/95 backdrop-blur-lg border-t border-purple-500/30 px-2 py-1.5 flex items-center justify-around">
        {[
          { id: 'dashboard', label: 'HUD', icon: Activity },
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'ai_tutor', label: 'AI Tutor', icon: BrainCircuit },
          { id: 'lessons', label: 'Media', icon: PlayCircle },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare },
          { id: 'automation', label: 'Runner', icon: Bot },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center p-1 rounded-lg transition-all min-w-[50px] ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-purple-400'}`} />
              <span className="text-[10px] font-mono mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Cyber Footer */}
      <footer className="border-t border-purple-500/20 bg-[#06020e] py-6 px-4 text-xs font-mono text-purple-300/70">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>MEI NetAcad AI Agent • Cisco Networking Academy Academic Assistant</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a 
              href="https://www.netacad.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>netacad.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://skillsforall.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>skillsforall.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setIsDiagModalOpen(true)}
              className="text-purple-300 hover:text-cyan-300 underline"
            >
              System Health Report
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        courses={courses}
        selectedCourseId={selectedCourseId}
      />

      <DiagnosticModal
        isOpen={isDiagModalOpen}
        onClose={() => setIsDiagModalOpen(false)}
      />

      <SubnetCalculatorModal
        isOpen={isSubnetModalOpen}
        onClose={() => setIsSubnetModalOpen(false)}
      />

    </div>
  );
}
