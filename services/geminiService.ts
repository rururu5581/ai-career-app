
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API Key is not configured. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Non-null assertion as we check above and App.tsx also checks

const model = ai.models;

const PROMPT_TEMPLATE = (resumeText: string) => `
あなたは世界トップクラスの人材エージェントのAIアシスタントです。候補者の面談準備のため、職務経歴書を分析し、鋭い質問と最適な職務提案を生成します。

以下の職務経歴書に基づいて分析を行ってください：
---
${resumeText}
---

提供してほしい情報：
1.  洞察に満ちた面談用の質問を3～5個。これらの質問は、単なる事実確認ではなく、候補者の本質、核となる強み、動機を明らかにするための「エージェントらしい」切り口でお願いします。過去の経験、現在の状況や価値観、将来の目標について掘り下げる質問をフレームワークとしてください。
2.  この候補者に強くマッチすると思われる職務名または役割を2～3個。それぞれの提案には、1～2文の簡単な理由を添えてください。

応答は必ず以下のJSON形式で返してください：
{
  "interviewQuestions": [
    {"category": "過去の経験について", "question": "これまでのご経験の中で、最もご自身の成長に繋がったと感じるプロジェクトや出来事は何ですか？具体的にどのような困難を乗り越え、何を学ばれましたか？"},
    {"category": "現在の価値観と動機", "question": "現在、お仕事を選択される上で最も重要視されている価値観は何でしょうか？また、それが形成されたきっかけや背景について教えていただけますか？"},
    {"category": "将来のビジョンと成長", "question": "5年後、10年後、どのようなキャリアを築いていたいとお考えですか？その目標達成のために、現在取り組んでいることや、今後挑戦したいことはありますか？"},
    {"category": "強みと自己認識", "question": "ご自身が考える、他の方にはない独自の強みや才能は何だと思われますか？それを活かして、これまでどのような貢献をされてきましたか？"}
  ],
  "jobSuggestions": [
    {"title": "具体的な職種名1 (例: シニアソフトウェアエンジニア)", "reasoning": "この職種を提案する簡単な理由 (例: XXの経験とYYのスキルが合致しているため)"},
    {"title": "具体的な職種名2 (例: プロダクトマネージャー)", "reasoning": "この職種を提案する簡単な理由"}
  ]
}

質問の"category"は、例に示したもの（「過去の経験について」、「現在の価値観と動機」、「将来のビジョンと成長」、「強みと自己認識」、「挑戦と困難の克服」など）を参考に、適切に設定してください。
`;

export const analyzeResumeWithGemini = async (resumeText: string): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error("APIキーが設定されていません。 (API Key is not configured.)");
  }

  const prompt = PROMPT_TEMPLATE(resumeText);

  try {
    const response: GenerateContentResponse = await model.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, // Slightly creative but still grounded
        topP: 0.9,
        topK: 40,
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    // Basic validation of the parsed structure
    if (!parsedData.interviewQuestions || !parsedData.jobSuggestions) {
      throw new Error("APIからの応答形式が正しくありません。期待されるデータ構造が見つかりません。 (Invalid response format from API. Expected data structure not found.)");
    }
    if (!Array.isArray(parsedData.interviewQuestions) || !Array.isArray(parsedData.jobSuggestions)) {
        throw new Error("APIからの応答形式が正しくありません。「interviewQuestions」と「jobSuggestions」は配列である必要があります。 (Invalid response format from API. 'interviewQuestions' and 'jobSuggestions' must be arrays.)");
    }

    return parsedData as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    if (error instanceof Error) {
        // Check for specific Gemini API error messages if available, otherwise rethrow
        if (error.message.includes("API key not valid")) {
             throw new Error("Gemini APIキーが無効です。設定を確認してください。 (Invalid Gemini API Key. Please check your configuration.)");
        }
         throw new Error(`Gemini APIとの通信に失敗しました: ${error.message} (Failed to communicate with Gemini API: ${error.message})`);
    }
    throw new Error("Gemini APIとの通信中に不明なエラーが発生しました。 (An unknown error occurred while communicating with Gemini API.)");
  }
};
