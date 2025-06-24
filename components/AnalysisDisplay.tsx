import React, { useRef, lazy, Suspense } from 'react';
import { QuestionCard } from './QuestionCard';
import { JobSuggestionCard } from './JobSuggestionCard';

const PdfExportButton = lazy(() => import('./PdfExportButton'));

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
  // useRefの型をHTMLDivElementに戻します。これが正しい指定です。
  const pdfExportAreaRef = useRef<HTMLDivElement>(null);

  if (!analysisData || !analysisData.questions || !analysisData.jobRoles) {
    return null;
  }

  return (
    <div className="analysis-container">
      {/* このdiv要素にrefを渡すため、型はHTMLDivElementである必要があります */}
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