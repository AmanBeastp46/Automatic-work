import React, { useState } from 'react';
import { 
  NetAcadCourse, 
  CourseModule 
} from '../types/netacad';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Lock, 
  ExternalLink, 
  Award, 
  BrainCircuit, 
  FileText, 
  CheckSquare, 
  Play, 
  ChevronRight, 
  ChevronDown, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface CourseTrackerViewProps {
  courses: NetAcadCourse[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onToggleModuleQuiz: (courseId: string, moduleId: string) => void;
  onToggleModuleLab: (courseId: string, moduleId: string) => void;
  onToggleFeedback: (courseId: string) => void;
  onToggleFinalExam: (courseId: string) => void;
  onOpenNotesGenerator: (course: NetAcadCourse, module: CourseModule) => void;
  onOpenQuizGenerator: (course: NetAcadCourse, module: CourseModule) => void;
  onOpenCertificateModal: () => void;
  onEnrollCourse: (courseId: string) => void;
}

export const CourseTrackerView: React.FC<CourseTrackerViewProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  onToggleModuleQuiz,
  onToggleModuleLab,
  onToggleFeedback,
  onToggleFinalExam,
  onOpenNotesGenerator,
  onOpenQuizGenerator,
  onOpenCertificateModal,
  onEnrollCourse
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('itn-mod-8');

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const progressPercent = currentCourse && currentCourse.totalModules > 0
    ? Math.round((currentCourse.completedModules / currentCourse.totalModules) * 100)
    : 0;

  // Evaluate Cisco Certificate eligibility checklist
  const allQuizzesPassed = currentCourse.quizzesCompleted >= currentCourse.quizzesTotal;
  const allLabsCompleted = currentCourse.labsCompleted >= currentCourse.labsTotal;
  const surveyDone = currentCourse.courseFeedbackCompleted;
  const finalExamDone = currentCourse.finalExamPassed;

  const isEligibleForCert = allQuizzesPassed && allLabsCompleted && surveyDone && finalExamDone;

  return (
    <div className="space-y-6">
      
      {/* Course Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-purple-500/20">
        {courses.map((course) => {
          const isSelected = course.id === currentCourse.id;
          return (
            <button
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className={`px-3.5 py-2 rounded-lg font-heading font-medium text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-purple-900/90 text-cyan-300 border border-cyan-500/50 cyber-glow-cyan'
                  : 'bg-[#0d051c] text-slate-300 hover:text-white border border-purple-500/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${course.enrolled ? 'bg-cyan-400' : 'bg-slate-500'}`} />
              <span>{course.code}</span>
              {course.enrolled && (
                <span className="text-[10px] font-mono text-cyan-400">
                  {Math.round((course.completedModules / course.totalModules) * 100)}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Course Header Banner */}
      <div className="rounded-xl cyber-panel border border-purple-500/30 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {currentCourse.track} Track
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
                Level: {currentCourse.level}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Target Date: {currentCourse.targetCompletionDate}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              {currentCourse.title}
            </h1>

            <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl font-sans">
              Official Cisco Networking Academy curriculum tracking. Verify progress across all module quizzes, Packet Tracer PTSA practical labs, and final certification requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {!currentCourse.enrolled ? (
              <button
                onClick={() => onEnrollCourse(currentCourse.id)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-heading font-semibold text-xs tracking-wider"
              >
                Mark as Enrolled
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={currentCourse.netacadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-heading font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Open in NetAcad</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={onOpenCertificateModal}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-pink-950/80 hover:bg-pink-900 border border-pink-500/40 text-pink-200 font-heading font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-pink-400" />
                  <span>Cert Check</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Requirements Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-500/20">
          <div className="p-3 rounded-lg bg-[#0c051a] border border-purple-500/20">
            <span className="text-[11px] font-mono text-purple-300">Modules Completed</span>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
              {currentCourse.completedModules} / {currentCourse.totalModules}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{progressPercent}% overall</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0c051a] border border-purple-500/20">
            <span className="text-[11px] font-mono text-purple-300">Module Quizzes (≥70%)</span>
            <div className="text-lg font-bold font-mono text-purple-300 mt-1">
              {currentCourse.quizzesCompleted} / {currentCourse.quizzesTotal}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {currentCourse.quizzesTotal - currentCourse.quizzesCompleted} remaining
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0c051a] border border-purple-500/20">
            <span className="text-[11px] font-mono text-purple-300">Packet Tracer Labs</span>
            <div className="text-lg font-bold font-mono text-pink-400 mt-1">
              {currentCourse.labsCompleted} / {currentCourse.labsTotal}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {currentCourse.labsTotal - currentCourse.labsCompleted} remaining
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0c051a] border border-purple-500/20">
            <span className="text-[11px] font-mono text-purple-300">Official Certificate</span>
            <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
              {isEligibleForCert ? 'QUALIFIED!' : 'In Progress'}
            </div>
            <div className="text-[10px] text-amber-400 mt-0.5">
              {!surveyDone ? 'Survey needed' : !finalExamDone ? 'Final exam needed' : 'All clear'}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Roadmap & Remaining Requirements Blocker */}
      <div className="rounded-xl cyber-panel border border-cyan-500/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-heading font-bold text-white">
              Cisco NetAcad Certificate Qualification Checklist
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-300">
            {isEligibleForCert ? '100% Complete' : 'Verification Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Step 1: Quizzes */}
          <div className={`p-3.5 rounded-lg border transition-all ${
            allQuizzesPassed 
              ? 'bg-cyan-950/40 border-cyan-500/40' 
              : 'bg-[#0e0621] border-purple-500/25'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">1. Module Quizzes</span>
              {allQuizzesPassed ? (
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <span className="text-[10px] font-mono text-amber-400">
                  {currentCourse.quizzesTotal - currentCourse.quizzesCompleted} Left
                </span>
              )}
            </div>
            <p className="text-[11px] text-purple-200/70 mt-1 font-sans">
              Pass every chapter quiz with at least 70% passing threshold.
            </p>
          </div>

          {/* Step 2: Labs */}
          <div className={`p-3.5 rounded-lg border transition-all ${
            allLabsCompleted 
              ? 'bg-cyan-950/40 border-cyan-500/40' 
              : 'bg-[#0e0621] border-purple-500/25'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">2. Packet Tracer PTSA</span>
              {allLabsCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <span className="text-[10px] font-mono text-amber-400">
                  {currentCourse.labsTotal - currentCourse.labsCompleted} Left
                </span>
              )}
            </div>
            <p className="text-[11px] text-purple-200/70 mt-1 font-sans">
              Complete hands-on skills assessment labs in Cisco Packet Tracer.
            </p>
          </div>

          {/* Step 3: End of Course Survey */}
          <div className={`p-3.5 rounded-lg border transition-all ${
            surveyDone 
              ? 'bg-cyan-950/40 border-cyan-500/40' 
              : 'bg-[#0e0621] border-purple-500/25'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">3. Student Feedback</span>
              <button
                onClick={() => onToggleFeedback(currentCourse.id)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  surveyDone 
                    ? 'bg-cyan-900/80 text-cyan-300 border-cyan-500/50' 
                    : 'bg-purple-950 text-purple-300 border-purple-500/30 hover:border-cyan-400'
                }`}
              >
                {surveyDone ? 'Submitted ✓' : 'Mark Done'}
              </button>
            </div>
            <p className="text-[11px] text-purple-200/70 mt-1 font-sans">
              Mandatory NetAcad survey. Unlocks the official Final Exam.
            </p>
          </div>

          {/* Step 4: Final Exam */}
          <div className={`p-3.5 rounded-lg border transition-all ${
            finalExamDone 
              ? 'bg-cyan-950/40 border-cyan-500/40' 
              : 'bg-[#0e0621] border-purple-500/25'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">4. Official Final Exam</span>
              <button
                onClick={() => onToggleFinalExam(currentCourse.id)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  finalExamDone 
                    ? 'bg-cyan-900/80 text-cyan-300 border-cyan-500/50' 
                    : 'bg-purple-950 text-purple-300 border-purple-500/30 hover:border-cyan-400'
                }`}
              >
                {finalExamDone ? 'Passed (≥75%) ✓' : 'Record Score'}
              </button>
            </div>
            <p className="text-[11px] text-purple-200/70 mt-1 font-sans">
              ≥75% earns Certificate of Completion + Cisco Letter of Merit.
            </p>
          </div>

        </div>
      </div>

      {/* Modules List Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-heading font-bold text-white">
              Curriculum Modules & Lesson Navigator
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-300">
            {currentCourse.modules.length} key modules loaded
          </span>
        </div>

        {currentCourse.modules.length === 0 ? (
          <div className="p-8 text-center rounded-xl cyber-panel border border-purple-500/20 space-y-3">
            <HelpCircle className="w-8 h-8 text-purple-400 mx-auto" />
            <p className="text-sm text-purple-200 font-mono">
              Course modules available on Skills for All / NetAcad.
            </p>
            <a
              href={currentCourse.netacadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-heading font-semibold"
            >
              <span>Access on NetAcad Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {currentCourse.modules.map((module) => {
              const isExpanded = expandedModuleId === module.id;
              const isDone = module.status === 'completed';

              return (
                <div
                  key={module.id}
                  className={`rounded-xl cyber-panel border transition-all ${
                    isDone 
                      ? 'border-purple-500/25 bg-[#0e0621]/90' 
                      : 'border-purple-500/40 bg-[#0d051c]'
                  }`}
                >
                  {/* Module Header Bar */}
                  <div
                    onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-purple-950/30 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 flex-1 pr-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isDone 
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' 
                          : 'bg-purple-950 text-purple-300 border border-purple-500/30'
                      }`}>
                        {module.moduleNumber}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                            {module.title}
                          </h3>
                          {module.hasPacketTracerLab && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-pink-950 text-pink-300 border border-pink-500/30">
                              Packet Tracer
                            </span>
                          )}
                          {module.quizPassed && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                              Quiz: {module.quizScore}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-200/70 font-sans line-clamp-1">
                          {module.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline text-xs font-mono text-slate-400">
                        {module.estimatedMinutes} mins
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Module Details */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-purple-500/15 space-y-4">
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        {module.description}
                      </p>

                      {/* Quick AI Assist Bar for this Module */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <button
                          onClick={() => onOpenNotesGenerator(currentCourse, module)}
                          className="px-3 py-1.5 rounded bg-purple-900/70 hover:bg-purple-800 text-purple-200 text-xs font-mono flex items-center gap-1.5 border border-purple-500/30"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Generate Notes & Cheat Sheet</span>
                        </button>

                        <button
                          onClick={() => onOpenQuizGenerator(currentCourse, module)}
                          className="px-3 py-1.5 rounded bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 text-xs font-mono flex items-center gap-1.5 border border-cyan-500/30"
                        >
                          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Practice Module Quiz (Gemini)</span>
                        </button>

                        <a
                          href={module.netacadDirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 text-xs font-mono flex items-center gap-1.5 border border-indigo-500/30"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Direct Launch in NetAcad</span>
                        </a>
                      </div>

                      {/* Module Lessons Table */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-mono font-bold text-purple-300">
                          Lessons & Interactive Activities:
                        </span>
                        <div className="space-y-1.5">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-2.5 rounded bg-[#090314] border border-purple-500/20 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                {lesson.type === 'video' ? (
                                  <Play className="w-4 h-4 text-cyan-400 shrink-0" />
                                ) : lesson.type === 'packet_tracer' ? (
                                  <FileCheck className="w-4 h-4 text-pink-400 shrink-0" />
                                ) : (
                                  <CheckSquare className="w-4 h-4 text-purple-400 shrink-0" />
                                )}
                                <span className="font-medium text-slate-200">
                                  {lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[11px] font-mono text-slate-400">
                                  {lesson.durationMinutes}m
                                </span>
                                <a
                                  href={lesson.directUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-purple-950 hover:bg-purple-900 text-cyan-400 border border-purple-500/30"
                                  title="Open lesson in Cisco NetAcad"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Completion Toggles */}
                      <div className="pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={module.quizPassed}
                              onChange={() => onToggleModuleQuiz(currentCourse.id, module.id)}
                              className="rounded border-purple-500 text-cyan-500 focus:ring-cyan-500 bg-purple-950"
                            />
                            <span className="text-slate-300">Chapter Quiz Passed (≥70%)</span>
                          </label>

                          {module.hasPacketTracerLab && (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={module.packetTracerCompleted}
                                onChange={() => onToggleModuleLab(currentCourse.id, module.id)}
                                className="rounded border-purple-500 text-pink-500 focus:ring-pink-500 bg-purple-950"
                              />
                              <span className="text-slate-300">PTSA Lab Completed</span>
                            </label>
                          )}
                        </div>

                        <span className="text-[11px] text-purple-300/70">
                          Status: {module.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
