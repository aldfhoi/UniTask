'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  UploadCloud, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  Link as LinkIcon, 
  Layers, 
  BookOpen, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { Resource, ProjectSynthesis, Project } from '../../lib/types';
import { getStoredProjects, getActiveProjectId, getStoredResources, saveResources, getStoredSynthesis, saveSynthesis } from '../../lib/storage';
import { AIService } from '../../lib/ai/ai-service';
import { extractTextFromFile } from '../../lib/file-parser';
import { AiBadge } from '../../components/AiBadge';
import { showToast } from '../../components/Toast';

export default function ResourcesPage() {
  const [activeProj, setActiveProj] = useState<Project | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [synthesis, setSynthesis] = useState<ProjectSynthesis | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'synthesis' | 'duplicates'>('all');

  useEffect(() => {
    const projects = getStoredProjects();
    const activeId = getActiveProjectId();
    const proj = projects.find(p => p.id === activeId) || projects[0];
    if (proj) {
      setActiveProj(proj);
      const res = getStoredResources(proj.id);
      setResources(res);
      const syn = getStoredSynthesis(proj.id);
      setSynthesis(syn);
    }
  }, []);

  // Handle File Upload & AI Summarization
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProj) return;

    setIsUploading(true);
    try {
      const parsed = await extractTextFromFile(file);
      const uploader = activeProj.members[Math.floor(Math.random() * activeProj.members.length)]?.name || '이예서';
      
      const aiSummary = await AIService.summarizeResource(file.name, parsed.text, uploader);

      const newResource: Resource = {
        id: `res-${Date.now()}`,
        projectId: activeProj.id,
        title: file.name,
        fileType: (file.name.split('.').pop() as any) || 'pdf',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploaderName: uploader,
        uploadDate: new Date().toISOString().split('T')[0],
        summary: aiSummary.summary || '자료 분석 내용이 요약되었습니다.',
        keywords: aiSummary.keywords || ['핵심자료', '학술연구', '참고문헌'],
        evidencePoints: aiSummary.evidencePoints || ['실험 데이터 및 통계치 수록'],
        sourceCitation: aiSummary.sourceCitation || `${file.name.replace(/\.[^/.]+$/, '')} (2026)`,
        matchedSection: aiSummary.matchedSection || '본론: 세부 분석'
      };

      const updatedResources = [newResource, ...resources];
      setResources(updatedResources);
      saveResources(updatedResources);

      // Re-synthesize
      const newSynthesis = await AIService.synthesizeProject(activeProj.id, updatedResources);
      setSynthesis(newSynthesis);
      saveSynthesis(activeProj.id, newSynthesis);

      showToast('success', '자료 업로드 및 AI 요약 완료', `"${file.name}"이(가) 등록되고 전체 자료와 자동 연결되었습니다.`);
    } catch (err) {
      showToast('error', '자료 분석 실패', '파일 분석 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>팀원 자료 통합 AI 정리 허브</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            자료 관리 & AI 종합 구조화
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            팀원들이 수집한 PDF, 논문, PPT를 업로드하면 AI가 핵심을 요약하고, 중복 조사를 감지하며, 최적의 보고서/발표 목차로 연결합니다.
          </p>
        </div>

        {/* Upload Button */}
        <label className="stripe-pill-btn cursor-pointer">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>{isUploading ? 'AI 자료 분석 중...' : '새 자료 업로드'}</span>
          <input
            type="file"
            accept=".pdf,.pptx,.docx,.txt"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Duplicate Alert Banner (If duplicates detected) */}
      {synthesis && synthesis.duplicates.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2 animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <h4 className="font-bold text-xs">⚠️ AI 중복 자료 발견 알림</h4>
          </div>
          {synthesis.duplicates.map((dup) => (
            <div key={dup.id} className="text-xs pl-6 space-y-1">
              <p className="font-semibold text-amber-900 leading-snug">
                "{dup.fileA}" 와 "{dup.fileB}"
              </p>
              <p className="text-amber-800 text-[11px]">{dup.reason}</p>
              <p className="text-[11px] font-medium text-emerald-800 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200/80 mt-1">
                💡 <strong>AI 권장 분담:</strong> {dup.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>업로드된 자료 목록 ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('synthesis')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'synthesis' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>AI 추천 보고서/발표 개요 (Structure)</span>
        </button>

        <button
          onClick={() => setActiveTab('duplicates')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'duplicates' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>자료 연결 및 매핑 ({synthesis?.linkages.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: All Resources Grid */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => (
            <div key={res.id} className="stripe-card p-5 bg-white flex flex-col justify-between hover:border-emerald-300">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {res.fileType.toUpperCase()} {res.fileSize && `· ${res.fileSize}`}
                  </span>
                  <AiBadge type="analysis" />
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mt-1">
                  {res.title}
                </h3>
                
                <p className="text-[11px] text-slate-600 mt-0.5">
                  업로더: <strong className="text-slate-700">{res.uploaderName}</strong> · {res.uploadDate}
                </p>

                {/* AI Summary Box */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <span className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">AI 핵심 요약</span>
                  <p className="font-medium text-slate-800">{res.summary}</p>
                </div>

                {/* Keywords */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {res.keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Evidence Points */}
                {res.evidencePoints.length > 0 && (
                  <div className="mt-3 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-600 block uppercase">핵심 데이터 / 근거</span>
                    {res.evidencePoints.map((ep, i) => (
                      <p key={i} className="text-[11px] text-slate-600 pl-2 border-l-2 border-emerald-500 font-mono">
                        {ep}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Citation & Mapping */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <p className="truncate text-slate-600">
                  📚 <em>{res.sourceCitation}</em>
                </p>
                <div className="mt-1 flex items-center justify-between text-emerald-700 font-semibold">
                  <span>추천 챕터: {res.matchedSection}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: AI Recommended Outline */}
      {activeTab === 'synthesis' && synthesis && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-indigo-900">AI 종합 자료 진단</p>
              <p className="text-indigo-800 mt-0.5">{synthesis.readinessNote}</p>
            </div>
          </div>

          <div className="stripe-card p-6 bg-white space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
              업로드된 모든 자료를 종합한 최적의 보고서/발표 목차 (4단계)
            </h3>

            <div className="space-y-3">
              {synthesis.recommendedOutline.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {item.chapter}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <span className="text-[10px] text-slate-600 font-bold block">활용 자료</span>
                    <span className="text-[11px] font-semibold text-slate-700">
                      {item.sourceResources.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Linkages */}
      {activeTab === 'duplicates' && synthesis && (
        <div className="stripe-card p-6 bg-white space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
            자료 간 유기적 연결 매핑 (Cross-Resource Linkage)
          </h3>

          <div className="space-y-3">
            {synthesis.linkages.map((link) => (
              <div key={link.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <LinkIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-bold text-slate-900">{link.fileTitle}</p>
                  <p className="text-emerald-700 font-semibold mt-0.5">➡️ 추천 배치: {link.suggestedSection}</p>
                  <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{link.roleInReport}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}