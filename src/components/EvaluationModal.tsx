'use client';

import React from 'react';
import { Award, CheckCircle2, AlertTriangle, AlertCircle, X, Download, RotateCcw, Sparkles } from 'lucide-react';
import { EvaluationReport } from '../lib/types';
import confetti from 'canvas-confetti';

interface EvaluationModalProps {
  report: EvaluationReport;
  onClose: () => void;
  onRetry: () => void;
}

export function EvaluationModal({ report, onClose, onRetry }: EvaluationModalProps) {
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  const metricsList = [
    { label: '내용 이해도', score: report.metrics.understanding, desc: '주제 및 이론적 메커니즘 숙지도' },
    { label: '논리성', score: report.metrics.logic, desc: '서론-본론-결론의 인과관계' },
    { label: '발표 구조', score: report.metrics.structure, desc: '슬라이드 구성 및 전환 매끄러움' },
    { label: '질문 대응력', score: report.metrics.qnaResponse, desc: '교수님 돌발 질문에 대한 순발력' },
    { label: '답변의 구체성', score: report.metrics.answerSpecificity, desc: '정량적 수치 및 논문 근거 활용' },
    { label: '시간 준수도', score: report.metrics.timeManagement, desc: '슬라이드별 권장 시간 배분' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-600 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI 실전 발표 종합 평가 리포트
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              현재 발표 준비도 <span className="text-emerald-600">{report.readinessPercent}%</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">세션 일시: {report.sessionDate} · 6대 핵심 지표 분석 완료</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex flex-col items-center justify-center text-white shadow-md">
              <span className="text-2xl font-black">{report.overallScore}</span>
              <span className="text-[10px] font-bold opacity-80">점 / 100</span>
            </div>
          </div>
        </div>

        {/* Overall Comment */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-slate-50 to-indigo-50/60 border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-medium">
          💡 <span className="font-bold">AI 총평:</span> {report.overallComment}
        </div>

        {/* 6 Metrics Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">6대 항목별 역량 분석</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {metricsList.map((m, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700">{m.label}</span>
                  <span className="font-black text-emerald-700">{m.score}점</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${m.score}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-600 truncate">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Action Items (🔴 우선 개선, 🟡 보완 권장, 🟢 잘하고 있음) */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">우선순위별 피드백</h4>
          
          {/* High Priority */}
          {report.priorityImprovements.map((item, i) => (
            <div key={`high-${i}`} className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">{item.split(']')[0]}]</p>
                <p className="text-rose-800 mt-0.5 font-medium">{item.split(']')[1] || item}</p>
              </div>
            </div>
          ))}

          {/* Medium Priority */}
          {report.recommendedEnhancements.map((item, i) => (
            <div key={`med-${i}`} className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">{item.split(']')[0]}]</p>
                <p className="text-amber-800 mt-0.5 font-medium">{item.split(']')[1] || item}</p>
              </div>
            </div>
          ))}

          {/* Strengths */}
          {report.strengths.map((item, i) => (
            <div key={`good-${i}`} className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">{item.split(']')[0]}]</p>
                <p className="text-emerald-800 mt-0.5 font-medium">{item.split(']')[1] || item}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>다시 연습하기</span>
          </button>
          <button
            onClick={onClose}
            className="stripe-pill-btn"
          >
            <span>확인 완료</span>
          </button>
        </div>
      </div>
    </div>
  );
}