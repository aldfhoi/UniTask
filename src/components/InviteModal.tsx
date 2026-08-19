'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Link as LinkIcon, Key, Users } from 'lucide-react';
import { Project } from '../lib/types';

interface InviteModalProps {
  project: Project;
  onClose: () => void;
}

export function InviteModal({ project, onClose }: InviteModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const inviteLink = `https://unitask.ai/join/${project.inviteCode}`;

  const copyToClipboard = (text: string, isLink: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">팀원 초대하기</h3>
            <p className="text-xs text-slate-500">{project.title}</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          팀원에게 초대 링크나 코드를 공유하면 별도의 복잡한 가입 절차 없이 워크스페이스에 즉시 참여하여 자료를 함께 조사하고 발표를 준비할 수 있습니다.
        </p>

        {/* Invite Link */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              초대 링크 (원클릭 참여)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-700 font-mono truncate">
                <LinkIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="truncate">{inviteLink}</span>
              </div>
              <button
                onClick={() => copyToClipboard(inviteLink, true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? '복사됨' : '복사'}</span>
              </button>
            </div>
          </div>

          {/* Invite Code */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              초대 코드
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 font-bold tracking-wider font-mono">
                <Key className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>{project.inviteCode}</span>
              </div>
              <button
                onClick={() => copyToClipboard(project.inviteCode, false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '복사됨' : '코드 복사'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Current Members Preview */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 mb-2">참여 중인 팀원 ({project.members.length}명)</p>
          <div className="flex flex-wrap gap-2">
            {project.members.map((m) => (
              <span key={m.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                <span className={`w-2 h-2 rounded-full ${m.avatarColor || 'bg-emerald-500'}`}></span>
                <span className="font-medium">{m.name}</span>
                <span className="text-[10px] text-slate-600">({m.role})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}