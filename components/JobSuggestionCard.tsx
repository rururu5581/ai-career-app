
import React from 'react';
import type { JobSuggestion } from '../types';

interface JobSuggestionCardProps {
  suggestion: JobSuggestion;
}

export const JobSuggestionCard: React.FC<JobSuggestionCardProps> = ({ suggestion }) => {
  return (
    <div className="bg-emerald-50 p-5 rounded-lg shadow-md border-l-4 border-accent transition-all hover:shadow-lg">
      <h4 className="text-lg font-semibold text-accent mb-1">{suggestion.title}</h4>
      <p className="text-neutral-dark text-sm">{suggestion.reasoning}</p>
    </div>
  );
};
