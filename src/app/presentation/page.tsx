'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Mic, 
  UploadCloud, 
  Clock, 
  Sparkles, 
  FileText, 
  Users, 
  Edit3, 
  Check, 
  Play, 
  RotateCcw, 
  Plus,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { PresentationDeck, SlideScript, Project, Resource } from '../../lib/types';
import { getStoredProjects, getActiveProjectId, getStoredResources, getStoredDeck, saveDeck } from '../../lib/storage';
import { AIService } from '../../lib/ai/ai-service';
import { AiBadge } from '../../components/AiBadge';
import { showToast } from '../../components/Toast';

export default function PresentationPage() {
  const [activeProj, setActiveProj] = useState<Project | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [deck, setDeck] = useState<PresentationDeck | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSlideNum, setEditingSlideNum] = useState<number | null>(null);
  const [editScript, setEditScript] = useState('');

  useEffect(() => {
    const projects = getStoredProjects();
    const activeId = getActiveProjectId();
    const proj = projects.find(p => p.id === activeId) || projects[0];
    if (proj) {
      setActiveProj(proj);
      const res = getStoredResources(proj.id);
      setResources(res);
      const storedDeck = getStoredDeck(proj.id);
      setDeck(storedDeck);
    }
  }, []);

  // Generate Deck & Scripts
  const handleGenerateDeck = async () => {
    if (!activeProj) return;
    setIsGenerating(true);
    try {
      const memberNames = activeProj.members.map(m => m.name);
      const newDeck = await AIService.generatePresentationDeck(
        activeProj.id,
        activeProj.title,
        resources,
        memberNames
      );
      setDeck(newDeck);
      saveDeck(activeProj.id, newDeck);
      showToast('success', '발표 대본 생성 완료', `${newDeck.totalSlides}개 슬라이드 대본과 소요 시간이 계산되었습니다.`);
    } catch (e) {
      showToast('error', '대본 생성 실패', '발표 대본을 생성하는 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartEdit = (slide: SlideScript) => {
    setEditingSlideNum(slide.slideNumber);
    setEditScript(slide.script);
  };

  const handleSaveEdit = (slideNumber: number) => {
    if (!deck || !activeProj) return;
    const updatedSlides = deck.slides.map(s =>
      s.slideNumber === slideNumber ? { ...s, script: editScript } : s
    );
    const updatedDeck = { ...deck, slides: updatedSlides };
    setDeck(updatedDeck);
    saveDeck(activeProj.id, updatedDeck);
    setEditingSlideNum(null);
    showToast('success', '대본 수정 완료', `Slide ${slideNumber} 대본이 저장되었습니다.`);
  };

  const handleChangeSpeaker = (slideNumber: number, speakerName: string) => {
    if (!deck || !activeProj) return;
    const updatedSlides = deck.slides.map(s =>
      s.slideNumber === slideNumber ? { ...s, speakerName } : s
    );
    const updatedDeck = { ...deck, slides: updatedSlides };
    setDeck(updatedDeck);
    saveDeck(activeProj.id, updatedDeck);
  };

  const formatTotalTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}분 ${secs > 0 ? `${secs}초` : ''}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <Mic className="w-3.5 h-3.5" />
            <span>AI 슬라이드별 대본 & 시간 산출</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            발표 준비 & 대본 생성기
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            PPT 슬라이드 및 업로드된 조사 자료를 기반으로 슬라이드별 자연스러운 구어체 대본과 팀원별 분담 시간을 자동 생성합니다.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateDeck}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isGenerating ? 'AI 대본 재생성 중...' : 'AI 대본 재생성'}</span>
          </button>

          <Link
            href="/practice"
            className="stripe-pill-btn"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>실전 발표 연습실 입장</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {deck ? (
        <div className="space-y-6">
          {/* Deck Summary Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stripe-card p-4 bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">총 슬라이드 수</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{deck.totalSlides}장</p>
              </div>
              <FileText className="w-6 h-6 text-indigo-500" />
            </div>

            <div className="stripe-card p-4 bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">⏱ 총 예상 발표 시간</span>
                <p className="text-xl font-black text-emerald-700 mt-0.5">{formatTotalTime(deck.estimatedTotalSeconds)}</p>
              </div>
              <Clock className="w-6 h-6 text-emerald-500" />
            </div>

            <div className="stripe-card p-4 bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">팀원별 배정</span>
                <p className="text-xs font-bold text-slate-700 mt-1">
                  {Array.from(new Set(deck.slides.map(s => s.speakerName))).join(', ')}
                </p>
              </div>
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>

          {/* Slide-by-Slide Script Cards */}
          <div className="space-y-4">
            {deck.slides.map((slide) => {
              const isEditing = editingSlideNum === slide.slideNumber;

              return (
                <div key={slide.slideNumber} className="stripe-card p-5 bg-white hover:border-emerald-300 transition-all space-y-3">
                  {/* Slide Top Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                        Slide {slide.slideNumber}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">
                        {slide.slideTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      {/* Speaker Selector */}
                      <div className="flex items-center gap-1">
                        <span className="text-slate-600 font-medium">발표자:</span>
                        <select
                          value={slide.speakerName}
                          onChange={(e) => handleChangeSpeaker(slide.slideNumber, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs font-semibold text-slate-800"
                        >
                          {activeProj?.members.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Estimated time */}
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200 text-[11px]">
                        ⏱ {slide.estimatedSeconds}초
                      </span>
                    </div>
                  </div>

                  {/* Key Points */}
                  <div className="flex flex-wrap gap-1.5">
                    {slide.keyPoints.map((kp, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                        • {kp}
                      </span>
                    ))}
                  </div>

                  {/* Script Text Box */}
                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={editScript}
                          onChange={(e) => setEditScript(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-emerald-500 rounded-xl text-xs text-slate-800 focus:outline-none leading-relaxed font-medium"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingSlideNum(null)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleSaveEdit(slide.slideNumber)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 group/script relative">
                        <div className="flex items-center justify-between mb-1 text-[10px] text-slate-600 font-bold uppercase">
                          <span>발표 멘트</span>
                          <button
                            onClick={() => handleStartEdit(slide)}
                            className="opacity-0 group-hover/script:opacity-100 text-emerald-700 hover:underline flex items-center gap-1 transition-opacity"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>대본 수정</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          "{slide.script}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="stripe-card p-12 bg-white text-center text-slate-600">
          <Mic className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">발표 대본이 아직 생성되지 않았습니다</h3>
          <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
            [AI 대본 생성] 버튼을 누르면 업로드된 팀원 자료와 과제 목표를 바탕으로 슬라이드별 대본을 구성합니다.
          </p>
          <button
            onClick={handleGenerateDeck}
            className="stripe-pill-btn mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI 슬라이드 및 대본 자동 생성</span>
          </button>
        </div>
      )}
    </div>
  );
}