import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, Moon, HelpCircle, Trash2, User } from "lucide-react";
import { UserProfile } from "../types";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  "오늘 중요한 미팅이 있는데 성공 팁이 있나요?",
  "마음에 두고 있는 인연에게 오늘 연락해도 될까요?",
  "요즘 금전운의 흐름과 아껴야 할 점은 무엇인가요?",
  "이직이나 새로운 프로젝트 시작에 좋은 시기인가요?",
];

const PRESET_DREAMS = [
  "황금빛 잉어가 맑은 물에서 품에 안기는 꿈",
  "이빨이 흔들리거나 빠지는 꿈",
  "불이 활활 타오르는 화려한 건물을 보는 꿈",
  "비행기를 타고 하늘 높이 날아오르는 꿈",
];

export const AiGuruChatView: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [tab, setTab] = useState<"chat" | "dream">("chat");

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: `반갑소, ${profile.name}님. 나는 사주와 천지음양의 이치로 사람들의 길을 밝혀주는 '운명도사'라 하오. 오늘 마음속에 품은 고민이나 나아가야 할 방향에 대해 무엇이든 편히 물어보시게나.`,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dream State
  const [dreamInput, setDreamInput] = useState("");
  const [dreamResult, setDreamResult] = useState<any | null>(null);
  const [isLoadingDream, setIsLoadingDream] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoadingChat]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoadingChat) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoadingChat(true);

    try {
      const res = await fetch("/api/fortune/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userContext: profile,
        }),
      });
      const data = await res.json();
      const reply = data.reply || "운명의 흐름은 늘 변화하니, 맑은 마음으로 나아가시게나.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: reply,
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (e) {
      console.error("AI chat error:", e);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: "기운이 잠시 어지러웠사오니, 잠시 후 다시 질문해 주시게나.",
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleInterpretDream = async (dreamTextToSend?: string) => {
    const content = (dreamTextToSend || dreamInput).trim();
    if (!content || isLoadingDream) return;

    setIsLoadingDream(true);
    setDreamResult(null);

    try {
      const res = await fetch("/api/fortune/dream-interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamContent: content }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDreamResult(data.data);
      }
    } catch (e) {
      console.error("Dream interpret error:", e);
    } finally {
      setIsLoadingDream(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "model",
        content: `마음을 가다듬었으니, 새로운 고민이나 물음을 들려주시게나.`,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Top sub-tabs */}
      <div className="flex bg-[#0f0f1a] border border-white/5 rounded-2xl p-1 max-w-xs mx-auto shadow-inner">
        <button
          onClick={() => setTab("chat")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            tab === "chat"
              ? "bg-[#161625] text-amber-200 border border-amber-500/30 shadow-md shadow-amber-500/10"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🔮 AI 운명도사 상담
        </button>
        <button
          onClick={() => setTab("dream")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            tab === "dream"
              ? "bg-[#161625] text-amber-200 border border-amber-500/30 shadow-md shadow-amber-500/10"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🌙 신통한 꿈해몽
        </button>
      </div>

      {tab === "chat" ? (
        /* GURU CHAT INTERFACE */
        <div className="rounded-3xl bg-[#0f0f1a] border border-white/5 overflow-hidden flex flex-col h-[520px] shadow-2xl shadow-black/80">
          {/* Chat Header */}
          <div className="p-3.5 bg-[#0f0f1a] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#161625] border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif-kr text-xs font-bold text-amber-100 block">천기누설 운명도사</span>
                <span className="text-[10px] text-emerald-400 font-medium">● 실시간 사주 문답 가능</span>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              aria-label="대화 초기화"
              className="p-1.5 rounded-lg hover:bg-[#161625] text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="px-3 py-2 bg-[#050508]/60 border-b border-white/5 flex space-x-1.5 overflow-x-auto no-scrollbar">
            {PRESET_QUESTIONS.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pq)}
                disabled={isLoadingChat}
                className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#161625] hover:bg-[#202033] text-[11px] text-slate-300 border border-white/5 whitespace-nowrap active:scale-95 transition-all"
              >
                {pq}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#050508]/30">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"} items-end space-x-2`}>
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#161625] border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0 mb-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-br-none shadow-md"
                        : "bg-[#161625] border border-white/5 text-slate-200 rounded-bl-none font-serif-kr shadow-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <span
                      className={`text-[9px] block mt-1 ${isUser ? "text-slate-900/70 text-right" : "text-slate-500"}`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#161625] border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 mb-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoadingChat && (
              <div className="flex justify-start items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#161625] border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-[#161625] border border-white/5 text-amber-200 text-xs font-serif-kr rounded-bl-none animate-pulse">
                  도사님이 괘(卦)를 짚어보는 중입니다...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0f0f1a] border-t border-white/5 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="도사님께 궁금한 점을 여쭤보세요..."
              className="flex-1 bg-[#161625] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/70"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoadingChat}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold active:scale-95 transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* DREAM INTERPRETATION (꿈해몽) */
        <div className="rounded-3xl bg-[#0f0f1a] border border-white/5 p-5 space-y-4 shadow-2xl shadow-black/80">
          <div>
            <h3 className="font-serif-kr text-base font-bold text-amber-100 flex items-center">
              <Moon className="w-4 h-4 text-amber-400 mr-1.5" />
              신통한 꿈해몽 (Dream Oracle)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">간밤에 꾼 꿈을 입력하면 길흉화복과 행운의 번호를 풀어드립니다</p>
          </div>

          {/* Quick preset dreams */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">자주 찾는 꿈 키워드:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_DREAMS.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDreamInput(d);
                    handleInterpretDream(d);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#161625] border border-white/5 text-[11px] text-slate-300 hover:text-amber-200 hover:border-amber-500/30 transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Dream Input */}
          <div className="space-y-2">
            <textarea
              rows={3}
              value={dreamInput}
              onChange={(e) => setDreamInput(e.target.value)}
              placeholder="예: 간밤에 큰 돼지가 방 안으로 뛰어들어와 품에 꼭 안기는 꿈을 꿨어요."
              className="w-full bg-[#161625] border border-white/10 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/70 resize-none"
            />
            <button
              onClick={() => handleInterpretDream()}
              disabled={!dreamInput.trim() || isLoadingDream}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoadingDream ? "꿈의 상징 해몽 중..." : "꿈해몽 정밀 풀이"}</span>
            </button>
          </div>

          {/* Dream Result Box */}
          {dreamResult && (
            <div className="p-4 rounded-2xl bg-[#161625] border border-amber-500/30 text-xs space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div>
                  <span className="font-serif-kr font-bold text-amber-200 text-sm block">
                    {dreamResult.dreamTitle}
                  </span>
                  <span className="text-[11px] text-amber-400">{dreamResult.fortuneCategory}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    dreamResult.isAuspicious ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-[#0f0f1a] text-slate-300 border border-white/5"
                  }`}
                >
                  {dreamResult.isAuspicious ? "🌟 길몽 (吉夢)" : "평몽 (平夢)"}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed">{dreamResult.detailedMeaning}</p>

              {dreamResult.psychologicalInsight && (
                <div className="p-2.5 rounded-xl bg-[#0f0f1a] border border-white/5 text-slate-300">
                  <span className="font-bold text-amber-300 mr-1">심리적 해석:</span>
                  {dreamResult.psychologicalInsight}
                </div>
              )}

              {dreamResult.luckyNumbers && (
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block mb-1">꿈이 전하는 길조 번호:</span>
                  <div className="flex space-x-1.5">
                    {dreamResult.luckyNumbers.map((n: number, i: number) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-[11px]"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
