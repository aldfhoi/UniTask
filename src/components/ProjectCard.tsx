import React from 'react';
import Link from 'next/link';
import { Calendar, Users, CheckCircle2, ArrowUpRight, Clock } from 'lucide-react';
import { Project } from '../lib/types';

interface ProjectCardProps {
  project: Project;
  onSelect?: () => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const isUrgent = project.dDay === 'D-2' || project.dDay === 'D-1' || project.dDay === 'D-Day';

  return (
    <div className="stripe-card p-5 group flex flex-col justify-between hover:border-emerald-300">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
            {project.course}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isUrgent ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {project.dDay}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              project.type === 'team' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {project.type === 'team' ? '팀플' : '개인'}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link 
          href={`/projects/${project.id}`}
          className="block font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mt-2"
        >
          {project.title}
        </Link>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Current Task Box */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>현재 해야 할 작업</span>
          </div>
          <p className="text-xs font-medium text-slate-800 truncate">
            {project.currentTask || '과제 개요 설계 및 자료 수집'}
          </p>
        </div>
      </div>

      {/* Bottom Progress & Action */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500 font-medium">진행률</span>
          <span className="font-bold text-emerald-700">{project.progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-700" 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {project.members.slice(0, 3).map((m, i) => (
              <span 
                key={m.id} 
                className={`w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white ${m.avatarColor || 'bg-emerald-600'}`}
                title={`${m.name} (${m.role})`}
              >
                {m.name[0]}
              </span>
            ))}
            {project.members.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium ml-1">+{project.members.length - 3}</span>
            )}
          </div>

          <Link
            href={`/projects/${project.id}`}
            className="text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>워크스페이스 열기</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}