import { ZodiacAnimalInfo } from "../types";

export const ZODIAC_ANIMALS_BASE = [
  { id: "rat", name: "쥐띠", hanja: "子 (자)", emoji: "🐭", element: "수(水)", personality: "총명하고 기민하며 재물운을 모으는 능력이 뛰어남", compatible: ["소띠", "용띠", "원숭이띠"], incompatible: ["말띠"] },
  { id: "ox", name: "소띠", hanja: "丑 (축)", emoji: "🐮", element: "토(土)", personality: "성실하고 우직하며 끈기로 큰 성취를 이루는 성품", compatible: ["쥐띠", "뱀띠", "닭띠"], incompatible: ["양띠"] },
  { id: "tiger", name: "호랑이띠", hanja: "寅 (인)", emoji: "🐯", element: "목(木)", personality: "용맹하고 리더십이 뛰어나며 대범한 결단력을 지님", compatible: ["말띠", "개띠", "돼지띠"], incompatible: ["원숭이띠"] },
  { id: "rabbit", name: "토끼띠", hanja: "卯 (묘)", emoji: "🐰", element: "목(木)", personality: "온화하고 예술적 감각이 풍부하며 신중한 지혜를 지님", compatible: ["양띠", "개띠", "돼지띠"], incompatible: ["닭띠"] },
  { id: "dragon", name: "용띠", hanja: "辰 (진)", emoji: "🐲", element: "토(土)", personality: "기백이 넘치고 이상이 높으며 큰 변화를 주도하는 기운", compatible: ["쥐띠", "원숭이띠", "닭띠"], incompatible: ["개띠"] },
  { id: "snake", name: "뱀띠", hanja: "巳 (사)", emoji: "🐍", element: "화(火)", personality: "직관력이 예리하고 카리스마가 있으며 지혜로운 책략가", compatible: ["소띠", "닭띠", "원숭이띠"], incompatible: ["돼지띠"] },
  { id: "horse", name: "말띠", hanja: "午 (오)", emoji: "🐴", element: "화(火)", personality: "자유롭고 열정적이며 추진력과 행동력이 뛰어남", compatible: ["호랑이띠", "양띠", "개띠"], incompatible: ["쥐띠"] },
  { id: "sheep", name: "양띠", hanja: "未 (미)", emoji: "🐑", element: "토(土)", personality: "다정다감하고 평화를 사랑하며 주변을 편안하게 함", compatible: ["토끼띠", "말띠", "돼지띠"], incompatible: ["소띠"] },
  { id: "monkey", name: "원숭이띠", hanja: "申 (신)", emoji: "🐵", element: "금(金)", personality: "재치와 순발력이 넘치며 다재다능하고 문제 해결력이 탁월", compatible: ["쥐띠", "용띠", "뱀띠"], incompatible: ["호랑이띠"] },
  { id: "rooster", name: "닭띠", hanja: "酉 (유)", emoji: "🐔", element: "금(金)", personality: "완벽주의적이고 시간 감각이 철저하며 통찰력이 날카로움", compatible: ["소띠", "용띠", "뱀띠"], incompatible: ["토끼띠"] },
  { id: "dog", name: "개띠", hanja: "戌 (술)", emoji: "🐶", element: "토(土)", personality: "충직하고 의리가 넘치며 정의롭고 신뢰를 받는 성향", compatible: ["호랑이띠", "토끼띠", "말띠"], incompatible: ["용띠"] },
  { id: "pig", name: "돼지띠", hanja: "亥 (해)", emoji: "🐷", element: "수(水)", personality: "마음이 넓고 정직하며 뚝심과 복록을 타고난 대길의 기운", compatible: ["호랑이띠", "토끼띠", "양띠"], incompatible: ["뱀띠"] },
];

const AGE_FORTUNE_TEMPLATES: Record<string, string[]> = {
  high: [
    "노력한 결실이 눈앞에 나타나는 날입니다. 기회를 적극적으로 잡으세요.",
    "귀인의 도움으로 막혔던 일에 활로가 열립니다. 대인관계에 미소를 머금으세요.",
    "재물과 명예가 함께 들어오는 운세입니다. 자신감을 갖고 추진하세요.",
    "새로운 인연이나 프로젝트에서 좋은 소식이 찾아옵니다. 긍정적인 자세를 유지하세요.",
    "뜻밖의 횡재수나 기쁜 소식이 문을 두드립니다. 주변과 기쁨을 나누면 배가 됩니다.",
  ],
  mid: [
    "서두르지 말고 순리대로 진행하면 무난히 목표를 달성할 수 있습니다.",
    "작은 것에 만족하고 차분히 내실을 다지는 것이 현명한 하루입니다.",
    "주변 사람과의 대화에서 뜻밖의 힌트를 얻을 수 있는 날입니다.",
    "지출 관리에 신경 쓰고 계획적인 소비를 하면 금전운이 안정됩니다.",
    "과욕은 금물이며, 오늘의 작은 노력이 내일의 큰 자산이 됩니다.",
  ],
  careful: [
    "순간의 감정에 휩쓸리기 쉬우니 한 템포 쉬어가는 여유가 필요합니다.",
    "계약이나 중요한 결정은 꼼꼼히 문서를 재확인하는 것이 안전합니다.",
    "무리한 일정보다는 몸과 마음의 피로를 푸는 데 집중하세요.",
    "언행에 신중을 기하고 불필요한 논쟁에는 한 걸음 물러서는 것이 상책입니다.",
  ],
};

export function getDailyZodiacFortunes(dateStr: string): ZodiacAnimalInfo[] {
  // Simple deterministic pseudo-random seed from date
  const seed = dateStr.split("-").reduce((acc, part) => acc * 31 + parseInt(part, 10), 7);
  const currentYear = new Date(dateStr).getFullYear() || 2026;

  return ZODIAC_ANIMALS_BASE.map((base, idx) => {
    const animalSeed = (seed + idx * 47) % 1000;
    const todayScore = 65 + (animalSeed % 33); // 65 ~ 98

    let summary = "";
    if (todayScore >= 88) {
      summary = "만사가 뜻대로 순조롭게 풀리며 귀인이 찾아오는 대길(大吉)의 날입니다.";
    } else if (todayScore >= 78) {
      summary = "성실한 태도가 빛을 발하며 안정적인 결실을 거둘 수 있는 하루입니다.";
    } else {
      summary = "무리한 확장보다는 내실을 기하고 주변의 조언에 귀를 기울이세요.";
    }

    // Generate birth years for each animal (e.g. for Rat: 2020, 2008, 1996, 1984, 1972, 1960, 1948)
    const baseYearOffset = (idx + 4) % 12; // 1984 is Rat (idx 0) -> (1984 - 4) % 12 = 0
    const birthYears: number[] = [];
    for (let y = currentYear; y >= currentYear - 85; y--) {
      if ((y - 4) % 12 === idx) {
        birthYears.push(y);
      }
    }

    const ageFortunes = birthYears.map((by, bIdx) => {
      const age = currentYear - by + 1;
      const bSeed = (animalSeed + by * 13 + bIdx * 19) % 100;
      const score = 60 + (bSeed % 39);
      const category = score >= 85 ? "high" : score >= 72 ? "mid" : "careful";
      const templates = AGE_FORTUNE_TEMPLATES[category];
      const fortune = templates[(bSeed + bIdx) % templates.length];

      // Ganji name estimation
      const cheongan = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
      const jiji = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
      const cIdx = (by - 4) % 10;
      const jIdx = (by - 4) % 12;
      const ganji = `${cheongan[(cIdx + 10) % 10]}${jiji[(jIdx + 12) % 12]}년`;

      return {
        birthYear: by,
        age,
        ganji,
        fortune,
        score,
      };
    });

    return {
      id: base.id,
      name: base.name,
      hanja: base.hanja,
      emoji: base.emoji,
      element: base.element,
      personality: base.personality,
      compatibleAnimals: base.compatible,
      incompatibleAnimals: base.incompatible,
      todayScore,
      todaySummary: summary,
      ageFortunes,
    };
  });
}
