import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Terminal, 
  Sparkles,
  BookOpen,
  ChevronDown,
  Layers,
  Flame,
  Skull
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

  // 3 ta bo'limni ochiq/yopiq holati (Accordion)
  // Qaysi bo'limdagi topshiriq faol bo'lsa, o'sha bo'lim avtomatik ochiq bo'ladi
  const [openSections, setOpenSections] = useState({
    part1: true,
    part2: currentStageId >= 16 && currentStageId <= 30,
    part3: currentStageId >= 31 && currentStageId <= 45,
  });

  const toggleSection = (partKey) => {
    setOpenSections(prev => ({
      ...prev,
      [partKey]: !prev[partKey]
    }));
  };

  const isLight = theme.type === "light";

  // 3 ta guruhga ajratish
  const sections = [
    {
      key: "part1",
      title: "1-Bo'lim: Boshlang'ich Asoslar",
      range: "1 - 15",
      icon: <Layers className="w-3.5 h-3.5 text-sky-400" />,
      stages: stages.slice(0, 15),
      badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/30"
    },
    {
      key: "part2",
      title: "2-Bo'lim: Matn, Distro & Filtrlar",
      range: "16 - 30",
      icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
      stages: stages.slice(15, 30),
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30"
    },
    {
      key: "part3",
      title: "3-Bo'lim: Admin & Hardcore Azob",
      range: "31 - 45",
      icon: <Skull className="w-3.5 h-3.5 text-rose-400" />,
      stages: stages.slice(30, 45),
      badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30"
    }
  ];

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
      <div className={`p-4 overflow-y-auto max-h-[320px] flex-shrink-0 border-b ${theme.border} ${isLight ? 'bg-white' : 'bg-black/10'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${theme.accentBorder} border ${theme.accent}`}>
            Bosqich {currentStage.id} / 45
          </span>
          {isCompleted && (
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${theme.accentBorder} border ${theme.accent} flex items-center gap-1`}>
              <CheckCircle2 className="w-3 h-3" /> Bajarildi
            </span>
          )}
        </div>

        <h2 className={`text-sm sm:text-base font-bold ${theme.textMain} mb-2 leading-tight`}>
          {currentStage.title}
        </h2>

        <p className={`text-xs ${theme.textDim} mb-3 leading-relaxed ${theme.bgCard} p-2.5 rounded-lg border ${theme.border}`}>
          {currentStage.description}
        </p>

        {/* Action Goal */}
        <div className={`mb-3 ${theme.bgCard} border ${theme.accentBorder} rounded-lg p-2.5`}>
          <div className={`text-[10px] uppercase tracking-wider font-bold ${theme.accent} mb-1 flex items-center gap-1`}>
            <Sparkles className="w-3 h-3" />
            Sizning vazifangiz:
          </div>
          <div className={`text-xs ${theme.textMain} font-mono font-medium`}>
            {currentStage.task}
          </div>
        </div>

        {/* Hint Section */}
        <div>
          <button
            onClick={() => setShowHint(!showHint)}
            className={`w-full py-1.5 px-3 flex items-center justify-between text-xs font-semibold rounded-lg ${theme.bgCard} border ${theme.border} text-amber-500 transition-colors`}
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? "Maslahatni yashirish" : "Maslahat (Hint) kerakmi?"}
            </span>
            <span className="text-[10px] opacity-70 font-mono">
              {showHint ? "▲" : "▼"}
            </span>
          </button>

          {showHint && (
            <div className={`mt-2 p-2.5 ${isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-amber-950/20 text-amber-200 border-amber-500/30'} border rounded-lg text-xs`}>
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
        <div className="flex items-center justify-between gap-2 mt-3">
          <button
            disabled={currentStageId <= 1}
            onClick={() => {
              setShowHint(false);
              onSelectStage(currentStageId - 1);
            }}
            className={`flex-1 py-1 px-2.5 flex items-center justify-center gap-1 text-xs rounded ${theme.bgCard} disabled:opacity-40 disabled:cursor-not-allowed border ${theme.border} ${theme.textMain} transition-all`}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Oldingi
          </button>
          <button
            disabled={currentStageId >= stages.length}
            onClick={() => {
              setShowHint(false);
              onSelectStage(currentStageId + 1);
            }}
            className={`flex-1 py-1 px-2.5 flex items-center justify-center gap-1 text-xs rounded ${theme.bgCard} disabled:opacity-40 disabled:cursor-not-allowed border ${theme.border} ${theme.textMain} transition-all`}
          >
            Keyingi <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 ta bo'limli Accordion Ro'yxati */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {sections.map((section) => {
          const isOpen = openSections[section.key];
          const completedCount = section.stages.filter(s => completedStages.includes(s.id)).length;
          const isSectionDone = completedCount === section.stages.length;

          return (
            <div 
              key={section.key} 
              className={`rounded-xl border ${theme.border} ${theme.bgCard} overflow-hidden transition-all`}
            >
              {/* Bo'lim Sarlavhasi (Accordion Header) */}
              <button
                onClick={() => toggleSection(section.key)}
                className={`w-full p-2.5 flex items-center justify-between text-left transition-colors ${
                  isLight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {section.icon}
                  <div className="truncate">
                    <div className={`text-xs font-bold ${theme.textMain} truncate`}>
                      {section.title}
                    </div>
                    <div className={`text-[10px] ${theme.textDim}`}>
                      Bosqichlar: {section.range}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                    isSectionDone 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' 
                      : section.badgeColor
                  }`}>
                    {completedCount}/15
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 ${theme.textDim} transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>

              {/* Bo'lim Ichidagi Topshiriqlar Ro'yxati (Accordion Content) */}
              {isOpen && (
                <div className={`p-2 border-t ${theme.border} space-y-1 ${isLight ? 'bg-slate-50' : 'bg-black/10'}`}>
                  {section.stages.map((stage) => {
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
                            ? `${theme.accentBorder} ${theme.accent} ${isLight ? 'bg-slate-200/80 font-bold' : 'bg-white/10 font-bold shadow-sm'}`
                            : isDone
                            ? `${theme.border} ${theme.textDim} opacity-80 hover:${theme.bgSidebar}`
                            : `border-transparent ${theme.textDim} hover:${theme.bgSidebar}`
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-1">
                          {isDone ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 ${theme.accent} flex-shrink-0`} />
                          ) : isCurrent ? (
                            <div className={`w-3.5 h-3.5 rounded-full border-2 ${theme.accentBorder} flex items-center justify-center flex-shrink-0`}>
                              <div className={`w-1.5 h-1.5 ${theme.accentBg} rounded-full animate-ping`} />
                            </div>
                          ) : (
                            <Circle className="w-3.5 h-3.5 opacity-30 flex-shrink-0" />
                          )}
                          <span className={`truncate text-xs ${isCurrent ? theme.textMain : ""}`}>
                            {stage.title}
                          </span>
                        </div>
                        <code className={`text-[9px] px-1.5 py-0.5 rounded ${isLight ? 'bg-slate-200' : 'bg-black/30'} ${theme.textDim} flex-shrink-0`}>
                          {stage.command.split(" ")[0]}
                        </code>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
