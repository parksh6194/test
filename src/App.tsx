import React, { useState, useEffect, useMemo } from "react";
import { Header } from "./components/Header";
import { ProfileModal } from "./components/ProfileModal";
import { ShareModal } from "./components/ShareModal";
import { DailyOverviewCard } from "./components/DailyOverviewCard";
import { LuckyBoard } from "./components/LuckyBoard";
import { DetailedFortuneAccordion } from "./components/DetailedFortuneAccordion";
import { ZodiacFortuneView } from "./components/ZodiacFortuneView";
import { ConstellationView } from "./components/ConstellationView";
import { TarotReadingView } from "./components/TarotReadingView";
import { FortuneCookieView } from "./components/FortuneCookieView";
import { AiGuruChatView } from "./components/AiGuruChatView";
import { BottomNavBar } from "./components/BottomNavBar";

import {
  calculateDailyFortune,
  loadStoredProfile,
  saveStoredProfile,
} from "./utils/sajuCalculator";
import { getDailyZodiacFortunes } from "./data/zodiacData";
import { getDailyConstellationFortunes } from "./data/constellationData";
import { DailyFortuneResult, MainTabType, UserProfile } from "./types";

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadStoredProfile());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<MainTabType>("daily");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [aiFortuneOverride, setAiFortuneOverride] = useState<DailyFortuneResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Compute base deterministic fortune
  const baseFortune = useMemo(() => {
    return calculateDailyFortune(profile, currentDate);
  }, [profile, currentDate]);

  const activeFortune = aiFortuneOverride || baseFortune;

  // Clear AI override if user changes date or profile
  useEffect(() => {
    setAiFortuneOverride(null);
  }, [profile, currentDate]);

  // Compute 12 Zodiac Fortunes
  const dateKey = currentDate.toISOString().split("T")[0];
  const zodiacList = useMemo(() => {
    return getDailyZodiacFortunes(dateKey);
  }, [dateKey]);

  // Compute 12 Constellation Fortunes
  const constellationList = useMemo(() => {
    return getDailyConstellationFortunes(dateKey);
  }, [dateKey]);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  // AI Deep Reading fetch
  const handleFetchAiReading = async () => {
    setIsLoadingAi(true);
    try {
      const response = await fetch("/api/fortune/ai-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          birthDate: profile.birthDate,
          birthTime: profile.birthTime,
          calendarType: profile.calendarType,
          gender: profile.gender,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const d = json.data;
        const enriched: DailyFortuneResult = {
          ...baseFortune,
          summaryHeadline: d.summaryHeadline || baseFortune.summaryHeadline,
          overallScore: d.overallScore || baseFortune.overallScore,
          overview: d.overview || baseFortune.overview,
          wealth: {
            ...baseFortune.wealth,
            score: d.wealth?.score || baseFortune.wealth.score,
            text: d.wealth?.text || baseFortune.wealth.text,
            tip: d.wealth?.tip || baseFortune.wealth.tip,
          },
          love: {
            ...baseFortune.love,
            score: d.love?.score || baseFortune.love.score,
            text: d.love?.text || baseFortune.love.text,
            tip: d.love?.tip || baseFortune.love.tip,
          },
          career: {
            ...baseFortune.career,
            score: d.career?.score || baseFortune.career.score,
            text: d.career?.text || baseFortune.career.text,
            tip: d.career?.tip || baseFortune.career.tip,
          },
          health: {
            ...baseFortune.health,
            score: d.health?.score || baseFortune.health.score,
            text: d.health?.text || baseFortune.health.text,
            tip: d.health?.tip || baseFortune.health.tip,
          },
          masterAdvice: d.masterAdvice || baseFortune.masterAdvice,
          isAiEnhanced: true,
        };
        setAiFortuneOverride(enriched);
      }
    } catch (err) {
      console.error("AI fortune reading error:", err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 flex flex-col font-sans pb-24 selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
      {/* Subtle Celestial Ambient Background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-amber-500/5 via-purple-900/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-purple-950/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Mobile Top Header */}
      <Header
        profile={profile}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        zodiacAnimal={activeFortune.zodiacAnimal}
      />

      {/* Main Content Area Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-3.5 sm:px-4 pt-3 pb-6 space-y-4">
        {/* TAB 1: DAILY FORTUNE (종합운세) */}
        {activeTab === "daily" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Overview Score Card */}
            <DailyOverviewCard
              fortune={activeFortune}
              userName={profile.name}
              onFetchAiReading={handleFetchAiReading}
              isLoadingAi={isLoadingAi}
            />

            {/* Lucky Elements Board (Numbers, Color, Food, Item, Direction, Biorhythm) */}
            <LuckyBoard lucky={activeFortune.luckyElements} />

            {/* Detailed Accordion for Wealth, Love, Career, Health, Relations */}
            <DetailedFortuneAccordion fortune={activeFortune} />
          </div>
        )}

        {/* TAB 2: ZODIAC & CONSTELLATIONS (띠 & 별자리) */}
        {activeTab === "zodiac" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ZodiacFortuneView
              zodiacList={zodiacList}
              userZodiacAnimal={activeFortune.zodiacAnimal}
            />
            <ConstellationView
              constellations={constellationList}
              userStarSign={activeFortune.starSign}
            />
          </div>
        )}

        {/* TAB 3: TAROT CARD READING (타로카드) */}
        {activeTab === "tarot" && (
          <div className="animate-in fade-in duration-300">
            <TarotReadingView />
          </div>
        )}

        {/* TAB 4: FORTUNE COOKIE & AMULETS (포춘쿠키 & 부적) */}
        {activeTab === "cookie" && (
          <div className="animate-in fade-in duration-300">
            <FortuneCookieView userName={profile.name} />
          </div>
        )}

        {/* TAB 5: AI GURU & DREAM (AI 도사 상담 & 꿈해몽) */}
        {activeTab === "ai-guru" && (
          <div className="animate-in fade-in duration-300">
            <AiGuruChatView profile={profile} />
          </div>
        )}
      </main>

      {/* Profile Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        fortune={activeFortune}
        profile={profile}
      />

      {/* Fixed Bottom Navigation Bar */}
      <BottomNavBar activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
