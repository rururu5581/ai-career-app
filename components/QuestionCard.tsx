
import React from 'react';
import type { InterviewQuestion } from '../types';

interface QuestionCardProps {
  question: InterviewQuestion;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <div className="bg-sky-50 p-5 rounded-lg shadow-md border-l-4 border-secondary transition-all hover:shadow-lg">
      <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">{question.category}</p>
      <p className="text-neutral-dark text-base">{question.question}</p>
    </div>
  );
};
