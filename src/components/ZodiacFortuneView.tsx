import React, { useState } from "react";
import { Sparkles, Heart, AlertCircle, Calendar } from "lucide-react";
import { ZodiacAnimalInfo } from "../types";

interface ZodiacFortuneViewProps {
  zodiacList: ZodiacAnimalInfo[];
  userZodiacAnimal?: string;
}

export const ZodiacFortuneView: React.FC<ZodiacFortuneViewProps> = ({
  zodiacList,
  userZodiacAnimal,
}) => {
  // Find initial index matching user's zodiac
  const initialIndex = Math.max(
    0,
    zodiacList.findIndex((z) => userZodiacAnimal && z.name.includes(userZodiacAnimal.replace("띠", "")))
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex >= 0 ? initialIndex : 0);

  const current = zodiacList[selectedIndex] || zodiacList[0];

  return (
    <div className="space-y-4">
      {/* 12 Zodiac Animal Horizontal Selector */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-serif-kr text-sm font-bold text-amber-100 flex items-center">
            <Sparkles className="w-4 h-4 text-amber-400 mr-1" />
            12간지 띠별 운세
          </h3>
          <span className="text-[11px] text-slate-400">원하는 띠를 터치하세요</span>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar px-0.5">
          {zodiacList.map((z, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={z.id}
                onClick={() => setSelectedIndex(idx)}
                className={`flex-shrink-0 flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all active:scale-95 min-w-[62px] ${
                  isSelected
                    ? "bg-gradient-to-b from-amber-500/20 via-[#161625] to-[#161625] border-amber-400/80 text-amber-200 shadow-md shadow-amber-500/20"
                    : "bg-[#0f0f1a] border-white/5 text-slate-400 hover:bg-[#161625]"
                }`}
              >
                <span className="text-2xl mb-1">{z.emoji}</span>
                <span className="text-xs font-bold whitespace-nowrap">{z.name}</span>
                <span className="text-[10px] text-slate-500">{z.hanja.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Zodiac Detail Card */}
      <div className="rounded-3xl bg-[#0f0f1a] border border-white/5 p-5 space-y-4 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#161625] border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
              {current.emoji}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-serif-kr text-lg font-bold text-amber-100">{current.name}</h4>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#161625] text-amber-300 border border-white/10">
                  {current.hanja}
                </span>
                <span className="text-xs text-slate-400 font-medium">{current.element}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{current.personality}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-amber-200 font-serif-kr">{current.todayScore}</span>
            <span className="text-xs text-slate-400 font-medium block">오늘의 점수</span>
          </div>
        </div>

        {/* Today Summary */}
        <div className="p-3 rounded-2xl bg-[#161625] border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed">
          {current.todaySummary}
        </div>

        {/* Compatibility info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#161625] border border-white/5 flex items-center space-x-2">
            <Heart className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">잘 맞는 띠 (상생)</span>
              <span className="text-xs font-semibold text-rose-200">{current.compatibleAnimals.join(", ")}</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#161625] border border-white/5 flex items-center space-x-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">주의할 띠 (상극)</span>
              <span className="text-xs font-semibold text-amber-200">{current.incompatibleAnimals.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Age-Specific Fortunes Table */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-amber-400" />
              출생년도별 오늘 맞춤 운세
            </span>
          </div>

          <div className="space-y-2">
            {current.ageFortunes.map((af) => (
              <div
                key={af.birthYear}
                className="p-3 rounded-xl bg-[#161625] border border-white/5 flex items-start justify-between space-x-3 text-xs"
              >
                <div className="flex-shrink-0">
                  <span className="font-bold text-amber-300 block">{af.birthYear}년생</span>
                  <span className="text-[11px] text-slate-400">{af.ganji} ({af.age}세)</span>
                </div>
                <div className="flex-1 text-slate-300 leading-snug">
                  {af.fortune}
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className={`font-black ${af.score >= 85 ? "text-amber-300" : af.score >= 70 ? "text-emerald-300" : "text-slate-400"}`}>
                    {af.score}점
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
