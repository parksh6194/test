export type CalendarType = "solar" | "lunar" | "leap-lunar";
export type Gender = "male" | "female";

export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // "00:00" to "23:59" or "unknown"
  calendarType: CalendarType;
  gender: Gender;
}

export type FortuneGrade = "대길 (大吉)" | "중길 (中吉)" | "소길 (小吉)" | "평안 (平安)" | "주의 (注意)";

export interface FortuneCategoryDetail {
  score: number; // 0 ~ 100
  level: string; // e.g. "최상", "원활", "보통", "신중"
  title: string;
  text: string;
  tip: string;
}

export interface LuckyElements {
  luckyNumbers: number[];
  luckyColor: {
    name: string;
    hex: string;
    bgClass: string;
  };
  luckyDirection: string;
  luckyItem: string;
  luckyFood: string;
  cautionTime: string;
  biorhythm: {
    physical: number; // -100 ~ 100
    emotional: number;
    intellectual: number;
  };
}

export interface DailyFortuneResult {
  date: string;
  koreanDateText: string;
  lunarDateText: string;
  zodiacAnimal: string;
  zodiacElement: string;
  starSign: string;
  overallScore: number;
  grade: FortuneGrade;
  summaryHeadline: string;
  overview: string;
  wealth: FortuneCategoryDetail;
  love: FortuneCategoryDetail;
  career: FortuneCategoryDetail;
  health: FortuneCategoryDetail;
  relations: FortuneCategoryDetail;
  luckyElements: LuckyElements;
  masterAdvice: string;
  isAiEnhanced?: boolean;
}

export interface ZodiacAnimalInfo {
  id: string;
  name: string;
  hanja: string;
  emoji: string;
  element: string;
  personality: string;
  compatibleAnimals: string[];
  incompatibleAnimals: string[];
  todayScore: number;
  todaySummary: string;
  ageFortunes: {
    birthYear: number;
    age: number;
    ganji: string;
    fortune: string;
    score: number;
  }[];
}

export interface ConstellationInfo {
  id: string;
  name: string;
  symbol: string;
  dateRange: string;
  element: "불" | "흙" | "바람" | "물";
  rulingPlanet: string;
  todayScore: number;
  keyword: string;
  todayFortune: string;
  loveFortune: string;
  moneyFortune: string;
  luckyPartner: string;
  luckyColor: string;
}

export interface TarotCard {
  id: number;
  nameEn: string;
  nameKo: string;
  number: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  uprightFortune: string;
  reversedFortune: string;
  advice: string;
  element: string;
  symbolColor: string;
  isReversed?: boolean;
}

export interface FortuneCookieItem {
  id: string;
  message: string;
  quoteAuthor?: string;
  luckyKeyword: string;
  luckyNumber: number;
  actionMission: string;
}

export interface LuckyAmulet {
  id: string;
  title: string;
  hanja: string;
  subtitle: string;
  purpose: string;
  talismanText: string;
  accentColor: string;
  bgGradient: string;
}

export type MainTabType = "daily" | "zodiac" | "tarot" | "cookie" | "ai-guru";
