'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Award, 
  Sparkles,
  Send,
  MessageSquare,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { PresentationDeck, SlideScript, PracticeMode, EvaluationReport } from '../lib/types';
import { WebSpeechController } from '../lib/speech';
import { SmartAIEngine } from '../lib/ai/smart-engine';
import { EvaluationModal } from './EvaluationModal';

interface PracticeRoomProps {
  deck: PresentationDeck;
  initialMode?: PracticeMode;
}

export function PracticeRoom({ deck, initialMode = 'professor' }: PracticeRoomProps) {
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isTtsActive, setIsTtsActive] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState('');
  
  // Q&A Interaction
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [qnaLog, setQnaLog] = useState<{ q: string; a: string }[]>([]);
  
  // Evaluation
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);

  const speechControllerRef = useRef<WebSpeechController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    speechControllerRef.current = new WebSpeechController();
    const qList = SmartAIEngine.getPracticeQuestions(mode, deck);
    setQuestions(qList);
    setCurrentQuestionIdx(0);
    setQnaLog([]);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (speechControllerRef.current) {
        speechControllerRef.current.stopListening();
        speechControllerRef.current.cancelSpeech();
      }
    };
  }, [mode, deck]);

  // Timer effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const currentSlide: SlideScript = deck.slides[currentSlideIdx] || deck.slides[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (isTtsActive && questions.length > 0 && currentQuestionIdx === 0 && qnaLog.length === 0) {
        // AI speaks question
        speechControllerRef.current?.speak(questions[0]);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    setCurrentSlideIdx(0);
    setLiveTranscript('');
    setCurrentQuestionIdx(0);
    setQnaLog([]);
  };

  const toggleMic = () => {
    if (isMicActive) {
      speechControllerRef.current?.stopListening();
      setIsMicActive(false);
    } else {
      speechControllerRef.current?.startListening({
        onResult: (text) => {
          setLiveTranscript(text);
          setUserAnswer(text);
        },
        onError: (err) => {
          console.warn('Speech err:', err);
          setIsMicActive(false);
        },
        onEnd: () => {
          setIsMicActive(false);
        }
      });
      setIsMicActive(true);
    }
  };

  const handleNextQuestion = () => {
    if (userAnswer.trim()) {
      setQnaLog(prev => [...prev, { q: questions[currentQuestionIdx], a: userAnswer.trim() }]);
    }
    setUserAnswer('');
    setLiveTranscript('');

    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      const nextQ = questions[currentQuestionIdx + 1];
      if (isTtsActive && nextQ) {
        speechControllerRef.current?.speak(nextQ);
      }
    } else {
      // Finished questions -> Trigger Evaluation
      handleFinishEvaluation();
    }
  };

  const handleFinishEvaluation = () => {
    setIsPlaying(false);
    speechControllerRef.current?.stopListening();
    setIsMicActive(false);
    const report = SmartAIEngine.evaluatePresentation(deck.projectId, mode, elapsedSeconds, qnaLog.length + 1);
    setEvaluationReport(report);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
        {[
          { id: 'professor', label: '👨‍🏫 교수님 질문 모드', desc: '돌발 학술 질문 & 근거 검증' },
          { id: 'tough', label: '⚡ 까다로운 질문 모드', desc: '반론 및 예외 상황 압박 테스트' },
          { id: 'team', label: '👥 팀 발표 모드', desc: '팀원 간 발표 전환 & 역할 조율' },
          { id: 'general', label: '🎯 일반 발표 연습', desc: '대본 텔레프롬프터 & 타이머 연습' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id as PracticeMode)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === tab.id
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Slide Viewer & Teleprompter (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Slide Box */}
          <div className="stripe-card p-6 bg-gradient-to-b from-white to-slate-50/50 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                  Slide {currentSlide.slideNumber} / {deck.totalSlides}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  담당: <strong className="text-slate-900">{currentSlide.speakerName}</strong>
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                권장 시간: {currentSlide.estimatedSeconds}초
              </span>
            </div>

            {/* Slide Title & Key Points */}
            <div className="my-4">
              <h3 className="text-lg font-black text-slate-900 mb-2">
                {currentSlide.slideTitle}
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {currentSlide.keyPoints.map((kp, i) => (
                  <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                    • {kp}
                  </span>
                ))}
              </div>

              {/* Script Teleprompter Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    발표 대본 (Teleprompter)
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">한국어 구어체</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  "{currentSlide.script}"
                </p>
              </div>
            </div>

            {/* Slide Navigator */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                disabled={currentSlideIdx === 0}
                onClick={() => setCurrentSlideIdx(prev => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>이전 슬라이드</span>
              </button>

              <div className="flex items-center gap-1">
                {deck.slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIdx(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentSlideIdx ? 'w-6 bg-emerald-600' : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={currentSlideIdx === deck.slides.length - 1}
                onClick={() => setCurrentSlideIdx(prev => Math.min(deck.slides.length - 1, prev + 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>다음 슬라이드</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Control Bar: Timer & Mic */}
          <div className="stripe-card p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm transition-transform active:scale-95 ${
                  isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={handleReset}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                title="타이머 초기화"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">발표 경과 시간</div>
                <div className="text-xl font-black text-slate-900 font-mono">
                  {formatTime(elapsedSeconds)} <span className="text-xs font-normal text-slate-400">/ {formatTime(deck.estimatedTotalSeconds)}</span>
                </div>
              </div>
            </div>

            {/* Mic & Audio toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isMicActive
                    ? 'bg-rose-50 text-rose-700 border border-rose-300 animate-pulse'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isMicActive ? <Mic className="w-4 h-4 text-rose-600" /> : <MicOff className="w-4 h-4 text-slate-400" />}
                <span>{isMicActive ? '음성 인식 중...' : '마이크 켜기'}</span>
              </button>

              <button
                onClick={() => setIsTtsActive(!isTtsActive)}
                className={`p-2 rounded-xl border text-xs font-medium ${
                  isTtsActive ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
                title="AI 음성 질문 읽어주기"
              >
                {isTtsActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleFinishEvaluation}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>평가 리포트 생성</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Question & Interactive Answer Stage (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="stripe-card p-5 bg-white flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {mode === 'professor' ? '교수님 돌발 질문' : mode === 'tough' ? '심층 압박 질문' : '실전 질의응답'}
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  질문 {currentQuestionIdx + 1} / {questions.length}
                </span>
              </div>

              {/* Question Bubble */}
              {questions[currentQuestionIdx] && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-950 leading-relaxed font-semibold mb-4">
                  {questions[currentQuestionIdx]}
                </div>
              )}

              {/* Past QnA mini log */}
              {qnaLog.length > 0 && (
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">이전 답변 완료 목록</span>
                  {qnaLog.map((log, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px]">
                      <p className="font-semibold text-slate-700 truncate">Q: {log.q}</p>
                      <p className="text-slate-500 truncate mt-0.5">A: {log.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Answer Input Area */}
            <div>
              {liveTranscript && (
                <div className="mb-2 p-2 rounded-lg bg-emerald-50 text-[11px] text-emerald-800 border border-emerald-200">
                  🎤 실시간 음성 변환: "{liveTranscript}"
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={3}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="마이크로 말씀하시거나 여기에 직접 답변을 입력하세요..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-slate-400">
                  {isMicActive ? '말씀이 끝나면 버튼을 눌러주세요.' : '텍스트 또는 음성으로 답변'}
                </span>
                <button
                  onClick={handleNextQuestion}
                  disabled={!userAnswer.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>{currentQuestionIdx + 1 < questions.length ? '다음 질문' : '답변 완료 & 평가'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      {evaluationReport && (
        <EvaluationModal
          report={evaluationReport}
          onClose={() => setEvaluationReport(null)}
          onRetry={() => {
            setEvaluationReport(null);
            handleReset();
          }}
        />
      )}
    </div>
  );
}