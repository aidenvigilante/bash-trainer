import React, { useState } from 'react';
import { Terminal, Copy, Check, Search } from 'lucide-react';

export default function CheatSheet({ cheatSheetData, onInsertCommand, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(null);

  const handleCopy = (cmd) => {
    onInsertCommand(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  const filteredCategories = cheatSheetData.map(cat => ({
    ...cat,
    commands: cat.commands.filter(
      item => item.cmd.toLowerCase().includes(searchTerm.toLowerCase()) || 
              item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.commands.length > 0);

  return (
    <div className={`${theme.bgHeader} border-t ${theme.border} p-3 sm:p-4 text-xs font-mono select-none`}>
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <Terminal className={`w-3.5 h-3.5 ${theme.accent}`} />
          <span className={`font-bold uppercase tracking-wider text-[11px] ${theme.textMain}`}>
            Linux Bash Shpargalkasi
          </span>
          <span className={`text-[10px] ${theme.textDim} hidden md:inline`}>
            — buyruq ustiga bossangiz terminalga yoziladi
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className={`w-3 h-3 ${theme.textDim} absolute left-2.5 top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            placeholder="Buyruq qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${theme.bgCard} border ${theme.border} rounded-md pl-8 pr-3 py-1 text-xs ${theme.textMain} placeholder-gray-400 focus:outline-none focus:${theme.accentBorder}`}
          />
        </div>
      </div>

      {/* Grid of commands */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className={`${theme.bgCard} rounded-lg p-2.5 border ${theme.border}`}>
            <div className={`text-[10px] font-bold ${theme.accent} mb-1.5 border-b ${theme.border} pb-1`}>
              {cat.category}
            </div>
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {cat.commands.map((item, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => handleCopy(item.cmd)}
                  className={`w-full text-left p-1 rounded hover:${theme.bgSidebar} transition-colors flex items-center justify-between group border border-transparent`}
                >
                  <div className="truncate pr-1">
                    <span className={`font-bold mr-1.5 ${theme.accent}`}>{item.cmd}</span>
                    <span className={`text-[10px] ${theme.textDim}`}>{item.desc}</span>
                  </div>
                  <span className={`opacity-0 group-hover:opacity-100 ${theme.textDim} flex-shrink-0 transition-opacity`}>
                    {copiedCmd === item.cmd ? (
                      <Check className={`w-3 h-3 ${theme.accent}`} />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
