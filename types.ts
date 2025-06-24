// 質問データの型
export interface InterviewQuestion {
  category: string;
  question: string;
}

// おすすめ職種のデータの型
export interface JobSuggestion {
  title: string;
  reasoning: string;
}

// Geminiからの分析結果全体の型
// これがAnalysisDisplayコンポーネントが期待するデータ構造
export interface AnalysisResult {
  questions: InterviewQuestion[];
  jobRoles: JobSuggestion[];
}