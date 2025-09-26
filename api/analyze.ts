// /api/analyze.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'text is required from the client' });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not configured on the server.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 1. 利用可能なモデル一覧を取得
    const models = await genAI.listModels();

    // 2. gemini-1.5-flash 系のモデルだけフィルタ
    const flashModels = models.filter((m: any) =>
      m.name.includes("gemini-1.5-flash")
    );

    if (flashModels.length === 0) {
      throw new Error("利用可能な gemini-1.5-flash モデルが見つかりません。");
    }

    // 3. 名前順で最新っぽいものを選択（例: -002 > -001 > 無印）
    //    APIの仕様によっては "supportedMethods" を見て generateContent 可能なものだけ残す
    flashModels.sort((a: any, b: any) => b.name.localeCompare(a.name));
    const latestModel = flashModels[0].name;

    console.log("選択された最新版モデル:", latestModel);

    // 4. 最新モデルで生成
    const model = genAI.getGenerativeModel({ model: latestModel });

    const prompt = `
      # 指示
      あなたは、入力されたテキストを分析し、必ず指定されたJSON形式で応答を返す、厳格なデータ処理APIです。
      絶対に会話や挨拶、前置き、後書き、説明、言い訳を含めないでください。
      応答は、必ず\`\`\`json から始まり、\`\`\` で終わる単一のJSONコードブロックのみにしてください。

      ## タスク
      以下の##職務経歴書を分析し、次の##出力形式（JSON）に従って、日本語で出力してください。

      ## 出力形式
      {
        "questions": [
          { "category": "経験の深掘り", "question": "（経歴に基づいた具体的な面接の想定質問）" }
        ],
        "jobRoles": [
          { "title": "（強みを活かせる具体的な職種名）", "reasoning": "（なぜその職種が適しているかの簡潔な理由）" }
        ]
      }

      ## 職務経歴書
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : responseText.trim();

    if (!jsonString) {
      throw new Error("AIからの応答から有効なJSONを抽出できませんでした。");
    }

    res.status(200).json({ result: jsonString });

  } catch (error: any) {
    console.error("Error in API route (/api/analyze):", error);
    res.status(500).json({ message: error.message || 'An unknown server error occurred.' });
  }
}
