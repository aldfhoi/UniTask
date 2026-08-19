'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  FolderPlus, 
  FileCheck, 
  Layers,
  HelpCircle,
  Copy
} from 'lucide-react';
import { AssignmentAnalysis, Project } from '../../lib/types';
import { AIService } from '../../lib/ai/ai-service';
import { SAMPLE_ASSIGNMENTS, extractTextFromFile } from '../../lib/file-parser';
import { getStoredProjects, saveProjects, setActiveProjectId } from '../../lib/storage';
import { AiBadge } from '../../components/AiBadge';
import { showToast } from '../../components/Toast';

export default function AssignmentsPage() {
  const router = useRouter();
  const [inputText, setInputText] = useState(SAMPLE_ASSIGNMENTS[0].text);
  const [titleHint, setTitleHint] = useState(SAMPLE_ASSIGNMENTS[0].title);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AssignmentAnalysis | null>(null);
  const [projectType, setProjectType] = useState<'team' | 'personal'>('team');

  // Run AI analysis
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      showToast('error', '입력 필요', '과제 안내문 텍스트를 입력하거나 파일을 업로드해 주세요.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await AIService.analyzeAssignment(inputText, titleHint);
      setAnalysisResult(result);
      setProjectType(result.isTeam ? 'team' : 'personal');
      showToast('success', 'AI 과제 분석 완료', '요구사항과 작업 계획이 도출되었습니다.');
    } catch (e) {
      showToast('error', '분석 실패', '과제 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await extractTextFromFile(file);
      setInputText(parsed.text);
      setTitleHint(file.name.replace(/\.[^/.]+$/, ''));
      showToast('info', '파일 업로드 완료', `${file.name}의 내용을 불러왔습니다. [AI 분석 시작]을 눌러주세요.`);
    } catch (err) {
      showToast('error', '파일 파싱 실패', '지원되지 않는 파일 형식이거나 파일 읽기에 실패했습니다.');
    }
  };

  // Create Project from Analysis
  const handleCreateProject = () => {
    if (!analysisResult) return;

    const newProjId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newProjId,
      title: analysisResult.title,
      course: analysisResult.course,
      type: projectType,
      progress: 10,
      deadline: analysisResult.deadline.split(' ')[0] || '2026-08-30',
      dDay: 'D-10',
      currentTask: analysisResult.planSteps[0]?.title || '주제 선정 및 요구사항 검토',
      description: `과제 안내문 AI 분석 기반 생성 프로젝트 (${analysisResult.format})`,
      inviteCode: `${analysisResult.course.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      members: projectType === 'team' ? [
        { id: 'm-1', name: '이예서 (팀장)', role: '총괄 및 해결방안', email: 'yeseo@univ.ac.kr', avatarColor: 'bg-emerald-600', assignedTaskCount: 3 },
        { id: 'm-2', name: '김민준', role: '시장 동향 & 기술 분석', email: 'minjun@univ.ac.kr', avatarColor: 'bg-blue-600', assignedTaskCount: 2 },
        { id: 'm-3', name: '박서현', role: '국내외 사례 & PPT 제작', email: 'seohyun@univ.ac.kr', avatarColor: 'bg-indigo-600', assignedTaskCount: 2 },
      ] : [
        { id: 'm-1', name: '이예서', role: '작성자', email: 'yeseo@univ.ac.kr', avatarColor: 'bg-emerald-600', assignedTaskCount: 3 }
      ],
      tasks: analysisResult.planSteps.slice(0, 5).map((step, idx) => ({
        id: `t-${Date.now()}-${idx}`,
        projectId: newProjId,
        title: step.title,
        assigneeId: 'm-1',
        assigneeName: '이예서',
        status: step.done ? 'done' : idx === 1 ? 'in_progress' : 'todo',
        deadline: '08/25',
        priority: idx < 2 ? 'high' : 'medium',
        order: idx + 1
      })),
      analysis: analysisResult
    };

    const currentProjects = getStoredProjects();
    saveProjects([newProject, ...currentProjects]);
    setActiveProjectId(newProjId);

    showToast('success', '새 프로젝트 생성 완료!', '워크스페이스로 이동합니다.');
    router.push(`/projects/${newProjId}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI 과제 분석 & 작업 자동화</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            과제 안내문 AI 심층 분석
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            교수님의 과제 공지, PDF, 강의계획서를 업로드하면 요구사항, 놓치기 쉬운 주의사항, 작업 체크리스트를 즉시 정리합니다.
          </p>
        </div>

        {/* Demo Samples Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">샘플 불러오기:</span>
          <button
            onClick={() => {
              setInputText(SAMPLE_ASSIGNMENTS[0].text);
              setTitleHint(SAMPLE_ASSIGNMENTS[0].title);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            배터리 신소재 (팀플)
          </button>
          <button
            onClick={() => {
              setInputText(SAMPLE_ASSIGNMENTS[1].text);
              setTitleHint(SAMPLE_ASSIGNMENTS[1].title);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            경영 AI 비즈니스 (개인)
          </button>
        </div>
      </div>

      {/* Main Input & Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Upload (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="stripe-card p-5 bg-white space-y-4">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>과제 안내문 / PDF 업로드</span>
            </h3>

            {/* File Dropzone */}
            <label className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-emerald-50/30 group">
              <UploadCloud className="w-8 h-8 text-slate-600 group-hover:text-emerald-600 transition-colors mb-2" />
              <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-800">
                PDF, PPT, DOCX, TXT 파일 드래그 또는 클릭
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                강의 공지문이나 교수님 과제 PDF를 올려주세요
              </p>
              <input
                type="file"
                accept=".pdf,.pptx,.ppt,.docx,.doc,.txt,.md"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {/* Text Input Fallback */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                과제 안내문 직접 입력
              </label>
              <textarea
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="교수님이 올리신 과제 공지 글이나 요구사항을 복사하여 붙여넣으세요..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all font-mono leading-relaxed resize-none"
              />
            </div>

            {/* Analyze Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI 과제 분석 및 요구사항 도출 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI 과제 분석 시작</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: AI Analysis Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {analysisResult ? (
            <div className="stripe-card p-6 bg-white space-y-6 animate-in fade-in duration-300">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AiBadge type="analysis" />
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {analysisResult.course}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-slate-900">
                    {analysisResult.title}
                  </h3>
                </div>

                <div className="text-right sm:text-right shrink-0">
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    제출: {analysisResult.deadline}
                  </span>
                </div>
              </div>

              {/* Basic Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] text-slate-600 font-bold uppercase">제출 형식</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{analysisResult.format}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] text-slate-600 font-bold uppercase">분량 기준</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{analysisResult.pageLength}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] text-slate-600 font-bold uppercase">과제 유형</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{analysisResult.isTeam ? '팀 프로젝트 (협업)' : '개인 과제'}</p>
                </div>
              </div>

              {/* Requirements Section */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>교수님 필수 요구사항 (반드시 포함해야 하는 내용)</span>
                </h4>
                <div className="space-y-1.5">
                  {analysisResult.requirements.map((req, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caution / Penalty alerts */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>교수님 주의사항 및 감점 방지 체크</span>
                </h4>
                <div className="space-y-1.5">
                  {analysisResult.cautionNotes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950 font-medium">
                      {note}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommended 9-Step Plan Checklist */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>AI 자동 생성 작업 계획 (순서별 체크리스트)</span>
                </h4>
                <div className="space-y-2">
                  {analysisResult.planSteps.map((step) => (
                    <div key={step.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <span className="w-5 h-5 rounded-full bg-white border border-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {step.id}
                        </span>
                        <div className="truncate">
                          <p className="font-bold text-slate-800 truncate">{step.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{step.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                        {step.done ? '완료' : '예정'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Type Select & Action */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-slate-500">생성할 프로젝트 형태:</span>
                  <button
                    onClick={() => setProjectType('personal')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      projectType === 'personal' ? 'bg-white border-emerald-500 text-emerald-800 shadow-xs' : 'bg-slate-100 border-transparent text-slate-500'
                    }`}
                  >
                    개인 과제
                  </button>
                  <button
                    onClick={() => setProjectType('team')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      projectType === 'team' ? 'bg-white border-emerald-500 text-emerald-800 shadow-xs' : 'bg-slate-100 border-transparent text-slate-500'
                    }`}
                  >
                    팀 프로젝트 (팀원 초대)
                  </button>
                </div>

                <button
                  onClick={handleCreateProject}
                  className="stripe-pill-btn w-full sm:w-auto"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>이 분석으로 프로젝트 생성</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="stripe-card p-12 bg-white flex flex-col items-center justify-center text-center text-slate-600 h-[480px]">
              <Sparkles className="w-12 h-12 text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-700 mb-1">
                과제 안내문을 입력하고 분석을 시작하세요
              </h4>
              <p className="text-xs text-slate-600 max-w-sm">
                교수님의 과제 안내문이나 PDF를 업로드한 후 [AI 과제 분석 시작] 버튼을 누르면 자동으로 핵심 요구사항과 일정표를 구성해 드립니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}