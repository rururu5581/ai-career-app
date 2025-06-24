import type { AnalysisResult } from '../types';

// ... (おそらくGoogleGenerativeAIのインポートなどがあるはず)

// ★★★ analyzeResumeWithGemini 関数を以下のように修正してください ★★★
export const analyzeResumeWithGemini = async (text: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("APIキーが設定されていません。");
  }

  // Gemini APIへのリクエストをセットアップ (既存のコードに合わせてください)
  // const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    以下の職務経歴書を分析し、次のJSON形式で出力してください。
    - "questions": 想定される面接質問を5つ生成します。質問は"category"（例:「経験について」）と"question"（質問文）のペアにしてください。
    - "jobRoles": この経歴にマッチする職種を3つ提案します。"title"（職種名）と"reasoning"（推薦理由）のペアにしてください。

    {
      "questions": [
        { "category": "カテゴリ", "question": "質問文" }
      ],
      "jobRoles": [
        { "title": "職種名", "reasoning": "推薦理由" }
      ]
    }

    ---
    職務経歴書:
    ${text}
  `;

  // const result = await model.generateContent(prompt);
  // const response = await result.response;
  // const responseText = response.text();

  // --- ↓↓↓ ここからが重要な変更点 ↓↓↓ ---
  
  // テスト用のダミーデータ（実際のAPI通信がうまくいくまでの仮データ）
  // 実際のAPI通信を行う場合は、以下の4行はコメントアウトしてください。
  const responseText = JSON.stringify({
    questions: [{ category: "自己紹介", question: "これまでの経歴を簡単に教えてください。" }],
    jobRoles: [{ title: "Webデベロッパー", reasoning: "フロントエンドとバックエンドの経験が豊富です。" }]
  });


  try {
    // AIからの応答テキストからJSON部分を抽出する
    // マークダウンのコードブロック(` ```json `と` ``` `)で囲まれている場合を考慮
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText;
    
    // JSON文字列をパースしてオブジェクトに変換
    const parsedResult: AnalysisResult = JSON.parse(jsonString);

    // 型ガード（念のため、データ構造が正しいかチェック）
    if (
      !Array.isArray(parsedResult.questions) || 
      !Array.isArray(parsedResult.jobRoles)
    ) {
      throw new Error("AIからの応答の形式が正しくありません。");
    }

    return parsedResult;

  } catch (error) {
    console.error("AIからの応答のパースに失敗しました:", responseText, error);
    throw new Error("AIからの応答を処理できませんでした。");
  }
};