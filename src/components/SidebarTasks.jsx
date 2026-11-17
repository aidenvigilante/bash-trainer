import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Terminal, 
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function SidebarTasks({ 
  stages, 
  currentStageId, 
  completedStages, 
  onSelectStage,
  onApplyHint
}) {
  const [showHint, setShowHint] = useState(false);
  const currentStage = stages.find(s => s.id === currentStageId) || stages[0];
  const isCompleted = completedStages.includes(currentStage.id);
  const progressPercent = Math.round((completedStages.length / stages.length) * 100);

  return (
    <div className="flex flex-col h-full bg-[#0d1217] border-r border-[#1f2b34] overflow-hidden">
      {/* Progress & Header */}
      <div className="p-4 border-b border-[#1f2b34] bg-[#0a0e12]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-hacker-dim flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-hacker-accent" />
            Vazifalar kursi
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-[#141d24] text-hacker-accent border border-[#1f2b34]">
            {completedStages.length} / {stages.length} ({progressPercent}%)
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#141b21] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-hacker-accent transition-all duration-500 ease-out shadow-[0_0_10px_#00ff66]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Stage Details */}
      <div className="p-5 overflow-y-auto flex-1 border-b border-[#1f2b34] bg-[#0f151b]/70">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Bosqich {currentStage.id}
          </span>
          {isCompleted && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-hacker-accent/10 text-hacker-accent border border-hacker-accent/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Bajarildi
            </span>
          )}
        </div>

        <h2 className="text-lg font-bold text-white mb-2 leading-tight">
          {currentStage.title}
        </h2>

        <p className="text-xs text-gray-300 mb-4 leading-relaxed bg-[#141c23] p-3 rounded-lg border border-[#1e2a35]">
          {currentStage.description}
        </p>

        {/* Action Goal */}
        <div className="mb-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3.5">
          <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Sizning vazifangiz:
          </div>
          <div className="text-sm text-gray-100 font-mono">
            {currentStage.task}
          </div>
        </div>

        {/* Hint Section */}
        <div className="mt-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold rounded-lg bg-[#161f28] hover:bg-[#1c2733] border border-[#23323f] text-hacker-warning transition-colors"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              {showHint ? "Maslahatni yashirish" : "Maslahat (Hint) kerakmi?"}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {showHint ? "▲" : "▼"}
            </span>
          </button>

          {showHint && (
            <div className="mt-2 p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs text-amber-200">
              <div className="mb-2">{currentStage.hint}</div>
              <button
                onClick={() => onApplyHint(currentStage.command)}
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-colors"
              >
                <Terminal className="w-3 h-3" />
                Terminalga nusxalash: <code>{currentStage.command}</code>
              </button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-2 mt-5">
          <button
            disabled={currentStageId <= 1}
            onClick={() => {
              setShowHint(false);
              onSelectStage(currentStageId - 1);
            }}
            className="flex-1 py-1.5 px-3 flex items-center justify-center gap-1 text-xs rounded bg-[#162029] hover:bg-[#1e2b37] disabled:opacity-40 disabled:cursor-not-allowed border border-[#21303e] text-gray-300 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Oldingi
          </button>
          <button
            disabled={currentStageId >= stages.length}
            onClick={() => {
              setShowHint(false);
              onSelectStage(currentStageId + 1);
            }}
            className="flex-1 py-1.5 px-3 flex items-center justify-center gap-1 text-xs rounded bg-[#162029] hover:bg-[#1e2b37] disabled:opacity-40 disabled:cursor-not-allowed border border-[#21303e] text-gray-300 transition-all"
          >
            Keyingi <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stage list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="text-[10px] uppercase font-bold tracking-wider text-hacker-dim px-2 py-1">
          Barcha bosqichlar (1-15)
        </div>
        {stages.map((stage) => {
          const isDone = completedStages.includes(stage.id);
          const isCurrent = stage.id === currentStageId;

          return (
            <button
              key={stage.id}
              onClick={() => {
                setShowHint(false);
                onSelectStage(stage.id);
              }}
              className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-all text-xs font-mono border ${
                isCurrent
                  ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  : isDone
                  ? "bg-[#10171d]/60 border-[#1a252f] text-gray-400 hover:bg-[#141d24]"
                  : "bg-transparent border-transparent text-gray-500 hover:bg-[#121921] hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-400 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                ) : (
                  <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                )}
                <span className={`truncate ${isCurrent ? "font-bold text-emerald-300" : ""}`}>
                  {stage.title}
                </span>
              </div>
              <code className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded bg-[#0a0d10] border border-[#1a232b]">
                {stage.command.split(" ")[0]}
              </code>
            </button>
          );
        })}
      </div>
    </div>
  );
}
