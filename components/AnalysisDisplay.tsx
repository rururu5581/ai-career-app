
import React from 'react';
import type { AnalysisResult } from '../types';
import { QuestionCard } from './QuestionCard';
import { JobSuggestionCard } from './JobSuggestionCard';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="heroicon mr-3 h-7 w-7 text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
          AIによる想定面談質問 (AI Suggested Interview Questions)
        </h3>
        {result.interviewQuestions && result.interviewQuestions.length > 0 ? (
          <div className="space-y-4">
            {result.interviewQuestions.map((q, index) => (
              <QuestionCard key={index} question={q} />
            ))}
          </div>
        ) : (
          <p className="text-neutral">質問は生成されませんでした。(No questions were generated.)</p>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="heroicon mr-3 h-7 w-7 text-accent">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25h-13.5A2.25 2.25 0 0 1 3 18V6.375c0-.621.504-1.125 1.125-1.125H7.5M12 15L9 12l3-3m5.25 6L14.25 12l3-3" />
          </svg>
          AIによるおすすめ職種 (AI Recommended Job Roles)
        </h3>
        {result.jobSuggestions && result.jobSuggestions.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {result.jobSuggestions.map((job, index) => (
              <JobSuggestionCard key={index} suggestion={job} />
            ))}
          </div>
        ) : (
          <p className="text-neutral">職種の提案はありませんでした。(No job suggestions were generated.)</p>
        )}
      </div>
    </div>
  );
};
