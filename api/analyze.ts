import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests' });
  }

  try {
    const { text } = req.body; // フロントから送られてくるテキスト
    if (!text) {
      return res.status(400).json({ message: 'text is required' });
    }
    
    // 元のプロンプトをここに記述
    const prompt = `# 指示\nあなたは優秀なキャリアアドバイザーです...\n\n# 職務経歴書\n${text}`;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not configured on the server.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    res.status(200).json({ result: responseText });

  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
}