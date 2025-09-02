import { Submission, SubmissionResult } from '@/types/problem';

// Mock evaluation function
const evaluateCode = (code: string, language: string): SubmissionResult => {
  // Simple mock evaluation based on code content and language
  // In a real application, this would be an API call to a backend judge system
  
  // Simulate different results based on code content
  if (code.includes('// accepted')) return 'accepted';
  if (code.includes('// wrong')) return 'wrong_answer';
  if (code.includes('// timeout')) return 'time_limit_exceeded';
  if (code.includes('// error')) return 'runtime_error';
  if (code.includes('// compile')) return 'compile_error';
  
  // Random result for demonstration
  const random = Math.random();
  if (random < 0.7) return 'accepted';          // 70% chance
  if (random < 0.85) return 'wrong_answer';     // 15% chance
  if (random < 0.95) return 'time_limit_exceeded'; // 10% chance
  return 'runtime_error';                       // 5% chance
};

interface SubmitCodeParams {
  problemId: number;
  language: string;
  code: string;
}

export default function useSubmission() {
  const submitCode = async (params: SubmitCodeParams): Promise<Submission> => {
    const { problemId, language, code } = params;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
    
    // Evaluate code (mock)
    const result = evaluateCode(code, language);
    
    // Generate submission data
    const submission: Submission = {
      id: Date.now().toString(),
      problemId,
      userId: 'mock_user_123', // In real app, this would be the actual user ID
      language,
      submittedAt: new Date().toISOString(),
      result,
      codeLength: code.length,
      
      // Add execution details if applicable
      executionTime: result === 'accepted' ? Math.floor(Math.random() * 500) + 50 : undefined,
      memoryUsed: result === 'accepted' ? Math.floor(Math.random() * 1024) + 512 : undefined,
      judgeInfo: result === 'compile_error' ? '语法错误: 缺少分号' : undefined
    };
    
    return submission;
  };
  
  return {
    submitCode
  };
}