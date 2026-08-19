'use client';

import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, MoreVertical, Calendar, User } from 'lucide-react';
import { Task, TaskStatus, Member } from '../lib/types';

interface KanbanBoardProps {
  tasks: Task[];
  members: Member[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: Omit<Task, 'id' | 'order'>) => void;
}

const COLUMNS: { id: TaskStatus; label: string; bg: string; dot: string }[] = [
  { id: 'todo', label: 'To Do (할 일)', bg: 'bg-slate-50', dot: 'bg-slate-400' },
  { id: 'in_progress', label: 'In Progress (진행 중)', bg: 'bg-blue-50/50', dot: 'bg-blue-500' },
  { id: 'review', label: 'Review (검토)', bg: 'bg-amber-50/50', dot: 'bg-amber-500' },
  { id: 'done', label: 'Done (완료)', bg: 'bg-emerald-50/50', dot: 'bg-emerald-500' },
];

export function KanbanBoard({ tasks, members, onTaskStatusChange, onAddTask }: KanbanBoardProps) {
  const [showAddModal, setShowAddModal] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState(members[0]?.id || '');
  const [newDeadline, setNewDeadline] = useState('08/25');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !showAddModal) return;

    const assignee = members.find(m => m.id === newAssigneeId) || members[0];
    onAddTask({
      projectId: tasks[0]?.projectId || 'proj-1',
      title: newTitle.trim(),
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      status: showAddModal,
      deadline: newDeadline,
      priority: newPriority
    });

    setNewTitle('');
    setShowAddModal(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter(t => t.status === col.id);

        return (
          <div key={col.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 flex flex-col h-full min-h-[480px]">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></span>
                <h4 className="font-bold text-xs text-slate-800">{col.label}</h4>
                <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => setShowAddModal(col.id)}
                className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-500 hover:text-emerald-700 flex items-center justify-center transition-colors"
                title="새 작업 추가"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
              {colTasks.map((task) => {
                const member = members.find(m => m.id === task.assigneeId);

                return (
                  <div
                    key={task.id}
                    className="stripe-card p-3 bg-white hover:border-emerald-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority === 'high' ? '우선순위 높음' : task.priority === 'medium' ? '보통' : '낮음'}
                      </span>
                      
                      {/* Quick Move Dropdown */}
                      <select
                        value={task.status}
                        onChange={(e) => onTaskStatusChange(task.id, e.target.value as TaskStatus)}
                        className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-600 focus:outline-none focus:border-emerald-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">
                      {task.title}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center ${member?.avatarColor || 'bg-emerald-600'}`}>
                          {task.assigneeName[0]}
                        </span>
                        <span className="font-medium text-slate-700">{task.assigneeName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{task.deadline}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="h-24 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  작업 없음
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">새 작업 추가</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">작업 내용</label>
                <input
                  type="text"
                  required
                  placeholder="예: 관련 논문 3편 요약 및 비교표 작성"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">담당 팀원</label>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">마감일</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="08/25"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">우선순위</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="high">높음</option>
                    <option value="medium">보통</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(null)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}