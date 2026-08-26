import React, { useState } from "react";
import { X, Copy, Check, Share2, Sparkles } from "lucide-react";
import { DailyFortuneResult, UserProfile } from "../types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fortune: DailyFortuneResult;
  profile: UserProfile;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  fortune,
  profile,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `✨ [${fortune.koreanDateText} 오늘의 운세] ✨
👤 대상: ${profile.name} (${fortune.zodiacAnimal} / ${fortune.starSign})
🌟 총운 점수: ${fortune.overallScore}점 [${fortune.grade}]

"${fortune.summaryHeadline}"

💰 재물운: ${fortune.wealth.score}점 (${fortune.wealth.level})
❤️ 애정운: ${fortune.love.score}점 (${fortune.love.level})
💼 직장운: ${fortune.career.score}점 (${fortune.career.level})
🍀 행운 번호: ${fortune.luckyElements.luckyNumbers.join(", ")}
🎨 행운 색상: ${fortune.luckyElements.luckyColor.name}
🍱 추천 음식: ${fortune.luckyElements.luckyFood}

#오늘의운세 #사주 #타로 #행운`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `오늘의 운세 - ${profile.name}님의 하루`,
          text: shareText,
        });
      } catch (e) {
        console.log("Share cancelled or failed:", e);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0f0f1a] border border-white/5 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0f0f1a]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-[#161625] border border-amber-500/30 text-amber-300 shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-kr text-base font-bold text-amber-100">운세 카드 공유하기</h2>
              <p className="text-xs text-slate-400">카카오톡, SNS, 메시지로 오늘의 운세를 공유하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-full hover:bg-[#161625] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Preview Card */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs bg-[#050508]/40">
          <div className="p-4 rounded-2xl bg-[#161625] border border-white/5 space-y-2 text-slate-200 font-sans shadow-xl">
            <div className="flex items-center justify-between text-amber-200 font-bold border-b border-white/5 pb-2">
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                {fortune.koreanDateText}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#0f0f1a] text-[11px] text-amber-200 border border-amber-500/30 font-semibold">
                {fortune.grade} ({fortune.overallScore}점)
              </span>
            </div>

            <div className="pt-1">
              <span className="text-slate-400 block text-[11px]">
                {profile.name}님 ({fortune.zodiacAnimal} • {fortune.starSign})
              </span>
              <p className="font-serif-kr font-bold text-amber-100 text-sm mt-1 leading-snug">
                "{fortune.summaryHeadline}"
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 text-[11px] space-y-1 text-slate-300">
              <div>💰 <strong>재물운:</strong> {fortune.wealth.score}점 ({fortune.wealth.level})</div>
              <div>❤️ <strong>애정운:</strong> {fortune.love.score}점 ({fortune.love.level})</div>
              <div>🍀 <strong>행운번호:</strong> {fortune.luckyElements.luckyNumbers.join(", ")}</div>
              <div>🎨 <strong>행운색:</strong> {fortune.luckyElements.luckyColor.name}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="py-3 rounded-xl bg-[#161625] hover:bg-[#1f1f33] text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 border border-white/10 active:scale-95 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? "복사 완료!" : "텍스트 복사"}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>SNS / 카톡 공유</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
