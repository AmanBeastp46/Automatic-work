import React from 'react';
import { NetAcadCourse } from '../types/netacad';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: NetAcadCourse[];
  selectedCourseId: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  courses,
  selectedCourseId
}) => {
  if (!isOpen) return null;

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const allQuizzesPassed = currentCourse.quizzesCompleted >= currentCourse.quizzesTotal;
  const allLabsCompleted = currentCourse.labsCompleted >= currentCourse.labsTotal;
  const surveyCompleted = currentCourse.courseFeedbackCompleted;
  const finalExamPassed = currentCourse.finalExamPassed;

  const isFullyQualified = allQuizzesPassed && allLabsCompleted && surveyCompleted && finalExamPassed;

  // Letter of Merit condition: final exam >= 75%
  const isLetterOfMeritQualified = isFullyQualified || (currentCourse.finalExamScore && currentCourse.finalExamScore >= 75);

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
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-600 via-purple-600 to-cyan-500 cyber-cut-sm">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-white tracking-wide">
              Cisco NetAcad Certificate Qualification Evaluator
            </h2>
            <p className="text-xs text-purple-200/80 font-mono">
              Auditing: <span className="text-cyan-400 font-bold">{currentCourse.title}</span>
            </p>
          </div>
        </div>

        {/* Qualification Status Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          isFullyQualified 
            ? 'bg-gradient-to-r from-cyan-950/80 to-purple-950/80 border-cyan-400 cyber-glow-cyan' 
            : 'bg-[#0f0724] border-purple-500/30'
        }`}>
          {isFullyQualified ? (
            <Sparkles className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <h3 className={`text-base font-heading font-bold tracking-wide ${
              isFullyQualified ? 'text-cyan-300' : 'text-amber-300'
            }`}>
              {isFullyQualified 
                ? 'CONGRATULATIONS: CERTIFICATE REQUIREMENTS UNLOCKED!' 
                : 'CERTIFICATE IN PROGRESS — REMAINING REQUIREMENTS IDENTIFIED'}
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {isFullyQualified 
                ? 'You have satisfied all Cisco Networking Academy criteria. You are qualified to claim your official Certificate of Course Completion and digital badge on Credly.' 
                : 'Review the verified checklist below to identify exactly what is remaining to earn your official Cisco credentials.'}
            </p>
          </div>
        </div>

        {/* Verified Criteria Breakdown */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-purple-300">
            Cisco Networking Academy Official Requirements Checklist:
          </span>

          <div className="space-y-2">
            {/* Criteria 1 */}
            <div className="p-3 rounded-lg bg-[#0a0316] border border-purple-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {allQuizzesPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-slate-200">1. Module Chapter Quizzes (≥70%)</span>
                  <p className="text-[11px] text-purple-300/70 font-mono">
                    Completed: {currentCourse.quizzesCompleted} / {currentCourse.quizzesTotal} quizzes
                  </p>
                </div>
              </div>

              <span className={`font-mono text-[11px] ${allQuizzesPassed ? 'text-cyan-400' : 'text-amber-400'}`}>
                {allQuizzesPassed ? 'CLEARED ✓' : `${currentCourse.quizzesTotal - currentCourse.quizzesCompleted} LEFT`}
              </span>
            </div>

            {/* Criteria 2 */}
            <div className="p-3 rounded-lg bg-[#0a0316] border border-purple-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {allLabsCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-slate-200">2. Packet Tracer Skills Assessments (PTSA)</span>
                  <p className="text-[11px] text-purple-300/70 font-mono">
                    Completed: {currentCourse.labsCompleted} / {currentCourse.labsTotal} practical labs
                  </p>
                </div>
              </div>

              <span className={`font-mono text-[11px] ${allLabsCompleted ? 'text-cyan-400' : 'text-amber-400'}`}>
                {allLabsCompleted ? 'CLEARED ✓' : `${currentCourse.labsTotal - currentCourse.labsCompleted} LEFT`}
              </span>
            </div>

            {/* Criteria 3 */}
            <div className="p-3 rounded-lg bg-[#0a0316] border border-purple-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {surveyCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-pink-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-slate-200">3. End-of-Course Student Feedback Survey</span>
                  <p className="text-[11px] text-purple-300/70 font-mono">
                    Mandatory step: NetAcad locks the Final Exam until this survey is submitted.
                  </p>
                </div>
              </div>

              <span className={`font-mono text-[11px] ${surveyCompleted ? 'text-cyan-400' : 'text-pink-400'}`}>
                {surveyCompleted ? 'SUBMITTED ✓' : 'MANDATORY ACTION'}
              </span>
            </div>

            {/* Criteria 4 */}
            <div className="p-3 rounded-lg bg-[#0a0316] border border-purple-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {finalExamPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-slate-200">4. Official Final Course Exam</span>
                  <p className="text-[11px] text-purple-300/70 font-mono">
                    Score ≥75% unlocks Cisco Letter of Merit & digital badge.
                  </p>
                </div>
              </div>

              <span className={`font-mono text-[11px] ${finalExamPassed ? 'text-cyan-400' : 'text-amber-400'}`}>
                {finalExamPassed ? 'PASSED ✓' : 'PENDING EXAM'}
              </span>
            </div>
          </div>
        </div>

        {/* Official Portal Launch Links */}
        <div className="p-4 rounded-xl bg-[#090314] border border-cyan-500/30 space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-300">
            Official Cisco Credential & Badge Destinations:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://www.netacad.com/portal/learning"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center justify-between text-xs font-heading font-semibold shadow-md transition-transform active:scale-95"
            >
              <div className="space-y-0.5">
                <span>Download NetAcad Certificate</span>
                <p className="text-[10px] text-cyan-100 font-sans font-normal">Official PDF via netacad.com</p>
              </div>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>

            <a
              href="https://www.credly.com/organizations/cisco/badges"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-white flex items-center justify-between text-xs font-heading font-semibold shadow-md transition-transform active:scale-95"
            >
              <div className="space-y-0.5">
                <span>Claim Credly Digital Badge</span>
                <p className="text-[10px] text-pink-100 font-sans font-normal">Verifiable LinkedIn badge</p>
              </div>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* Anti-Faking Integrity Guarantee */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-purple-300/70 border-t border-purple-500/20 pt-3">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>MEI NetAcad Agent Academic Integrity: Real criteria verified. No fake certificates generated.</span>
        </div>

      </div>
    </div>
  );
};
