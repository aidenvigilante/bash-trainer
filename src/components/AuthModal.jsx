import React, { useState } from 'react';
import { Terminal, Lock, User, UserPlus, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { authService } from '../utils/authService';

export default function AuthModal({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      const res = authService.register(name, loginInput, password);
      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setError(res.message);
      }
    } else {
      const res = authService.login(loginInput, password);
      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070a0d]/90 backdrop-blur-md p-4 font-mono select-none">
      <div className="bg-[#0f151c] border border-[#1f2d3a] rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-[0_0_50px_rgba(0,255,102,0.15)] relative">
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <Terminal className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Bash<span className="text-emerald-400">Learn</span> Kabineti
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isRegister
              ? "Yangi o'quvchi hisobini oching"
              : "Shaxsiy kabinetingizga kiring (eMaktab uslubida)"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1">
                To'liq Ism-Familiya
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Masalan: Ali Valiyev"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#151d27] border border-[#233242] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-300 font-semibold mb-1">
              Login (Foydalanuvchi nomi)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="login123"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full bg-[#151d27] border border-[#233242] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-300 font-semibold mb-1">
              Parol
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#151d27] border border-[#233242] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)]"
          >
            {isRegister ? (
              <>
                <UserPlus className="w-4 h-4" /> Ro'yxatdan o'tish
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Tizimga kirish
              </>
            )}
          </button>
        </form>

        {/* Toggle Register/Login */}
        <div className="mt-6 pt-4 border-t border-[#1e2a37] text-center">
          <p className="text-xs text-gray-400">
            {isRegister ? "Akkauntingiz bormi?" : "Hali hisobingiz yo'qmi?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-emerald-400 hover:underline font-bold ml-1"
            >
              {isRegister ? "Kirish" : "Yangi hisob ochish"}
            </button>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
          <span>Barcha natijalar faqat o'z qurilmangizda saqlanadi</span>
        </div>
      </div>
    </div>
  );
}
