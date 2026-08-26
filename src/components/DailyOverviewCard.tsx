import React from "react";
import { Sparkles, Compass, Star, Bot, RefreshCw, ChevronRight } from "lucide-react";
import { DailyFortuneResult } from "../types";

interface DailyOverviewCardProps {
  fortune: DailyFortuneResult;
  userName: string;
  onFetchAiReading: () => void;
  isLoadingAi: boolean;
}

export const DailyOverviewCard: React.FC<DailyOverviewCardProps> = ({
  fortune,
  userName,
  onFetchAiReading,
  isLoadingAi,
}) => {
  const getGradeColor = (grade: string) => {
    if (grade.includes("대길")) return "from-amber-400 to-yellow-500 text-slate-950 border-amber-300";
    if (grade.includes("중길")) return "from-emerald-400 to-teal-500 text-slate-950 border-emerald-300";
    if (grade.includes("소길")) return "from-sky-400 to-blue-500 text-slate-950 border-sky-300";
    return "from-slate-300 to-slate-400 text-slate-950 border-slate-200";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 90) return "#fbbf24"; // amber
    if (score >= 80) return "#34d399"; // emerald
    if (score >= 70) return "#60a5fa"; // blue
    return "#a78bfa"; // purple
  };

  // SVG circular gauge calculation
  const strokeWidth = 8;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (fortune.overallScore / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0f0f1a] border border-white/5 p-5 shadow-2xl shadow-black/80">
      {/* Background Ambient Celestial Glow */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#161625] text-amber-300 border border-amber-500/20 flex items-center font-medium">
            <Compass className="w-3 h-3 mr-1 text-amber-400" />
            {fortune.zodiacAnimal}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#161625] text-sky-300 border border-sky-500/20 flex items-center font-medium">
            <Star className="w-3 h-3 mr-1 text-sky-400" />
            {fortune.starSign}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#161625] text-emerald-300 border border-emerald-500/20 font-medium">
            {fortune.zodiacElement}
          </span>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r ${getGradeColor(fortune.grade)} shadow-md border`}>
          {fortune.grade}
        </span>
      </div>

      {/* Main Score & Headline Area */}
      <div className="flex items-center justify-between gap-4 my-2">
        {/* Left: Headline & Key Summary */}
        <div className="flex-1 space-y-1.5">
          <p className="text-xs text-amber-400/90 font-medium flex items-center tracking-wide">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {fortune.koreanDateText} 총운
          </p>
          <h2 className="font-serif-kr text-base sm:text-lg font-bold text-amber-100/95 leading-snug tracking-tight">
            "{fortune.summaryHeadline}"
          </h2>
        </div>

        {/* Right: Circular Score Meter */}
        <div className="relative flex-shrink-0 w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 110 110">
            {/* Background circle */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-[#161625]"
            />
            {/* Progress circle */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke={getScoreProgressColor(fortune.overallScore)}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-amber-200 tracking-tighter leading-none font-serif-kr">
              {fortune.overallScore}
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">운세 지수</span>
          </div>
        </div>
      </div>

      {/* Detailed Overview text */}
      <div className="mt-3.5 p-3.5 rounded-2xl bg-[#161625] border border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
        {fortune.overview}
      </div>

      {/* Master Advice */}
      <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#161625] to-[#161625] border-l-2 border-amber-400 border-y border-r border-white/5 text-xs text-amber-200/95 flex items-start space-x-2">
        <span className="font-serif-kr font-bold text-amber-400 whitespace-nowrap text-xs mt-0.5">도사의 지침:</span>
        <span className="leading-snug">{fortune.masterAdvice}</span>
      </div>

      {/* AI Fortune Deep Analysis Button */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="text-[11px] text-slate-400 flex items-center">
          <Bot className="w-3.5 h-3.5 mr-1 text-amber-400" />
          <span>{fortune.isAiEnhanced ? "AI 명리학 심층 분석 완료" : "더 정밀한 AI 심층 해설이 필요하신가요?"}</span>
        </div>
        <button
          id="ai-reading-btn"
          onClick={onFetchAiReading}
          disabled={isLoadingAi}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#050508] text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoadingAi ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>명리 분석 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{fortune.isAiEnhanced ? "AI 재분석" : "AI 심층 사주"}</span>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
