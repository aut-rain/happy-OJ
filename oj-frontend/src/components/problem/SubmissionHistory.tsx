import { Submission, SubmissionResult } from '@/types/problem';
import { MOCK_PROGRAMMING_LANGUAGES } from '@/mocks/problems';

// Get language name from ID
const getLanguageName = (languageId: string) => {
  const language = MOCK_PROGRAMMING_LANGUAGES.find(l => l.id === languageId);
  return language ? language.name : languageId;
};

// Get result badge style
const getResultBadgeStyle = (result: SubmissionResult) => {
  switch (result) {
    case 'accepted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'wrong_answer':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'time_limit_exceeded':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'memory_limit_exceeded':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'compile_error':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

// Get result icon
const getResultIcon = (result: SubmissionResult) => {
  switch (result) {
    case 'accepted':
      return <i className="fa-solid fa-check text-green-500"></i>;
    case 'wrong_answer':
      return <i className="fa-solid fa-times text-red-500"></i>;
    case 'time_limit_exceeded':
      return <i className="fa-solid fa-hourglass-end text-orange-500"></i>;
    case 'memory_limit_exceeded':
      return <i className="fa-solid fa-memory text-purple-500"></i>;
    case 'compile_error':
      return <i className="fa-solid fa-exclamation-triangle text-yellow-500"></i>;
    default:
      return <i className="fa-solid fa-question-circle text-gray-500"></i>;
  }
};

// Format date to relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}秒前`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}天前`;
};

interface SubmissionHistoryProps {
  submissions: Submission[];
}

export default function SubmissionHistory({ submissions }: SubmissionHistoryProps) {
  if (submissions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <i className="fa-solid fa-file-code text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
        <p className="text-gray-500 dark:text-gray-400">暂无提交记录</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">提交你的代码开始解题吧</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="hidden md:grid grid-cols-[80px_100px_100px_100px_1fr] border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
        <div>结果</div>
        <div>语言</div>
        <div>用时</div>
        <div>内存</div>
        <div>提交时间</div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {submissions.map(submission => (
          <div 
            key={submission.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="md:hidden flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getResultIcon(submission.result)}
                <span className={`font-medium ${submission.result === 'accepted' ? 'text-green-600' : 'text-gray-800 dark:text-gray-200'}`}>
                  {submission.result === 'accepted' ? '通过' : 
                   submission.result === 'wrong_answer' ? '答案错误' :
                   submission.result === 'time_limit_exceeded' ? '超时' :
                   submission.result === 'compile_error' ? '编译错误' : '运行错误'}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(submission.submittedAt)}
              </span>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-[80px_100px_100px_100px_1fr] gap-4 items-center">
              <div className="hidden md:flex items-center">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${getResultBadgeStyle(submission.result)}`}>
                  {getResultIcon(submission.result)}
                </span>
              </div>
              
              <div className="text-sm">
                {getLanguageName(submission.language)}
              </div>
              
              <div className="text-sm">
                {submission.executionTime ? `${submission.executionTime}ms` : '-'}
              </div>
              
              <div className="text-sm">
                {submission.memoryUsed ? `${(submission.memoryUsed / 1024).toFixed(1)}MB` : '-'}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 md:text-left">
                {formatRelativeTime(submission.submittedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}