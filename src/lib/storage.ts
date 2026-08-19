import { Project, Resource, ProjectSynthesis, PresentationDeck, EvaluationReport, ChatMessage, UserSettings, AssignmentAnalysis } from './types';

const STORAGE_KEYS = {
  PROJECTS: 'unitask_projects_v1',
  RESOURCES: 'unitask_resources_v1',
  SYNTHESIS: 'unitask_synthesis_v1',
  DECKS: 'unitask_decks_v1',
  EVALUATIONS: 'unitask_evaluations_v1',
  CHATS: 'unitask_chats_v1',
  SETTINGS: 'unitask_settings_v1',
  ACTIVE_PROJECT_ID: 'unitask_active_project_id_v1',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: '차세대 2차전지 양극재 기술 동향 및 시장 분석',
    course: '에너지신소재공학',
    type: 'team',
    progress: 65,
    deadline: '2026-08-26',
    dDay: 'D-7',
    currentTask: '논문 자료 정리 및 실증 사례 분석',
    description: 'NCM/LFP 및 전고체 배터리용 고에너지 밀도 양극재의 최신 기술 트렌드와 국내외 밸류체인 경쟁력 심층 분석',
    inviteCode: 'BATTERY-2026',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-19',
    members: [
      { id: 'm-1', name: '이예서 (팀장)', role: '총괄 및 해결방안', email: 'yeseo@univ.ac.kr', avatarColor: 'bg-emerald-600', assignedTaskCount: 3 },
      { id: 'm-2', name: '김민준', role: '시장 동향 & 기술 분석', email: 'minjun@univ.ac.kr', avatarColor: 'bg-blue-600', assignedTaskCount: 2 },
      { id: 'm-3', name: '박서현', role: '국내외 사례 & PPT 제작', email: 'seohyun@univ.ac.kr', avatarColor: 'bg-indigo-600', assignedTaskCount: 2 },
      { id: 'm-4', name: '정우진', role: '원가 분석 & 발표', email: 'woojin@univ.ac.kr', avatarColor: 'bg-purple-600', assignedTaskCount: 2 },
    ],
    tasks: [
      { id: 't-1', projectId: 'proj-1', title: '국내외 고용량 하이니켈 NCM 학술 논문 3편 분석', assigneeId: 'm-2', assigneeName: '김민준', status: 'done', deadline: '08/15', priority: 'high', order: 1 },
      { id: 't-2', projectId: 'proj-1', title: '글로벌 LFP 대비 NCM 원가 경쟁력 비교표 작성', assigneeId: 'm-4', assigneeName: '정우진', status: 'done', deadline: '08/17', priority: 'medium', order: 2 },
      { id: 't-3', projectId: 'proj-1', title: '국내 3사(LG엔솔, 삼성SDI, SK온) 양극재 로드맵 조사', assigneeId: 'm-3', assigneeName: '박서현', status: 'in_progress', deadline: '08/21', priority: 'high', order: 3 },
      { id: 't-4', projectId: 'proj-1', title: '기술적 한계점(열화 현상, 열폭주) 및 안정성 해결 방안 정리', assigneeId: 'm-1', assigneeName: '이예서 (팀장)', status: 'in_progress', deadline: '08/22', priority: 'high', order: 4 },
      { id: 't-5', projectId: 'proj-1', title: '중간 보고서 및 10장 규모 PPT 슬라이드 초안 구성', assigneeId: 'm-3', assigneeName: '박서현', status: 'todo', deadline: '08/24', priority: 'medium', order: 5 },
      { id: 't-6', projectId: 'proj-1', title: '발표 대본 완성 및 AI 시뮬레이터 실전 연습', assigneeId: 'm-4', assigneeName: '정우진', status: 'todo', deadline: '08/25', priority: 'high', order: 6 },
    ],
    analysis: {
      id: 'ana-1',
      course: '에너지신소재공학',
      title: '차세대 2차전지 양극재 기술 동향 및 시장 분석',
      deadline: '2026-08-26 (수) 23:59',
      format: 'PDF 보고서 (10~15p) + 발표 PPT (15분 분량)',
      pageLength: '보고서 12페이지 내외, 슬라이드 15장',
      isTeam: true,
      requirements: [
        '기존 NCM622 대비 하이니켈(9반반 이상) 기술적 장단점 명시',
        'LFP 배터리와의 경제성/안전성 다각도 비교 분석표 포함 필수',
        '글로벌 원자재 공급망(리튬, 니켈) 리스크와 대응 전략 제시',
        '팀원별 담당 파트 및 기여도 명확히 기재'
      ],
      cautionNotes: [
        '⚠️ 학술 논문 및 공신력 있는 기관(IEA, SNE리서치 등) 참고문헌 7개 이상 필수 인용',
        '⚠️ 단순 기술 나열 지양, 수치화된 데이터와 근거 그래프 반드시 포함할 것',
        '⚠️ 발표 시 질의응답 5분 포함되므로 예상 질문 사전 대비 필수'
      ],
      planSteps: [
        { id: 1, title: '주제 구체화 및 팀원 역할 분담', description: '배터리 세부 소재(NCM/LFP)별 담당자 매핑', done: true },
        { id: 2, title: '학술 논문 및 시장 보고서 수집', description: 'KCI/SCI 논문 및 시장조사기관 리포트 8편 확보', done: true },
        { id: 3, title: '핵심 데이터 취합 및 AI 요약', description: '에너지밀도 및 단가 수치 데이터 시트화', done: true },
        { id: 4, title: '보고서 개요 및 본론 초안 작성', description: '문제정의 -> 비교분석 -> 해결방안 구조화', done: false },
        { id: 5, title: '발표자료(PPT) 제작', description: '가독성 높은 인포그래픽 및 15장 슬라이드 완성', done: false },
        { id: 6, title: '발표 대본 생성 & AI 리허설 연습', description: '15분 분량 타이머 준수 및 교수님 질문 대비', done: false },
        { id: 7, title: '최종 교정 및 PDF 변환 제출', description: '참고문헌 포맷 검토 및 시스템 업로드', done: false },
      ],
      createdAt: '2026-08-10'
    }
  },
  {
    id: 'proj-2',
    title: '생성형 AI 시대의 플랫폼 비즈니스 모델 혁신 연구',
    course: '경영정보시스템',
    type: 'personal',
    progress: 40,
    deadline: '2026-08-30',
    dDay: 'D-11',
    currentTask: '해외 SaaS 기업 AI 수익화 사례 비교',
    description: 'LLM 및 멀티모달 AI를 도입한 글로벌 플랫폼 기업들의 수익 모델 다변화 전략과 이용자 리텐션 효과 분석',
    inviteCode: 'MIS-PERSONAL',
    createdAt: '2026-08-12',
    updatedAt: '2026-08-18',
    members: [
      { id: 'm-1', name: '이예서', role: '작성자', email: 'yeseo@univ.ac.kr', avatarColor: 'bg-emerald-600', assignedTaskCount: 4 }
    ],
    tasks: [
      { id: 't-201', projectId: 'proj-2', title: 'OpenAI, Anthropic, Notion의 B2B 과금 모델 비교표 작성', assigneeId: 'm-1', assigneeName: '이예서', status: 'done', deadline: '08/16', priority: 'high', order: 1 },
      { id: 't-202', projectId: 'proj-2', title: '국내 AI 스타트업(업스테이지, 뤼튼 등) 수익 모델 인터뷰 기사 정리', assigneeId: 'm-1', assigneeName: '이예서', status: 'in_progress', deadline: '08/23', priority: 'medium', order: 2 },
      { id: 't-203', projectId: 'proj-2', title: '본론 3장: 플랫폼 전환 비용과 네트워크 효과 분석 작성', assigneeId: 'm-1', assigneeName: '이예서', status: 'todo', deadline: '08/27', priority: 'high', order: 3 },
      { id: 't-204', projectId: 'proj-2', title: '결론 및 미래 비즈니스 시사점 도출', assigneeId: 'm-1', assigneeName: '이예서', status: 'todo', deadline: '08/29', priority: 'medium', order: 4 },
    ]
  },
  {
    id: 'proj-3',
    title: '스마트 모빌리티 도시 인프라 최적화 알고리즘 제안',
    course: '도시계획학개론',
    type: 'team',
    progress: 85,
    deadline: '2026-08-21',
    dDay: 'D-2',
    currentTask: '최종 발표 리허설 및 평가 리포트 확인',
    description: '도심 교통 혼잡 구간의 V2X 통신 기반 신호 제어 및 자율주행 셔틀 노선 최적화 알고리즘 연구',
    inviteCode: 'MOBILITY-77',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-19',
    members: [
      { id: 'm-1', name: '이예서', role: '알고리즘 설계', email: 'yeseo@univ.ac.kr', avatarColor: 'bg-emerald-600', assignedTaskCount: 2 },
      { id: 'm-5', name: '최동현', role: '데이터 시뮬레이션', email: 'donghyun@univ.ac.kr', avatarColor: 'bg-amber-600', assignedTaskCount: 2 },
      { id: 'm-6', name: '한지민', role: '발표 및 보고서', email: 'jimin@univ.ac.kr', avatarColor: 'bg-rose-600', assignedTaskCount: 2 },
    ],
    tasks: [
      { id: 't-301', projectId: 'proj-3', title: '서울시 강남구 교통량 공공 데이터셋 정제', assigneeId: 'm-5', assigneeName: '최동현', status: 'done', deadline: '08/08', priority: 'high', order: 1 },
      { id: 't-302', projectId: 'proj-3', title: 'SUMO 시뮬레이터 신호 연동 알고리즘 테스트', assigneeId: 'm-1', assigneeName: '이예서', status: 'done', deadline: '08/14', priority: 'high', order: 2 },
      { id: 't-303', projectId: 'proj-3', title: '교통 지체 시간 23% 개선 실증 수치 도출', assigneeId: 'm-5', assigneeName: '최동현', status: 'done', deadline: '08/16', priority: 'medium', order: 3 },
      { id: 't-304', projectId: 'proj-3', title: '최종 발표 PPT 20장 완성 및 발표 대본 생성', assigneeId: 'm-6', assigneeName: '한지민', status: 'done', deadline: '08/18', priority: 'high', order: 4 },
      { id: 't-305', projectId: 'proj-3', title: 'AI 발표 연습 시뮬레이터로 예상 질문 Q&A 점검', assigneeId: 'm-6', assigneeName: '한지민', status: 'in_progress', deadline: '08/20', priority: 'high', order: 5 },
    ]
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    projectId: 'proj-1',
    title: '하이니켈 NCM 양극재 열화 메커니즘 및 도핑 개질 연구.pdf',
    fileType: 'pdf',
    fileSize: '3.4 MB',
    uploaderName: '김민준',
    uploadDate: '2026-08-14',
    summary: 'Ni 함량 90% 이상 고용량 양극재에서 발생하는 미세 균열(Microcrack) 발생 원인과 Zr/Al 코팅을 통한 열화 억제 기법을 실험적으로 입증함. 300사이클 후 용량 유지율 89.2% 달성.',
    keywords: ['하이니켈 NCM', '미세 균열', '열안정성', '표면 코팅', '용량 유지율'],
    evidencePoints: [
      'Ni 비율이 80% -> 90% 증가 시 충방전 중 상변화(H2->H3)로 인한 체적 수축율이 2.4배 증가',
      'Zr 원소 도핑 시 격자 스트레인이 45% 완화되어 사이클 수명 25% 향상'
    ],
    sourceCitation: 'Journal of Power Sources (2025), "Degradation mitigation of Ni-rich cathode via atomic layer coating"',
    matchedSection: '본론 2장: 핵심 기술적 한계 및 극복 방안'
  },
  {
    id: 'res-2',
    projectId: 'proj-1',
    title: '글로벌 LFP vs NCM 배터리 제조원가 및 공급망 전망.pdf',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    uploaderName: '정우진',
    uploadDate: '2026-08-16',
    summary: '2026년 기준 팩 단위 단가 비교(LFP: $68/kWh, NCM: $89/kWh). 리튬/니켈 가격 변동성에 따른 원가 마진율과 글로벌 완성차 업체의 소재 채택 로드맵 수록.',
    keywords: ['LFP 배터리', 'kWh당 제조단가', '원자재 공급망', 'CATL', '가격 경쟁력'],
    evidencePoints: [
      'LFP는 NCM 대비 약 23% 저렴하나 에너지 밀도가 30% 낮아 대형 SUV 적용 한계',
      '니켈 가격 폭등 시 NCM 원가 상승률이 LFP 대비 1.8배 민감하게 반응'
    ],
    sourceCitation: 'BloombergNEF (2026), "Global EV Battery Pack Price & Raw Material Outlook"',
    matchedSection: '본론 1장: 소재별 경제성 및 원가 비교'
  },
  {
    id: 'res-3',
    projectId: 'proj-1',
    title: '고에너지밀도 양극재 표면 코팅 기술 동향 보고서.docx',
    fileType: 'docx',
    fileSize: '1.2 MB',
    uploaderName: '박서현',
    uploadDate: '2026-08-17',
    summary: '하이니켈 배터리의 수명 연장을 위한 건식/습식 코팅 공정 비교. 김민준 팀원의 논문과 유사하게 양극재 열화 방지 코팅제를 다루고 있음.',
    keywords: ['건식 코팅', '열화 방지', '양극재 안정화', '전해액 부반응'],
    evidencePoints: [
      '건식 코팅 공정 도입 시 기존 용매 건조 공정 대비 생산 단가 12% 절감'
    ],
    sourceCitation: '한국에너지기술연구원 (2026), "이차전지 전극 소재 기술동향"',
    matchedSection: '본론 2장: 제조 공정 혁신 방안'
  }
];

export const INITIAL_SYNTHESIS: ProjectSynthesis = {
  projectId: 'proj-1',
  readinessNote: '업로드된 3건의 자료를 종합할 때, 기술 분석과 원가 분석 자료가 풍부하게 수집되었습니다. 다만 [국내 실증 정책 및 폐배터리 리사이클링] 관련 자료가 보완되면 더욱 완성도 높은 과제가 됩니다.',
  duplicates: [
    {
      id: 'dup-1',
      fileA: '하이니켈 NCM 양극재 열화 메커니즘...pdf (김민준)',
      fileB: '고에너지밀도 양극재 표면 코팅 기술...docx (박서현)',
      uploaderA: '김민준',
      uploaderB: '박서현',
      reason: '두 자료 모두 [하이니켈 양극재의 표면 코팅 및 열화 억제 기법]을 중점적으로 다루고 있어 조사 영역이 약 70% 중복됩니다.',
      suggestion: '김민준 팀원의 논문은 [재료 물성 및 실험 데이터]에 활용하고, 박서현 팀원의 자료는 [공정 단가 절감 효과]에 집중하여 역할을 분리하는 것을 추천합니다.'
    }
  ],
  linkages: [
    {
      id: 'link-1',
      fileTitle: '글로벌 LFP vs NCM 배터리 제조원가...pdf',
      suggestedSection: '서론 및 본론 1: 시장 현황 및 경제성 비교',
      roleInReport: '왜 하이니켈 NCM의 원가 절감과 고에너지밀도화가 필수적인지 문제 정의의 핵심 통계 근거로 활용'
    },
    {
      id: 'link-2',
      fileTitle: '하이니켈 NCM 양극재 열화 메커니즘...pdf',
      suggestedSection: '본론 2: 핵심 기술적 과제 및 해결 메커니즘',
      roleInReport: '하이니켈화에 따른 수명 저하 원인을 과학적으로 규명하고 코팅 솔루션의 구체적 성능 수치 제시'
    },
    {
      id: 'link-3',
      fileTitle: '고에너지밀도 양극재 표면 코팅 기술...docx',
      suggestedSection: '본론 3 & 결론: 산업계 상용화 공정 및 경제적 파급효과',
      roleInReport: '실제 양산 라인 적용 가능성과 공정 혁신을 통한 원가 절감 기대효과 뒷받침'
    }
  ],
  recommendedOutline: [
    {
      chapter: '1. 서론: 연구 배경 및 문제 정의',
      title: '전기차 시장 확대에 따른 고에너지밀도 배터리 수요 급증',
      description: 'LFP와 NCM의 시장 점유율 격차 분석 및 차세대 양극재 혁신의 필요성 제시',
      sourceResources: ['글로벌 LFP vs NCM 배터리 제조원가...pdf']
    },
    {
      chapter: '2. 본론: 하이니켈 NCM 기술 동향 및 한계점',
      title: 'Ni 90%+ 초고용량 양극재의 화학적 불안정성과 미세 균열 열화 메커니즘',
      description: '충방전 사이클에 따른 구조 붕괴 원인 및 실험 데이터 시각화',
      sourceResources: ['하이니켈 NCM 양극재 열화 메커니즘...pdf']
    },
    {
      chapter: '3. 해결방안: 도핑 및 첨단 코팅 공정 기술',
      title: '원자층 코팅(ALD) 및 건식 코팅을 통한 수명·안전성 개선과 원가 절감',
      description: '사이클 수명 25% 향상 및 양산 단가 12% 절감 효과 검증',
      sourceResources: ['하이니켈 NCM 양극재 열화 메커니즘...pdf', '고에너지밀도 양극재 표면 코팅 기술...docx']
    },
    {
      chapter: '4. 결론 및 산업적 시사점',
      title: 'K-배터리 글로벌 밸류체인 경쟁력 확보 전략',
      description: '향후 전고체 배터리 시대로의 전환 로드맵과 정부/학계의 협력 방향 제언',
      sourceResources: ['글로벌 LFP vs NCM 배터리 제조원가...pdf']
    }
  ]
};

export const INITIAL_DECKS: Record<string, PresentationDeck> = {
  'proj-1': {
    id: 'deck-1',
    projectId: 'proj-1',
    title: '차세대 2차전지 양극재 기술 동향 및 시장 경쟁력 분석 (최종 발표)',
    totalSlides: 6,
    estimatedTotalSeconds: 435, // 7분 15초
    updatedAt: '2026-08-19',
    slides: [
      {
        slideNumber: 1,
        slideTitle: '표지 및 팀원 소개',
        keyPoints: ['프로젝트 제목', '팀원 및 역할 소개', '발표 목적'],
        script: '안녕하십니까. 에너지신소재공학 3조 발표를 맡은 정우진입니다. 저희 팀은 전기차 캐즘 극복과 차세대 모빌리티의 핵심 열쇠인 "차세대 2차전지 양극재 기술 동향 및 시장 분석"을 주제로 발표를 준비했습니다. 팀장 이예서 학생의 총괄 하에 김민준, 박서현 팀원과 함께 심층 조사를 진행했습니다.',
        estimatedSeconds: 45,
        speakerName: '정우진'
      },
      {
        slideNumber: 2,
        slideTitle: '연구 배경: 왜 다시 양극재 혁신인가?',
        keyPoints: ['LFP 저가 공세', 'NCM 고에너지밀도 차별화', 'K-배터리 생존 전략'],
        script: '현재 글로벌 배터리 시장은 중국발 LFP 배터리의 저가 공세와 에너지 밀도의 한계가 공존하는 전환점에 서 있습니다. BloombergNEF 자료에 따르면 LFP는 팩당 $68 수준으로 저렴하지만 주행거리 확장에 한계가 명확합니다. 따라서 대한민국 배터리 산업이 지속 가능한 초격차를 유지하기 위해서는 Ni 90% 이상의 고용량 하이니켈 NCM 양극재 기술 확보가 필수적입니다.',
        estimatedSeconds: 65,
        speakerName: '김민준'
      },
      {
        slideNumber: 3,
        slideTitle: '핵심 기술적 난제: 하이니켈 양극재의 열화 메커니즘',
        keyPoints: ['미세 균열(Microcrack)', '격자 수축 H2->H3 상변화', '가스 발생 및 열폭주 위험'],
        script: '하지만 니켈 함량을 90% 이상으로 높이면 결정적인 기술적 난제가 발생합니다. 충방전이 반복됨에 따라 양극재 입자 내부에서 체적 수축율이 2.4배 증가하면서 미세 균열이 발생하고, 전해액과 반응해 가스가 방출되면서 사이클 수명이 급격히 저하됩니다. 즉, 고용량화와 구조적 안정성 사이의 트레이드오프가 최대 병목입니다.',
        estimatedSeconds: 80,
        speakerName: '김민준'
      },
      {
        slideNumber: 4,
        slideTitle: '돌파구: 나노 표면 코팅 & Zr 도핑 공정 혁신',
        keyPoints: ['원자층 코팅(ALD)', '격자 스트레인 45% 완화', '300사이클 수명 유지율 89.2%'],
        script: '저희 조가 분석한 핵심 돌파구는 "나노 표면 코팅"과 "원소 도핑" 기술입니다. 지르코늄(Zr) 도핑을 통해 결정 격자 스트레인을 45% 완화하고, 초박형 표면 코팅층을 형성함으로써 300사이클 후에도 89.2%라는 높은 용량 유지율을 달성할 수 있음을 실험 데이터로 검증했습니다.',
        estimatedSeconds: 75,
        speakerName: '이예서 (팀장)'
      },
      {
        slideNumber: 5,
        slideTitle: '경제성 분석: 건식 공정 도입을 통한 원가 절감',
        keyPoints: ['건식 전극 공정', '생산 원가 12% 절감', '글로벌 가격 경쟁력 확보'],
        script: '기술적 완성도뿐 아니라 제조 원가 경쟁력 역시 핵심입니다. 한국에너지기술연구원 분석에 따르면 건식 코팅 공정을 도입할 경우 용매 건조 공정이 생략되어 전극 제조 단가를 약 12% 절감할 수 있습니다. 이를 통해 고성능 NCM 배터리의 가격 프리미엄을 상쇄할 수 있습니다.',
        estimatedSeconds: 70,
        speakerName: '박서현'
      },
      {
        slideNumber: 6,
        slideTitle: '결론 및 질의응답 (Q&A)',
        keyPoints: ['핵심 요약', '향후 발전 방향', '감사 인사 및 Q&A 진행'],
        script: '결론적으로 차세대 배터리 시장의 승자는 초고용량 하이니켈의 안정화 기술과 원가 절감 공정을 동시에 달성하는 기업이 될 것입니다. 이상으로 발표를 마치고 교수님과 학우 여러분의 날카로운 질문을 받도록 하겠습니다. 경청해 주셔서 감사합니다.',
        estimatedSeconds: 50,
        speakerName: '정우진'
      }
    ]
  }
};

export const INITIAL_EVALUATION: EvaluationReport = {
  id: 'eval-1',
  projectId: 'proj-1',
  sessionDate: '2026-08-19 14:30',
  overallScore: 88,
  readinessPercent: 88,
  metrics: {
    understanding: 92,
    logic: 90,
    structure: 95,
    qnaResponse: 82,
    answerSpecificity: 85,
    timeManagement: 84
  },
  priorityImprovements: [
    '🔴 [우선 개선] Slide 3 열폭주 위험 질문 시, 화재 지연(BMS 및 분리막 연계)에 대한 구체적 안전 장치 수치 보완 필요'
  ],
  recommendedEnhancements: [
    '🟡 [보완 권장] Slide 5 건식 공정 설명 시, 기존 습식 공정 설비의 전환 투자 비용에 대한 언급을 1문장 추가하면 설득력 상승'
  ],
  strengths: [
    '🟢 [잘하고 있음] Slide 1~6의 논리적 빌드업(문제제기 -> 원인분석 -> 기술솔루션 -> 경제성)이 매우 탄탄함',
    '🟢 [잘하고 있음] 7분 15초로 권장 발표 시간(7~8분)을 정확하게 지키는 페이싱'
  ],
  overallComment: '전반적인 기술적 깊이와 발표 전달력이 매우 우수합니다. 질문 대응 시 수치적 근거(수명 유지율 89.2%, 12% 단가 절감 등)를 적극적으로 언급하면 A+ 발표가 될 것입니다.'
};

export const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'c-1',
    projectId: 'proj-1',
    sender: 'user',
    content: '현재 우리 프로젝트에서 어떤 내용을 더 조사해야 할까?',
    timestamp: '오후 2:15'
  },
  {
    id: 'c-2',
    projectId: 'proj-1',
    sender: 'ai',
    content: '현재 업로드된 자료를 분석한 결과, 다음 2가지 영역이 다소 부족합니다.\n\n1. **폐배터리 리사이클링 및 ESG 규제**: EU 배터리 여권 제도(2026 시행)에 따른 양극재 회수율 규제 대응 전략\n2. **실제 완성차 기업(현대차, 테슬라 등)의 2026~2027 채택 현황**: 실험실 수치를 넘어선 양산 적용 사례\n\n이 2가지 자료를 추가로 보완하시면 교수님의 과제 요구사항을 100% 충족할 수 있습니다.',
    timestamp: '오후 2:15',
    contextSources: ['과제 요구사항 체크리스트', '하이니켈 NCM 양극재 열화 메커니즘.pdf']
  },
  {
    id: 'c-3',
    projectId: 'proj-1',
    sender: 'user',
    content: '팀원들이 조사한 내용을 합쳐서 발표 구조를 만들어줘.',
    timestamp: '오후 2:18'
  },
  {
    id: 'c-4',
    projectId: 'proj-1',
    sender: 'ai',
    content: '업로드된 3개 자료를 종합하여 **7분~8분 발표에 최적화된 6단계 슬라이드 구조**를 추천합니다!\n\n- **Slide 1**: 연구 배경 및 K-배터리 생존 과제 (정우진)\n- **Slide 2**: LFP 저가 공세와 NCM 고에너지밀도화 필요성 (김민준)\n- **Slide 3**: 하이니켈의 핵심 병목: 미세 균열 & 열화 메커니즘 (김민준)\n- **Slide 4**: 나노 코팅 & Zr 도핑 기술 해결책 (이예서)\n- **Slide 5**: 건식 공정 도입을 통한 12% 원가 절감 효과 (박서현)\n- **Slide 6**: 종합 결론 및 Q&A 대비 (정우진)\n\n[발표 준비] 메뉴에서 슬라이드별 맞춤 대본을 바로 확인하실 수 있습니다.',
    timestamp: '오후 2:18',
    contextSources: ['업로드 자료 3종 종합 분석']
  }
];

export const INITIAL_SETTINGS: UserSettings = {
  geminiApiKey: '',
  selectedModel: 'smart-builtin',
  userName: '이예서',
  studentId: '202314208',
  university: '한국대학교'
};

// Helper storage functions
export function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

export function getActiveProjectId(): string {
  if (typeof window === 'undefined') return 'proj-1';
  const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
  return stored || 'proj-1';
}

export function setActiveProjectId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
}

export function getStoredResources(projectId?: string): Resource[] {
  if (typeof window === 'undefined') return INITIAL_RESOURCES;
  const stored = localStorage.getItem(STORAGE_KEYS.RESOURCES);
  let list: Resource[] = INITIAL_RESOURCES;
  if (stored) {
    try {
      list = JSON.parse(stored);
    } catch (e) {
      list = INITIAL_RESOURCES;
    }
  } else {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
  }
  return projectId ? list.filter(r => r.projectId === projectId) : list;
}

export function saveResources(resources: Resource[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
}

export function getStoredSynthesis(projectId: string): ProjectSynthesis {
  if (typeof window === 'undefined') return INITIAL_SYNTHESIS;
  const stored = localStorage.getItem(`${STORAGE_KEYS.SYNTHESIS}_${projectId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_SYNTHESIS;
    }
  }
  return INITIAL_SYNTHESIS;
}

export function saveSynthesis(projectId: string, synth: ProjectSynthesis): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEYS.SYNTHESIS}_${projectId}`, JSON.stringify(synth));
}

export function getStoredDeck(projectId: string): PresentationDeck | null {
  if (typeof window === 'undefined') return INITIAL_DECKS[projectId] || null;
  const stored = localStorage.getItem(`${STORAGE_KEYS.DECKS}_${projectId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_DECKS[projectId] || null;
    }
  }
  return INITIAL_DECKS[projectId] || null;
}

export function saveDeck(projectId: string, deck: PresentationDeck): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEYS.DECKS}_${projectId}`, JSON.stringify(deck));
}

export function getStoredEvaluation(projectId: string): EvaluationReport | null {
  if (typeof window === 'undefined') return INITIAL_EVALUATION;
  const stored = localStorage.getItem(`${STORAGE_KEYS.EVALUATIONS}_${projectId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_EVALUATION;
    }
  }
  return projectId === 'proj-1' ? INITIAL_EVALUATION : null;
}

export function saveEvaluation(projectId: string, evalReport: EvaluationReport): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEYS.EVALUATIONS}_${projectId}`, JSON.stringify(evalReport));
}

export function getStoredChats(projectId: string): ChatMessage[] {
  if (typeof window === 'undefined') return INITIAL_CHATS;
  const stored = localStorage.getItem(`${STORAGE_KEYS.CHATS}_${projectId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_CHATS;
    }
  }
  return projectId === 'proj-1' ? INITIAL_CHATS : [];
}

export function saveChats(projectId: string, chats: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEYS.CHATS}_${projectId}`, JSON.stringify(chats));
}

export function getStoredSettings(): UserSettings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_SETTINGS;
    }
  }
  return INITIAL_SETTINGS;
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}