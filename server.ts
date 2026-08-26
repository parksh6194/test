import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Personalized Daily Saju Fortune Reading
  app.post("/api/fortune/ai-reading", async (req, res) => {
    try {
      const { name, birthDate, birthTime, calendarType, gender, specificTopic } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(200).json({
          success: false,
          message: "GEMINI_API_KEY not configured, using algorithmic fortune.",
          isFallback: true,
        });
      }

      const todayStr = new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });

      const prompt = `당신은 30년 경력의 덕망 높고 따뜻한 정통 동양 명리학자이자 사주 운세 전문가 '운명도사'입니다.
오늘 날짜: ${todayStr}
사용자 정보:
- 이름: ${name || "방문자"}
- 성별: ${gender === "female" ? "여성" : "남성"}
- 생년월일: ${birthDate} (${calendarType === "lunar" ? "음력" : "양력"})
- 태어난 시간: ${birthTime || "시간 모름"}
${specificTopic ? `- 특별히 궁금한 분야: ${specificTopic}` : ""}

다음 구조의 JSON으로 오늘의 맞춤 정밀 운세를 분석해 주세요. 친절하고 품격 있는 어조로 구체적이고 실천 가능한 조언을 담아주세요:
{
  "summaryHeadline": "오늘을 관통하는 한 줄 사자성어 또는 시적 요약 (예: 금의환향의 기운, 차분한 준비가 대길을 부르는 날)",
  "overallScore": 88, // 0~100 사이 정수
  "overview": "오늘의 전반적인 사주 총운 해석 (3~4문장)",
  "wealth": {
    "score": 90,
    "text": "오늘의 재물/금전운 상세 조언",
    "tip": "금전 꿀팁 1개"
  },
  "love": {
    "score": 85,
    "text": "오늘의 애정/연애/인연운 상세 조언 (솔로/커플 모두 공감)",
    "tip": "애정 꿀팁 1개"
  },
  "career": {
    "score": 80,
    "text": "오늘의 직장/학업/사업운 상세 조언",
    "tip": "업무/학업 팁 1개"
  },
  "health": {
    "score": 85,
    "text": "오늘의 건강/활력운 조언 (주의할 신체 부위나 스트레스 관리)",
    "tip": "건강 팁 1개"
  },
  "luckyElements": {
    "luckyNumbers": [3, 7, 14, 21, 33, 42],
    "luckyColor": "샴페인 골드",
    "luckyDirection": "동남쪽",
    "luckyItem": "따뜻한 차 한 잔",
    "luckyFood": "단호박죽 또는 맑은 국물 요리",
    "cautionTime": "오후 2시 ~ 4시 (충동적 결정 주의)"
  },
  "masterAdvice": "도사의 오늘 하루를 위한 특별한 마음가짐 조언 (따뜻한 위로와 격려 2문장)"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, data: parsed, isFallback: false });
    } catch (error: any) {
      console.error("AI Fortune Reading error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to generate AI fortune",
        isFallback: true,
      });
    }
  });

  // AI Tarot Interpretation
  app.post("/api/fortune/tarot-ai", async (req, res) => {
    try {
      const { question, cards } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(200).json({
          success: false,
          message: "API key unavailable",
          isFallback: true,
        });
      }

      const cardDescriptions = (cards || []).map((c: any, i: number) => 
        `카드 ${i+1}: [${c.name}] (${c.isReversed ? "역방향" : "정방향"}) - 의미: ${c.keywords}`
      ).join("\n");

      const prompt = `당신은 직관적이고 공감 능력 있는 전문 타로 마스터입니다.
질문자 질문: "${question || "오늘 하루 저에게 전하는 타로 카드의 신비로운 메시지는 무엇인가요?"}"

뽑힌 카드:
${cardDescriptions}

다음 JSON 구조로 감동적이고 현실적인 타로 리딩을 작성해주세요:
{
  "cardReading": "뽑힌 카드들의 상징과 흐름을 바탕으로 한 깊이 있는 종합 리딩 (4~5문장)",
  "keyAdvice": "질문자가 오늘 마음에 새겨야 할 핵심 조언",
  "actionStep": "오늘 즉시 실천할 수 있는 구체적인 행동 1가지",
  "positiveAffirmation": "오늘의 긍정 확언 문구"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("AI Tarot error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // AI Dream Interpretation (꿈해몽)
  app.post("/api/fortune/dream-interpret", async (req, res) => {
    try {
      const { dreamContent } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(200).json({
          success: false,
          message: "API key unavailable",
        });
      }

      const prompt = `당신은 전통 동양 해몽 비기와 현대 심리학을 결합한 꿈해몽 명인입니다.
사용자가 꾼 꿈 내용: "${dreamContent}"

다음 JSON 구조로 명쾌하고 길흉화복을 짚어주는 꿈해몽을 제공해주세요:
{
  "dreamTitle": "꿈의 핵심 주제 요약 (예: 황금 돼지를 품에 안는 길몽)",
  "isAuspicious": true, // 길몽 여부 (true/false)
  "fortuneCategory": "재물운 대길 / 심리적 치유 / 인연운 상승 등",
  "detailedMeaning": "꿈에 등장한 상징들의 의미와 향후 현실에 미칠 영향 분석 (3~4문장)",
  "psychologicalInsight": "무의식과 심리적 상태에 대한 따뜻한 진단",
  "recommendedAction": "이 꿈을 꾼 후 취하면 좋은 행동/마음가짐",
  "luckyNumbers": [7, 12, 23, 31, 38, 45] // 꿈과 관련된 길조 번호 6개
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("AI Dream error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // AI Fortune Guru Live Q&A Chat
  app.post("/api/fortune/ai-chat", async (req, res) => {
    try {
      const { messages, userContext } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(200).json({
          success: false,
          reply: "도사님이 잠시 명상 중입니다. 잠시 후 다시 여쭤봐 주시거나 오늘의 사주 운세를 확인해 보세요.",
        });
      }

      const systemInstruction = `당신은 '천기누설 운명도사'입니다.
조선시대 최고의 명리학자이자 따뜻하고 지혜로운 할아버지처럼 이야기합니다.
말투는 부드러운 하오체나 정중하고 정감 있는 경어체(~하였소, ~하옵니다, ~해보시게나, ~랍니다)를 섞어 신비롭고 위로가 되는 톤으로 답변합니다.
사용자의 생년월일 정보: ${JSON.stringify(userContext || {})}
답변 시:
1. 사용자의 상황에 깊이 공감하고 위로와 용기를 북돋아 줍니다.
2. 음양오행, 시기, 기운의 흐름을 빗대어 현실적이고 현명한 처세술을 제시합니다.
3. 2~4문단으로 읽기 편하게 핵심을 전하세요.`;

      const formattedContents = (messages || []).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      return res.json({
        success: true,
        reply: response.text || "운명의 흐름은 늘 변화하는 법이니, 마음을 편히 가지시게나.",
      });
    } catch (error: any) {
      console.error("AI Chat error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
        reply: "기운이 흐트러졌사오니, 잠시 마음을 가다듬고 다시 물어보시게나.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[오늘의 운세] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
