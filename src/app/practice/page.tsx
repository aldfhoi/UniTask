'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Mic, 
  Sparkles, 
  BookOpen, 
  RotateCcw, 
  ArrowLeft, 
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { PresentationDeck, Project, EvaluationReport } from '../../lib/types';
import { getStoredProjects, getActiveProjectId, getStoredDeck, getStoredEvaluation } from '../../lib/storage';
import { PracticeRoom } from '../../components/PracticeRoom';
import { EvaluationModal } from '../../components/EvaluationModal';
import { AiBadge } from '../../components/AiBadge';

export default function PracticePage() {
  const [activeProj, setActiveProj] = useState<Project | null>(null);
  const [deck, setDeck] = useState<PresentationDeck | null>(null);
  const [latestEval, setLatestEval] = useState<EvaluationReport | null>(null);
  const [showEvalModal, setShowEvalModal] = useState(false);

  useEffect(() => {
    const projects = getStoredProjects();
    const activeId = getActiveProjectId();
    const proj = projects.find(p => p.id === activeId) || projects[0];
    if (proj) {
      setActiveProj(proj);
      const storedDeck = getStoredDeck(proj.id);
      setDeck(storedDeck);
      const evalReport = getStoredEvaluation(proj.id);
      setLatestEval(evalReport);
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>AI 실전 발표 시뮬레이터 & 피드백</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            실전 발표 연습 & AI 다면 평가
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            교수님 질문 모드, 까다로운 질문 모드, 팀 발표 모드로 슬라이드 대본을 연습하고, 음성/텍스트 질의응답을 통해 6대 지표 피드백을 받으세요.
          </p>
        </div>

        {/* Latest Evaluation Quick Badge */}
        {latestEval && (
          <button
            onClick={() => setShowEvalModal(true)}
            className="px-4 py-2 rounded-2xl bg-white border border-emerald-300 shadow-sm hover:shadow-md transition-all flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
              {latestEval.overallScore}점
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase block">최근 발표 준비도</span>
              <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                {latestEval.readinessPercent}% 달성 (리포트 보기)
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 ml-1" />
          </button>
        )}
      </div>

      {/* Practice Room Core */}
      {deck ? (
        <PracticeRoom deck={deck} initialMode="professor" />
      ) : (
        <div className="stripe-card p-12 bg-white text-center text-slate-600">
          <Mic className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">발표 자료 및 대본이 필요합니다</h3>
          <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
            [발표 준비] 메뉴에서 슬라이드 대본을 먼저 생성한 후 실전 연습실을 이용하실 수 있습니다.
          </p>
          <Link href="/presentation" className="stripe-pill-btn mx-auto">
            <span>발표 대본 생성하러 가기</span>
          </Link>
        </div>
      )}

      {/* Modal for Recent Evaluation */}
      {showEvalModal && latestEval && (
        <EvaluationModal
          report={latestEval}
          onClose={() => setShowEvalModal(false)}
          onRetry={() => setShowEvalModal(false)}
        />
      )}
    </div>
  );
}