import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, RefreshCw, Copy, Check, Shield, Download } from "lucide-react";
import { FORTUNE_COOKIES } from "../data/fortuneCookieData";
import { LUCKY_AMULETS } from "../data/amuletsData";
import { FortuneCookieItem, LuckyAmulet } from "../types";

export const FortuneCookieView: React.FC<{ userName: string }> = ({ userName }) => {
  const [subTab, setSubTab] = useState<"cookie" | "amulet">("cookie");
  const [isCracking, setIsCracking] = useState(false);
  const [isCracked, setIsCracked] = useState(false);
  const [currentCookie, setCurrentCookie] = useState<FortuneCookieItem>(FORTUNE_COOKIES[0]);
  const [selectedAmulet, setSelectedAmulet] = useState<LuckyAmulet>(LUCKY_AMULETS[0]);
  const [customWish, setCustomWish] = useState("");
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleCrackCookie = () => {
    if (isCracking) return;
    setIsCracking(true);

    if ("vibrate" in navigator) {
      navigator.vibrate([30, 50, 80]);
    }

    setTimeout(() => {
      // Pick random cookie
      const random = FORTUNE_COOKIES[Math.floor(Math.random() * FORTUNE_COOKIES.length)];
      setCurrentCookie(random);
      setIsCracked(true);
      setIsCracking(false);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#d97706", "#fef3c7"],
      });
    }, 500);
  };

  const handleResetCookie = () => {
    setIsCracked(false);
    setIsCracking(false);
  };

  const handleCopyFortuneSlip = () => {
    const text = `[오늘의 포춘쿠키 행운 메시지]
"${currentCookie.message}"
- 키워드: ${currentCookie.luckyKeyword} / 행운수: ${currentCookie.luckyNumber}
- 미션: ${currentCookie.actionMission}`;
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Sub-tab Switcher */}
      <div className="flex bg-[#0f0f1a] border border-white/5 rounded-2xl p-1 max-w-xs mx-auto shadow-inner">
        <button
          onClick={() => setSubTab("cookie")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            subTab === "cookie"
              ? "bg-[#161625] text-amber-200 border border-amber-500/30 shadow-md shadow-amber-500/10"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🥠 포춘쿠키 쪼개기
        </button>
        <button
          onClick={() => setSubTab("amulet")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            subTab === "amulet"
              ? "bg-[#161625] text-amber-200 border border-amber-500/30 shadow-md shadow-amber-500/10"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          📜 디지털 행운 부적
        </button>
      </div>

      {subTab === "cookie" ? (
        /* FORTUNE COOKIE SECTION */
        <div className="rounded-3xl bg-[#0f0f1a] border border-white/5 p-5 text-center space-y-4 shadow-2xl shadow-black/80">
          <div>
            <h3 className="font-serif-kr text-base font-bold text-amber-100">오늘의 포춘쿠키 (Fortune Cookie)</h3>
            <p className="text-xs text-slate-400 mt-0.5">바삭한 포춘쿠키를 터치해 오늘의 행운 메시지를 열어보세요</p>
          </div>

          {/* Cookie Visual Interactive Area */}
          <div className="py-6 flex flex-col items-center justify-center min-h-[190px]">
            {!isCracked ? (
              <button
                id="crack-cookie-btn"
                onClick={handleCrackCookie}
                disabled={isCracking}
                className={`relative group transition-all duration-300 transform active:scale-95 ${
                  isCracking ? "animate-bounce scale-110" : "hover:scale-105"
                }`}
              >
                {/* Visual Cookie Icon */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-2xl shadow-amber-500/30 border-4 border-amber-200/60">
                  <span className="text-5xl select-none filter drop-shadow">🥠</span>
                </div>
                <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-[#161625] border border-amber-400/40 text-amber-200 text-xs font-bold animate-pulse shadow-md">
                  터치하여 쿠키 열기!
                </div>
              </button>
            ) : (
              /* CRACKED PAPER SLIP */
              <div className="w-full max-w-sm space-y-3 animate-in zoom-in-95 duration-400">
                {/* Paper slip styled card */}
                <div className="relative p-5 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 text-slate-900 shadow-2xl border-2 border-amber-300 text-left space-y-3 font-serif-kr">
                  {/* Decorative stamp */}
                  <div className="absolute top-3 right-3 text-rose-700/60 font-black text-xs border border-rose-700/60 px-1.5 py-0.5 rounded rotate-12">
                    大吉
                  </div>

                  <div className="text-xs text-amber-900/70 font-sans font-bold flex items-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 mr-1" />
                    {userName}님을 위한 오늘의 행운 전언
                  </div>

                  <p className="text-base font-bold text-slate-900 leading-relaxed">
                    "{currentCookie.message}"
                  </p>

                  <div className="pt-2 border-t border-amber-300/80 flex items-center justify-between text-xs font-sans text-amber-950">
                    <div>
                      <span className="text-amber-800 font-semibold mr-1">행운 키워드:</span>
                      <span className="font-bold text-rose-700">#{currentCookie.luckyKeyword}</span>
                    </div>
                    <div>
                      <span className="text-amber-800 font-semibold mr-1">행운 번호:</span>
                      <span className="font-black text-amber-900">{currentCookie.luckyNumber}</span>
                    </div>
                  </div>

                  {/* Daily micro mission */}
                  <div className="p-2.5 rounded-xl bg-amber-200/70 border border-amber-300 text-xs text-amber-950 font-sans">
                    <span className="font-bold text-amber-900 mr-1">🎯 오늘의 미션:</span>
                    <span>{currentCookie.actionMission}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center space-x-2 pt-1">
                  <button
                    onClick={handleCopyFortuneSlip}
                    className="px-3.5 py-2 rounded-xl bg-[#161625] hover:bg-[#1f1f33] text-slate-200 text-xs font-medium flex items-center space-x-1.5 active:scale-95 transition-all border border-white/10"
                  >
                    {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedMessage ? "복사 완료!" : "메시지 복사"}</span>
                  </button>
                  <button
                    onClick={handleResetCookie}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#050508] text-xs font-bold flex items-center space-x-1.5 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>새 쿠키 뽑기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* LUCKY AMULETS (부적) SECTION */
        <div className="rounded-3xl bg-[#0f0f1a] border border-white/5 p-5 space-y-4 shadow-2xl shadow-black/80">
          <div>
            <h3 className="font-serif-kr text-base font-bold text-amber-100">디지털 소원 성취 부적 (Amulets)</h3>
            <p className="text-xs text-slate-400 mt-0.5">내 소원에 맞는 신령한 부적을 선택하여 길운을 채우세요</p>
          </div>

          {/* Amulets Carousel */}
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar px-0.5">
            {LUCKY_AMULETS.map((amulet) => {
              const isSelected = selectedAmulet.id === amulet.id;
              return (
                <button
                  key={amulet.id}
                  onClick={() => setSelectedAmulet(amulet)}
                  className={`flex-shrink-0 p-2.5 rounded-2xl border text-left transition-all active:scale-95 min-w-[120px] ${
                    isSelected
                      ? "bg-gradient-to-b from-amber-500/20 to-[#161625] border-amber-400/80 text-amber-200 shadow-md shadow-amber-500/20"
                      : "bg-[#161625] border-white/5 text-slate-400 hover:bg-[#1c1c30]"
                  }`}
                >
                  <span className="text-xs font-bold block">{amulet.title.split(" ")[0]}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{amulet.hanja}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Wish Input */}
          <div className="p-3 rounded-2xl bg-[#161625] border border-white/5 space-y-1">
            <label className="text-xs text-amber-200/90 font-medium">부적에 새길 나의 특별한 소원 (선택)</label>
            <input
              type="text"
              value={customWish}
              onChange={(e) => setCustomWish(e.target.value)}
              placeholder="예: 올해 원하는 시험 무조건 합격하기 / 대박 나기"
              maxLength={25}
              className="w-full bg-[#0f0f1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/70"
            />
          </div>

          {/* The Talisman Visual Display */}
          <div
            className={`p-6 rounded-3xl bg-gradient-to-b ${selectedAmulet.bgGradient} border-2 border-amber-400/70 shadow-2xl relative overflow-hidden text-center space-y-4`}
          >
            {/* Background seal stamp */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none text-9xl font-serif-kr font-black text-amber-400">
              {selectedAmulet.hanja.slice(0, 2)}
            </div>

            {/* Talisman Header */}
            <div className="relative z-10 space-y-1">
              <span className="text-xs tracking-widest text-amber-400 font-cinzel font-bold">SACRED TALISMAN</span>
              <h4 className="font-serif-kr text-xl font-bold text-amber-200">{selectedAmulet.title}</h4>
              <p className="text-xs text-slate-300">{selectedAmulet.subtitle}</p>
            </div>

            {/* Inscription Box */}
            <div className="relative z-10 p-4 rounded-2xl bg-black/60 border border-amber-400/40 backdrop-blur-sm space-y-2">
              <div className="font-serif-kr text-2xl font-black text-amber-300 tracking-wider">
                {selectedAmulet.hanja}
              </div>
              <p className="text-xs text-amber-100/90 font-serif-kr leading-relaxed">
                "{selectedAmulet.talismanText}"
              </p>
              {customWish && (
                <div className="mt-2 pt-2 border-t border-amber-500/30 text-xs text-rose-300 font-bold">
                  소원자 [{userName}]: "{customWish}"
                </div>
              )}
            </div>

            {/* Seal & blessing footer */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-amber-300/80 pt-1">
              <span>수호자: {userName}</span>
              <div className="w-8 h-8 rounded-lg bg-rose-600/80 border border-rose-400 flex items-center justify-center font-serif-kr text-white font-bold text-xs shadow-md">
                대길
              </div>
              <span>기운: 상생보호</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
