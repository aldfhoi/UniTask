'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  FileText, 
  Users, 
  FolderOpen, 
  Sparkles, 
  Mic, 
  Settings, 
  ChevronRight,
  GraduationCap,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeProjectTitle?: string;
  activeProjectProgress?: number;
}

export function Sidebar({ activeProjectTitle = '차세대 2차전지 양극재...', activeProjectProgress = 65 }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: '대시보드', href: '/', icon: Home },
    { label: '내 프로젝트', href: '/projects', icon: BookOpen },
    { label: '과제 분석 AI', href: '/assignments', icon: FileText, badge: 'AI' },
    { label: '팀 워크스페이스', href: '/projects/proj-1', icon: Users },
    { label: '자료 관리 & AI 정리', href: '/resources', icon: FolderOpen, badge: 'AI' },
    { label: 'AI 프로젝트 어시스턴트', href: '/assistant', icon: Sparkles, badge: 'RAG' },
    { label: '발표 준비 & 대본', href: '/presentation', icon: Mic },
    { label: 'AI 발표 연습 & 평가', href: '/practice', icon: Award, badge: '실전' },
    { label: '설정', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-30 select-none shadow-xs">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">UniTask</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">대학생 과제·팀플 워크스페이스</p>
          </div>
        </Link>
      </div>

      {/* Current Active Project Widget */}
      <div className="px-4 py-3 border-b border-slate-200/80 bg-slate-50">
        <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1 font-bold">
          <span>선택된 프로젝트</span>
          <span className="text-emerald-700 font-extrabold">{activeProjectProgress}%</span>
        </div>
        <Link 
          href="/projects/proj-1"
          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 shadow-xs transition-all group"
        >
          <div className="truncate pr-2">
            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700">{activeProjectTitle}</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${activeProjectProgress}%` }}></div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
          메뉴
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/projects');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-100 text-emerald-900 font-extrabold shadow-xs border border-emerald-300'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : item.badge === '실전'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Helper Banner / Footer */}
      <div className="p-3 border-t border-slate-200">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-emerald-50 border border-indigo-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
            <span>AI 학습 원칙 안내</span>
          </div>
          <p className="text-[11px] text-slate-700 font-medium leading-tight">
            UniTask AI는 과제를 대신 작성하지 않고 학생의 주도적 완성을 돕습니다.
          </p>
        </div>
      </div>
    </aside>
  );
}