import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Terminal, 
  Shield, 
  Award, 
  RefreshCw, 
  User, 
  LogOut, 
  BookOpen, 
  Palette, 
  Lock, 
  Unlock,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import SidebarTasks from './components/SidebarTasks';
import TerminalView from './components/TerminalView';
import CheatSheet from './components/CheatSheet';
import AuthModal from './components/AuthModal';
import { distros, generateDistroStages } from './data/distroData';
import { cheatSheetData } from './data/trainerData';
import { themes } from './data/themes';
import { VirtualFS } from './utils/VirtualFS';
import { authService } from './utils/authService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const login = authService.getCurrentUser();
    if (login) {
      const users = authService.getAllUsers();
      return users[login] || null;
    }
    return null;
  });

  // Current Distro
  const [currentDistroId, setCurrentDistroId] = useState(() => {
    return currentUser?.activeDistro || "ubuntu";
  });

  // Current Theme
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return currentUser?.theme || "darkBlack";
  });
  const theme = themes[currentThemeId] || themes.darkBlack;

  // Active Distro Config & Stages (45 tasks)
  const currentDistro = distros.find(d => d.id === currentDistroId) || distros[0];
  const stages = generateDistroStages(currentDistro);

  const [fs, setFs] = useState(() => new VirtualFS());
  const [currentStageId, setCurrentStageId] = useState(1);
  const [completedStages, setCompletedStages] = useState([]);
  const [history, setHistory] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [mobileTab, setMobileTab] = useState('terminal'); // 'tasks' | 'terminal'
  const [showDistroMenu, setShowDistroMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Load progress when user or distro changes
  useEffect(() => {
    if (currentUser) {
      const data = authService.getDistroProgress(currentUser.login, currentDistroId);
      if (data) {
        setCurrentStageId(data.currentStageId || 1);
        setCompletedStages(data.completedStages || []);
        setHistory(data.history || []);
        if (data.fs) {
          setFs(new VirtualFS(data.fs));
        } else {
          setFs(new VirtualFS());
        }
      } else {
        setCurrentStageId(1);
        setCompletedStages([]);
        setHistory([]);
        setFs(new VirtualFS());
      }
    }
  }, [currentUser?.login, currentDistroId]);

  // Auto-save on change
  useEffect(() => {
    if (currentUser) {
      authService.saveDistroProgress(currentUser.login, currentDistroId, {
        currentStageId,
        completedStages,
        fsData: fs.toJSON(),
        history
      });
    }
  }, [currentUser, currentDistroId, currentStageId, completedStages, fs, history]);

  // Trigger celebration
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleCommandSubmit = (commandText) => {
    if (!commandText.trim()) return;

    const currentPathBefore = fs.getDisplayPath();
    const result = fs.execute(commandText);

    const currentStage = stages.find(s => s.id === currentStageId);
    let taskCompletedNow = false;

    if (currentStage && currentStage.validate(commandText, fs, fs.currentPath)) {
      if (!completedStages.includes(currentStage.id)) {
        const nextCompleted = [...completedStages, currentStage.id];
        setCompletedStages(nextCompleted);
        taskCompletedNow = true;
        triggerConfetti();

        // 45 ta vazifa to'liq tugaganda
        if (nextCompleted.length === stages.length) {
          setShowCelebrationModal(true);
        } else {
          setTimeout(() => {
            setCurrentStageId(prev => Math.min(stages.length, prev + 1));
          }, 800);
        }
      }
    }

    if (result.clear) {
      if (taskCompletedNow) {
        setHistory([
          {
            command: commandText,
            path: currentPathBefore,
            output: "",
            isSuccess: true,
            notification: `🎉 Barakalla! ${currentDistro.name} bo'yicha barcha 45 ta topshiriq yakunlandi! Keyingi distro ochildi!`
          }
        ]);
      } else {
        setHistory([]);
      }
      return;
    }

    setHistory(prev => [
      ...prev,
      {
        command: commandText,
        path: currentPathBefore,
        output: result.output,
        isSuccess: result.success,
        notification: taskCompletedNow ? `Barakalla! "${currentStage.title}" muvaffaqiyatli bajarildi!` : null
      }
    ]);
  };

  const handleResetTerminal = () => {
    const newFs = new VirtualFS();
    setFs(newFs);
    setHistory([]);
    setInputVal('');
  };

  const handleApplyHint = (command) => {
    setInputVal(command);
    setMobileTab('terminal');
  };

  const handleRestartCurrentDistro = () => {
    if (currentUser) {
      authService.resetDistroProgress(currentUser.login, currentDistroId);
    }
    handleResetTerminal();
    setCurrentStageId(1);
    setCompletedStages([]);
    setShowCelebrationModal(false);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const handleSwitchDistro = (distroId) => {
    // Tekshirish: Qulflanganmi?
    const unlocked = currentUser?.unlockedDistros || ["ubuntu"];
    if (!unlocked.includes(distroId)) {
      alert(`🔒 Diqqat: Siz avval joriy (${currentDistro.name}) distroning 45 ta darsini to'liq tugatishingiz kerak!`);
      return;
    }
    setCurrentDistroId(distroId);
    if (currentUser) {
      authService.setActiveDistro(currentUser.login, distroId);
    }
    setShowDistroMenu(false);
  };

  const handleSwitchTheme = (themeId) => {
    setCurrentThemeId(themeId);
    if (currentUser) {
      authService.saveTheme(currentUser.login, themeId);
    }
    setShowThemeMenu(false);
  };

  return (
    <div className={`flex flex-col h-screen w-screen ${theme.bg} ${theme.textMain} font-mono select-none overflow-hidden transition-colors duration-300`}>
      {/* Auth Modal */}
      {!currentUser && (
        <AuthModal onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentDistroId(user.activeDistro || "ubuntu");
          setCurrentThemeId(user.theme || "darkBlack");
        }} />
      )}

      {/* Top Main Navigation Header */}
      <header className={`h-12 border-b ${theme.border} ${theme.bgHeader} px-3 sm:px-4 flex items-center justify-between z-20 flex-shrink-0`}>
        {/* Left: Logo & Distro Selector */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${theme.accentBg} flex items-center justify-center font-bold text-xs`}>
              {currentDistro.icon}
            </div>
            <div className="hidden sm:block">
              <span className={`font-extrabold text-sm tracking-wide ${theme.textMain}`}>
                Linux<span className={theme.accent}>Trainer</span>
              </span>
            </div>
          </div>

          {/* Distro Dropdown with Lock Status */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDistroMenu(!showDistroMenu);
                setShowThemeMenu(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${theme.border} ${theme.bgCard} text-xs font-semibold transition-all`}
            >
              <span>{currentDistro.icon}</span>
              <span className="max-w-[100px] truncate">{currentDistro.name}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showDistroMenu && (
              <div className={`absolute left-0 mt-2 w-64 rounded-xl border ${theme.border} ${theme.bgCard} shadow-2xl p-2 z-50`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${theme.textDim} px-2 py-1`}>
                  Linux Distrolari Kurslari (45 ta dars)
                </div>
                {distros.map(d => {
                  const unlocked = currentUser?.unlockedDistros?.includes(d.id);
                  const isCurrent = d.id === currentDistroId;

                  return (
                    <button
                      key={d.id}
                      onClick={() => handleSwitchDistro(d.id)}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors my-0.5 ${
                        isCurrent 
                          ? `${theme.accentBorder} border ${theme.accent} font-bold`
                          : unlocked 
                          ? `hover:${theme.bgSidebar} ${theme.textMain}`
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{d.icon}</span>
                        <div className="truncate">
                          <div>{d.name}</div>
                          <div className={`text-[9px] ${theme.textDim}`}>{d.pkgManager} paket boshqaruvi</div>
                        </div>
                      </div>
                      <div>
                        {unlocked ? (
                          <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-rose-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center: Mobile Tabs */}
        <div className="flex md:hidden bg-black/10 p-0.5 rounded-lg border border-black/10 text-xs">
          <button
            onClick={() => setMobileTab('tasks')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              mobileTab === 'tasks' 
                ? `${theme.accentBg} font-bold` 
                : `${theme.textDim}`
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Vazifalar</span>
          </button>
          <button
            onClick={() => setMobileTab('terminal')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              mobileTab === 'terminal' 
                ? `${theme.accentBg} font-bold` 
                : `${theme.textDim}`
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Terminal</span>
          </button>
        </div>

        {/* Right: Theme Selector, User & Actions */}
        <div className="flex items-center gap-2 text-xs">
          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowDistroMenu(false);
              }}
              title="Mavzular (Themes)"
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${theme.border} ${theme.bgCard} text-xs`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">{theme.name}</span>
            </button>

            {showThemeMenu && (
              <div className={`absolute right-0 mt-2 w-48 rounded-xl border ${theme.border} ${theme.bgCard} shadow-2xl p-2 z-50`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${theme.textDim} px-2 py-1`}>
                  Mavzular (4 xil)
                </div>
                {Object.values(themes).map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSwitchTheme(t.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between my-0.5 ${
                      t.id === currentThemeId ? 'font-bold bg-white/10' : `hover:${theme.bgSidebar}`
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="text-[10px] opacity-60">({t.type})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleRestartCurrentDistro}
            title="Ushbu distroni qaytadan 1-bosqichdan boshlash"
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded border ${theme.border} ${theme.bgCard} ${theme.textDim} hover:${theme.textMain} transition-colors`}
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden lg:inline">Qayta boshlash</span>
          </button>

          {currentUser && (
            <button
              onClick={handleLogout}
              title="Kabinetdan chiqish"
              className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left side: Tasks list */}
        <div className={`w-full md:w-[380px] lg:w-[420px] flex-shrink-0 h-full ${
          mobileTab === 'tasks' ? 'flex' : 'hidden md:flex'
        }`}>
          <SidebarTasks
            stages={stages}
            currentStageId={currentStageId}
            completedStages={completedStages}
            onSelectStage={(id) => {
              setCurrentStageId(id);
              setMobileTab('terminal');
            }}
            onApplyHint={handleApplyHint}
            theme={theme}
          />
        </div>

        {/* Right side: Interactive Terminal and Cheat Sheet */}
        <div className={`flex-1 flex-col h-full overflow-hidden ${theme.bgTerminal} ${
          mobileTab === 'terminal' ? 'flex' : 'hidden md:flex'
        }`}>
          <div className="flex-1 min-h-0">
            <TerminalView
              history={history}
              onCommandSubmit={handleCommandSubmit}
              currentPathDisplay={fs.getDisplayPath()}
              onResetTerminal={handleResetTerminal}
              inputVal={inputVal}
              setInputVal={setInputVal}
              theme={theme}
              distro={currentDistro}
            />
          </div>

          {/* Bottom CheatSheet */}
          <div className="flex-shrink-0">
            <CheatSheet
              cheatSheetData={cheatSheetData}
              onInsertCommand={(cmd) => setInputVal(cmd)}
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`border-2 ${theme.accentBorder} ${theme.bgCard} rounded-2xl p-6 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300`}>
            <div className={`w-16 h-16 rounded-full ${theme.accentBg} mx-auto flex items-center justify-center text-2xl mb-4 animate-bounce`}>
              {currentDistro.icon}
            </div>

            <h3 className="text-xl font-bold mb-2">
              Tabriklaymiz! {currentDistro.name} Kursi Yakunlandi! 🎉
            </h3>
            
            <p className={`text-xs ${theme.textDim} leading-relaxed mb-6`}>
              Siz ushbu distributiv bo'yicha barcha 45 ta darsni muvaffaqiyatli topshirdingiz! Keyingi Linux distrolari siz uchun blokdan ochildi!
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCelebrationModal(false)}
                className={`flex-1 py-2 px-4 rounded-lg ${theme.bgSidebar} text-xs font-semibold border ${theme.border}`}
              >
                Yopish
              </button>
              <button
                onClick={() => {
                  setShowCelebrationModal(false);
                  setShowDistroMenu(true);
                }}
                className={`flex-1 py-2 px-4 rounded-lg ${theme.accentBg} text-xs font-bold transition-all shadow-lg`}
              >
                Keyingi Distroni Tanlash 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
