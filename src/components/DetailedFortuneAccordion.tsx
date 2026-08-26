import React, { useState } from "react";
import { Coins, Heart, Briefcase, HeartPulse, Users, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { DailyFortuneResult, FortuneCategoryDetail } from "../types";

interface DetailedFortuneAccordionProps {
  fortune: DailyFortuneResult;
}

export const DetailedFortuneAccordion: React.FC<DetailedFortuneAccordionProps> = ({ fortune }) => {
  const [openSection, setOpenSection] = useState<string | null>("wealth");

  const categories: {
    key: string;
    icon: React.ReactNode;
    color: string;
    bgAccent: string;
    data: FortuneCategoryDetail;
  }[] = [
    {
      key: "wealth",
      icon: <Coins className="w-4 h-4 text-amber-400" />,
      color: "text-amber-400",
      bgAccent: "from-amber-500/20 to-amber-950/40",
      data: fortune.wealth,
    },
    {
      key: "love",
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      color: "text-rose-400",
      bgAccent: "from-rose-500/20 to-rose-950/40",
      data: fortune.love,
    },
    {
      key: "career",
      icon: <Briefcase className="w-4 h-4 text-blue-400" />,
      color: "text-blue-400",
      bgAccent: "from-blue-500/20 to-blue-950/40",
      data: fortune.career,
    },
    {
      key: "health",
      icon: <HeartPulse className="w-4 h-4 text-emerald-400" />,
      color: "text-emerald-400",
      bgAccent: "from-emerald-500/20 to-emerald-950/40",
      data: fortune.health,
    },
    {
      key: "relations",
      icon: <Users className="w-4 h-4 text-purple-400" />,
      color: "text-purple-400",
      bgAccent: "from-purple-500/20 to-purple-950/40",
      data: fortune.relations,
    },
  ];

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-serif-kr text-sm font-bold text-amber-100">분야별 상세 운세</h3>
        <span className="text-[11px] text-slate-400">카드를 눌러 상세 조언 확인</span>
      </div>

      <div className="space-y-2">
        {categories.map(({ key, icon, color, bgAccent, data }) => {
          const isOpen = openSection === key;

          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl bg-[#0f0f1a] border border-white/5 transition-all shadow-md shadow-black/40"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(key)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#161625]/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#161625] border border-white/10 flex items-center justify-center shadow-inner">
                    {icon}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-200 block">{data.title}</span>
                    <span className="text-[11px] text-slate-400 font-medium">상태: {data.level}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className={`text-sm font-black ${color}`}>{data.score}점</span>
                  </div>
                  <div className="text-slate-500">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1.5 border-t border-white/5 bg-[#161625]/50 text-xs sm:text-sm space-y-3 animate-in fade-in duration-200">
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-[#050508] rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                      style={{ width: `${data.score}%` }}
                    />
                  </div>

                  {/* Fortune explanation */}
                  <p className="text-slate-300 leading-relaxed font-normal">{data.text}</p>

                  {/* Practical tip */}
                  <div className="p-2.5 rounded-xl bg-[#0f0f1a] border border-white/5 flex items-start space-x-2 text-xs">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-slate-300">
                      <span className="font-semibold text-amber-300 mr-1">오늘의 실천 팁:</span>
                      <span>{data.tip}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
