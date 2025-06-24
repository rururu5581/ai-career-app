import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// コンポーネントが受け取るPropsの型を定義します
interface PdfExportButtonProps {
  // ▼▼▼ ここが最重要ポイント ▼▼▼
  // 親から渡されるrefの型を `React.RefObject<HTMLDivElement>` と正確に指定します。
  // これで、親が渡す `useRef` の型と完全に一致します。
  exportTargetRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ exportTargetRef, className }) => {
  
  const handleExportClick = async () => {
    // refの.currentプロパティがnullでないことを確認します。
    if (!exportTargetRef.current) {
      console.error("PDF出力の対象となる要素が見つかりません。");
      alert("PDFの出力に失敗しました。対象要素が見つかりません。");
      return; // 処理を中断
    }

    try {
      const targetElement = exportTargetRef.current;
      const canvas = await html2canvas(targetElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / pdfWidth;
      const resizedImgHeight = imgHeight / ratio;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, resizedImgHeight);
      pdf.save('ai-career-analysis.pdf');

    } catch (error) {
      console.error("PDF生成中にエラーが発生しました:", error);
      alert("PDFの生成に失敗しました。");
    }
  };

  return (
    <button onClick={handleExportClick} className={className}>
      PDFとしてエクスポート
    </button>
  );
};

export default PdfExportButton;