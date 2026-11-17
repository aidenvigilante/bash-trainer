import React, { useState, useEffect } from 'react';
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
    targetId: "tour-distro",
    title: "1. Linux Distrosini Tanlash",
    desc: "Bu yerda siz o'rganayotgan Linux operatsion tizimi joylashgan. Bitta distroning 45 ta darsini to'liq tugatganingizdan so'ng qolgan barcha distrolar ochiladi!",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    placement: "bottom-left"
  },
  {
    targetId: "tour-themes",
    title: "2. 4 xil UI Mavzulari (Themes)",
    desc: "Mavzuni o'zingizga qulay qilib sozlang: 2 ta Dark (Black va Neon) hamda 2 ta Light (Standart Oq va Qog'ozsimon Krem) variantlar mavjud.",
    icon: <Palette className="w-5 h-5 text-amber-400" />,
    placement: "bottom-right"
  },
  {
    targetId: "tour-sidebar",
    title: "3. Vazifalar Paneli (3 ta Bo'lim)",
    desc: "Chap tomonda sizning 45 ta amaliy topshirig'ingiz 3 ta yig'iladigan bo'limga ajratilgan. Har bir bo'limni bosib ochish yoki yopish mumkin.",
    icon: <BookOpen className="w-5 h-5 text-sky-400" />,
    placement: "right"
  },
  {
    targetId: "tour-terminal",
    title: "4. Interaktiv Linux CLI Simulyatori",
    desc: "Haqiqiy Linux terminali! Buyruqlarni klaviaturadan kiritib Enter bosing, oldingi buyruqlarni chaqirish uchun esa Yuqoriga/Pastga strelkalardan foydalaning.",
    icon: <Terminal className="w-5 h-5 text-emerald-400" />,
    placement: "left"
  },
  {
    targetId: "tour-cheatsheet",
    title: "5. Linux Shpargalkasi (Cheat Sheet)",
    desc: "Eng ko'p ishlatiladigan buyruqlar to'plami. Istalgan buyruq ustiga bir marta bossangiz, u darhol terminalga yoziladi!",
    icon: <Sparkles className="w-5 h-5 text-fuchsia-400" />,
    placement: "top"
  }
];

export default function OnboardingTutorial({ onComplete, theme }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const step = tutorialSteps[currentStep];

  // Elementning ekrandagi koordinatalarini hisoblash
  useEffect(() => {
    const updatePosition = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
      } else {
        setTargetRect(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep, step.targetId]);

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

  // Tooltip oynasining ekranda joylashishi
  const getTooltipStyle = () => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const margin = 16;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobilda doimo pastroqda qulay ko'rsatish
      return {
        bottom: '24px',
        left: '16px',
        right: '16px',
        width: 'auto'
      };
    }

    if (step.placement === "bottom-left") {
      return {
        top: `${targetRect.bottom + margin}px`,
        left: `${Math.max(16, targetRect.left)}px`,
      };
    } else if (step.placement === "bottom-right") {
      return {
        top: `${targetRect.bottom + margin}px`,
        right: `${Math.max(16, window.innerWidth - targetRect.right)}px`,
      };
    } else if (step.placement === "right") {
      return {
        top: `${Math.max(60, targetRect.top + 20)}px`,
        left: `${targetRect.right + margin}px`,
      };
    } else if (step.placement === "left") {
      return {
        top: `${Math.max(60, targetRect.top + 60)}px`,
        left: `${Math.max(16, targetRect.left - 380)}px`,
      };
    } else if (step.placement === "top") {
      return {
        bottom: `${window.innerHeight - targetRect.top + margin}px`,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    }

    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono select-none">
      {/* 1. Backdrop va Targetni ramkaga olish (Spotlight Highlight) */}
      {targetRect && (
        <div 
          className="fixed pointer-events-none transition-all duration-300 rounded-xl"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.78), 0 0 25px rgba(0, 255, 102, 0.8)',
            border: '2px solid #00ff66',
          }}
        >
          {/* Pulsatsiya qiluvchi nishon burchaklari */}
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
        </div>
      )}

      {/* 2. Bog'lovchi chiziq (Pointer / Connector Badge) */}
      {targetRect && window.innerWidth >= 768 && (
        <div 
          className="fixed pointer-events-none z-50 text-emerald-400 font-bold text-xs flex items-center gap-1 transition-all duration-300"
          style={{
            top: step.placement.startsWith("bottom") ? targetRect.bottom + 4 : targetRect.top - 18,
            left: targetRect.left + 8,
          }}
        >
          <span className="animate-bounce">📍 Mana shu maydon</span>
        </div>
      )}

      {/* 3. Yo'naltiruvchi Tushuntirish Kartochkasi (Floating Tooltip Card) */}
      <div 
        style={getTooltipStyle()}
        className={`fixed z-50 w-full max-w-sm rounded-2xl border ${theme.accentBorder} ${theme.bgCard} p-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-300`}
      >
        {/* Yuqori qism: Bosqich raqami va Yopish */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.accent} flex items-center gap-1`}>
              <Sparkles className="w-3 h-3" />
              Yo'riqnoma {currentStep + 1} / {tutorialSteps.length}
            </span>
          </div>

          <button 
            onClick={onComplete}
            className={`p-1 rounded-md ${theme.textDim} hover:${theme.textMain} hover:${theme.bgSidebar} transition-colors`}
            title="O'tkazib yuborish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress chizig'i */}
        <div className="flex gap-1 w-full mb-3">
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

        {/* Sarlavha va Matn */}
        <div className="mb-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`w-8 h-8 rounded-lg border ${theme.accentBorder} ${theme.bgSidebar} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              {step.icon}
            </div>
            <h4 className={`text-sm font-bold ${theme.textMain} leading-tight`}>
              {step.title}
            </h4>
          </div>

          <p className={`text-xs ${theme.textDim} leading-relaxed`}>
            {step.desc}
          </p>
        </div>

        {/* Tugmalar */}
        <div className={`pt-3 border-t ${theme.border} flex items-center justify-between gap-2`}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`py-1.5 px-3 rounded-lg border ${theme.border} ${theme.textDim} hover:${theme.textMain} disabled:opacity-30 disabled:cursor-not-allowed text-xs flex items-center gap-1 transition-colors`}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Orqaga
          </button>

          <button
            onClick={handleNext}
            className={`py-1.5 px-4 rounded-lg ${theme.accentBg} text-xs font-bold flex items-center gap-1 transition-all shadow-md`}
          >
            {currentStep === tutorialSteps.length - 1 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Tushundim, boshlash!
              </>
            ) : (
              <>
                Keyingisi <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
