import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// 定义题目类型
interface Problem {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  acceptance: number;
}

// 定义标签类型
interface Tag {
  id: string;
  name: string;
  count: number;
}

// 模拟题目数据
const MOCK_PROBLEMS: Problem[] = [
  {
    id: 1001,
    title: "A + B Problem",
    difficulty: "easy",
    tags: ["Math", "Beginner"],
    acceptance: 89.2
  },
  {
    id: 1002,
    title: "Two Sum",
    difficulty: "easy",
    tags: ["Array", "Hash Table"],
    acceptance: 45.6
  },
  {
    id: 1003,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    tags: ["String", "Sliding Window"],
    acceptance: 30.4
  },
  {
    id: 1004,
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    tags: ["Array", "Binary Search"],
    acceptance: 29.6
  }
];

// 模拟热门标签
const POPULAR_TAGS: Tag[] = [
  { id: "array", name: "Array", count: 128 },
  { id: "string", name: "String", count: 96 },
  { id: "math", name: "Math", count: 87 },
  { id: "dp", name: "Dynamic Programming", count: 76 },
  { id: "tree", name: "Tree", count: 68 },
  { id: "graph", name: "Graph", count: 54 },
  { id: "sort", name: "Sorting", count: 42 },
  { id: "search", name: "Search", count: 39 }
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 视差滚动效果
  useEffect(() => {
    const handleParallax = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
      }
    };
    
    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  // 难度标签样式映射
  const difficultyStyles = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 导航栏 */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-2" 
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-code text-2xl text-blue-600 dark:text-blue-400"></i>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CodeJudge
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                首页
              </Link>
              <Link to="/problems" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                题目
              </Link>
              <Link to="/rankings" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                排行榜
              </Link>
              <Link to="/contests" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                竞赛
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                <i className="fa-solid fa-user-plus"></i>
                <span>注册</span>
              </button>
              <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                登录
              </button>
              <button className="md:hidden text-xl">
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* 英雄区域 - 带动态效果 */}
        <section 
          ref={heroRef}
          className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 bg-[length:120%_120%] bg-position-0-0 transition-all duration-500 overflow-hidden"
        >
          {/* 背景装饰元素 */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-[10%] left-[10%] w-64 h-64 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-50"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute bottom-[15%] right-[15%] w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-50"
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
          
          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  提升你的<span className="relative inline-block">
                    编程技能
                    <motion.span 
                      className="absolute -bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-50 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </span>
                </h1>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
              >
                加入我们的在线评测平台，挑战编程题目，提升算法能力，与全球开发者一起成长
              </motion.p>
              
              {/* 搜索框 - 带动态交互效果 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={cn(
                  "relative max-w-2xl mx-auto",
                  isSearchFocused ? "scale-[1.02]" : "scale-100",
                  "transition-transform duration-300"
                )}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索题目、标签或内容..."
                    className="w-full px-5 py-4 pr-14 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                    <i className="fa-solid fa-search"></i>
                  </button>
                </div>
                
                {/* 搜索建议 - 仅在聚焦时显示 */}
                <AnimatePresence>
                  {isSearchFocused && searchQuery.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10"
                    >
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">热门搜索</h3>
                        <div className="flex flex-wrap gap-2">
                          {["数组", "字符串", "动态规划", "二分查找"].map((item) => (
                            <span 
                              key={item}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">相关题目</h3>
                        <ul>
                          {MOCK_PROBLEMS.filter(p => 
                            p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                          ).slice(0, 3).map(problem => (
                            <li key={problem.id}>
                              <Link to={`/problems/${problem.id}`} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <div>
                                  <div className="font-medium">{problem.title}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {problem.tags.join(", ")}
                                  </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${difficultyStyles[problem.difficulty]}`}>
                                  {problem.difficulty}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* 快速开始按钮 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-10"
              >
                <Link 
                  to="/problems"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <span>开始刷题</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </motion.div>
            </div>
          </div>
          
          {/* 波浪装饰 */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path 
                fill="#f9fafb" 
                fillOpacity="1" 
                d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
                className="dark:hidden"
              ></path>
              <path 
                fill="#111827" 
                fillOpacity="1" 
                d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
                className="hidden dark:block"
              ></path>
            </svg>
          </div>
        </section>

        {/* 平台特点 */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">为什么选择我们的OJ平台</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                我们提供全面的编程练习环境，帮助你提升算法能力，为面试和竞赛做好准备
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* 特点卡片 1 */}
              <motion.div 
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl mb-6">
                  <i className="fa-solid fa-code"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">丰富的题目库</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  超过1000道高质量编程题目，涵盖算法、数据结构、数学等多个领域，从入门到进阶全覆盖
                </p>
              </motion.div>
              
              {/* 特点卡片 2 */}
              <motion.div 
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl mb-6">
                  <i className="fa-solid fa-terminal"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">实时代码评测</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  提交代码后立即获得评测结果，详细的错误信息和执行时间，帮助你快速定位问题
                </p>
              </motion.div>
              
              {/* 特点卡片 3 */}
              <motion.div 
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 text-2xl mb-6">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">竞赛与排行榜</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  定期举办模拟竞赛，实时排行榜展示你的进步，与全球用户一较高下
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 热门题目 */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">热门题目</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                  探索最受欢迎的编程挑战，提升你的算法和编程技能
                </p>
              </div>
              <Link 
                to="/problems"
                className="mt-4 md:mt-0 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>查看全部题目</span>
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">题目</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">难度</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">通过率</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {MOCK_PROBLEMS.map((problem) => (
                      <tr 
                        key={problem.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">{problem.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <Link to={`/problems/${problem.id}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {problem.title}
                            </Link>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {problem.tags.map((tag) => (
                              <span 
                                key={tag}
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${difficultyStyles[problem.difficulty]}`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{problem.acceptance}%</td>
                        <td className="px-6 py-4">
                          <Link 
                            to={`/problems/${problem.id}`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          >
                            做题
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 热门标签 */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">按标签浏览</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                通过热门标签快速找到你感兴趣的题目类型
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {POPULAR_TAGS.map((tag) => (
                <motion.a
                  key={tag.id}
                  href={`/problems?tag=${tag.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-gray-800 dark:text-gray-200">{tag.name}</span>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">{tag.count}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* 行动召唤 */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">准备好提升你的编程技能了吗？</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              加入我们的OJ平台，开始你的编程之旅，挑战自我，成为更好的开发者
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/problems"
                className="px-8 py-4 bg-white text-blue-600 font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                立即开始刷题
              </Link>
              <Link 
                to="/register"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all"
              >
                注册账号
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-white text-xl font-bold mb-4">
                <i className="fa-solid fa-code"></i>
                <span>CodeJudge</span>
              </div>
              <p className="mb-4">
                提供高质量的编程题目和评测服务，帮助开发者提升算法能力
              </p>
              <div className="flex gap-4 text-xl">
                <a href="https://github.com/aut-rain/happy-OJ" className="hover:text-white transition-colors"><i className="fa-brands fa-github"></i></a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">平台</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">题目列表</a></li>
                <li><a href="#" className="hover:text-white transition-colors">竞赛活动</a></li>
                <li><a href="#" className="hover:text-white transition-colors">排行榜</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">资源</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">教程文档</a></li>
                <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">法律</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
                <li><a href="#" className="hover:text-white transition-colors">服务条款</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie政策</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} CodeJudge. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
