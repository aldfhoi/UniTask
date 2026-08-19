'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  Layers, 
  ListTodo, 
  Kanban, 
  FolderOpen, 
  Sparkles, 
  Mic, 
  Plus, 
  Share2, 
  Settings,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Project, Task, TaskStatus } from '../../../lib/types';
import { getStoredProjects, saveProjects, setActiveProjectId } from '../../../lib/storage';
import { KanbanBoard } from '../../../components/KanbanBoard';
import { InviteModal } from '../../../components/InviteModal';
import { AiBadge } from '../../../components/AiBadge';
import { showToast } from '../../../components/Toast';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const projectId = (params?.id as string) || 'proj-1';
  
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'kanban' | 'list' | 'overview'>('kanban');
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    const list = getStoredProjects();
    const found = list.find((p) => p.id === projectId) || list[0];
    if (found) {
      setProject(found);
      setActiveProjectId(found.id);
    }
  }, [projectId]);

  if (!project) {
    return (
      <div className="p-12 text-center text-slate-600">
        프로젝트를 불러오는 중...
      </div>
    );
  }

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = project.tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    
    // Recalculate progress
    const doneCount = updatedTasks.filter((t) => t.status === 'done').length;
    const progress = Math.round((doneCount / Math.max(1, updatedTasks.length)) * 100);

    const updatedProject = { ...project, tasks: updatedTasks, progress };
    setProject(updatedProject);

    const allProjects = getStoredProjects().map((p) =>
      p.id === project.id ? updatedProject : p
    );
    saveProjects(allProjects);
    showToast('success', '작업 상태 변경', '작업 상태 및 진행률이 업데이트되었습니다.');
  };

  // Add new task
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'order'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `t-${Date.now()}`,
      order: project.tasks.length + 1
    };

    const updatedTasks = [...project.tasks, newTask];
    const doneCount = updatedTasks.filter((t) => t.status === 'done').length;
    const progress = Math.round((doneCount / updatedTasks.length) * 100);

    const updatedProject = { ...project, tasks: updatedTasks, progress };
    setProject(updatedProject);

    const allProjects = getStoredProjects().map((p) =>
      p.id === project.id ? updatedProject : p
    );
    saveProjects(allProjects);
    showToast('success', '새 작업 등록', `"${newTask.title}" 작업이 추가되었습니다.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Workspace Header */}
      <div className="stripe-card p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {project.course}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              project.type === 'team' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-700'
            }`}>
              {project.type === 'team' ? '👥 팀 프로젝트' : '👤 개인 과제'}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {project.dDay} (마감 {project.deadline})
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {project.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {project.type === 'team' && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span>팀원 초대</span>
            </button>
          )}

          <Link
            href="/resources"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FolderOpen className="w-4 h-4 text-emerald-600" />
            <span>자료 관리</span>
          </Link>

          <Link
            href="/presentation"
            className="stripe-pill-btn"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>발표 준비</span>
          </Link>
        </div>
      </div>

      {/* Progress & Quick Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stripe-card p-4 bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">전체 진행률</span>
            <span className="font-bold text-emerald-700">{project.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="stripe-card p-4 bg-white flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-600 font-bold uppercase">완료된 태스크</span>
            <p className="text-base font-black text-slate-900">
              {project.tasks.filter(t => t.status === 'done').length} / {project.tasks.length}
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>

        <div className="stripe-card p-4 bg-white flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-600 font-bold uppercase">참여 팀원</span>
            <p className="text-base font-black text-slate-900">{project.members.length}명</p>
          </div>
          <Users className="w-6 h-6 text-indigo-500" />
        </div>

        <div className="stripe-card p-4 bg-white flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-600 font-bold uppercase">AI 어시스턴트</span>
            <Link href="/assistant" className="text-xs font-bold text-indigo-600 hover:underline block mt-0.5">
              자료 기반 RAG 질의 💬
            </Link>
          </div>
          <Sparkles className="w-6 h-6 text-indigo-500" />
        </div>
      </div>

      {/* Tabs Bar: Kanban vs List View vs Overview */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'kanban' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>칸반 보드 (Kanban)</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>테이블 리스트 뷰</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>과제 개요 & 팀원 역할</span>
          </button>
        </div>

        <span className="text-xs text-slate-600 font-medium hidden sm:inline">
          드래그 또는 상태 변경으로 실시간 저장됩니다.
        </span>
      </div>

      {/* Tab Contents */}
      {activeTab === 'kanban' && (
        <KanbanBoard
          tasks={project.tasks}
          members={project.members}
          onTaskStatusChange={handleTaskStatusChange}
          onAddTask={handleAddTask}
        />
      )}

      {activeTab === 'list' && (
        <div className="stripe-card bg-white overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="p-3.5">작업명</th>
                <th className="p-3.5">담당자</th>
                <th className="p-3.5">상태</th>
                <th className="p-3.5">마감일</th>
                <th className="p-3.5">우선순위</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {project.tasks.map((task) => {
                const member = project.members.find(m => m.id === task.assigneeId);
                return (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-semibold text-slate-800">{task.title}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full text-[9px] text-white font-bold flex items-center justify-center ${member?.avatarColor || 'bg-emerald-600'}`}>
                          {task.assigneeName[0]}
                        </span>
                        <span>{task.assigneeName}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={task.status}
                        onChange={(e) => handleTaskStatusChange(task.id, e.target.value as TaskStatus)}
                        className="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-700 font-medium"
                      >
                        <option value="todo">To Do (대기)</option>
                        <option value="in_progress">In Progress (진행 중)</option>
                        <option value="review">Review (검토)</option>
                        <option value="done">Done (완료)</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono">{task.deadline}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'high' ? 'bg-rose-50 text-rose-700' :
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '보통' : '낮음'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Members Breakdown (5 Cols) */}
          <div className="lg:col-span-5 stripe-card p-5 bg-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>팀원별 역할 분담</span>
              </h3>
              <button
                onClick={() => setShowInviteModal(true)}
                className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>초대</span>
              </button>
            </div>

            <div className="space-y-3">
              {project.members.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center ${m.avatarColor || 'bg-emerald-600'}`}>
                      {m.name[0]}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{m.name}</p>
                      <p className="text-[11px] text-slate-500">{m.role} · {m.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    할당: {project.tasks.filter(t => t.assigneeId === m.id).length}건
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Requirements Overview (7 Cols) */}
          <div className="lg:col-span-7 stripe-card p-5 bg-white space-y-4">
            <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>과제 핵심 요구사항 및 일정 체크</span>
            </h3>

            {project.analysis ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700">필수 포함 사항:</span>
                  <ul className="mt-1.5 space-y-1 text-slate-600">
                    {project.analysis.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-rose-700">주의사항 & 감점 방지:</span>
                  <div className="mt-1 space-y-1">
                    {project.analysis.cautionNotes.map((note, i) => (
                      <p key={i} className="text-amber-800 text-[11px] bg-amber-50 p-2 rounded-lg border border-amber-200">
                        {note}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600">등록된 과제 분석 데이터가 없습니다.</p>
            )}
          </div>
        </div>
      )}

      {showInviteModal && (
        <InviteModal project={project} onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}