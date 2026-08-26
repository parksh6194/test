import React from "react";
import { Sparkles, User, Calendar as CalendarIcon, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  profile: UserProfile;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onOpenProfile: () => void;
  onOpenShare: () => void;
  zodiacAnimal: string;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentDate,
  onDateChange,
  onOpenProfile,
  onOpenShare,
  zodiacAnimal,
}) => {
  const isToday = new Date().toDateString() === currentDate.toDateString();

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d);
  };

  const handleResetToday = () => {
    onDateChange(new Date());
  };

  const dateDisplay = currentDate.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <header className="sticky top-0 z-30 bg-[#0f0f1a]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 shadow-md shadow-black/40">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo & Profile Indicator */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/90 to-amber-700/90 flex items-center justify-center shadow-md shadow-amber-500/20 border border-amber-300/30">
            <Sparkles className="w-4 h-4 text-[#050508]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-serif-kr text-sm sm:text-base font-bold text-amber-100/90 tracking-tight">오늘의 운세</h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                {zodiacAnimal}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              <span className="text-amber-200 font-medium">{profile.name}</span>님의 하루 길흉화복
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            id="header-share-btn"
            onClick={onOpenShare}
            aria-label="운세 공유하기"
            className="w-8 h-8 rounded-full bg-[#161625] hover:bg-[#1f1f33] border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-300 transition-colors active:scale-95 shadow-sm"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            aria-label="사주 프로필 설정"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-[#161625] hover:bg-[#1f1f33] border border-amber-500/30 text-amber-200 text-xs font-medium transition-all active:scale-95 shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>내 사주</span>
          </button>
        </div>
      </div>

      {/* Date Navigator Bar */}
      <div className="max-w-md mx-auto mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
        <button
          onClick={handlePrevDay}
          className="flex items-center space-x-1 text-slate-400 hover:text-amber-300 transition-colors py-1 px-2 rounded-lg active:bg-[#161625]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>어제</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-200 tracking-tight">{dateDisplay}</span>
          {!isToday && (
            <button
              onClick={handleResetToday}
              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/20 font-medium transition-colors"
            >
              오늘로
            </button>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="flex items-center space-x-1 text-slate-400 hover:text-amber-300 transition-colors py-1 px-2 rounded-lg active:bg-[#161625]"
        >
          <span>내일</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
