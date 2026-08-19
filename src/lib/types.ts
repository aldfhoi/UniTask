export type ProjectType = 'personal' | 'team';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type PracticeMode = 'general' | 'professor' | 'tough' | 'team';

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarColor: string;
  assignedTaskCount?: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  status: TaskStatus;
  deadline: string;
  priority: PriorityLevel;
  order: number;
}

export interface PlanStep {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

export interface AssignmentAnalysis {
  id: string;
  course: string;
  title: string;
  deadline: string;
  format: string;
  pageLength: string;
  isTeam: boolean;
  requirements: string[];
  cautionNotes: string[];
  planSteps: PlanStep[];
  rawText?: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  projectId: string;
  title: string;
  fileType: 'pdf' | 'pptx' | 'docx' | 'txt' | 'link';
  fileSize?: string;
  uploaderName: string;
  uploadDate: string;
  summary: string;
  keywords: string[];
  evidencePoints: string[];
  sourceCitation: string;
  fileContent?: string;
  matchedSection?: string;
}

export interface DuplicateAlert {
  id: string;
  fileA: string;
  fileB: string;
  uploaderA: string;
  uploaderB: string;
  reason: string;
  suggestion: string;
}

export interface ResourceLinkage {
  id: string;
  fileTitle: string;
  suggestedSection: string;
  roleInReport: string;
}

export interface OutlineItem {
  chapter: string;
  title: string;
  description: string;
  sourceResources: string[];
}

export interface ProjectSynthesis {
  projectId: string;
  recommendedOutline: OutlineItem[];
  duplicates: DuplicateAlert[];
  linkages: ResourceLinkage[];
  readinessNote: string;
}

export interface SlideScript {
  slideNumber: number;
  slideTitle: string;
  keyPoints: string[];
  script: string;
  estimatedSeconds: number;
  speakerName: string;
}

export interface PresentationDeck {
  id: string;
  projectId: string;
  title: string;
  totalSlides: number;
  estimatedTotalSeconds: number;
  slides: SlideScript[];
  updatedAt: string;
}

export interface PracticeQA {
  question: string;
  answer?: string;
  score?: number;
  feedback?: string;
}

export interface EvaluationMetrics {
  understanding: number; // 내용 이해도 (0-100)
  logic: number; // 논리성
  structure: number; // 발표 구조
  qnaResponse: number; // 질문 대응
  answerSpecificity: number; // 답변의 구체성
  timeManagement: number; // 발표 시간 준수
}

export interface EvaluationReport {
  id: string;
  projectId: string;
  sessionDate: string;
  readinessPercent: number; // 예: 78%
  overallScore: number;
  metrics: EvaluationMetrics;
  priorityImprovements: string[]; // 🔴 우선 개선
  recommendedEnhancements: string[]; // 🟡 보완 권장
  strengths: string[]; // 🟢 잘하고 있음
  overallComment: string;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  contextSources?: string[];
}

export interface Project {
  id: string;
  title: string;
  course: string;
  type: ProjectType;
  progress: number; // 0-100
  deadline: string;
  dDay: string;
  currentTask: string;
  description: string;
  inviteCode: string;
  members: Member[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  analysis?: AssignmentAnalysis;
}

export interface UserSettings {
  geminiApiKey: string;
  selectedModel: string;
  userName: string;
  studentId: string;
  university: string;
}