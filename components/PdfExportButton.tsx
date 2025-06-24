import React from 'react';

interface PdfExportButtonProps {
  // 親の型に合わせて、HTMLDivElementを受け取るようにします
  exportTargetRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ exportTargetRef, className }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    
    const elementToCapture = exportTargetRef.current;
    if (!elementToCapture) {
      console.error("PDF出力対象の要素が見つかりません。");
      return;
    }

    setIsExporting(true);

    try {
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
    } catch (error) {
      console.error("PDFの生成に失敗しました:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button onClick={handleExport} className={className} disabled={isExporting}>
      {isExporting ? '生成中...' : '結果をPDFでダウンロード'}
    </button>
  );
};

export default PdfExportButton;