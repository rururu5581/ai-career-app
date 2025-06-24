import React, { useRef } from 'react';

// 外部コンポーネントのインポート
import { QuestionCard } from './QuestionCard';
import { JobSuggestionCard } from './JobSuggestionCard';

// -------------------- 型定義 --------------------
// 質問カード用のデータ型
interface InterviewQuestion {
  category: string;
  question: string;
}

// おすすめ職種カード用のデータ型
interface JobSuggestion {
  title: string;
  reasoning: string;
}

// コンポーネントが受け取るprops全体の型
interface AnalysisDisplayProps {
  analysisData: {
    questions: InterviewQuestion[];
    jobRoles: JobSuggestion[];
  };
  onReset: () => void;
}

// -------------------- コンポーネント本体 --------------------
const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysisData, onReset }) => {
  const pdfExportAreaRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    const elementToCapture = pdfExportAreaRef.current;
    if (!elementToCapture) {
      console.error("PDF出力対象の要素が見つかりません。");
      return;
    }

    // ボタンが押されてからライブラリを動的にインポート
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    const canvas = await html2canvas(elementToCapture, { scale: 2, useCORS: true });
    
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

    while (heightLeft > 0) {
      position = -pageHeight * (pdf.internal.pages.length - 1);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save('AIキャリア分析結果.pdf');
  };

  if (!analysisData || !analysisData.questions || !analysisData.jobRoles) {
    return null;
  }

  return (
    <div className="analysis-container">
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