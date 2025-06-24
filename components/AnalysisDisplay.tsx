import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 外部コンポーネントのインポート（実際のファイルパスに合わせてください）
import { QuestionCard } from './QuestionCard';
import { JobSuggestionCard } from './JobSuggestionCard';

// -------------------- 型定義 --------------------
// `types.ts`で定義されている型と一致させる

// 質問カード用のデータ型
interface InterviewQuestion {
  category: string;
  question: string; // "text" ではなく "question" だった
}

// おすすめ職種カード用のデータ型
interface JobSuggestion {
  title: string;
  reasoning: string; // "reasoning" プロパティを追加
}

// コンポーネントが受け取るprops全体の型
interface AnalysisDisplayProps {
  analysisData: {
    questions: InterviewQuestion[]; // 型名を変更
    jobRoles: JobSuggestion[];   // 型名を変更
  };
  onReset: () => void;
}

// -------------------- コンポーネント本体 --------------------
const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysisData, onReset }) => {
  // PDFとして出力したいエリア全体を囲むためのref
  const pdfExportAreaRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = () => {
    const elementToCapture = pdfExportAreaRef.current;
    if (!elementToCapture) {
      console.error("PDF出力対象の要素が見つかりません。");
      return;
    }

    html2canvas(elementToCapture, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('AIキャリア分析結果.pdf');
    });
  };

  // analysisDataが存在しない、または空の場合は何も表示しない
  if (!analysisData || !analysisData.questions || !analysisData.jobRoles) {
    return null;
  }

  return (
    // classNameはご自身のプロジェクトのCSSに合わせて調整してください
    <div className="analysis-container">
      {/* ↓↓↓ このdivが出力範囲になります ↓↓↓ */}
      <div ref={pdfExportAreaRef}>
<div className="section">
  <h2 className="section-title">AIによる想定面談質問 (AI Suggested Interview Questions)</h2>
  {analysisData.questions.map((q, index) => (
    // こちらは "question" でデータを渡します
    <QuestionCard key={index} question={q} />
  ))}
</div>

<div className="section">
  <h2 className="section-title">AIによるおすすめ職種 (AI Recommended Job Roles)</h2>
  {analysisData.jobRoles.map((role, index) => (
    // こちらは "suggestion" でデータを渡します
    <JobSuggestionCard key={index} suggestion={role} />
  ))}
</div>
      </div>
      {/* ↑↑↑ このdivが出力範囲になります ↑↑↑ */}

      <div className="button-area">
        <button onClick={handleExportPdf} className="export-button">
          結果をPDFでダウンロード
        </button>
        <button onClick={onReset} className="reset-button">
          新しい経歴書で分析する
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;