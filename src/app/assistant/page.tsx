'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  FolderOpen, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Lightbulb, 
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { Project, Resource, ChatMessage } from '../../lib/types';
import { getStoredProjects, getActiveProjectId, getStoredResources, getStoredChats, saveChats } from '../../lib/storage';
import { AIService } from '../../lib/ai/ai-service';
import { AiBadge } from '../../components/AiBadge';

export default function AssistantPage() {
  const [activeProj, setActiveProj] = useState<Project | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const projects = getStoredProjects();
    const activeId = getActiveProjectId();
    const proj = projects.find(p => p.id === activeId) || projects[0];
    if (proj) {
      setActiveProj(proj);
      const res = getStoredResources(proj.id);
      setResources(res);
      const chats = getStoredChats(proj.id);
      setMessages(chats);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || !activeProj || isThinking) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      projectId: activeProj.id,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await AIService.askProjectAssistant(
        activeProj.id,
        query,
        activeProj,
        resources,
        newMessages
      );

      const aiMsg: ChatMessage = {
        id: `chat-ai-${Date.now()}`,
        projectId: activeProj.id,
        sender: 'ai',
        content: response.text,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        contextSources: response.contextSources
      };

      const updatedHistory = [...newMessages, aiMsg];
      setMessages(updatedHistory);
      saveChats(activeProj.id, updatedHistory);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearHistory = () => {
    if (!activeProj) return;
    setMessages([]);
    saveChats(activeProj.id, []);
  };

  const quickPrompts = [
    '우리 프로젝트에서 어떤 내용을 더 조사해야 할까?',
    '팀원들이 조사한 내용을 합쳐서 발표 구조를 만들어줘.',
    '본론 2장의 하이니켈 열화 메커니즘 핵심 논리 요약해줘.',
    '참고문헌 인용 형식(APA)과 출처 표기 검토해줘.'
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>프로젝트 전용 AI 어시스턴트</span>
                <AiBadge type="analysis" />
              </h1>
              <p className="text-[11px] text-slate-500">
                현재 과제({activeProj?.title})와 업로드된 자료({resources.length}건)를 실시간 참조하여 답변합니다.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="대화 기록 초기화"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="p-8 text-center text-slate-600 stripe-card bg-white max-w-lg mx-auto mt-12">
            <Bot className="w-10 h-10 mx-auto text-indigo-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-700">프로젝트 AI 튜터와 대화를 시작하세요</h3>
            <p className="text-xs text-slate-600 mt-1 mb-4">
              업로드된 자료의 빈틈을 찾거나, 슬라이드 구조 추천, 서론 초안 작성 등 무엇이든 질문하세요.
            </p>
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-bold text-slate-600 uppercase">추천 질문:</span>
              {quickPrompts.slice(0, 2).map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-colors"
                >
                  💡 {qp}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'stripe-card bg-white text-slate-800'
            }`}>
              <div className="whitespace-pre-wrap font-medium">{msg.content}</div>

              {/* Context Sources footer if AI message */}
              {msg.contextSources && msg.contextSources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="font-bold text-indigo-700">🔍 참조 컨텍스트:</span>
                  {msg.contextSources.map((src, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {src}
                    </span>
                  ))}
                </div>
              )}

              <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-slate-600' : 'text-slate-600'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                나
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="stripe-card p-3 bg-white text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>프로젝트 자료를 분석하여 답변을 구성하고 있습니다...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
        <span className="text-[11px] font-bold text-slate-600 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          빠른 질문:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[11px] font-semibold shrink-0 transition-colors border border-slate-200/80"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="stripe-card p-2 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="과제에 관해 무엇이든 물어보세요 (예: 부족한 자료 추천, 결론 작성 방향 등)..."
          className="flex-1 px-3 py-2 text-xs text-slate-800 focus:outline-none placeholder-slate-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isThinking}
          className="stripe-pill-btn disabled:opacity-40"
        >
          <span>전송</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}