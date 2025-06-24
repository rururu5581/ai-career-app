// Gemini APIをインポート
import { GoogleGenerativeAI } from '@google/generative-ai';
// 型定義をインポート
import type { AnalysisResult } from '../types';

/**
 * 職務経歴書テキストをGemini APIに送信し、分析結果（想定質問とおすすめ職種）を返す関数
 * @param text ユーザーが入力した職務経歴書のテキスト
 * @returns 分析結果のオブジェクト (Promise)
 */
export const analyzeResumeWithGemini = async (text: string): Promise<AnalysisResult> => {
  // 環境変数からAPIキーを取得
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // APIキーがない場合はエラーを投げる
    throw new Error("APIキーが設定されていません。");
  }

  // Gemini APIのクライアントを初期化
  const genAI = new GoogleGenerativeAI(apiKey);
  // 使用するモデルを指定
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  // AIに渡す指示（プロンプト）を作成
  const prompt = `
    # 指示
    あなたは優秀なキャリアアドバイザーです。
    以下の##職務経歴書を分析し、次の##出力形式（JSON）に従って、日本語で出力してください。

    ## 出力形式
    - "questions": 経歴に基づいた具体的な面接の想定質問を5つ生成してください。質問は"category"（質問のカテゴリ）と"question"（質問文）のペアにしてください。
    - "jobRoles": この経歴の強みを活かせる職種を3つ提案してください。"title"（職種名）と"reasoning"（なぜその職種が適しているかの簡潔な理由）のペアにしてください。

    \`\`\`json
    {
      "questions": [
        { "category": "経験の深掘り", "question": "（具体的な質問文）" }
      ],
      "jobRoles": [
        { "title": "（具体的な職種名）", "reasoning": "（具体的な推薦理由）" }
      ]
    }
    \`\`\`

    ## 職務経歴書
    ${text}
  `;

  try {
    // AIにプロンプトを送信し、応答を待つ
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // AIからの応答テキストからJSON部分を安全に抽出する
    // マークダウンのコードブロック(` ```json `と` ``` `)で囲まれている場合を考慮
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText;
    
    // JSON文字列をパース（解析）してJavaScriptオブジェクトに変換
    const parsedResult: AnalysisResult = JSON.parse(jsonString);

    // データ構造が正しいかどうかの簡易チェック（型ガード）
    if (
      !Array.isArray(parsedResult.questions) || 
      !Array.isArray(parsedResult.jobRoles)
    ) {
      // 期待した形式でなければエラーを投げる
      throw new Error("AIからの応答のJSON形式が期待したものと異なります。");
    }

    // 正しい形式のオブジェクトを返す
    return parsedResult;

  } catch (error) {
    // エラーが発生した場合は、コンソールに詳細を記録し、より分かりやすいエラーを投げる
    console.error("Gemini APIの処理中にエラーが発生しました:", error);
    throw new Error("AIによる分析中に予期せぬエラーが発生しました。");
  }
};