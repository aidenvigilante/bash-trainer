import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Terminal, Shield, Award, CheckCircle, RefreshCw, Sparkles, Save, User, LogOut, BookOpen } from 'lucide-react';
import SidebarTasks from './components/SidebarTasks';
import TerminalView from './components/TerminalView';
import CheatSheet from './components/CheatSheet';
import AuthModal from './components/AuthModal';
import { stages, cheatSheetData } from './data/trainerData';
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

  const [fs, setFs] = useState(() => new VirtualFS());
  const [currentStageId, setCurrentStageId] = useState(1);
  const [completedStages, setCompletedStages] = useState([]);
  const [history, setHistory] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [mobileTab, setMobileTab] = useState('terminal'); // 'tasks' | 'terminal'

  // Foydalanuvchi yuklanganda
  useEffect(() => {
    if (currentUser) {
      const data = authService.getUserData(currentUser.login);
      if (data) {
        setCurrentStageId(data.currentStageId || 1);
        setCompletedStages(data.completedStages || []);
        setHistory(data.history || []);
        if (data.fs) {
          setFs(new VirtualFS(data.fs));
        } else {
          setFs(new VirtualFS());
        }
      }
    }
  }, [currentUser?.login]);

  // Har safar o'zgarganda saqlash
  useEffect(() => {
    if (currentUser) {
      authService.saveUserData(currentUser.login, {
        currentStageId,
        completedStages,
        fsData: fs.toJSON(),
        history
      });
    }
  }, [currentUser, currentStageId, completedStages, fs, history]);

  // Trigger celebration
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCommandSubmit = (commandText) => {
    if (!commandText.trim()) return;

    // Execute on VFS
    const currentPathBefore = fs.getDisplayPath();
    const result = fs.execute(commandText);

    if (result.clear) {
      setHistory([]);
      return;
    }

    const currentStage = stages.find(s => s.id === currentStageId);
    let taskCompletedNow = false;

    // Check if task is valid for current stage
    if (currentStage && currentStage.validate(commandText, fs, fs.currentPath)) {
      if (!completedStages.includes(currentStage.id)) {
        const nextCompleted = [...completedStages, currentStage.id];
        setCompletedStages(nextCompleted);
        taskCompletedNow = true;
        triggerConfetti();

        // Check if finished all stages
        if (nextCompleted.length === stages.length) {
          setShowCelebrationModal(true);
        } else {
          // Auto advance to next unfinished stage after 1s
          setTimeout(() => {
            setCurrentStageId(prev => Math.min(stages.length, prev + 1));
          }, 800);
        }
      }
    }

    setHistory(prev => [
      ...prev,
      {
        command: commandText,
        path: currentPathBefore,
        output: result.output,
        isSuccess: result.success,
        notification: taskCompletedNow ? `Barakalla! "${currentStage.title}" bosqichi muvaffaqiyatli bajarildi!` : null
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
    setMobileTab('terminal'); // Telefondan foydalanganda avtomatik terminal oynasiga o'tkazish
  };

  const handleRestartFullCourse = () => {
    if (currentUser) {
      authService.resetUserData(currentUser.login);
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

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0d0f] text-gray-100 font-mono select-none overflow-hidden">
      {/* Agar login qilinmagan bo'lsa Login/Register Modali chiqadi */}
      {!currentUser && (
        <AuthModal onLoginSuccess={(user) => setCurrentUser(user)} />
      )}

      {/* Top Main Navigation Header */}
      <header className="h-12 border-b border-[#1f2b34] bg-[#0d1318] px-3 sm:px-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wide text-white">
              Bash<span className="text-emerald-400">Learn</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] px-1.5 py-0.5 rounded bg-[#162029] text-gray-400 border border-[#212f3d]">
              Linux Trenajyori
            </span>
          </div>
        </div>

        {/* Mobile View Switcher (Tabs) */}
        <div className="flex md:hidden bg-[#141d24] p-0.5 rounded-lg border border-[#22303e] text-xs">
          <button
            onClick={() => setMobileTab('tasks')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              mobileTab === 'tasks' 
                ? 'bg-emerald-500 text-black font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Vazifalar</span>
          </button>
          <button
            onClick={() => setMobileTab('terminal')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              mobileTab === 'terminal' 
                ? 'bg-emerald-500 text-black font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Terminal</span>
          </button>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-1.5 bg-[#141d25] border border-[#22303e] rounded-lg px-2.5 py-1 text-gray-200">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-300 truncate max-w-[100px]">{currentUser.name}</span>
            </div>
          )}

          <button
            onClick={handleRestartFullCourse}
            title="Kursni boshlang'ich 1-bosqichdan qayta boshlash"
            className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-[#141c23] hover:bg-[#1a2632] border border-[#202e3b] text-gray-300 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span className="hidden lg:inline">Qayta boshlash</span>
          </button>

          {currentUser && (
            <button
              onClick={handleLogout}
              title="Kabinetdan chiqish"
              className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace (Responsive) */}
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
              setMobileTab('terminal'); // Bosqichni tanlaganda darhol terminalga o'tkazish
            }}
            onApplyHint={handleApplyHint}
          />
        </div>

        {/* Right side: Interactive Terminal and Cheat Sheet */}
        <div className={`flex-1 flex-col h-full overflow-hidden bg-[#0a0d0f] ${
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
            />
          </div>

          {/* Bottom CheatSheet */}
          <div className="flex-shrink-0">
            <CheatSheet
              cheatSheetData={cheatSheetData}
              onInsertCommand={(cmd) => setInputVal(cmd)}
            />
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#10171e] border-2 border-emerald-500/60 rounded-2xl p-6 max-w-md w-full text-center shadow-[0_0_50px_rgba(0,255,102,0.2)] animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Tabriklaymiz! Siz Kursni Tugatdingiz! 🎉
            </h3>
            
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Siz Linux terminali (Bash)ning eng asosiy 15 ta buyrug'ini amaliy tarzda muvaffaqiyatli o'zlashtirdingiz. Endi siz bemalol buyruqlar satrida ishlay olasiz!
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="flex-1 py-2 px-4 rounded-lg bg-[#18232e] hover:bg-[#202f3d] text-xs font-semibold text-gray-200 border border-[#273748] transition-colors"
              >
                Yopish
              </button>
              <button
                onClick={handleRestartFullCourse}
                className="flex-1 py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-black transition-colors shadow-[0_0_15px_rgba(0,255,102,0.4)]"
              >
                Qaytadan boshlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
