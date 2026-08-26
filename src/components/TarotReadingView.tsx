import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, RotateCw, HelpCircle, Bot, Check, ArrowRight, Layers } from "lucide-react";
import { TAROT_CARDS } from "../data/tarotData";
import { TarotCard } from "../types";

export const TarotReadingView: React.FC = () => {
  const [spreadMode, setSpreadMode] = useState<"single" | "three">("single");
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [isFlippedList, setIsFlippedList] = useState<boolean[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [aiReadingResult, setAiReadingResult] = useState<any | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Trigger shuffle & draw
  const handleShuffleAndDraw = () => {
    setIsShuffling(true);
    setDrawnCards([]);
    setIsFlippedList([]);
    setAiReadingResult(null);

    // Vibration feedback
    if ("vibrate" in navigator) {
      navigator.vibrate([40, 60, 40]);
    }

    setTimeout(() => {
      // Pick randomly
      const count = spreadMode === "single" ? 1 : 3;
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count).map((card) => ({
        ...card,
        isReversed: Math.random() < 0.25, // 25% chance reversed
      }));

      setDrawnCards(selected);
      setIsFlippedList(new Array(count).fill(false));
      setIsShuffling(false);
    }, 600);
  };

  const handleFlipCard = (index: number) => {
    if (isFlippedList[index]) return;
    const nextList = [...isFlippedList];
    nextList[index] = true;
    setIsFlippedList(nextList);

    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    // Confetti effect on all cards revealed
    if (nextList.every((v) => v)) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#38bdf8", "#ec4899", "#a855f7"],
      });
    }
  };

  const handleAskAiTarot = async () => {
    if (drawnCards.length === 0) return;
    setIsLoadingAi(true);
    try {
      const response = await fetch("/api/fortune/tarot-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion || "오늘 하루 저에게 필요한 지혜와 조언을 알려주세요.",
          cards: drawnCards.map((c) => ({
            name: `${c.nameKo} (${c.nameEn})`,
            isReversed: c.isReversed,
            keywords: c.keywords.join(", "),
          })),
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setAiReadingResult(data.data);
      }
    } catch (e) {
      console.error("AI tarot error:", e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const spreadLabels = spreadMode === "single" ? ["오늘의 운세 카드"] : ["과거 (원인)", "현재 (상황)", "조언 (미래)"];

  return (
    <div className="space-y-4">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h3 className="font-serif-kr text-sm font-bold text-amber-100 flex items-center">
            <Sparkles className="w-4 h-4 text-purple-400 mr-1.5" />
            신비로운 타로 리딩 (Tarot Oracle)
          </h3>
          <p className="text-[11px] text-slate-400">마음을 가다듬고 카드를 뽑아 신탁을 확인하세요</p>
        </div>

        {/* 1-card / 3-card toggle */}
        <div className="flex bg-[#0f0f1a] border border-white/5 rounded-xl p-1 self-start sm:self-auto shadow-inner">
          <button
            onClick={() => {
              setSpreadMode("single");
              setDrawnCards([]);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              spreadMode === "single"
                ? "bg-purple-600/25 text-purple-200 border border-purple-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            1장 (오늘의 운)
          </button>
          <button
            onClick={() => {
              setSpreadMode("three");
              setDrawnCards([]);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              spreadMode === "three"
                ? "bg-purple-600/25 text-purple-200 border border-purple-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            3장 (심층 스프레드)
          </button>
        </div>
      </div>

      {/* Optional User Question Box */}
      <div className="p-3.5 rounded-2xl bg-[#0f0f1a] border border-white/5 space-y-1.5 shadow-lg shadow-black/40">
        <label className="text-xs text-amber-200/90 font-medium flex items-center">
          <HelpCircle className="w-3.5 h-3.5 mr-1 text-purple-400" />
          타로 카드에 묻고 싶은 질문 (선택 사항)
        </label>
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder="예: 오늘 중요한 미팅이 있는데 잘 될까요? / 연애운은 어떨까요?"
          className="w-full bg-[#161625] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
        />
      </div>

      {/* Draw / Shuffle Action Area */}
      <div className="text-center py-2">
        <button
          id="shuffle-tarot-btn"
          onClick={handleShuffleAndDraw}
          disabled={isShuffling}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-[#050508] font-bold text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isShuffling ? "animate-spin" : ""}`} />
          <span>{drawnCards.length === 0 ? "카드 셔플 & 운명의 카드 뽑기" : "다시 셔플하여 뽑기"}</span>
        </button>
      </div>

      {/* Drawn Cards Display */}
      {drawnCards.length > 0 && (
        <div className="space-y-4">
          <div className={`grid gap-3 ${spreadMode === "single" ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-1 sm:grid-cols-3"}`}>
            {drawnCards.map((card, idx) => {
              const isFlipped = isFlippedList[idx];
              const label = spreadLabels[idx];

              return (
                <div key={card.id + "-" + idx} className="flex flex-col items-center space-y-2">
                  <span className="text-xs font-semibold text-amber-200 px-2.5 py-0.5 rounded-full bg-[#161625] border border-white/10">
                    {label}
                  </span>

                  {/* 3D Flippable Card Container */}
                  <div
                    onClick={() => handleFlipCard(idx)}
                    className="w-full aspect-[2/3] max-w-[220px] cursor-pointer perspective-1000 select-none group"
                  >
                    <div
                      className={`relative w-full h-full rounded-2xl shadow-xl transition-transform duration-700 preserve-3d ${
                        isFlipped ? "rotate-y-180" : "hover:scale-[1.02]"
                      }`}
                    >
                      {/* CARD BACK */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#0f0f1a] via-[#161625] to-[#0f0f1a] border-2 border-amber-500/30 p-3 flex flex-col items-center justify-between backface-hidden shadow-2xl">
                        <div className="w-full flex justify-between text-amber-400/60 text-xs">
                          <span>✦</span>
                          <span>✦</span>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-14 h-14 rounded-full border border-amber-400/30 flex items-center justify-center bg-[#161625]">
                            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                          </div>
                          <span className="text-xs font-cinzel font-bold text-amber-200 tracking-wider">
                            TAP TO REVEAL
                          </span>
                          <span className="text-[10px] text-slate-400">터치하여 뒤집기</span>
                        </div>
                        <div className="w-full flex justify-between text-amber-400/60 text-xs">
                          <span>✦</span>
                          <span>✦</span>
                        </div>
                      </div>

                      {/* CARD FRONT */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-b from-[#161625] via-[#0f0f1a] to-[#161625] border-2 border-amber-400/60 p-3 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl ${
                          card.isReversed ? "rotate-180" : ""
                        }`}
                      >
                        {/* Top: Card Number & Name */}
                        <div className="flex items-center justify-between text-amber-300 text-xs border-b border-white/5 pb-1">
                          <span className="font-cinzel font-bold">{card.number}</span>
                          <span className="text-[11px] font-serif-kr font-bold">{card.nameKo}</span>
                          <span className="text-[10px] text-slate-400">{card.nameEn}</span>
                        </div>

                        {/* Center: Tarot Visual Symbol */}
                        <div className="my-auto flex flex-col items-center text-center space-y-2 py-2">
                          <div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.symbolColor} flex items-center justify-center text-white shadow-lg border border-white/30`}
                          >
                            <span className="text-2xl font-cinzel font-black">{card.number}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-100 block">
                              {card.isReversed ? "역방향 (Reversed)" : "정방향 (Upright)"}
                            </span>
                            <div className="flex flex-wrap justify-center gap-1 mt-1">
                              {card.keywords.slice(0, 3).map((kw, kIdx) => (
                                <span key={kIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#161625] border border-white/5 text-amber-200">
                                  #{kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Element badge */}
                        <div className="text-center pt-1 border-t border-white/5 text-[10px] text-slate-400">
                          {card.element}의 원소
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Explanation Summary once flipped */}
                  {isFlipped && (
                    <div className="w-full p-3.5 rounded-2xl bg-[#0f0f1a] border border-white/5 text-xs space-y-2 animate-in fade-in duration-300 shadow-lg shadow-black/40">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-200 font-serif-kr">
                          {card.nameKo} ({card.isReversed ? "역방향" : "정방향"})
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-normal">
                        {card.isReversed ? card.reversedFortune : card.uprightFortune}
                      </p>
                      <div className="p-2.5 rounded-xl bg-[#161625] border border-white/5 text-purple-200 text-[11px]">
                        <span className="font-bold mr-1 text-amber-300">조언:</span>
                        {card.advice}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Tarot Master Consultation trigger */}
          {isFlippedList.every((v) => v) && (
            <div className="rounded-2xl bg-[#0f0f1a] border border-white/5 p-4 space-y-3 shadow-xl shadow-black/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-100">AI 타로 마스터 심층 풀이</h4>
                    <p className="text-[10px] text-slate-400">질문과 뽑힌 카드를 융합하여 깊이 있는 해석을 제공합니다</p>
                  </div>
                </div>
                <button
                  onClick={handleAskAiTarot}
                  disabled={isLoadingAi}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center space-x-1"
                >
                  {isLoadingAi ? (
                    <span>풀이 분석 중...</span>
                  ) : (
                    <>
                      <span>AI 심층 풀이</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* AI Tarot Result */}
              {aiReadingResult && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#161625] border border-purple-500/20 text-xs space-y-2 animate-in fade-in duration-300">
                  <p className="text-slate-200 leading-relaxed">{aiReadingResult.cardReading}</p>
                  <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-purple-200 font-medium">
                    ✨ <strong>핵심 조언:</strong> {aiReadingResult.keyAdvice}
                  </div>
                  {aiReadingResult.actionStep && (
                    <div className="text-slate-300 text-[11px]">
                      🎯 <strong>오늘의 실천:</strong> {aiReadingResult.actionStep}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
