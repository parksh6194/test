import React, { useState } from "react";
import { Copy, Check, ShieldAlert, Compass, Sparkles, Utensils, Gift, Activity } from "lucide-react";
import { LuckyElements } from "../types";

interface LuckyBoardProps {
  lucky: LuckyElements;
}

export const LuckyBoard: React.FC<LuckyBoardProps> = ({ lucky }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyNumbers = () => {
    const text = lucky.luckyNumbers.join(", ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBiorhythmColor = (val: number) => {
    if (val >= 50) return "bg-emerald-500 text-emerald-300";
    if (val >= 0) return "bg-blue-500 text-blue-300";
    if (val >= -50) return "bg-amber-500 text-amber-300";
    return "bg-rose-500 text-rose-300";
  };

  return (
    <div className="rounded-3xl bg-[#0f0f1a] border border-white/5 p-4 sm:p-5 space-y-4 shadow-xl shadow-black/60">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif-kr text-sm font-bold text-amber-100 flex items-center">
          <Sparkles className="w-4 h-4 text-amber-400 mr-1.5" />
          오늘의 행운 비책 (Lucky Code)
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">맞춤 개운(開運) 정보</span>
      </div>

      {/* Lucky Numbers (Lottery balls) */}
      <div className="p-3.5 rounded-2xl bg-[#161625] border border-white/5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-amber-200">행운의 번호 (로또 & 길조 수)</span>
          <button
            id="copy-lucky-numbers-btn"
            onClick={handleCopyNumbers}
            className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-lg bg-[#1f1f33] hover:bg-[#272740] border border-white/10 text-slate-300 transition-colors active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>번호 복사</span>
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {lucky.luckyNumbers.map((num, i) => {
            const ballBg =
              num <= 10
                ? "from-amber-500 to-amber-700"
                : num <= 20
                ? "from-blue-500 to-blue-700"
                : num <= 30
                ? "from-rose-500 to-rose-700"
                : num <= 40
                ? "from-purple-500 to-purple-700"
                : "from-emerald-500 to-emerald-700";

            return (
              <div
                key={i}
                className={`aspect-square rounded-full bg-gradient-to-br ${ballBg} flex items-center justify-center font-black text-white text-xs sm:text-sm shadow-md shadow-black/50 border border-white/20`}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of Lucky Elements */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        {/* Lucky Color */}
        <div className="p-3 rounded-2xl bg-[#161625] border border-white/5 flex items-center space-x-2.5">
          <div
            className="w-8 h-8 rounded-xl flex-shrink-0 shadow-inner border border-white/20"
            style={{ backgroundColor: lucky.luckyColor.hex }}
          />
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 block font-medium">행운의 색상</span>
            <span className="text-xs font-bold text-slate-200 truncate block">{lucky.luckyColor.name}</span>
          </div>
        </div>

        {/* Lucky Direction */}
        <div className="p-3 rounded-2xl bg-[#161625] border border-white/5 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-500/25">
            <Compass className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 block font-medium">행운의 방향</span>
            <span className="text-xs font-bold text-slate-200 truncate block">{lucky.luckyDirection}</span>
          </div>
        </div>

        {/* Lucky Food */}
        <div className="p-3 rounded-2xl bg-[#161625] border border-white/5 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-300 flex items-center justify-center flex-shrink-0 border border-orange-500/25">
            <Utensils className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 block font-medium">추천 행운 음식</span>
            <span className="text-xs font-bold text-slate-200 truncate block">{lucky.luckyFood}</span>
          </div>
        </div>

        {/* Lucky Item */}
        <div className="p-3 rounded-2xl bg-[#161625] border border-white/5 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-300 flex items-center justify-center flex-shrink-0 border border-purple-500/25">
            <Gift className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 block font-medium">행운의 아이템</span>
            <span className="text-xs font-bold text-slate-200 truncate block">{lucky.luckyItem}</span>
          </div>
        </div>
      </div>

      {/* Caution Time */}
      <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-start space-x-2 text-xs">
        <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-rose-200 block">주의해야 할 시간대</span>
          <span className="text-rose-300/80 text-[11px] leading-tight block mt-0.5">{lucky.cautionTime}</span>
        </div>
      </div>

      {/* Biorhythm Section */}
      <div className="p-3.5 rounded-2xl bg-[#161625] border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-slate-300 flex items-center">
            <Activity className="w-3.5 h-3.5 mr-1 text-sky-400" />
            오늘의 바이오리듬 (생체 리듬)
          </span>
        </div>
        <div className="space-y-2">
          {/* Physical */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">신체 리듬 (활력/체력)</span>
              <span className="font-bold text-emerald-400">{lucky.biorhythm.physical > 0 ? `+${lucky.biorhythm.physical}%` : `${lucky.biorhythm.physical}%`}</span>
            </div>
            <div className="h-2 w-full bg-[#0f0f1a] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${Math.max(10, (lucky.biorhythm.physical + 100) / 2)}%` }}
              />
            </div>
          </div>
          {/* Emotional */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">감성 리듬 (기분/교감)</span>
              <span className="font-bold text-blue-400">{lucky.biorhythm.emotional > 0 ? `+${lucky.biorhythm.emotional}%` : `${lucky.biorhythm.emotional}%`}</span>
            </div>
            <div className="h-2 w-full bg-[#0f0f1a] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-blue-500 transition-all duration-700"
                style={{ width: `${Math.max(10, (lucky.biorhythm.emotional + 100) / 2)}%` }}
              />
            </div>
          </div>
          {/* Intellectual */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">지성 리듬 (판단/집중)</span>
              <span className="font-bold text-purple-400">{lucky.biorhythm.intellectual > 0 ? `+${lucky.biorhythm.intellectual}%` : `${lucky.biorhythm.intellectual}%`}</span>
            </div>
            <div className="h-2 w-full bg-[#0f0f1a] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-purple-500 transition-all duration-700"
                style={{ width: `${Math.max(10, (lucky.biorhythm.intellectual + 100) / 2)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
