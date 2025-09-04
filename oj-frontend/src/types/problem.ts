/**
 * 题目难度类型
 */
export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

/**
 * 测试样例类型
 */
export interface TestCase {
  input: string;
  output: string;
}

/**
 * 题目类型定义 - 符合ACM赛制
 */
export interface Problem {
  /** 题目唯一ID */
  id: number;
  
  /** 题目标题 */
  title: string;
  
  /** 题目描述（Markdown格式） */
  description: string;
  
  /** 输入格式（Markdown格式） */
  inputFormat: string;
  
  /** 输出格式（Markdown格式） */
  outputFormat: string;
  
  /** 测试样例 */
  testCases: TestCase[];
  
  /** 提示信息（Markdown格式） */
  hint?: string;
  
  /** 题目难度 */
  difficulty: ProblemDifficulty;
  
  /** 时间限制（毫秒） */
  timeLimit: number;
  
  /** 内存限制（MB） */
  memoryLimit: number;
  
  /** 题目标签 */
  tags: string[];
  
  /** 通过率 */
  acceptance: number;
  
  /** 提交次数 */
  submissionCount: number;
  
  /** 解决次数 */
  solveCount: number;
  
  /** 创建时间 */
  createdAt: string;
  
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 题目列表项类型 - 用于列表展示的简化版本
 */
export interface ProblemListItem extends Pick<Problem, 'id' | 'title' | 'difficulty' | 'tags' | 'acceptance'> {
  /** 是否被当前用户解决 */
  isSolved?: boolean;
}

/**
 * 编程语言类型
 */
export interface ProgrammingLanguage {
  /** 语言唯一标识 */
  id: string;
  
  /** 语言名称 */
  name: string;
  
  /** 文件扩展名 */
  extension: string;
  
  /** 代码高亮模式 */
  highlightMode: string;
  
  /** 编译器/解释器命令 */
  command: string;
}

/**
 * 代码提交结果类型
 */
export type SubmissionResult = 'pending' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compile_error';

/**
 * 代码提交记录类型
 */
export interface Submission {
  /** 提交ID */
  id: string;
  
  /** 题目ID */
  problemId: number;
  
  /** 用户ID */
  userId: string;
  
  /** 编程语言 */
  language: string;
  
  /** 提交时间 */
  submittedAt: string;
  
  /** 评测结果 */
  result: SubmissionResult;
  
  /** 执行时间（毫秒） */
  executionTime?: number;
  
  /** 内存使用（KB） */
  memoryUsed?: number;
  
  /** 代码长度 */
  codeLength: number;
  
  /** 评测信息 */
  judgeInfo?: string;
}