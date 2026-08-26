import React, { useState } from "react";
import { Sparkles, Heart, Coins, Users, Compass } from "lucide-react";
import { ConstellationInfo } from "../types";

interface ConstellationViewProps {
  constellations: ConstellationInfo[];
  userStarSign?: string;
}

export const ConstellationView: React.FC<ConstellationViewProps> = ({
  constellations,
  userStarSign,
}) => {
  const initialIndex = Math.max(
    0,
    constellations.findIndex((c) => userStarSign && c.name.includes(userStarSign.replace("자리", "")))
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex >= 0 ? initialIndex : 0);

  const current = constellations[selectedIndex] || constellations[0];

  const getElementBadgeColor = (el: string) => {
    if (el === "불") return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    if (el === "물") return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    if (el === "바람") return "bg-sky-500/20 text-sky-300 border-sky-500/30";
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"; // 흙
  };

  return (
    <div className="space-y-4">
      {/* Selector */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-serif-kr text-sm font-bold text-amber-100 flex items-center">
            <Sparkles className="w-4 h-4 text-amber-400 mr-1" />
            12 별자리 운세 (Horoscope)
          </h3>
          <span className="text-[11px] text-slate-400">별자리를 선택하세요</span>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar px-0.5">
          {constellations.map((c, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedIndex(idx)}
                className={`flex-shrink-0 flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all active:scale-95 min-w-[64px] ${
                  isSelected
                    ? "bg-gradient-to-b from-sky-500/20 via-[#161625] to-[#161625] border-sky-400/80 text-sky-200 shadow-md shadow-sky-500/20"
                    : "bg-[#0f0f1a] border-white/5 text-slate-400 hover:bg-[#161625]"
                }`}
              >
                <span className="text-2xl mb-1">{c.symbol}</span>
                <span className="text-xs font-bold whitespace-nowrap">{c.name}</span>
                <span className="text-[10px] text-slate-500">{c.dateRange.split("~")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Card */}
      <div className="rounded-3xl bg-[#0f0f1a] border border-white/5 p-5 space-y-4 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#161625] border border-sky-500/30 flex items-center justify-center text-3xl shadow-inner text-sky-200">
              {current.symbol}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-serif-kr text-lg font-bold text-sky-100">{current.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${getElementBadgeColor(current.element)}`}>
                  {current.element}의 원소
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {current.dateRange} • 수호성: {current.rulingPlanet}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-sky-300 font-serif-kr">{current.todayScore}</span>
            <span className="text-xs text-slate-400 font-medium block">별자리 지수</span>
          </div>
        </div>

        {/* Keyword pill */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#161625] border border-sky-500/20 text-sky-200 text-xs font-semibold">
          오늘의 테마: {current.keyword}
        </div>

        {/* Main Star Fortune */}
        <div className="p-3.5 rounded-2xl bg-[#161625] border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed">
          {current.todayFortune}
        </div>

        {/* Love & Money breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-[#161625] border border-white/5 space-y-1">
            <div className="flex items-center space-x-1.5 text-rose-300 font-semibold mb-1">
              <Heart className="w-3.5 h-3.5" />
              <span>별자리 애정운</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{current.loveFortune}</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#161625] border border-white/5 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-300 font-semibold mb-1">
              <Coins className="w-3.5 h-3.5" />
              <span>별자리 금전운</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{current.moneyFortune}</p>
          </div>
        </div>

        {/* Match Partners */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-[#161625] border border-white/5 flex items-center space-x-2">
            <Users className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">오늘의 천생연분</span>
              <span className="text-xs font-semibold text-sky-200">{current.luckyPartner}</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#161625] border border-white/5 flex items-center space-x-2">
            <Compass className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">행운의 별빛 색상</span>
              <span className="text-xs font-semibold text-amber-200">{current.luckyColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
