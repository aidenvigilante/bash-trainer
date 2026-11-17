import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, ShieldCheck, RefreshCw } from 'lucide-react';

export default function TerminalView({
  history,
  onCommandSubmit,
  currentPathDisplay,
  onResetTerminal,
  inputVal,
  setInputVal
}) {
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Keep input focused
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
      // Simple tab completion for commands and files
      const val = inputVal.trim();
      const common = ["ls", "pwd", "cd", "mkdir", "touch", "cat", "cp", "mv", "rm", "clear", "echo", "whoami", "date", "index.html", "backup.html", "arxiv.html", "loyihalar"];
      const match = common.find(c => c.startsWith(val) && c !== val);
      if (match) {
        setInputVal(match);
      }
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      className="flex flex-col h-full bg-[#0a0d0f] font-mono text-sm overflow-hidden select-text cursor-text"
    >
      {/* Top bar of terminal window */}
      <div className="bg-[#12181e] px-4 py-2.5 border-b border-[#1f2b34] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-[0_0_6px_rgba(255,95,86,0.6)]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-[0_0_6px_rgba(255,189,46,0.6)]"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-[0_0_6px_rgba(39,201,63,0.6)]"></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-gray-200">bash — 80x24</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-emerald-400/80 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Linux Emulyatori (Bash)
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onResetTerminal();
            }}
            title="Terminalni boshlang'ich holatga qaytarish"
            className="text-xs text-gray-400 hover:text-white p-1 rounded hover:bg-[#1f2b34] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal log output */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {/* Welcome Banner */}
        <div className="text-gray-400 text-xs mb-3 pb-3 border-b border-[#1b252e]">
          <div className="text-emerald-400 font-bold mb-1">
            Linux Terminal Trainer v1.0.0 (Bash CLI Environment)
          </div>
          <div>Yordam olish uchun <code className="text-emerald-300">help</code> deb yozing yoki chapdagi topshiriqlarni bajaring.</div>
        </div>

        {/* Command history list */}
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {/* Input line */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-emerald-400 font-bold">user@linux-trainer</span>
              <span className="text-gray-400">:</span>
              <span className="text-sky-400 font-bold">{item.path}</span>
              <span className="text-emerald-400 font-bold">$</span>
              <span className="text-gray-100 font-semibold">{item.command}</span>
            </div>

            {/* Output line */}
            {item.output && (
              <pre className={`text-xs whitespace-pre-wrap pl-2 leading-relaxed ${
                item.isSuccess ? 'text-gray-300' : 'text-rose-400 font-medium'
              }`}>
                {item.output}
              </pre>
            )}

            {/* Task notification if any */}
            {item.notification && (
              <div className="my-1.5 p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
                <span>✨</span>
                <span>{item.notification}</span>
              </div>
            )}
          </div>
        ))}

        {/* Current Active Input Prompt */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold">user@linux-trainer</span>
          <span className="text-gray-400">:</span>
          <span className="text-sky-400 font-bold">{currentPathDisplay}</span>
          <span className="text-emerald-400 font-bold">$</span>
          
          <div className="flex-1 flex items-center relative">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none border-none text-emerald-200 caret-emerald-400 font-mono text-sm p-0 m-0"
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
