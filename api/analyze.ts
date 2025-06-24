// /api/analyze.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // POSTリクエスト以外は受け付けない
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    // フロントエンドから送信されたテキストを取得
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'text is required from the client' });
    }
    
    // 環境変数からAPIキーを取得
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not configured on the server.");
    }

    // Gemini APIのクライアントを初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // ▼▼▼ AIに渡す指示（プロンプト）を強化しました ▼▼▼
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

    // AIにプロンプトを送信し、応答を待つ
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // デバッグ用にAIからの生の応答をサーバーログに出力
    console.log("AIからの生の応答:", responseText);

    // AIからの応答テキストからJSON部分を安全に抽出する
    // マークダウンのコードブロック(` ```json `と` ``` `)で囲まれている場合を考慮
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
    
    // 抽出したJSON文字列が空でないか確認
    if (!jsonString) {
      throw new Error("AIからの応答から有効なJSONを抽出できませんでした。");
    }

    // 成功したら、抽出したJSON文字列をフロントエンドに返す
    res.status(200).json({ result: jsonString });

  } catch (error: any) {
    // エラーが発生した場合は、サーバーログに記録し、エラーメッセージを返す
    console.error("Error in API route (/api/analyze):", error);
    res.status(500).json({ message: error.message || 'An unknown server error occurred.' });
  }
}