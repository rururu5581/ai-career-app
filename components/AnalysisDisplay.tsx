import React, { useRef, lazy, Suspense } from 'react';
import { QuestionCard } from './QuestionCard';
import { JobSuggestionCard } from './JobSuggestionCard';

// PdfExportButtonは遅延読み込みされます
const PdfExportButton = lazy(() => import('./PdfExportButton'));

// 型定義
interface InterviewQuestion {
  category: string;
  question: string;
}
interface JobSuggestion {
  title: string;
  reasoning: string;
}
interface AnalysisDisplayProps {
  analysisData: {
    questions: InterviewQuestion[];
    jobRoles: JobSuggestion[];
  };
  onReset: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysisData, onReset }) => {
  // ▼▼▼ ここを修正しました ▼▼▼
  // PDF出力の対象となるdiv要素への参照を作成します。
  // 型は `HTMLDivElement` を指定し、初期値は `null` です。
  const pdfExportAreaRef = useRef<HTMLDivElement>(null);
  // ▲▲▲ ここまで修正 ▲▲▲

  // analysisData がまだない場合は何も表示しない（安全対策）
  if (!analysisData || !analysisData.questions || !analysisData.jobRoles) {
    return null;
  }

  return (
    <div className="analysis-container">
      {/* このdiv要素にrefを渡すことで、DOM要素への参照が確立されます */}
      <div ref={pdfExportAreaRef}>
        <div className="section">
          <h2 className="section-title">AIによる想定面談質問 (AI Suggested Interview Questions)</h2>
          {analysisData.questions.map((q, index) => (
            <QuestionCard key={index} question={q} />
          ))}
        </div>

        <div className="section">
          <h2 className="section-title">AIによるおすすめ職種 (AI Recommended Job Roles)</h2>
          {analysisData.jobRoles.map((role, index) => (
            <JobSuggestionCard key={index} suggestion={role} />
          ))}
        </div>
      </div>

      <div className="button-area">
        <Suspense fallback={<button className="export-button" disabled>読み込み中...</button>}>
          <PdfExportButton 
            exportTargetRef={pdfExportAreaRef} 
            className="export-button"
          />
        </Suspense>
        
        <button onClick={onReset} className="reset-button">
          新しい経歴書で分析する
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;