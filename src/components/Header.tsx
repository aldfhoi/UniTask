'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, ChevronDown, Check, UserPlus } from 'lucide-react';
import { Project } from '../lib/types';
import { getStoredProjects, getActiveProjectId, setActiveProjectId } from '../lib/storage';
import { InviteModal } from './InviteModal';

interface HeaderProps {
  onProjectChange?: (project: Project) => void;
}

export function Header({ onProjectChange }: HeaderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProj, setActiveProj] = useState<Project | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const list = getStoredProjects();
    setProjects(list);
    const activeId = getActiveProjectId();
    const found = list.find(p => p.id === activeId) || list[0];
    setActiveProj(found || null);
  }, []);

  const handleSelect = (p: Project) => {
    setActiveProj(p);
    setActiveProjectId(p.id);
    setIsDropdownOpen(false);
    if (onProjectChange) onProjectChange(p);
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between px-6 ml-64">
      {/* Left: Project Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all text-xs font-semibold text-slate-800 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="max-w-[220px] truncate">{activeProj?.title || '프로젝트 선택'}</span>
            <span className="text-[10px] text-slate-400 font-normal">({activeProj?.course})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                진행 중인 프로젝트
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors group"
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 truncate">{p.title}</span>
                        {p.type === 'team' && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-blue-700 font-bold rounded">팀플</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{p.course} · 마감 {p.deadline}</p>
                    </div>
                    {activeProj?.id === p.id && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 mt-1">
                <Link
                  href="/assignments"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  새 과제 AI 분석 및 생성
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick invite button if team project */}
        {activeProj?.type === 'team' && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl text-slate-600 bg-slate-100/80 hover:bg-slate-200 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>팀원 초대</span>
          </button>
        )}
      </div>

      {/* Middle/Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative hidden lg:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="자료, 태스크, 대본 검색..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100/70 border border-transparent focus:border-emerald-300 focus:bg-white focus:outline-none rounded-full text-xs text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">최근 알림</span>
                <span className="text-[10px] text-emerald-600 font-medium">전체 읽음</span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100/80">
                  <p className="font-semibold text-emerald-950">AI 피드백 도착 🎤</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">발표 리허설 평가 리포트(준비도 88%)가 생성되었습니다.</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-800">중복 자료 감지 알림 📁</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">김민준 팀원과 박서현 팀원의 조사 자료가 65% 유사합니다.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <Link href="/settings" className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            이
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">이예서</p>
            <p className="text-[10px] text-slate-400">한국대 3학년</p>
          </div>
        </Link>
      </div>

      {showInviteModal && activeProj && (
        <InviteModal project={activeProj} onClose={() => setShowInviteModal(false)} />
      )}
    </header>
  );
}