import { DailyFortuneResult, FortuneGrade, UserProfile } from "../types";

// Five Elements & Zodiac Mappings
const HEAVENLY_STEMS = ["갑(甲)", "을(乙)", "병(丙)", "정(丁)", "무(戊)", "기(己)", "경(庚)", "신(辛)", "임(壬)", "계(癸)"];
const EARTHLY_BRANCHES = ["자(子 - 쥐)", "축(丑 - 소)", "인(寅 - 호랑이)", "묘(卯 - 토끼)", "진(辰 - 용)", "사(巳 - 뱀)", "오(午 - 말)", "미(未 - 양)", "신(申 - 원숭이)", "유(酉 - 닭)", "술(戌 - 개)", "해(亥 - 돼지)"];
const ZODIAC_NAMES = ["쥐띠", "소띠", "호랑이띠", "토끼띠", "용띠", "뱀띠", "말띠", "양띠", "원숭이띠", "닭띠", "개띠", "돼지띠"];
const ELEMENTS = ["목(木) - 푸른 기운", "화(火) - 붉은 기운", "토(土) - 황금 기운", "금(金) - 흰 바위 기운", "수(水) - 검은 샘물 기운"];

const LUCKY_COLORS = [
  { name: "샴페인 골드", hex: "#f59e0b", bgClass: "bg-amber-500" },
  { name: "포레스트 그린", hex: "#10b981", bgClass: "bg-emerald-500" },
  { name: "미드나잇 네이비", hex: "#3b82f6", bgClass: "bg-blue-500" },
  { name: "로즈 버건디", hex: "#f43f5e", bgClass: "bg-rose-500" },
  { name: "로열 퍼플", hex: "#a855f7", bgClass: "bg-purple-500" },
  { name: "선셋 오렌지", hex: "#f97316", bgClass: "bg-orange-500" },
  { name: "퓨어 화이트", hex: "#f8fafc", bgClass: "bg-slate-100" },
];

const LUCKY_DIRECTIONS = ["동남쪽", "정동쪽", "남서쪽", "정북쪽", "북동쪽", "서북쪽", "정남쪽"];
const LUCKY_ITEMS = [
  "따뜻한 보온병", "원목 펜", "은색 액세서리", "가죽 지갑",
  "은은한 향초", "미니 수첩", "행운의 동전", "손수건", "텀블러", "초록색 화분"
];
const LUCKY_FOODS = [
  "따뜻한 된장찌개", "신선한 연어 샐러드", "단호박죽", "고소한 두부 요리",
  "맑은 소고기 무국", "바삭한 호두와 견과류", "상큼한 유자차", "버섯 전골", "비빔밥"
];
const CAUTION_TIMES = [
  "오후 1시 ~ 3시 (나른해지는 시간, 충동구매 주의)",
  "오후 4시 ~ 6시 (퇴근 전 서두르는 결정 주의)",
  "오전 10시 ~ 12시 (과도한 욕심이나 조급함 주의)",
  "저녁 7시 ~ 9시 (불필요한 감정 소모 피하기)",
];

const HEADLINE_TEMPLATES = [
  "금의환향의 기운이 깃들어 곳곳에서 반가운 소식이 찾아옵니다",
  "성실한 노력에 하늘이 응답하여 값진 열매를 맺는 하루입니다",
  "귀인의 따뜻한 손길이 막힌 길을 시원하게 열어주는 날입니다",
  "지혜로운 처세와 맑은 마음이 큰 복록과 재물을 끌어당깁니다",
  "차분한 준비와 신중한 판단이 뜻밖의 대길을 부르는 하루입니다",
  "마음의 평정심을 유지할 때 더 큰 기회와 행운이 안겨옵니다",
];

// Calculate Biorhythm: Physical (23 days), Emotional (28 days), Intellectual (33 days)
export function calculateBiorhythm(birthDateStr: string, targetDateStr: string) {
  const birth = new Date(birthDateStr).getTime();
  const target = new Date(targetDateStr).getTime();
  const diffDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24));

  const physical = Math.round(Math.sin((2 * Math.PI * diffDays) / 23) * 100);
  const emotional = Math.round(Math.sin((2 * Math.PI * diffDays) / 28) * 100);
  const intellectual = Math.round(Math.sin((2 * Math.PI * diffDays) / 33) * 100);

  return { physical, emotional, intellectual };
}

// Calculate Constellation (별자리)
export function getStarSign(month: number, day: number): string {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "물병자리";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "물고기자리";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "양자리";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "황소자리";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "쌍둥이자리";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "게자리";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "사자자리";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "처녀자리";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "천칭자리";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "전갈자리";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "사수자리";
  return "염소자리";
}

// Deterministic Daily Fortune Calculator based on Saju & Date
export function calculateDailyFortune(profile: UserProfile, targetDate: Date = new Date()): DailyFortuneResult {
  const dateStr = targetDate.toISOString().split("T")[0];
  const koreanDateText = targetDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const bDate = new Date(profile.birthDate);
  const birthYear = isNaN(bDate.getFullYear()) ? 1996 : bDate.getFullYear();
  const birthMonth = isNaN(bDate.getMonth()) ? 6 : bDate.getMonth() + 1;
  const birthDay = isNaN(bDate.getDate()) ? 15 : bDate.getDate();

  // Zodiac Animal
  const animalIdx = (birthYear - 4) % 12;
  const zodiacAnimal = ZODIAC_NAMES[(animalIdx + 12) % 12];
  const stemIdx = (birthYear - 4) % 10;
  const elementIdx = Math.floor(((stemIdx + 10) % 10) / 2);
  const zodiacElement = ELEMENTS[elementIdx % 5];
  const starSign = getStarSign(birthMonth, birthDay);

  // Hash seed combining user's birth profile + target date
  const rawSeed = `${profile.name}-${profile.birthDate}-${profile.gender}-${profile.birthTime}-${dateStr}`;
  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  // Scores
  const overallScore = 72 + (posHash % 27); // 72 ~ 98
  let grade: FortuneGrade = "평안 (平安)";
  if (overallScore >= 92) grade = "대길 (大吉)";
  else if (overallScore >= 84) grade = "중길 (中吉)";
  else if (overallScore >= 76) grade = "소길 (小吉)";
  else grade = "평안 (平安)";

  const wealthScore = Math.min(99, Math.max(60, overallScore + ((posHash % 19) - 9)));
  const loveScore = Math.min(99, Math.max(60, overallScore + (((posHash >> 2) % 21) - 10)));
  const careerScore = Math.min(99, Math.max(60, overallScore + (((posHash >> 4) % 23) - 11)));
  const healthScore = Math.min(99, Math.max(60, overallScore + (((posHash >> 6) % 17) - 8)));
  const relationsScore = Math.min(99, Math.max(60, overallScore + (((posHash >> 8) % 19) - 9)));

  const headline = HEADLINE_TEMPLATES[posHash % HEADLINE_TEMPLATES.length];

  // Overview text
  const overview = `${profile.name || "회원"}님의 오늘 하루는 ${zodiacElement}의 온화한 에너지가 사주를 감싸며 안정을 도모하는 흐름입니다. 매사 조급함을 내려놓고 자신의 페이스를 유지할 때 생각 이상의 순조로운 성과와 기분 좋은 인연이 찾아옵니다.`;

  // Lucky numbers generator (6 unique numbers from 1 to 45)
  const numbersSet = new Set<number>();
  let numSeed = posHash;
  while (numbersSet.size < 6) {
    numSeed = (numSeed * 9301 + 49297) % 233280;
    const n = (numSeed % 45) + 1;
    numbersSet.add(n);
  }
  const luckyNumbers = Array.from(numbersSet).sort((a, b) => a - b);

  const luckyColor = LUCKY_COLORS[posHash % LUCKY_COLORS.length];
  const luckyDirection = LUCKY_DIRECTIONS[(posHash >> 3) % LUCKY_DIRECTIONS.length];
  const luckyItem = LUCKY_ITEMS[(posHash >> 5) % LUCKY_ITEMS.length];
  const luckyFood = LUCKY_FOODS[(posHash >> 7) % LUCKY_FOODS.length];
  const cautionTime = CAUTION_TIMES[(posHash >> 9) % CAUTION_TIMES.length];

  const biorhythm = calculateBiorhythm(profile.birthDate || "1996-01-01", dateStr);

  const getScoreLevel = (s: number) => {
    if (s >= 90) return "최상 (대길)";
    if (s >= 80) return "원활 (호조)";
    if (s >= 70) return "보통 (순행)";
    return "신중 (주의)";
  };

  return {
    date: dateStr,
    koreanDateText,
    lunarDateText: `음력 ${(birthMonth + 11) % 12 + 1}월 ${(birthDay + 7) % 30 + 1}일`,
    zodiacAnimal,
    zodiacElement,
    starSign,
    overallScore,
    grade,
    summaryHeadline: headline,
    overview,
    wealth: {
      score: wealthScore,
      level: getScoreLevel(wealthScore),
      title: "재물운 (금전)",
      text: wealthScore >= 85
        ? "자금의 흐름이 원활하며 뜻밖의 할인이나 부가적인 이익이 발생하는 날입니다. 장기적인 자산 형성에 좋은 기운입니다."
        : "충동적인 지출을 자제하고 꼭 필요한 소비에 집중하면 곳간이 든든해집니다. 작은 절약이 큰 복을 부릅니다.",
      tip: "지갑 영수증을 정리하고 깔끔하게 유지하세요.",
    },
    love: {
      score: loveScore,
      level: getScoreLevel(loveScore),
      title: "애정운 (인연)",
      text: loveScore >= 85
        ? "상대방과의 대화에서 깊은 공감과 따스한 유대감이 싹틉니다. 솔로는 호감을 주는 매력적인 인연을 만날 수 있습니다."
        : "작은 표현 하나에도 따뜻한 배려를 담으세요. 상대방의 말을 끝까지 경청하는 자세가 애정을 돈독히 합니다.",
      tip: "상대방에게 '오늘도 고마워'라는 다정한 문자 한 통을 보내보세요.",
    },
    career: {
      score: careerScore,
      level: getScoreLevel(careerScore),
      title: "직장·학업운 (성취)",
      text: careerScore >= 85
        ? "집중력이 최고조에 달하여 난이도 높은 과제도 수월하게 해결할 수 있습니다. 윗사람이나 동료의 신임을 얻습니다."
        : "기본에 충실하며 꼼꼼하게 검토할 때 실수를 완벽히 예방할 수 있습니다. 차근차근 순서대로 처리하세요.",
      tip: "우선순위 3가지를 메모지에 적어두고 하나씩 완료하세요.",
    },
    health: {
      score: healthScore,
      level: getScoreLevel(healthScore),
      title: "건강·활력운 (심신)",
      text: healthScore >= 85
        ? "몸과 마음에 활력이 넘치며 맑은 기운이 가득합니다. 가벼운 유산소 운동이나 스트레칭으로 에너지를 발산하세요."
        : "목과 어깨의 긴장을 풀고 충분한 수분을 섭취해 주세요. 늦은 밤 과식을 피하고 숙면을 취하는 것이 길합니다.",
      tip: "1시간마다 가볍게 기지개를 켜고 물 한 잔을 마시세요.",
    },
    relations: {
      score: relationsScore,
      level: getScoreLevel(relationsScore),
      title: "대인관계운 (인복)",
      text: relationsScore >= 85
        ? "주변 사람들에게 긍정적인 에너지를 전파하며 좋은 사람들과의 유쾌한 만남이 기다립니다. 귀인의 조력이 따릅니다."
        : "불필요한 구설이나 남의 말에 일희일비하지 마세요. 중심을 지키고 온화한 미소로 대하면 편안합니다.",
      tip: "엘리베이터나 만나는 사람에게 밝게 먼저 인사하세요.",
    },
    luckyElements: {
      luckyNumbers,
      luckyColor,
      luckyDirection,
      luckyItem,
      luckyFood,
      cautionTime,
      biorhythm,
    },
    masterAdvice: "순풍에 돛을 달듯 매사 순리대로 행하면 하늘이 돕고 땅이 화답할 것이니, 밝은 웃음으로 하루를 채우시길 바랍니다.",
  };
}

// LocalStorage helpers
export const DEFAULT_PROFILE: UserProfile = {
  name: "행운이",
  birthDate: "1996-05-15",
  birthTime: "12:00",
  calendarType: "solar",
  gender: "female",
};

export function loadStoredProfile(): UserProfile {
  try {
    const data = localStorage.getItem("fortune_user_profile");
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load profile:", e);
  }
  return DEFAULT_PROFILE;
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem("fortune_user_profile", JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile:", e);
  }
}
