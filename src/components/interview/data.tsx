
import { Coffee, Lightbulb, Brain, Zap, Sparkles } from "lucide-react"
import type {
  CodingChallenge,
  InterviewMessage,
  Job,
  ProgrammingLanguage,
  VirtualBackground,
  InterviewTip,
} from "./types"

// Sample job data
export const jobsData: Job[] = [
  {
    id: 1,
    companyLogo: "/google.png",
    jobTitle: "Frontend Developer",
    companyName: "Google",
    experience: "2-3 Years",
    salary: "₹20,000 - ₹30,000",
    jobType: "Full-time",
    location: "Mumbai",
    tags: ["Frontend", "React", "JavaScript", "Remote"],
  },
  {
    id: 2,
    companyLogo: "/microsoft.png",
    jobTitle: "Backend Developer",
    companyName: "Microsoft",
    experience: "7-8 years",
    salary: "₹50,000 - ₹60,000",
    jobType: "Full-time",
    location: "Mumbai",
    tags: ["Backend", "Java", "Spring", "Remote"],
  },
  {
    id: 3,
    companyLogo: "/amazon.png",
    jobTitle: "Full Stack Developer",
    companyName: "Amazon",
    experience: "2-3 Years",
    salary: "₹20,000 - ₹30,000",
    jobType: "Full-time",
    location: "Mumbai",
    tags: ["Frontend", "Backend", "React", "Node.js", "Remote"],
  },
  {
    id: 4,
    companyLogo: "/facebook.png",
    jobTitle: "UI/UX Designer",
    companyName: "Facebook",
    experience: "3-5 Years",
    salary: "₹40,000 - ₹50,000",
    jobType: "Contract",
    location: "Bangalore",
    tags: ["UI", "UX", "Figma", "Adobe XD", "Hybrid"],
  },
  {
    id: 5,
    companyLogo: "/netflix.png",
    jobTitle: "DevOps Engineer",
    companyName: "Netflix",
    experience: "4-6 Years",
    salary: "₹60,000 - ₹80,000",
    jobType: "Part-time",
    location: "Delhi",
    tags: ["DevOps", "AWS", "Docker", "Kubernetes", "On-site"],
  },
  {
    id: 6,
    companyLogo: "/apple.png",
    jobTitle: "iOS Developer",
    companyName: "Apple",
    experience: "5-7 Years",
    salary: "₹70,000 - ₹90,000",
    jobType: "Full-time",
    location: "Hyderabad",
    tags: ["iOS", "Swift", "Objective-C", "Remote"],
  },
]

// Sample chat messages
export const initialMessages: InterviewMessage[] = [
  {
    id: 1,
    sender: "interviewer",
    message: "Hello! Welcome to your interview for the position. How are you doing today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 2,
    sender: "candidate",
    message: "Hi! I'm doing well, thank you for asking. I'm excited for this interview opportunity.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 3,
    sender: "interviewer",
    message: "Great! Let's start with a brief introduction. Could you tell me about yourself and your experience?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
]

// Programming languages
export const programmingLanguages: ProgrammingLanguage[] = [
  { id: "javascript", name: "JavaScript", icon: "JS" },
  { id: "python", name: "Python", icon: "PY" },
  { id: "java", name: "Java", icon: "JV" },
  { id: "cpp", name: "C++", icon: "C++" },
  { id: "csharp", name: "C#", icon: "C#" },
  { id: "ruby", name: "Ruby", icon: "RB" },
  { id: "go", name: "Go", icon: "GO" },
  { id: "typescript", name: "TypeScript", icon: "TS" },
]

// Sample coding challenges with multiple language support
export const codingChallenges: CodingChallenge[] = [
  {
    id: 1,
    title: "Reverse a String",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    difficulty: "Easy",
    initialCode: {
      javascript: "function reverseString(str) {\n  // Your code here\n  \n}",
      python: "def reverse_string(s):\n    # Your code here\n    \n",
      java: "public class Solution {\n    public String reverseString(String s) {\n        // Your code here\n        \n    }\n}",
      cpp: "#include <string>\n\nclass Solution {\npublic:\n    std::string reverseString(std::string s) {\n        // Your code here\n        \n    }\n};",
      csharp:
        "public class Solution {\n    public string ReverseString(string s) {\n        // Your code here\n        \n    }\n}",
      ruby: "def reverse_string(s)\n  # Your code here\n  \nend",
      go: "func reverseString(s string) string {\n    // Your code here\n    \n}",
      typescript: "function reverseString(str: string): string {\n  // Your code here\n  \n}",
    },
    testCases: [
      { input: "hello", expected: "olleh" },
      { input: "world", expected: "dlrow" },
    ],
  },
  {
    id: 2,
    title: "FizzBuzz",
    description:
      "Write a function that returns 'Fizz' for numbers divisible by 3, 'Buzz' for numbers divisible by 5, and 'FizzBuzz' for numbers divisible by both 3 and 5. Otherwise, return the number itself.",
    difficulty: "Easy",
    initialCode: {
      javascript: "function fizzBuzz(n) {\n  // Your code here\n  \n}",
      python: "def fizz_buzz(n):\n    # Your code here\n    \n",
      java: "public class Solution {\n    public String fizzBuzz(int n) {\n        // Your code here\n        \n    }\n}",
      cpp: "class Solution {\npublic:\n    std::string fizzBuzz(int n) {\n        // Your code here\n        \n    }\n};",
      csharp:
        "public class Solution {\n    public string FizzBuzz(int n) {\n        // Your code here\n        \n    }\n}",
      ruby: "def fizz_buzz(n)\n  # Your code here\n  \nend",
      go: "func fizzBuzz(n int) string {\n    // Your code here\n    \n}",
      typescript: "function fizzBuzz(n: number): string {\n  // Your code here\n  \n}",
    },
    testCases: [
      { input: 3, expected: "Fizz" },
      { input: 5, expected: "Buzz" },
      { input: 15, expected: "FizzBuzz" },
      { input: 7, expected: "7" },
    ],
  },
  {
    id: 3,
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Medium",
    initialCode: {
      javascript: "function twoSum(nums, target) {\n  // Your code here\n  \n}",
      python: "def two_sum(nums, target):\n    # Your code here\n    \n",
      java: "public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        \n    }\n}",
      cpp: "class Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Your code here\n        \n    }\n};",
      csharp:
        "public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        // Your code here\n        \n    }\n}",
      ruby: "def two_sum(nums, target)\n  # Your code here\n  \nend",
      go: "func twoSum(nums []int, target int) []int {\n    // Your code here\n    \n}",
      typescript: "function twoSum(nums: number[], target: number): number[] {\n  // Your code here\n  \n}",
    },
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
    ],
  },
  {
    id: 4,
    title: "Valid Palindrome",
    description:
      "Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
    difficulty: "Easy",
    initialCode: {
      javascript: "function isPalindrome(s) {\n  // Your code here\n  \n}",
      python: "def is_palindrome(s):\n    # Your code here\n    \n",
      java: "public class Solution {\n    public boolean isPalindrome(String s) {\n        // Your code here\n        \n    }\n}",
      cpp: "class Solution {\npublic:\n    bool isPalindrome(std::string s) {\n        // Your code here\n        \n    }\n};",
      csharp:
        "public class Solution {\n    public bool IsPalindrome(string s) {\n        // Your code here\n        \n    }\n}",
      ruby: "def is_palindrome(s)\n  # Your code here\n  \nend",
      go: "func isPalindrome(s string) bool {\n    // Your code here\n    \n}",
      typescript: "function isPalindrome(s: string): boolean {\n  // Your code here\n  \n}",
    },
    testCases: [
      { input: "A man, a plan, a canal: Panama", expected: true },
      { input: "race a car", expected: false },
    ],
  },
]

// Interview stages
export const interviewStages = [
  "Introduction",
  "Technical Questions",
  "Coding Challenge",
  "Behavioral Questions",
  "Q&A",
]

// Interview tips
export const interviewTips: InterviewTip[] = [
  {
    title: "Prepare Your Environment",
    description: "Ensure you have a quiet space with good lighting and a stable internet connection.",
    icon: <Coffee className="h-5 w-5" />,
  },
  {
    title: "Research the Company",
    description: "Understand the company's products, culture, and recent news before the interview.",
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    title: "Practice Common Questions",
    description: "Prepare answers for common technical and behavioral questions in your field.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: "Show Your Problem-Solving",
    description: "Think aloud during coding challenges to demonstrate your thought process.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Ask Thoughtful Questions",
    description: "Prepare questions about the role, team, and company to show your interest.",
    icon: <Sparkles className="h-5 w-5" />,
  },
]

// Virtual backgrounds
export const virtualBackgrounds: VirtualBackground[] = [
  { id: "none", name: "None", url: null },
  { id: "office", name: "Office", url: "/backgrounds/office.jpg" },
  { id: "bookshelf", name: "Bookshelf", url: "/backgrounds/bookshelf.jpg" },
  { id: "nature", name: "Nature", url: "/backgrounds/nature.jpg" },
  { id: "tech", name: "Tech Space", url: "/backgrounds/tech.jpg" },
  { id: "blur", name: "Blur", url: "blur" },
]

