import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  BookOpen, 
  Palette, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  X,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const tutorialSteps = [
  {
    target: "distro",
    title: "1. Linux Distrosini Tanlash",
    desc: "Bu yerda siz o'rganayotgan Linux operatsion tizimi ko'rinadi (Ubuntu, Arch, Fedora, Kali, Tuxedo). Bitta distroning 45 ta darsini to'liq tugatganingizdan so'ng keyingi distrolar qulfdan ochiladi!",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
  },
  {
    target: "theme",
    title: "2. 4 xil UI Mavzulari (Themes)",
    desc: "Ko'zingizga qulay interfeysni tanlang: 2 ta Dark (Qora va Neon Glow) hamda 2 ta Light (Standart Oq va Qog'ozsimon Krem) mavzular mavjud.",
    icon: <Palette className="w-6 h-6 text-amber-400" />,
  },
  {
    target: "tasks",
    title: "3. Vazifalar Paneli (3 ta Bo'lim)",
    desc: "Chap tomonda sizning 45 ta amaliy topshirig'ingiz 3 ta yig'iladigan bo'limga ajratilgan: Asoslar (1-15), Matn va Filtrlar (16-30), hamda Admin va Monitoring (31-45).",
    icon: <BookOpen className="w-6 h-6 text-sky-400" />,
  },
  {
    target: "hint",
    title: "4. Maslahat (Hint) va Avto-nusxalash",
    desc: "Agar biror buyruqni eslay olmasangiz, 'Maslahat kerakmi?' tugmasini bosing. Sizga to'g'ri sintaksis tushuntiriladi va bitta bosish bilan terminalga yozib beriladi.",
    icon: <HelpCircle className="w-6 h-6 text-amber-400" />,
  },
  {
    target: "terminal",
    title: "5. Interaktiv Linux CLI Simulyatori",
    desc: "O'ng tomonda haqiqiy Linux terminali joylashgan. Buyruqlarni klaviaturada yozib Enter bosing, buyruqlar tarixini chaqirish uchun Yuqoriga/Pastga strelkalardan foydalaning!",
    icon: <Terminal className="w-6 h-6 text-emerald-400" />,
  },
  {
    target: "cheatsheet",
    title: "6. Linux Shpargalkasi (Cheat Sheet)",
    desc: "Pastki qismda eng ko'p ishlatiladigan buyruqlar to'plangan. Shpargalkadagi istalgan buyruq ustiga bossangiz, u darhol terminalga yoziladi!",
    icon: <Sparkles className="w-6 h-6 text-fuchsia-400" />,
  }
];

export default function OnboardingTutorial({ onComplete, theme }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono select-none animate-in fade-in duration-300">
      <div className={`relative w-full max-w-lg rounded-2xl border ${theme.accentBorder} ${theme.bgCard} p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-between`}>
        {/* Skip button */}
        <button 
          onClick={onComplete}
          className={`absolute top-4 right-4 p-1.5 rounded-lg border ${theme.border} ${theme.textDim} hover:${theme.textMain} hover:${theme.bgSidebar} transition-colors`}
          title="O'tkazib yuborish (Skip)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with step counter */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${theme.accent} flex items-center gap-1.5`}>
              <Sparkles className="w-3.5 h-3.5" />
              Tizim bilan tanishuv
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${theme.border} ${theme.textDim}`}>
              {currentStep + 1} / {tutorialSteps.length}
            </span>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-1.5 w-full">
            {tutorialSteps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  idx === currentStep 
                    ? `${theme.accentBg}` 
                    : idx < currentStep 
                    ? 'bg-emerald-500/50' 
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="my-4 min-h-[140px] flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl border ${theme.accentBorder} ${theme.bgSidebar} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              {step.icon}
            </div>
            <h3 className={`text-base sm:text-lg font-bold ${theme.textMain} leading-tight`}>
              {step.title}
            </h3>
          </div>

          <p className={`text-xs sm:text-sm ${theme.textDim} leading-relaxed`}>
            {step.desc}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className={`pt-4 border-t ${theme.border} flex items-center justify-between gap-3`}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`py-2 px-3 rounded-lg border ${theme.border} ${theme.textDim} hover:${theme.textMain} disabled:opacity-30 disabled:cursor-not-allowed text-xs flex items-center gap-1 transition-colors`}
          >
            <ChevronLeft className="w-4 h-4" /> Orqaga
          </button>

          <button
            onClick={handleNext}
            className={`py-2 px-5 rounded-lg ${theme.accentBg} text-xs font-bold flex items-center gap-1.5 transition-all shadow-md`}
          >
            {currentStep === tutorialSteps.length - 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Boshlash!
              </>
            ) : (
              <>
                Davom etish <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
