'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Users, 
  FileText, 
  FolderOpen, 
  Mic, 
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import { Project, Task } from '../lib/types';
import { getStoredProjects, saveProjects } from '../lib/storage';
import { ProjectCard } from '../components/ProjectCard';
import { showToast } from '../components/Toast';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [todayTodos, setTodayTodos] = useState<{ id: string; text: string; course: string; done: boolean }[]>([
    { id: 'todo-1', text: '하이니켈 NCM 양극재 관련 논문 2개 AI 요약 검토', course: '에너지신소재공학', done: true },
    { id: 'todo-2', text: '정우진 팀원의 원가 비교표 자료 검토 및 코멘트', course: '에너지신소재공학', done: false },
    { id: 'todo-3', text: '발표자료(PPT) 5~8페이지 초안 작성', course: '에너지신소재공학', done: false },
    { id: 'todo-4', text: 'AI 발표 연습 시뮬레이터로 예상 질문 10개 확인', course: '도시계획학개론', done: false },
    { id: 'todo-5', text: '경영정보시스템 SaaS B2B 가격 모델 분석 초안 완성', course: '경영정보시스템', done: false },
  ]);

  useEffect(() => {
    setProjects(getStoredProjects());
  }, []);

  const toggleTodo = (id: string) => {
    setTodayTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.done;
          if (nextState) {
            showToast('success', '할 일 완료!', `"${t.text}"을(를) 완료했습니다.`);
          }
          return { ...t, done: nextState };
        }
        return t;
      })
    );
  };

  const urgentProjects = projects.filter(p => p.dDay === 'D-2' || p.dDay === 'D-1' || p.dDay === 'D-Day' || p.dDay === 'D-7');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner (Clean Stripe White Card with Vibrant Gradient Glow & Crisp Dark Text) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-7 md:p-9 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Subtle Stripe mesh gradient background behind text */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-emerald-100/60 via-indigo-100/50 to-teal-50/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-50/60 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200/80 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>대학생 전용 통합 AI 워크스페이스</span>
          </div>

          {/* Main Title - Dark & Ultra-Crisp */}
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-slate-900 mb-2.5">
            과제 시작부터 발표까지, <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">AI와 함께.</span>
          </h1>

          {/* Description - High-contrast charcoal text */}
          <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
            과제를 분석하고, 팀원과 협업하고, 발표까지 준비하세요. 교수님의 요구사항 분석부터 AI 실전 발표 연습까지 원스톱으로 지원합니다.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/assignments"
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md inline-flex items-center gap-2 group transition-all"
            >
              <span>새 과제 AI 분석하기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/practice"
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-300 inline-flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>AI 발표 연습 시작</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Ongoing Projects + Today's AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ongoing Projects (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>진행 중인 프로젝트</span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  {projects.length}
                </span>
              </h2>
              <p className="text-xs text-slate-600 font-medium">현재 수강 중인 과목의 과제 및 팀프로젝트 현황</p>
            </div>
            <Link
              href="/assignments"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 과제 등록</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Right Sidebar: Today's Recommended Todos + Urgent Alerts (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's AI Todos Card */}
          <div className="stripe-card p-5 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-900">오늘 할 일 (AI 추천)</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">과제 진행 상황 기반 자동 추천</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700">
                {todayTodos.filter(t => t.done).length}/{todayTodos.length}
              </span>
            </div>

            <div className="space-y-2">
              {todayTodos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 group ${
                    todo.done
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-300 hover:border-emerald-500 shadow-2xs'
                  }`}
                >
                  {todo.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 group-hover:text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-xs font-semibold leading-snug ${todo.done ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {todo.text}
                    </p>
                    <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                      {todo.course}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Deadlines Widget */}
          <div className="stripe-card p-5 bg-gradient-to-br from-rose-50 via-amber-50 to-white border-rose-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="font-extrabold text-xs text-slate-900">마감 임박 과제</h3>
            </div>

            <div className="space-y-2.5">
              {urgentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="p-2.5 rounded-xl bg-white border border-rose-200 hover:border-rose-400 flex items-center justify-between transition-all group shadow-2xs"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-rose-700 truncate">{p.title}</p>
                    <p className="text-[11px] text-slate-600 font-medium">{p.course} · 마감 {p.deadline}</p>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                    {p.dDay}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fast Action Feature Cards (Notion-style 3 Pillars) */}
      <div className="pt-2">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
          UniTask 핵심 기능 바로가기
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/assignments"
            className="stripe-card p-5 bg-white hover:border-emerald-400 group flex items-start gap-4 shadow-xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                1. 과제 분석 AI
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                교수님 안내문을 업로드하면 필수 요구사항과 놓치기 쉬운 주의사항, 작업 체크리스트를 자동 생성합니다.
              </p>
            </div>
          </Link>

          <Link
            href="/resources"
            className="stripe-card p-5 bg-white hover:border-emerald-400 group flex items-start gap-4 shadow-xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                2. 팀 자료 AI 정리 & 중복 감지
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                팀원들이 올린 논문과 PDF를 분석하여 중복 조사를 찾고, 보고서 목차에 맞게 자료를 유기적으로 연결합니다.
              </p>
            </div>
          </Link>

          <Link
            href="/practice"
            className="stripe-card p-5 bg-white hover:border-emerald-400 group flex items-start gap-4 shadow-xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                3. AI 발표 연습 & 실전 평가
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                슬라이드별 대본과 예상 시간을 확인하고, 교수님 질문 모드로 발표를 시뮬레이션하여 6대 지표 평가를 받으세요.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}