import { ConstellationInfo } from "../types";

export const CONSTELLATIONS_BASE: Omit<ConstellationInfo, "todayScore" | "todayFortune" | "loveFortune" | "moneyFortune" | "keyword">[] = [
  {
    id: "aquarius",
    name: "물병자리",
    symbol: "♒",
    dateRange: "1.20 ~ 2.18",
    element: "바람",
    rulingPlanet: "천왕성",
    luckyPartner: "쌍둥이자리",
    luckyColor: "스카이블루",
  },
  {
    id: "pisces",
    name: "물고기자리",
    symbol: "♓",
    dateRange: "2.19 ~ 3.20",
    element: "물",
    rulingPlanet: "해왕성",
    luckyPartner: "게자리",
    luckyColor: "라벤더",
  },
  {
    id: "aries",
    name: "양자리",
    symbol: "♈",
    dateRange: "3.21 ~ 4.19",
    element: "불",
    rulingPlanet: "화성",
    luckyPartner: "사자자리",
    luckyColor: "크림슨 레드",
  },
  {
    id: "taurus",
    name: "황소자리",
    symbol: "♉",
    dateRange: "4.20 ~ 5.20",
    element: "흙",
    rulingPlanet: "금성",
    luckyPartner: "처녀자리",
    luckyColor: "에메랄드 그린",
  },
  {
    id: "gemini",
    name: "쌍둥이자리",
    symbol: "♊",
    dateRange: "5.21 ~ 6.21",
    element: "바람",
    rulingPlanet: "수성",
    luckyPartner: "천칭자리",
    luckyColor: "선샤인 옐로우",
  },
  {
    id: "cancer",
    name: "게자리",
    symbol: "♋",
    dateRange: "6.22 ~ 7.22",
    element: "물",
    rulingPlanet: "달",
    luckyPartner: "전갈자리",
    luckyColor: "실버 화이트",
  },
  {
    id: "leo",
    name: "사자자리",
    symbol: "♌",
    dateRange: "7.23 ~ 8.22",
    element: "불",
    rulingPlanet: "태양",
    luckyPartner: "사수자리",
    luckyColor: "로열 골드",
  },
  {
    id: "virgo",
    name: "처녀자리",
    symbol: "♍",
    dateRange: "8.23 ~ 9.22",
    element: "흙",
    rulingPlanet: "수성",
    luckyPartner: "염소자리",
    luckyColor: "네이비 블루",
  },
  {
    id: "libra",
    name: "천칭자리",
    symbol: "♎",
    dateRange: "9.23 ~ 10.22",
    element: "바람",
    rulingPlanet: "금성",
    luckyPartner: "물병자리",
    luckyColor: "파스텔 핑크",
  },
  {
    id: "scorpio",
    name: "전갈자리",
    symbol: "♏",
    dateRange: "10.23 ~ 11.21",
    element: "물",
    rulingPlanet: "명왕성",
    luckyPartner: "물고기자리",
    luckyColor: "딥 버건디",
  },
  {
    id: "sagittarius",
    name: "사수자리",
    symbol: "♐",
    dateRange: "11.22 ~ 12.21",
    element: "불",
    rulingPlanet: "목성",
    luckyPartner: "양자리",
    luckyColor: "코발트 퍼플",
  },
  {
    id: "capricorn",
    name: "염소자리",
    symbol: "♑",
    dateRange: "12.22 ~ 1.19",
    element: "흙",
    rulingPlanet: "토성",
    luckyPartner: "황소자리",
    luckyColor: "차콜 그레이",
  },
];

const KEYWORDS_POOL = [
  "도약의 순간", "창의적 영감", "감정의 균형", "행운의 조력자",
  "내면의 성찰", "결단력 발휘", "매력 폭발", "새로운 기회",
  "신뢰와 결속", "풍요로운 결실", "안정된 평화", "직관의 적중"
];

const STAR_FORTUNE_TEMPLATES = [
  "별들의 에너지가 당신의 직관을 지지합니다. 망설이던 일이 있다면 오늘 과감히 시작해 보세요.",
  "조화로운 대인관계가 큰 행운을 불러옵니다. 주위 사람들에게 건네는 따뜻한 한마디가 복이 됩니다.",
  "작은 디테일에 신경 쓸 때 완벽한 결과가 완성됩니다. 차분하고 꼼꼼한 마무리가 돋보이는 날입니다.",
  "새로운 지식이나 트렌드에 관심을 가지면 유익한 영감을 얻을 수 있습니다. 이동 중 책이나 기사를 추천합니다.",
  "지출을 신중하게 조율하고 가치 있는 곳에 에너지를 투자하세요. 곧 보람찬 성과로 돌아올 것입니다.",
];

export function getDailyConstellationFortunes(dateStr: string): ConstellationInfo[] {
  const seed = dateStr.split("-").reduce((acc, part) => acc * 29 + parseInt(part, 10), 13);

  return CONSTELLATIONS_BASE.map((base, idx) => {
    const starSeed = (seed + idx * 53) % 1000;
    const todayScore = 70 + (starSeed % 29); // 70 ~ 98
    const keyword = KEYWORDS_POOL[(starSeed + idx) % KEYWORDS_POOL.length];
    const todayFortune = STAR_FORTUNE_TEMPLATES[(starSeed) % STAR_FORTUNE_TEMPLATES.length];

    const loveSeed = (starSeed * 7) % 100;
    const loveFortune = loveSeed > 60
      ? "서로의 마음에 공감대가 깊어지는 설레는 하루. 솔로는 뜻밖의 장소에서 매력적인 대화 상대를 만납니다."
      : "작은 오해가 생길 수 있으니 솔직하고 부드러운 화법으로 진심을 표현해 보세요.";

    const moneySeed = (starSeed * 11) % 100;
    const moneyFortune = moneySeed > 50
      ? "기대 이상의 부가 수익이나 깜짝 혜택이 찾아올 기운. 필요한 곳에만 알뜰하게 사용하는 지혜가 길합니다."
      : "충동적인 쇼핑이나 즉흥적 투자를 피하고 장기적인 저축 플랜을 점검하기에 좋은 날입니다.";

    return {
      ...base,
      todayScore,
      keyword,
      todayFortune,
      loveFortune,
      moneyFortune,
    };
  });
}
