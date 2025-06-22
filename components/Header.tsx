
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary shadow-lg">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25h-13.5A2.25 2.25 0 0 1 3 18V6.375c0-.621.504-1.125 1.125-1.125H7.5M12 15L9 12l3-3m5.25 6L14.25 12l3-3" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <h1 className="text-3xl font-bold text-white">
            AIキャリア面談アシスタント
          </h1>
        </div>
        <p className="text-primary-light text-sm mt-1">あなたのキャリア戦略をAIがサポート (AI supports your career strategy)</p>
      </div>
    </header>
  );
};
