import React, { useState, useCallback } from 'react';
import { ResumeUpload } from './components/ResumeUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { analyzeResumeWithGemini } from './services/geminiService';
// ↓↓↓ 修正した types.ts からインポートします
import type { AnalysisResult } from './types'; 
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyError("APIキーが設定されていません。環境変数 'API_KEY' を設定してください。");
      console.error("API_KEY is not set in environment variables.");
    }
  }, []);

  const handleResumeAnalysis = useCallback(async (text: string) => {
    if (!process.env.API_KEY) {
      setError("APIキーが設定されていません。");
      setApiKeyError("APIキーが設定されていません。環境変数 'API_KEY' を設定してください。");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResumeWithGemini(text);
      setAnalysisResult(result);
    } catch (e) {
      console.error("Error during analysis:", e);
      if (e instanceof Error) {
        setError(`分析中にエラーが発生しました: ${e.message}`);
      } else {
        setError("分析中に不明なエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClear = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-light via-slate-100 to-sky-100 text-neutral-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {apiKeyError && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p className="font-bold">設定エラー (Configuration Error)</p>
                <p>{apiKeyError}</p>
            </div>
        )}
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            キャリア面談サポート
          </h2>
          
          {!analysisResult && !isLoading && (
            <ResumeUpload onAnalyze={handleResumeAnalysis} disabled={isLoading || !!apiKeyError} />
          )}

          {isLoading && <LoadingSpinner />}
          
          {error && !isLoading && <ErrorMessage message={error} />}

          {/* ↓↓↓ ボタンが重複しないように、AnalysisDisplayのみを表示 ↓↓↓ */}
          {analysisResult && !isLoading && (
            <AnalysisDisplay analysisData={analysisResult} onReset={handleClear} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;