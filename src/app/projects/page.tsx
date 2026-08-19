'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, BookOpen, Users, User, Search, Filter } from 'lucide-react';
import { Project } from '../../lib/types';
import { getStoredProjects } from '../../lib/storage';
import { ProjectCard } from '../../components/ProjectCard';

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'team' | 'personal'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setProjects(getStoredProjects());
  }, []);

  const filtered = projects.filter((p) => {
    if (filter === 'team' && p.type !== 'team') return false;
    if (filter === 'personal' && p.type !== 'personal') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.course.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>내 프로젝트 보관함</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            진행 중인 개인 과제 및 팀프로젝트 워크스페이스를 관리합니다.
          </p>
        </div>

        <Link
          href="/assignments"
          className="stripe-pill-btn"
        >
          <Plus className="w-4 h-4" />
          <span>새 과제 AI 등록</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: '전체 프로젝트' },
            { id: 'team', label: '👥 팀 프로젝트' },
            { id: 'personal', label: '👤 개인 과제' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="과목명, 프로젝트명 검색..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="stripe-card p-12 text-center text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-600">일치하는 프로젝트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}