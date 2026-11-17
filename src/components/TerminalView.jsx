import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ShieldCheck, RefreshCw } from 'lucide-react';

export default function TerminalView({
  history,
  onCommandSubmit,
  currentPathDisplay,
  onResetTerminal,
  inputVal,
  setInputVal,
  theme,
  distro
}) {
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputVal.trim();
      if (trimmed) {
        setCmdHistory(prev => [...prev, trimmed]);
        setHistoryIndex(-1);
      }
      onCommandSubmit(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = inputVal.trim();
      const common = ["ls", "pwd", "cd", "mkdir", "touch", "cat", "cp", "mv", "rm", "clear", "echo", "whoami", "date", "index.html", "backup.html", "arxiv.html", "loyihalar", "grep", "head", "tail", "wc", "sort", "ps", "kill", "free", "df", "uptime", "curl", "ping"];
      const match = common.find(c => c.startsWith(val) && c !== val);
      if (match) {
        setInputVal(match);
      }
    }
  };

  const promptUser = `${distro.promptUser}@${distro.promptHost}`;
  const isLight = theme.type === "light";

  return (
    <div 
      onClick={handleContainerClick}
      className={`flex flex-col h-full ${theme.bgTerminal} font-mono text-xs sm:text-sm overflow-hidden select-text cursor-text`}
    >
      {/* Top bar of terminal window */}
      <div className={`${isLight ? 'bg-slate-200/70 border-slate-300' : 'bg-black/40 border-white/10'} px-4 py-2 border-b flex items-center justify-between select-none`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs ${theme.textDim}`}>
            <TerminalIcon className={`w-3.5 h-3.5 ${theme.accent}`} />
            <span className="font-semibold">{distro.name} Terminal (bash)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[10px] px-2 py-0.5 rounded border ${theme.accentBorder} ${theme.accent} hidden sm:flex items-center gap-1`}>
            <ShieldCheck className="w-3 h-3" /> {distro.osReleaseName}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onResetTerminal();
            }}
            title="Terminalni tozalash va qayta ishga tushirish"
            className={`text-xs ${theme.textDim} hover:${theme.textMain} p-1 rounded hover:${theme.bgCard} transition-colors`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal log output */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {/* Welcome Banner */}
        <div className={`text-xs pb-3 border-b ${theme.border} ${theme.textDim}`}>
          <div className={`font-bold mb-1 ${theme.accent}`}>
            {distro.icon} {distro.name} Terminal Simulator [Kernel {distro.kernel.split(' ')[2]}]
          </div>
          <div>Yordam uchun <code className={theme.accent}>help</code> deb yozing yoki chapdagi topshiriqlarni bajaring.</div>
        </div>

        {/* Command history list */}
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {/* Input line */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`font-bold ${theme.terminalPromptUser}`}>{promptUser}</span>
              <span className={theme.textDim}>:</span>
              <span className={`font-bold ${theme.terminalPromptPath}`}>{item.path}</span>
              <span className={`font-bold ${theme.terminalPromptUser}`}>$</span>
              <span className={`font-semibold ${theme.textMain}`}>{item.command}</span>
            </div>

            {/* Output line */}
            {item.output && (
              <pre className={`text-xs whitespace-pre-wrap pl-2 leading-relaxed ${
                item.isSuccess ? theme.textDim : 'text-rose-500 font-medium'
              }`}>
                {item.output}
              </pre>
            )}

            {/* Task notification if any */}
            {item.notification && (
              <div className={`my-1.5 p-2 rounded ${theme.accentBorder} border ${isLight ? 'bg-emerald-50 text-emerald-800' : 'bg-emerald-950/40 text-emerald-300'} text-xs flex items-center gap-2 animate-pulse`}>
                <span>✨</span>
                <span>{item.notification}</span>
              </div>
            )}
          </div>
        ))}

        {/* Current Active Input Prompt */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className={`font-bold ${theme.terminalPromptUser}`}>{promptUser}</span>
          <span className={theme.textDim}>:</span>
          <span className={`font-bold ${theme.terminalPromptPath}`}>{currentPathDisplay}</span>
          <span className={`font-bold ${theme.terminalPromptUser}`}>$</span>
          
          <div className="flex-1 flex items-center relative">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent outline-none border-none ${theme.terminalText} font-mono text-xs sm:text-sm p-0 m-0`}
              spellCheck="false"
              autoComplete="off"
            />
          </div>
        </div>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
