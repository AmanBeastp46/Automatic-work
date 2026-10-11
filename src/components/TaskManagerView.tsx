import React, { useState } from 'react';
import { 
  CourseTask, 
  NetAcadCourse 
} from '../types/netacad';
import { 
  CheckSquare, 
  Calendar, 
  Plus, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Download, 
  Upload, 
  Cpu, 
  Award, 
  Layers, 
  Check,
  CalendarDays
} from 'lucide-react';

interface TaskManagerViewProps {
  tasks: CourseTask[];
  courses: NetAcadCourse[];
  onAddTask: (task: Omit<CourseTask, 'id'>) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onImportTasks: (tasks: CourseTask[]) => void;
}

export const TaskManagerView: React.FC<TaskManagerViewProps> = ({
  tasks,
  courses,
  onAddTask,
  onToggleTaskStatus,
  onDeleteTask,
  onImportTasks
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || 'ccna-itn');
  const [newType, setNewType] = useState<'quiz' | 'packet_tracer' | 'reading' | 'survey' | 'final_exam'>('quiz');
  const [newDueDate, setNewDueDate] = useState('2026-10-18');
  const [newPriority, setNewPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [newMinutes, setNewMinutes] = useState(30);
  const [newNotes, setNewNotes] = useState('');

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.length - completedCount;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedCourse = courses.find(c => c.id === newCourseId);

    onAddTask({
      courseId: newCourseId,
      courseName: selectedCourse ? selectedCourse.code : 'CCNA',
      title: newTitle.trim(),
      type: newType,
      dueDate: newDueDate,
      priority: newPriority,
      status: 'pending',
      estimatedMinutes: Number(newMinutes) || 30,
      directNetAcadUrl: selectedCourse ? selectedCourse.netacadUrl : 'https://www.netacad.com/portal/learning',
      notes: newNotes.trim()
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddingTask(false);
  };

  const exportTasksJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'netacad_tasks_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportTasks(parsed);
        }
      } catch (err) {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-xl cyber-panel border border-purple-500/30 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">
                Cisco NetAcad Assignment & Lab Manager
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/80 font-sans">
              Keep track of required chapter quizzes, Packet Tracer PTSA practical exams, mandatory student feedback, and final certificate assessments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-heading font-semibold text-xs tracking-wider flex items-center gap-1.5 cyber-cut-sm shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingTask ? 'Cancel' : 'Add Course Task'}</span>
            </button>

            <button
              onClick={exportTasksJson}
              className="p-2 rounded-lg bg-[#0e0621] border border-purple-500/30 text-purple-300 hover:text-cyan-300 text-xs font-mono"
              title="Export tasks as JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              className="p-2 rounded-lg bg-[#0e0621] border border-purple-500/30 text-purple-300 hover:text-cyan-300 text-xs font-mono cursor-pointer"
              title="Import tasks JSON"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>

        {/* Progress & Stat summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-purple-500/20 text-xs font-mono">
          <div className="p-2.5 rounded bg-[#090314] border border-purple-500/20">
            <span className="text-purple-300">Total Tasks:</span>
            <div className="text-base font-bold text-slate-100">{tasks.length}</div>
          </div>
          <div className="p-2.5 rounded bg-[#090314] border border-purple-500/20">
            <span className="text-amber-400">Pending:</span>
            <div className="text-base font-bold text-amber-300">{pendingCount}</div>
          </div>
          <div className="p-2.5 rounded bg-[#090314] border border-purple-500/20">
            <span className="text-cyan-400">Completed:</span>
            <div className="text-base font-bold text-cyan-300">{completedCount}</div>
          </div>
          <div className="p-2.5 rounded bg-[#090314] border border-purple-500/20">
            <span className="text-pink-400">Critical Priority:</span>
            <div className="text-base font-bold text-pink-300">
              {tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal / Form Drawer */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="rounded-xl cyber-panel border border-cyan-500/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Create New NetAcad Assignment / Lab</h3>
            <span className="text-xs font-mono text-cyan-400">Custom Directive</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono text-purple-300">Assignment Title:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Packet Tracer 11.5.5: Subnet an IPv4 Network"
                className="w-full bg-[#0d051c] border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-purple-300">Target Course:</label>
              <select
                value={newCourseId}
                onChange={(e) => setNewCourseId(e.target.value)}
                className="w-full bg-[#0d051c] border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-purple-300">Category:</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full bg-[#0d051c] border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="quiz">Chapter Quiz</option>
                <option value="packet_tracer">Packet Tracer Lab (PTSA)</option>
                <option value="reading">Lecture / Reading</option>
                <option value="survey">End-of-Course Survey</option>
                <option value="final_exam">Official Final Exam</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-purple-300">Due Date:</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-[#0d051c] border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-purple-300">Priority Level:</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-[#0d051c] border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="critical">Critical (Certificate Blocker)</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-purple-300">Notes / Command checklist:</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. remember enable secret and IPv6 unicast-routing"
              className="w-full bg-[#0d051c] border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-4 py-2 rounded-lg bg-purple-950 text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-heading font-semibold text-xs tracking-wider"
            >
              Save Directive
            </button>
          </div>
        </form>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0b0416] border border-purple-500/20 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" />
          <span className="font-mono text-purple-300">Filter By:</span>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1 rounded bg-[#130728] border border-purple-500/30 text-slate-200 font-mono text-xs"
          >
            <option value="all">All Types</option>
            <option value="quiz">Quizzes</option>
            <option value="packet_tracer">Packet Tracer Labs</option>
            <option value="survey">Course Survey</option>
            <option value="final_exam">Final Exam</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1 rounded bg-[#130728] border border-purple-500/30 text-slate-200 font-mono text-xs"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {filteredTasks.length} tasks
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center rounded-xl cyber-panel border border-purple-500/20">
            <p className="text-xs font-mono text-purple-300">No tasks match your selected filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl cyber-panel border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-cyan-500/20 bg-[#090314]/80 opacity-75'
                    : 'border-purple-500/30 bg-[#0d051c]'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      isCompleted
                        ? 'bg-cyan-500 border-cyan-400 text-black'
                        : 'border-purple-500/50 hover:border-cyan-400 bg-purple-950/40'
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
                        {task.courseName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        task.priority === 'critical' ? 'bg-pink-950 text-pink-300 border-pink-500/40' :
                        task.priority === 'high' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                        'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        <span>Due {task.dueDate}</span>
                      </span>
                    </div>

                    <h4 className={`text-sm font-medium font-sans ${isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-purple-200/70 font-sans">
                        💡 {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <a
                    href={task.directNetAcadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-purple-900/60 hover:bg-purple-800 text-cyan-300 border border-purple-500/30 text-xs flex items-center gap-1"
                    title="Launch directly in NetAcad"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded bg-pink-950/40 hover:bg-pink-900/60 text-pink-400 border border-pink-500/20 text-xs"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
