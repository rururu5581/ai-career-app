
export interface InterviewQuestion {
  category: string;
  question: string;
}

export interface JobSuggestion {
  title: string;
  reasoning: string;
}

export interface AnalysisResult {
  interviewQuestions: InterviewQuestion[];
  jobSuggestions: JobSuggestion[];
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // May include other types of chunks in the future
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // May include searchQueries etc.
}
