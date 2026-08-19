'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Cpu, 
  User, 
  Save, 
  Check, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Info,
  ExternalLink
} from 'lucide-react';
import { UserSettings } from '../../lib/types';
import { getStoredSettings, saveSettings, INITIAL_PROJECTS, INITIAL_RESOURCES, INITIAL_SYNTHESIS, INITIAL_DECKS, INITIAL_EVALUATION, INITIAL_CHATS } from '../../lib/storage';
import { showToast } from '../../components/Toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    geminiApiKey: '',
    selectedModel: 'smart-builtin',
    userName: '이예서',
    studentId: '202314208',
    university: '한국대학교'
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setIsSaved(true);
    showToast('success', '설정 저장 완료', 'AI 모델 및 사용자 설정이 안전하게 저장되었습니다.');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetDemoData = () => {
    if (confirm('모든 과제 및 자료를 초기 데모 상태로 복원하시겠습니까?')) {
      localStorage.clear();
      showToast('info', '초기화 완료', '기본 대학 과제 시나리오가 복원되었습니다.');
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>환경 설정 및 AI 모델 연동</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          시스템 설정
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Google Gemini API 키 설정 및 대학생 프로필, 내장 스마트 AI 엔진 옵션을 관리합니다.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gemini API Key Card */}
        <div className="stripe-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Google Gemini API Key 연동</h3>
                <p className="text-[11px] text-slate-600">직접 발급받은 Gemini API 키를 연결할 수 있습니다.</p>
              </div>
            </div>

            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              settings.geminiApiKey ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
            }`}>
              {settings.geminiApiKey ? '연결됨 (Custom Key)' : '내장 스마트 엔진 구동 중'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gemini API Key (선택 사항)
            </label>
            <input
              type="password"
              value={settings.geminiApiKey}
              onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-600 mt-1.5 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>
                API 키를 입력하지 않아도 고품질 내장 컨텍스트 스마트 엔진이 100% 정상 작동합니다.
              </span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              AI 모델 엔진 선택
            </label>
            <select
              value={settings.selectedModel}
              onChange={(e) => setSettings({ ...settings, selectedModel: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none font-semibold"
            >
              <option value="smart-builtin">🧠 UniTask Built-in Smart Engine (오프라인/기본 스마트 모드)</option>
              <option value="gemini-1.5-flash">⚡ Google Gemini 1.5 Flash (초고속)</option>
              <option value="gemini-2.0-flash">🚀 Google Gemini 2.0 Flash (최신 멀티모달)</option>
              <option value="gemini-1.5-pro">🎯 Google Gemini 1.5 Pro (심층 연구용)</option>
            </select>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="stripe-card p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">사용자 프로필 정보</h3>
              <p className="text-[11px] text-slate-600">보고서 및 팀원 표시에 활용됩니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">이름</label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => setSettings({ ...settings, userName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">학번</label>
              <input
                type="text"
                value={settings.studentId}
                onChange={(e) => setSettings({ ...settings, studentId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">대학교</label>
              <input
                type="text"
                value={settings.university}
                onChange={(e) => setSettings({ ...settings, university: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="px-4 py-2 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>샘플 과제 데이터 전체 초기화</span>
          </button>

          <button
            type="submit"
            className="stripe-pill-btn"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? '저장되었습니다' : '설정 저장하기'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}