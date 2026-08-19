# 🎓 UniTask AI (대학생 과제·팀프로젝트 통합 AI 워크스페이스)

> **"과제 시작부터 발표까지, AI와 함께."**  
> 대학생이 실제 과제와 팀프로젝트를 수행할 때 과제 분석, 자료 조사, 팀원 협업, 발표 준비, AI 실전 발표 연습까지 원스톱으로 관리할 수 있는 생성형 AI 웹 서비스입니다.

---

## 📌 주요 기능 소개

1. **📝 과제 분석 AI (`/assignments`)**
   - 교수님의 과제 안내문(PDF, 텍스트)을 분석하여 **필수 요구사항, 감점 방지 주의사항, 9단계 작업 계획**을 자동 도출합니다.
   - 분석 결과로부터 즉시 개인 과제 또는 팀 프로젝트 워크스페이스를 원클릭 생성합니다.

2. **👥 팀프로젝트 워크스페이스 & Task 관리 (`/projects/[id]`)**
   - **Kanban 보드 & 테이블 뷰**: To Do / In Progress / Review / Done 상태 변경 및 팀원별 담당 업무 배정
   - **원클릭 팀원 초대**: 간편한 초대 링크 및 초대 코드 생성

3. **📁 자료 관리 & AI 종합 정리 (`/resources`)**
   - 논문, 보고서, PDF 업로드 시 AI가 핵심 3줄 요약, 키워드 `#태그`, 핵심 근거 데이터 추출
   - 🔍 **AI 중복 자료 발견**: 팀원 간 유사한 주제를 중복 조사했을 때 알림 및 분담 가이드 제공
   - 🔗 **자료 간 연결 매핑** 및 📑 **AI 추천 4단계 보고서/발표 개요(Structure)** 제공

4. **🤖 프로젝트 전용 AI Assistant (`/assistant`)**
   - 해당 과제 요구사항과 팀원들이 업로드한 자료(RAG 컨텍스트)를 기반으로 부족한 점 진단 및 맞춤 조언 제공

5. **🎤 발표 준비 & 슬라이드별 대본 생성 (`/presentation`)**
   - 슬라이드별 발표 멘트, 예상 발표 소요 시간(초 단위) 자동 계산 및 전체 총 발표 시간 산출
   - 팀원별 발표자 배정 및 인라인 대본 즉시 수정

6. **🏆 AI 실전 발표 연습 & 6대 지표 다면 평가 (`/practice`)**
   - 4가지 모드: 👨‍🏫 **교수님 질문 모드**, ⚡ **까다로운 질문 모드**, 👥 **팀 발표 모드**, 🎯 **일반 연습 모드**
   - 마이크 실시간 음성 인식(STT) 및 AI 질문 음성 출력(TTS)
   - 발표 후 **준비도 점수(예: 88%) + 6대 항목 분석 + 🔴 우선 개선 / 🟡 보완 권장 / 🟢 잘하고 있음** 리포트 제공

7. **⚙️ 환경 설정 (`/settings`)**
   - Google Gemini API Key 설정 지원 및 API 키 없이도 동작하는 고품질 내장 스마트 엔진 탑재

---

## 💻 로컬 실행 방법 (Local Getting Started)

### 1. 저장소 복제 (Clone)
```bash
git clone https://github.com/aldfhoi/UniTask.git
cd UniTask
```

### 2. 패키지 설치 (Install Dependencies)
```bash
npm install
```

### 3. 개발 서버 실행 (Run Dev Server)
```bash
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

---

## 🚀 Vercel 배포 전 체크리스트 (Deployment Checklist)

Vercel에서 본 저장소를 Import하여 바로 배포할 때 아래 순서대로 진행하시면 됩니다.

- [x] **1. GitHub Push 완료**
  - 아래 Git 명령어를 통해 코드가 `https://github.com/aldfhoi/UniTask.git`에 정상 푸시되었는지 확인합니다.
- [x] **2. Vercel에서 Repository Import**
  - [Vercel 대시보드](https://vercel.com/new)에 접속하여 `aldfhoi/UniTask` 저장소를 선택합니다.
  - Framework Preset: **Next.js**가 자동으로 인식됩니다.
- [x] **3. (선택 사항) 환경변수 설정**
  - Gemini API를 사용하시려면 `Environment Variables` 항목에 `GEMINI_API_KEY`를 추가합니다.  
  *(※ 환경변수를 설정하지 않아도 내장 스마트 AI 엔진이 기본 탑재되어 있어 100% 오류 없이 동작합니다.)*
- [x] **4. Deploy 버튼 클릭**
  - 약 1분 내에 `https://unitask.vercel.app` 형태의 라이브 사이트가 배포 완료됩니다.

---

## 🛠 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Stripe Modern Clean Aesthetic)
- **Icons**: Lucide React
- **Speech API**: Web Speech API (STT & TTS)
- **AI Integration**: Google Generative AI (`@google/generative-ai`) & Context-Aware Heuristic Smart Engine