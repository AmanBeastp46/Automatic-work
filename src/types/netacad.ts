export interface NetAcadCourse {
  id: string;
  code: string;
  title: string;
  track: 'Networking' | 'Cybersecurity' | 'Programming' | 'Infrastructure';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  netacadUrl: string;
  enrolled: boolean;
  totalModules: number;
  completedModules: number;
  quizzesCompleted: number;
  quizzesTotal: number;
  labsCompleted: number;
  labsTotal: number;
  courseFeedbackCompleted: boolean;
  finalExamPassed: boolean;
  finalExamScore?: number;
  letterOfMeritQualified: boolean;
  digitalBadgeEarned: boolean;
  targetCompletionDate: string;
  bannerImage: string;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  moduleNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  quizPassed: boolean;
  quizScore?: number;
  hasPacketTracerLab: boolean;
  packetTracerCompleted: boolean;
  netacadDirectUrl: string;
  lessons: ModuleLesson[];
}

export interface ModuleLesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'packet_tracer' | 'interactive_lab' | 'quiz';
  durationMinutes: number;
  completed: boolean;
  directUrl: string;
  hasTranscript: boolean;
  transcriptSample?: string;
}

export interface CourseTask {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: 'quiz' | 'packet_tracer' | 'reading' | 'survey' | 'final_exam' | 'practice_exam';
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  estimatedMinutes: number;
  directNetAcadUrl: string;
  notes?: string;
  verificationSource?: 'manual' | 'runner_verified' | 'bookmarklet_sync';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  packetTracerTip?: string;
  topicTag: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  feedback: string;
  recommendations: string[];
}

export interface TranscriptSummary {
  title: string;
  keyConcepts: string[];
  packetTracerCommands: { command: string; description: string; mode?: string }[];
  examHighYieldNotes: string[];
  practiceScenarios: string[];
}

export interface AutomationStep {
  id: string;
  stepNumber: number;
  action: 'LAUNCH_NETACAD_HUB' | 'OPEN_LESSON' | 'VERIFY_MODULE_PAGE' | 'SYNC_COMPLETION' | 'FALLBACK_MANUAL';
  targetUrl: string;
  label: string;
  status: 'idle' | 'running' | 'success' | 'warn' | 'error';
  log: string;
  timestamp?: string;
}

export interface StudyPlanDay {
  date: string;
  dayLabel: string;
  focusCourse: string;
  tasks: string[];
  targetHours: number;
  completed: boolean;
}
