import { Problem, ProblemListItem } from '@/types/problem';

/**
 * 模拟题目数据 - A + B Problem
 */
export const MOCK_PROBLEM_1001: Problem = {
  id: 1001,
  title: "A + B Problem",
  description: `# A + B Problem

这是一道经典的入门题目，用于熟悉在线评测系统的使用方法。

## 问题描述
给定两个整数 A 和 B，计算它们的和。

## 输入说明
输入包含两个整数 A 和 B，中间用空格分隔。

## 输出说明
输出 A + B 的结果。

## 样例输入
1 2

## 样例输出
3

## 提示
- A 和 B 都是 32 位整数
- 注意处理输入输出格式`,
  inputFormat: "输入包含两个整数 A 和 B（-10^9 ≤ A, B ≤ 10^9）",
  outputFormat: "输出 A + B 的值",
  testCases: [
    { input: "1 2", output: "3" },
    { input: "0 0", output: "0" },
    { input: "-1 1", output: "0" },
    { input: "1000000 2000000", output: "3000000" }
  ],
  hint: "这是一道非常简单的题目，只需要读取两个整数并输出它们的和即可。注意处理可能的整数溢出问题，但在大多数编程语言中，32位整数足以处理本题的输入范围。",
  difficulty: "easy",
  timeLimit: 1000,
  memoryLimit: 65536,
  tags: ["Math", "Beginner", "Ad Hoc"],
  acceptance: 89.2,
  submissionCount: 125432,
  solveCount: 111921,
  createdAt: "2023-01-15T08:00:00Z",
  updatedAt: "2023-01-15T08:00:00Z"
};

/**
 * 模拟题目数据 - Two Sum
 */
export const MOCK_PROBLEM_1002: Problem = {
  id: 1002,
  title: "Two Sum",
  description: `# Two Sum

## 问题描述
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

## 示例
### 示例 1:
输入: nums = [2,7,11,15], target = 9
输出: [0,1]
解释: 因为 nums[0] + nums[1] == 9，返回 [0, 1]。

### 示例 2:
输入: nums = [3,2,4], target = 6
输出: [1,2]

### 示例 3:
输入: nums = [3,3], target = 6
输出: [0,1]

## 提示
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- 只会存在一个有效答案`,
  inputFormat: `第一行包含两个整数 n 和 target，分别表示数组长度和目标值。
第二行包含 n 个整数，表示数组 nums。`,
  outputFormat: `输出两个整数，表示找到的两个元素的下标，用空格分隔。`,
  testCases: [
    { 
      input: "4 9\n2 7 11 15", 
      output: "0 1" 
    },
    { 
      input: "3 6\n3 2 4", 
      output: "1 2" 
    },
    { 
      input: "2 6\n3 3", 
      output: "0 1" 
    }
  ],
  hint: "可以使用哈希表来优化查找过程，将时间复杂度从 O(n^2) 降低到 O(n)。",
  difficulty: "easy",
  timeLimit: 1000,
  memoryLimit: 65536,
  tags: ["Array", "Hash Table", "Two Pointers"],
  acceptance: 45.6,
  submissionCount: 892345,
  solveCount: 407000,
  createdAt: "2023-01-20T08:00:00Z",
  updatedAt: "2023-05-10T14:30:00Z"
};

/**
 * 模拟题目列表数据
 */
export const MOCK_PROBLEM_LIST: ProblemListItem[] = [
  {
    id: 1001,
    title: "A + B Problem",
    difficulty: "easy",
    tags: ["Math", "Beginner"],
    acceptance: 89.2,
    isSolved: true
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
  },
  {
    id: 1005,
    title: "Valid Parentheses",
    difficulty: "easy",
    tags: ["String", "Stack"],
    acceptance: 40.1,
    isSolved: true
  },
  {
    id: 1006,
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    tags: ["Linked List", "Recursion"],
    acceptance: 56.7
  },
  {
    id: 1007,
    title: "Reverse Integer",
    difficulty: "easy",
    tags: ["Math"],
    acceptance: 28.4
  },
  {
    id: 1008,
    title: "Palindrome Number",
    difficulty: "easy",
    tags: ["Math"],
    acceptance: 50.0
  }
];

/**
 * 模拟编程语言列表
 */
export const MOCK_PROGRAMMING_LANGUAGES = [
  {
    id: "c",
    name: "C",
    extension: "c",
    highlightMode: "c",
    command: "gcc"
  },
  {
    id: "cpp",
    name: "C++",
    extension: "cpp",
    highlightMode: "cpp",
    command: "g++"
  },
  {
    id: "java",
    name: "Java",
    extension: "java",
    highlightMode: "java",
    command: "javac"
  },
  {
    id: "python",
    name: "Python",
    extension: "py",
    highlightMode: "python",
    command: "python"
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: "js",
    highlightMode: "javascript",
    command: "node"
  },
  {
    id: "csharp",
    name: "C#",
    extension: "cs",
    highlightMode: "csharp",
    command: "csc"
  }
];