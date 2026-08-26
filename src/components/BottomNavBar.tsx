import React from "react";
import { Compass, Sparkles, Moon, Bot, Gift } from "lucide-react";
import { MainTabType } from "../types";

interface BottomNavBarProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: MainTabType; label: string; icon: React.ReactNode }[] = [
    { id: "daily", label: "종합운세", icon: <Compass className="w-5 h-5" /> },
    { id: "zodiac", label: "띠·별자리", icon: <Moon className="w-5 h-5" /> },
    { id: "tarot", label: "타로카드", icon: <Sparkles className="w-5 h-5" /> },
    { id: "cookie", label: "포춘·부적", icon: <Gift className="w-5 h-5" /> },
    { id: "ai-guru", label: "AI 도사", icon: <Bot className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f1a]/95 backdrop-blur-xl border-t border-white/5 px-2 py-1.5 pb-safe shadow-2xl shadow-black">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}-btn`}
              onClick={() => {
                if ("vibrate" in navigator) {
                  navigator.vibrate(20);
                }
                onChangeTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all active:scale-90 ${
                isActive
                  ? "text-amber-200 font-bold"
                  : "text-slate-400 hover:text-slate-200 font-medium"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? "bg-gradient-to-b from-amber-200/20 to-amber-500/10 border border-amber-200/30 shadow-md shadow-amber-500/20 text-amber-200" : ""
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
