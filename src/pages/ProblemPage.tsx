import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Components
import ProblemDisplay from '@/components/problem/ProblemDisplay';
import CodeEditor from '@/components/code-editor/CodeEditor';
import SubmissionHistory from '@/components/problem/SubmissionHistory';
import TagFilterSidebar from '@/components/problem/TagFilterSidebar';

// Hooks
import { useTheme } from '@/hooks/useTheme';
import useCodeAutoSave from '@/hooks/useCodeAutoSave';
import useSubmission from '@/hooks/useSubmission';

// Mocks
import { MOCK_PROBLEM_LIST, MOCK_PROBLEM_1001, MOCK_PROBLEM_1002, MOCK_PROGRAMMING_LANGUAGES } from '@/mocks/problems';
import { Problem, ProblemListItem, SubmissionResult } from '@/types/problem';

// Mock submission history data
const MOCK_SUBMISSIONS = [
  {
    id: '1',
    problemId: 1001,
    language: 'cpp',
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    result: 'accepted' as SubmissionResult,
    executionTime: 45,
    memoryUsed: 1240,
    codeLength: 356
  },
  {
    id: '2',
    problemId: 1001,
    language: 'cpp',
    submittedAt: new Date(Date.now() - 7200000).toISOString(),
    result: 'wrong_answer' as SubmissionResult,
    executionTime: 32,
    memoryUsed: 1230,
    codeLength: 342
  },
  {
    id: '3',
    problemId: 1001,
    language: 'python',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    result: 'time_limit_exceeded' as SubmissionResult,
    codeLength: 189
  }
];

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Find current problem index for navigation
  const problemList = MOCK_PROBLEM_LIST;
  const currentProblemIndex = problemList.findIndex(p => p.id === Number(id));
  
  // Auto-save code every 30 seconds
  useCodeAutoSave(`problem_${id}_${selectedLanguage}`, code, 30000);
  
  // Submission handler
  const { submitCode } = useSubmission();
  
  // Load problem data
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Mock API call to load problem data
    setTimeout(() => {
      try {
        // In a real app, this would be an API call
        const problemData = Number(id) === 1001 ? MOCK_PROBLEM_1001 : 
                           Number(id) === 1002 ? MOCK_PROBLEM_1002 : null;
        
        if (!problemData) {
          throw new Error('题目不存在');
        }
        
        setProblem(problemData);
        
        // Load saved code if available
        const savedCode = localStorage.getItem(`problem_${id}_${selectedLanguage}`);
        if (savedCode) {
          setCode(savedCode);
        } else {
          // Set default code template based on language
          setCode(getDefaultCodeTemplate(selectedLanguage));
        }
        
        setLoading(false);
      } catch (err) {
        setError('加载题目失败，请重试');
        setLoading(false);
        console.error('Error loading problem:', err);
      }
    }, 800);
  }, [id, selectedLanguage]);
  
  // Handle language change
  const handleLanguageChange = (lang: string) => {
    // Save current code before changing language
    localStorage.setItem(`problem_${id}_${selectedLanguage}`, code);
    
    setSelectedLanguage(lang);
    
    // Load code for new language if available
    const savedCode = localStorage.getItem(`problem_${id}_${lang}`);
    setCode(savedCode || getDefaultCodeTemplate(lang));
  };
  
  // Get default code template based on language
  const getDefaultCodeTemplate = (language: string): string => {
    switch(language) {
      case 'c':
        return `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`;
      case 'cpp':
        return `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`;
      case 'java':
        return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Your code here
    }
}`;
      case 'python':
        return `# Your code here
`;
      default:
        return '';
    }
  };
  
  // Handle code submission
  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('请输入代码后再提交');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Mock submission process
      const result = await submitCode({
        problemId: Number(id),
        language: selectedLanguage,
        code
      });
      
      // Add new submission to history
      setSubmissions(prev => [result, ...prev.slice(0, 4)]);
      
      // Show appropriate message based on result
      if (result.result === 'accepted') {
        toast.success('恭喜！代码通过所有测试用例');
      } else if (result.result === 'wrong_answer') {
        toast.error('答案错误，请检查你的代码');
      } else if (result.result === 'time_limit_exceeded') {
        toast.error('代码运行超时');
      } else if (result.result === 'compile_error') {
        toast.error('编译错误，请检查语法');
      } else {
        toast.error('代码运行出错');
      }
    } catch (err) {
      toast.error('提交失败，请稍后重试');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Navigation between problems
  const navigateToProblem = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentProblemIndex > 0) {
      navigate(`/problems/${problemList[currentProblemIndex - 1].id}`);
    } else if (direction === 'next' && currentProblemIndex < problemList.length - 1) {
      navigate(`/problems/${problemList[currentProblemIndex + 1].id}`);
    }
  };
  
  // Toggle mobile sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">加载题目中...</p>
      </div>
    );
  }
  
  if (error || !problem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-5xl text-red-500 mb-4">
          <i className="fa-solid fa-exclamation-triangle"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">题目加载失败</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error || '题目不存在或已被删除'}</p>
        <button 
          onClick={() => navigate('/problems')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回题目列表
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/problems')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="text-xl font-bold truncate max-w-[200px] md:max-w-none">
              {problem.id}. {problem.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
            
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fa-solid fa-filter"></i>
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Tag filter sidebar */}
        <aside className={`
          w-72 bg-white dark:bg-gray-800 shadow-md z-50
          transition-transform duration-300 ease-in-out
          fixed md:relative h-[calc(100vh-64px)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <TagFilterSidebar 
            currentProblemTags={problem.tags}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4 md:p-6">
            {/* Problem display */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-all duration-300 hover:shadow-md">
              <ProblemDisplay problem={problem} />
            </div>
            
            {/* Code editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
              {/* Language selector */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">编程语言:</span>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {MOCK_PROGRAMMING_LANGUAGES.map(lang => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !code.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                      ${isSubmitting 
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>运行中...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-play"></i>
                        <span>提交代码</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Editor container */}
              <div className="h-[400px]">
                <CodeEditor
                  language={selectedLanguage}
                  code={code}
                  onChange={setCode}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                />
              </div>
            </div>
            
            {/* Submission history */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <i className="fa-solid fa-history text-gray-500"></i>
                <span>提交历史</span>
              </h2>
              <SubmissionHistory submissions={submissions} />
            </div>
          </div>
          
          {/* Problem navigation bar */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateToProblem('prev')}
                disabled={currentProblemIndex <= 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${currentProblemIndex <= 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700'
                  }`}
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>上一题</span>
                {currentProblemIndex > 0 && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {problemList[currentProblemIndex - 1].id}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => navigateToProblem('next')}
                disabled={currentProblemIndex >= problemList.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${currentProblemIndex >= problemList.length - 1
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700'
                  }`}
              >
                <span>下一题</span>
                {currentProblemIndex < problemList.length - 1 && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {problemList[currentProblemIndex + 1].id}
                  </span>
                )}
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}