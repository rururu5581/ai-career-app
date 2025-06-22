
import React, { useState, useCallback, ChangeEvent } from 'react';

interface ResumeUploadProps {
  onAnalyze: (resumeText: string) => void;
  disabled: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onAnalyze, disabled }) => {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFile(null);
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "text/plain" || selectedFile.name.endsWith(".txt")) {
        setFile(selectedFile);
      } else {
        setError("テキストファイル (.txt) を選択してください。(Please select a text file (.txt).)");
      }
    }
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(event.target.value);
    if (event.target.value.trim() !== '') {
        setError(null);
    }
  };

  const handleSubmit = useCallback(() => {
    setError(null);
    if (uploadMethod === 'file') {
      if (!file) {
        setError("ファイルが選択されていません。(No file selected.)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text.trim() === '') {
            setError("ファイルの内容が空です。(File content is empty.)");
            return;
        }
        onAnalyze(text);
      };
      reader.onerror = () => {
        setError("ファイルの読み込みに失敗しました。(Failed to read file.)");
      };
      reader.readAsText(file);
    } else { // text input
      if (textInput.trim() === '') {
        setError("経歴書テキストを入力してください。(Please enter resume text.)");
        return;
      }
      onAnalyze(textInput);
    }
  }, [file, textInput, onAnalyze, uploadMethod]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setUploadMethod('file')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            uploadMethod === 'file' ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ファイルアップロード
        </button>
        <button
          onClick={() => setUploadMethod('text')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            uploadMethod === 'text' ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          テキスト入力
        </button>
      </div>

      {uploadMethod === 'file' ? (
        <div>
          <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700 mb-1">
            職務経歴書ファイル (.txt形式):
          </label>
          <input
            id="resumeFile"
            type="file"
            accept=".txt,text/plain"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-light file:text-primary-dark
              hover:file:bg-primary"
            disabled={disabled}
          />
          {file && <p className="mt-2 text-sm text-gray-600">選択中のファイル: {file.name}</p>}
        </div>
      ) : (
        <div>
          <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-1">
            職務経歴書テキスト:
          </label>
          <textarea
            id="resumeText"
            rows={10}
            value={textInput}
            onChange={handleTextChange}
            placeholder="ここに職務経歴書のテキストを貼り付けてください..."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-shadow"
            disabled={disabled}
          />
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={disabled || (uploadMethod === 'file' && !file && textInput.trim() === '') || (uploadMethod === 'text' && textInput.trim() === '')}
        className="w-full mt-4 px-6 py-3 bg-accent hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="heroicon mr-2 h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12h.008v.008h-.008V12ZM15.75 21h.008v.008h-.008V21Zm-7.5 0h.008v.008h-.008V21Z" />
        </svg>
        AIで分析する (Analyze with AI)
      </button>
       <p className="mt-4 text-xs text-gray-500 text-center">
        注意: 機密情報や個人を特定できる情報（氏名、連絡先など）は、アップロードまたは入力する前に削除または仮名に置き換えてください。
      </p>
    </div>
  );
};
