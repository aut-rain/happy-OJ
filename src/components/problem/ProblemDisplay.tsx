import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Problem } from '@/types/problem';

// Difficulty badge component
const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '★☆☆';
      case 'medium':
        return '★★☆';
      case 'hard':
        return '★★★';
      default:
        return '★☆☆';
    }
  };
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getDifficultyStyles(difficulty)}`}>
      <span>{difficulty}</span>
      <span className="text-yellow-500">{getDifficultyStars(difficulty)}</span>
    </div>
  );
};

// Problem tags component
const ProblemTags: React.FC<{ tags: string[] }> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map(tag => (
        <span 
          key={tag}
          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

// Problem metadata component
const ProblemMetadata: React.FC<{ 
  timeLimit: number; 
  memoryLimit: number;
  acceptance: number;
}> = ({ timeLimit, memoryLimit, acceptance }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-clock"></i>
        <span>时间限制: {timeLimit}ms</span>
      </div>
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-memory"></i>
        <span>内存限制: {memoryLimit}MB</span>
      </div>
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-check-circle"></i>
        <span>通过率: {acceptance}%</span>
      </div>
    </div>
  );
};

interface ProblemDisplayProps {
  problem: Problem;
}

export default function ProblemDisplay({ problem }: ProblemDisplayProps) {
  return (
    <div className="prose dark:prose-invert prose-lg max-w-none">
      {/* Problem header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <ProblemTags tags={problem.tags} />
        <ProblemMetadata 
          timeLimit={problem.timeLimit} 
          memoryLimit={problem.memoryLimit}
          acceptance={problem.acceptance}
        />
      </div>
      
      {/* Problem description in Markdown */}
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        className="prose dark:prose-invert prose-lg max-w-none"
      >
        {problem.description}
      </ReactMarkdown>
    </div>
  );
}