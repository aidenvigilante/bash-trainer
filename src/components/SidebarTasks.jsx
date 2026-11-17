import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Terminal, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function SidebarTasks({ 
  stages, 
  currentStageId, 
  completedStages, 
  onSelectStage,
  onApplyHint,
  theme
}) {
  const [showHint, setShowHint] = useState(false);
  const currentStage = stages.find(s => s.id === currentStageId) || stages[0];
  const isCompleted = completedStages.includes(currentStage.id);
  const progressPercent = Math.round((completedStages.length / stages.length) * 100);

  const isLight = theme.type === "light";

  return (
    <div className={`flex flex-col h-full ${theme.bgSidebar} border-r ${theme.border} overflow-hidden select-none`}>
      {/* Progress & Header */}
      <div className={`p-4 border-b ${theme.border} ${isLight ? 'bg-slate-50' : 'bg-black/20'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold uppercase tracking-wider ${theme.textDim} flex items-center gap-1.5`}>
            <BookOpen className={`w-3.5 h-3.5 ${theme.accent}`} />
            Vazifalar kursi
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isLight ? 'bg-slate-200' : 'bg-white/10'} ${theme.accent} border ${theme.border}`}>
            {completedStages.length} / {stages.length} ({progressPercent}%)
          </span>
        </div>
        
        {/* Progress bar */}
        <div className={`w-full h-1.5 ${isLight ? 'bg-slate-200' : 'bg-white/10'} rounded-full overflow-hidden`}>
          <div 
            className={`h-full ${theme.accentBg} transition-all duration-500 ease-out`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Stage Details */}
      <div className={`p-5 overflow-y-auto flex-1 border-b ${theme.border} ${isLight ? 'bg-white' : 'bg-black/10'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${theme.accentBorder} border ${theme.accent}`}>
            Bosqich {currentStage.id}
          </span>
          {isCompleted && (
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${theme.accentBorder} border ${theme.accent} flex items-center gap-1`}>
              <CheckCircle2 className="w-3 h-3" /> Bajarildi
            </span>
          )}
        </div>

        <h2 className={`text-base font-bold ${theme.textMain} mb-2 leading-tight`}>
          {currentStage.title}
        </h2>

        <p className={`text-xs ${theme.textDim} mb-4 leading-relaxed ${theme.bgCard} p-3 rounded-lg border ${theme.border}`}>
          {currentStage.description}
        </p>

        {/* Action Goal */}
        <div className={`mb-4 ${theme.bgCard} border ${theme.accentBorder} rounded-lg p-3.5`}>
          <div className={`text-[11px] uppercase tracking-wider font-bold ${theme.accent} mb-1 flex items-center gap-1.5`}>
            <Sparkles className="w-3.5 h-3.5" />
            Sizning vazifangiz:
          </div>
          <div className={`text-xs ${theme.textMain} font-mono font-medium`}>
            {currentStage.task}
          </div>
        </div>

        {/* Hint Section */}
        <div className="mt-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className={`w-full py-2 px-3 flex items-center justify-between text-xs font-semibold rounded-lg ${theme.bgCard} border ${theme.border} text-amber-500 transition-colors`}
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              {showHint ? "Maslahatni yashirish" : "Maslahat (Hint) kerakmi?"}
            </span>
            <span className="text-[10px] opacity-70 font-mono">
              {showHint ? "▲" : "▼"}
            </span>
          </button>

          {showHint && (
            <div className={`mt-2 p-3 ${isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-amber-950/20 text-amber-200 border-amber-500/30'} border rounded-lg text-xs`}>
              <div className="mb-2 leading-relaxed">{currentStage.hint}</div>
              <button
                onClick={() => onApplyHint(currentStage.command)}
                className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded ${isLight ? 'bg-amber-200 text-amber-900' : 'bg-amber-500/20 text-amber-300'} border border-amber-500/40 transition-colors`}
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
            className={`flex-1 py-1.5 px-3 flex items-center justify-center gap-1 text-xs rounded ${theme.bgCard} disabled:opacity-40 disabled:cursor-not-allowed border ${theme.border} ${theme.textMain} transition-all`}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Oldingi
          </button>
          <button
            disabled={currentStageId >= stages.length}
            onClick={() => {
              setShowHint(false);
              onSelectStage(currentStageId + 1);
            }}
            className={`flex-1 py-1.5 px-3 flex items-center justify-center gap-1 text-xs rounded ${theme.bgCard} disabled:opacity-40 disabled:cursor-not-allowed border ${theme.border} ${theme.textMain} transition-all`}
          >
            Keyingi <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stage list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className={`text-[10px] uppercase font-bold tracking-wider ${theme.textDim} px-2 py-1`}>
          Barcha 45 ta bosqich
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
              className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all text-xs font-mono border ${
                isCurrent
                  ? `${theme.accentBorder} ${theme.accent} ${isLight ? 'bg-slate-200/80 font-bold' : 'bg-white/10 font-bold'}`
                  : isDone
                  ? `${theme.border} ${theme.textDim} opacity-80`
                  : `border-transparent ${theme.textDim} hover:${theme.bgCard}`
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {isDone ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${theme.accent} flex-shrink-0`} />
                ) : isCurrent ? (
                  <div className={`w-3.5 h-3.5 rounded-full border-2 ${theme.accentBorder} flex items-center justify-center flex-shrink-0`}>
                    <div className={`w-1 h-1 ${theme.accentBg} rounded-full`} />
                  </div>
                ) : (
                  <Circle className="w-3.5 h-3.5 opacity-30 flex-shrink-0" />
                )}
                <span className={`truncate text-xs ${isCurrent ? theme.textMain : ""}`}>
                  {stage.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
