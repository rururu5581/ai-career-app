import React, { useState, useCallback } from 'react';
import { ResumeUpload } from './components/ResumeUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
// import { analyzeResumeWithGemini } from './services/geminiService'; // ← 不要になったので削除
import type { AnalysisResult } from './types'; 
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // apiKeyErrorはもう不要なので削除
  // const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // APIキーのチェックはサーバー側で行うため、このuseEffectは不要
  // React.useEffect(() => { ... }, []);

  // ▼▼▼ この関数を fetch を使う形に全面的に書き換えました ▼▼▼
  const handleResumeAnalysis = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // サーバーAPI('/api/analyze')にリクエストを送信
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      // サーバーからの応答をJSONとして受け取る
      const data = await response.json();

      // 応答がエラーでないかチェック
      if (!response.ok) {
        // サーバーが返したエラーメッセージを使ってエラーを投げる
        throw new Error(data.message || 'サーバーで分析エラーが発生しました。');
      }
      
      // サーバーから返ってきたJSON"文字列"を、JavaScriptオブジェクトに変換
      const result: AnalysisResult = JSON.parse(data.result);
      
      // データ構造が正しいかどうかの簡易チェック（任意ですが安全）
      if (!Array.isArray(result.questions) || !Array.isArray(result.jobRoles)) {
        throw new Error("AIからの応答のJSON形式が期待したものと異なります。");
      }

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
  // ▲▲▲ ここまで書き換え ▲▲▲

  const handleClear = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-light via-slate-100 to-sky-100 text-neutral-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* APIキーエラーの表示は不要になったので削除 */}
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            キャリア面談サポート
          </h2>
          
          {/* APIキーエラーのチェックを削除し、常にResumeUploadを表示 */}
          {!analysisResult && !isLoading && (
            <ResumeUpload onAnalyze={handleResumeAnalysis} disabled={isLoading} />
          )}

          {isLoading && <LoadingSpinner />}
          
          {error && !isLoading && <ErrorMessage message={error} />}

          {analysisResult && !isLoading && (
            // AnalysisDisplayのprop名を 'analysisData' から 'result' に合わせるか、
            // AnalysisDisplay側で 'result' を受け取るように修正
            <AnalysisDisplay analysisData={analysisResult} onReset={handleClear} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;