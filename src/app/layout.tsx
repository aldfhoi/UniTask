import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ToastContainer } from '../components/Toast';

export const metadata: Metadata = {
  title: 'UniTask AI | 대학생 과제·팀프로젝트 통합 AI 워크스페이스',
  description: '과제 분석부터 자료 정리, 팀원 협업, 발표 준비, AI 실전 발표 연습까지 한 곳에서.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 flex antialiased">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 ml-64 p-6 md:p-8 stripe-bg-grid max-w-7xl">
            {children}
          </main>
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}