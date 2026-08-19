import React from 'react';
import { Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

interface AiBadgeProps {
  type: 'analysis' | 'citation' | 'verified';
  sourceText?: string;
  className?: string;
}

export function AiBadge({ type, sourceText, className = '' }: AiBadgeProps) {
  if (type === 'analysis') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-2xs ${className}`}>
        <Sparkles className="w-3 h-3 text-indigo-600" />
        AI 분석
      </span>
    );
  }

  if (type === 'citation') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 ${className}`}>
        <BookOpen className="w-3 h-3 text-slate-500" />
        {sourceText ? `출처: ${sourceText}` : '참고문헌 기반'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 ${className}`}>
      <ShieldCheck className="w-3 h-3 text-emerald-600" />
      근거 검증 완료
    </span>
  );
}