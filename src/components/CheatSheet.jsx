import React, { useState } from 'react';
import { Terminal, Copy, Check, Search, ExternalLink } from 'lucide-react';

export default function CheatSheet({ cheatSheetData, onInsertCommand }) {
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
    <div className="bg-[#0c1014] border-t border-[#1f2b34] p-4 text-xs font-mono">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">
            Linux Bash Shpargalkasi (Cheat Sheet)
          </span>
          <span className="text-gray-500 text-[10px]">
            — buyruq ustiga bossangiz terminalga yoziladi
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buyruq yoki tavsif bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141b21] border border-[#212c36] rounded-md pl-8 pr-3 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of commands */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className="bg-[#11171d] rounded-lg p-3 border border-[#1b2630]">
            <div className="text-[11px] font-bold text-emerald-400 mb-2 border-b border-[#1b2630] pb-1">
              {cat.category}
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {cat.commands.map((item, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => handleCopy(item.cmd)}
                  className="w-full text-left p-1.5 rounded hover:bg-[#18222b] transition-colors flex items-center justify-between group border border-transparent hover:border-[#273644]"
                >
                  <div className="truncate pr-2">
                    <span className="text-emerald-300 font-bold mr-1.5">{item.cmd}</span>
                    <span className="text-gray-400 text-[10px]">{item.desc}</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 text-gray-400 flex-shrink-0 transition-opacity">
                    {copiedCmd === item.cmd ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
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
