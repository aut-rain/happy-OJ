import { useState } from 'react';
import { motion } from 'framer-motion';

// Mock data for filter tags
const ALGORITHM_TAGS = [
  { id: 'array', name: '数组', count: 128 },
  { id: 'string', name: '字符串', count: 96 },
  { id: 'math', name: '数学', count: 87 },
  { id: 'dp', name: '动态规划', count: 76 },
  { id: 'tree', name: '树', count: 68 },
  { id: 'graph', name: '图', count: 54 },
  { id: 'sort', name: '排序', count: 42 },
  { id: 'search', name: '搜索', count: 39 },
  { id: 'greedy', name: '贪心', count: 36 },
  { id: 'backtrack', name: '回溯', count: 32 },
  { id: 'bit', name: '位运算', count: 28 },
  { id: 'hash', name: '哈希', count: 24 }
];

const DIFFICULTY_TAGS = [
  { id: 'easy', name: '简单', count: 156 },
  { id: 'medium', name: '中等', count: 243 },
  { id: 'hard', name: '困难', count: 108 }
];

const ACCEPTANCE_TAGS = [
  { id: 'high', name: '高通过率 (>70%)', count: 124 },
  { id: 'medium', name: '中等通过率 (30%-70%)', count: 287 },
  { id: 'low', name: '低通过率 (<30%)', count: 96 }
];

interface TagFilterSidebarProps {
  currentProblemTags: string[];
  onClose?: () => void;
}

export default function TagFilterSidebar({ currentProblemTags, onClose }: TagFilterSidebarProps) {
  const [activeTags, setActiveTags] = useState<string[]>(currentProblemTags);
  
  const toggleTag = (tagId: string) => {
    setActiveTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Sidebar header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold">题目筛选</h2>
        <button 
          onClick={onClose}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Algorithm tags section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">算法类型</h3>
          <div className="flex flex-wrap gap-2">
            {ALGORITHM_TAGS.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all
                  ${activeTags.includes(tag.id)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-70">({tag.count})</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Difficulty tags section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">难度</h3>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_TAGS.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all
                  ${activeTags.includes(tag.id)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-70">({tag.count})</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Acceptance tags section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">通过率</h3>
          <div className="flex flex-wrap gap-2">
            {ACCEPTANCE_TAGS.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all
                  ${activeTags.includes(tag.id)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-70">({tag.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Apply filters button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          应用筛选
        </button>
      </div>
    </div>
  );
}