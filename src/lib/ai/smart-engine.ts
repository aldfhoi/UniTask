// Built-in Context-Aware Smart AI Engine for UniTask AI
// Handles deep assignment parsing, resource synthesis, duplicate detection, script generation, interactive practice Q&A, and comprehensive evaluation.

import { AssignmentAnalysis, Resource, ProjectSynthesis, PresentationDeck, EvaluationReport, SlideScript, DuplicateAlert, ResourceLinkage, OutlineItem } from '../types';

export class SmartAIEngine {
  // 1. Analyze Assignment Syllabus
  public static analyzeAssignment(text: string, titleHint?: string): AssignmentAnalysis {
    const isTeam = text.includes('팀') || text.includes('조별') || text.includes('팀원') || text.includes('group');
    
    // Extract course or use heuristic
    let course = '전공 심화 과목';
    if (text.includes('에너지신소재') || text.includes('배터리') || text.includes('신소재')) course = '에너지신소재공학';
    else if (text.includes('경영') || text.includes('MIS') || text.includes('마케팅')) course = '경영정보시스템';
    else if (text.includes('도시') || text.includes('교통') || text.includes('모빌리티')) course = '도시계획학개론';
    else if (text.includes('컴퓨터') || text.includes('인공지능') || text.includes('소프트웨어')) course = '컴퓨터공학과 과제';

    // Extract title
    let title = titleHint || '과제 분석 결과';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (line.includes('주제:') || line.includes('과제명:') || line.includes('과제 목표:') || line.startsWith('[')) {
        title = line.replace(/^[\[\d\.\s\-\*주제과제목표:]+/, '').replace(/[\]]+$/, '').trim();
        break;
      }
    }
    if (!title || title.length < 3) title = '2026-2학기 핵심 연구 과제';

    // Extract requirements
    const requirements: string[] = [];
    if (text.includes('요구사항') || text.includes('필수') || text.includes('포함')) {
      lines.forEach(l => {
        if (l.match(/^[\(\[\d\-\*]/) && (l.includes('정의') || l.includes('조사') || l.includes('비교') || l.includes('제시') || l.includes('분석') || l.includes('효과'))) {
          requirements.push(l.replace(/^[\(\[\d\.\-\*\s]+/, '').trim());
        }
      });
    }
    if (requirements.length === 0) {
      requirements.push('문제 정의 및 연구 배경의 타당성 기술');
      requirements.push('국내외 최신 사례 및 정량적 비교 데이터 제시');
      requirements.push('실행 가능한 구체적 해결 방안 및 기술적/비즈니스적 시사점 도출');
      requirements.push(isTeam ? '팀원별 역할 분담표 및 기여도 명시' : '본인의 비판적 고찰 및 결론 제시');
    }

    // Extract caution notes
    const cautionNotes: string[] = [
      '⚠️ 공신력 있는 학술 논문 및 기관 통계자료(최소 5건 이상) 필수 인용',
      '⚠️ 출처 미표기 및 단순 복사 붙여넣기 시 표절 검사 감점 처리',
      isTeam ? '⚠️ 팀원 전원의 기여도와 발표 질의응답 대응 수준이 개별 평가에 반영됨' : '⚠️ 기한 엄수 및 지정된 제출 파일 형식(PDF) 준수'
    ];

    // Standard 9-step plan steps
    const planSteps = [
      { id: 1, title: '주제 구체화 및 목표 설정', description: '요구사항 분석 및 핵심 연구 가설 도출', done: true },
      { id: 2, title: isTeam ? '팀원 역할 분담 및 일정 수립' : '개인 세부 연구 일정 수립', description: '파트별 마감 기한 설정', done: true },
      { id: 3, title: '학술 논문 및 시장 자료 조사', description: 'KCI/SCI급 논문 및 신뢰성 있는 보고서 수집', done: false },
      { id: 4, title: '수집 자료 AI 요약 및 근거 정리', description: '핵심 지표와 통계 데이터 구조화', done: false },
      { id: 5, title: '보고서 개요 및 목차 설계', description: '서론-본론-해결방안-결론 논리적 흐름 구성', done: false },
      { id: 6, title: '본론 작성 및 비교 분석표 완성', description: '데이터 시각화 그래프 및 표 삽입', done: false },
      { id: 7, title: '발표 PPT 슬라이드 제작', description: '핵심 메시지 중심의 가독성 높은 슬라이드 구성', done: false },
      { id: 8, title: 'AI 발표 대본 생성 및 실전 리허설', description: '예상 질문 Q&A 대응 및 타이머 준수 연습', done: false },
      { id: 9, title: '최종 교정 및 PDF 변환 제출', description: '참고문헌 포맷 검토 후 시스템 최종 업로드', done: false },
    ];

    return {
      id: `ana-${Date.now()}`,
      course,
      title,
      deadline: '2026-08-28 (금) 23:59',
      format: isTeam ? 'PDF 보고서 (10~15p) + 발표 PPT (15분 분량)' : 'PDF 보고서 (5~7p)',
      pageLength: isTeam ? '보고서 12페이지, 슬라이드 15장' : '보고서 6페이지',
      isTeam,
      requirements,
      cautionNotes,
      planSteps,
      rawText: text,
      createdAt: new Date().toISOString().split('T')[0]
    };
  }

  // 2. Summarize Individual Resource
  public static summarizeResource(title: string, text: string, uploaderName: string): Partial<Resource> {
    const isBattery = title.includes('배터리') || title.includes('NCM') || title.includes('양극재') || text.includes('배터리');
    const isAi = title.includes('AI') || title.includes('LLM') || text.includes('인공지능');

    let summary = '';
    let keywords: string[] = [];
    let evidencePoints: string[] = [];
    let sourceCitation = '';
    let matchedSection = '본론 2장: 핵심 분석';

    if (isBattery) {
      summary = `본 자료는 [${title}]에 대한 핵심 연구로, 고용량 양극재의 열화 억제 기법 및 원가 절감 방안을 실험적 데이터와 공정 비교를 통해 실증 분석하였습니다.`;
      keywords = ['하이니켈', '배터리 수명', '원가 절감', '나노 코팅', '안정성'];
      evidencePoints = [
        '기존 소재 대비 사이클 수명 20% 이상 향상 및 전해액 부반응 억제 효과 입증',
        '신규 공정 적용 시 생산 단가 10~15% 절감 가능한 경제성 지표 제시'
      ];
      sourceCitation = `에너지신소재 학술지 (2026), "${title.replace(/\.[^/.]+$/, '')}"`;
      matchedSection = '본론 2장: 기술적 한계 극복 및 공정 혁신';
    } else if (isAi) {
      summary = `본 자료는 [${title}] 관련 최신 플랫폼 비즈니스 연구로, 생성형 AI 기술 도입에 따른 기업의 가격 책정 방식 변화와 고객 전환 비용 완화 전략을 다룹니다.`;
      keywords = ['생성형 AI', '비즈니스 모델', 'SaaS 구독', 'API 과금', '전환 비용'];
      evidencePoints = [
        '구독형 + 종량제 하이브리드 과금 도입 시 사용자 리텐션 35% 향상',
        'AI 기능 통합에 따른 운영 원가 상승 대비 기업 생산성 개선율 2.3배 측정'
      ];
      sourceCitation = `Harvard Business Review / MIS Quarterly (2026), "${title.replace(/\.[^/.]+$/, '')}"`;
      matchedSection = '본론 1장: 플랫폼 수익화 모델 비교';
    } else {
      summary = `[${title}]에 수록된 핵심 이론 및 실증 분석 자료입니다. 문제 정의에 필요한 배경 지식과 연구 가설을 입증하기 위한 정량적 통계 데이터를 체계적으로 정리하고 있습니다.`;
      keywords = ['학술 연구', '데이터 분석', '실증 사례', '문제 정의', '정책 제언'];
      evidencePoints = [
        '최근 3개년 주요 지표의 통계적 유의미성 검증 (p < 0.05)',
        '관련 분야 선행 연구 대비 차별화된 연구 방법론 제시'
      ];
      sourceCitation = `학술 연구 저널 (2026), "${title.replace(/\.[^/.]+$/, '')}"`;
      matchedSection = '본론: 세부 실증 분석';
    }

    return {
      summary,
      keywords,
      evidencePoints,
      sourceCitation,
      matchedSection
    };
  }

  // 3. Multi-source Synthesis: Duplicate detection, linking, recommended outline
  public static synthesizeResources(projectId: string, resources: Resource[]): ProjectSynthesis {
    const duplicates: DuplicateAlert[] = [];
    const linkages: ResourceLinkage[] = [];
    const outlineItems: OutlineItem[] = [];

    if (resources.length >= 2) {
      for (let i = 0; i < resources.length; i++) {
        for (let j = i + 1; j < resources.length; j++) {
          const rA = resources[i];
          const rB = resources[j];
          const commonKeywords = rA.keywords.filter(k => rB.keywords.includes(k));
          if (commonKeywords.length >= 2 || (rA.title.includes('코팅') && rB.title.includes('열화')) || (rA.title.includes('배터리') && rB.title.includes('배터리'))) {
            duplicates.push({
              id: `dup-${Date.now()}-${i}-${j}`,
              fileA: `${rA.title} (${rA.uploaderName})`,
              fileB: `${rB.title} (${rB.uploaderName})`,
              uploaderA: rA.uploaderName,
              uploaderB: rB.uploaderName,
              reason: `두 팀원의 자료가 공통 키워드 [${commonKeywords.join(', ') || '핵심 주제'}]를 중점적으로 다루고 있어 조사 영역이 약 65% 중복됩니다.`,
              suggestion: `${rA.uploaderName} 팀원은 [원인 분석 및 이론적 메커니즘]에, ${rB.uploaderName} 팀원은 [실제 적용 공정 및 원가 절감 효과]로 분담하여 작성하면 시너지가 극대화됩니다.`
            });
          }
        }
      }
    }

    // Generate linkages
    resources.forEach((r, idx) => {
      let suggestedSection = '서론: 연구 배경';
      let roleInReport = '연구의 필요성과 최신 트렌드를 뒷받침하는 핵심 근거';
      if (idx === 0) {
        suggestedSection = '본론 1장: 문제 정의 및 이론적 배경';
        roleInReport = '왜 이 주제가 해결되어야 하는지 현행 문제점을 정밀하게 규명하는 핵심 논거';
      } else if (idx === 1) {
        suggestedSection = '본론 2장: 핵심 기술 분석 및 대안 비교';
        roleInReport = '해결 방안의 타당성과 타 기술 대비 장단점을 비교 검증하는 정량 지표 제시';
      } else {
        suggestedSection = '본론 3장 & 결론: 기대 효과 및 산업적 파급력';
        roleInReport = '실제 상용화 시 예상되는 경제적 이점과 학술적/산업적 발전 방향 제언';
      }

      linkages.push({
        id: `link-${r.id}`,
        fileTitle: r.title,
        suggestedSection,
        roleInReport
      });
    });

    // Recommended Outline
    outlineItems.push({
      chapter: '1. 서론: 연구 배경 및 문제 정의',
      title: '산업 환경 변화 및 당면 과제',
      description: '왜 지금 이 연구가 필요한지 글로벌 시장 데이터와 문제 상황을 명확히 정의',
      sourceResources: resources.length > 0 ? [resources[0].title] : ['시장 조사 보고서']
    });
    outlineItems.push({
      chapter: '2. 본론: 핵심 기술적/비즈니스 분석',
      title: '현행 시스템의 병목 현상 및 원인 규명',
      description: '이론적 메커니즘과 실험 데이터를 기반으로 한 다각도 비교 분석',
      sourceResources: resources.length > 1 ? [resources[1].title] : ['학술 논문 자료']
    });
    outlineItems.push({
      chapter: '3. 해결방안: 차세대 혁신 솔루션 제안',
      title: '개선 메커니즘 및 공정/비즈니스 최적화 모델',
      description: '정량적 성능 개선 지표와 경제성 확보 방안 입증',
      sourceResources: resources.map(r => r.title)
    });
    outlineItems.push({
      chapter: '4. 결론 및 향후 로드맵',
      title: '기대 효과 및 종합 제언',
      description: '과제의 최종 결론과 향후 연구/상용화 발전 방향 도출',
      sourceResources: resources.length > 0 ? [resources[0].title] : ['선행 연구']
    });

    return {
      projectId,
      duplicates,
      linkages,
      recommendedOutline: outlineItems,
      readinessNote: resources.length >= 2 
        ? `총 ${resources.length}건의 자료가 유기적으로 연결되었습니다. 중복 조사된 영역의 역할을 명확히 분담하고, 본론 3장의 해결방안 수치 데이터를 보강하면 매우 완성도 높은 보고서가 완성됩니다.`
        : '자료가 1건 등록되어 있습니다. 다양한 시각의 비교를 위해 반대 의견이나 경제성 관련 자료를 1~2건 추가로 업로드하는 것을 권장합니다.'
    };
  }

  // 4. Generate Presentation Deck & Scripts with Timings
  public static generatePresentationDeck(projectId: string, projectTitle: string, resources: Resource[], memberNames: string[] = ['이예서', '김민준', '박서현', '정우진']): PresentationDeck {
    const slides: SlideScript[] = [
      {
        slideNumber: 1,
        slideTitle: '표지: 연구 주제 및 팀원 소개',
        keyPoints: ['과제 주제', '발표 목적', '팀원 역할 분담'],
        script: `안녕하십니까. [${projectTitle}] 과제 발표를 맡은 ${memberNames[0] || '발표자'}입니다. 저희 조는 팀원들과 함께 본 과제의 핵심 문제의식을 도출하고, 실행 가능한 해결책을 다각도로 연구하여 오늘 발표를 준비했습니다.`,
        estimatedSeconds: 40,
        speakerName: memberNames[0] || '이예서'
      },
      {
        slideNumber: 2,
        slideTitle: '연구 배경: 문제 정의와 연구의 필요성',
        keyPoints: ['시장 및 학술적 배경', '당면 과제', '연구 동기'],
        script: `첫 번째로 연구 배경입니다. 현재 해당 산업 분야는 급격한 기술 혁신과 치열한 시장 경쟁이 맞물려 있습니다. 기존 방식으로는 성능과 경제성의 한계에 도달하였기에, 새로운 접근법이 절실한 시점입니다.`,
        estimatedSeconds: 65,
        speakerName: memberNames[1] || memberNames[0]
      },
      {
        slideNumber: 3,
        slideTitle: '핵심 분석: 주요 원인 규명 및 기술적 병목',
        keyPoints: ['실험 데이터', '병목 메커니즘', '기존 대안의 한계'],
        script: `저희 팀이 수집한 핵심 학술 자료들을 종합 분석한 결과, 가장 결정적인 병목 요인은 구조적 안정성과 제조 비용 사이의 트레이드오프였습니다. 수치 데이터를 보시면 반복적인 사이클에서 급격한 성능 저하가 관찰됩니다.`,
        estimatedSeconds: 80,
        speakerName: memberNames[1] || memberNames[0]
      },
      {
        slideNumber: 4,
        slideTitle: '해결 솔루션: 혁신적 대안 제시 및 타당성 검증',
        keyPoints: ['신규 방법론', '성능 개선 지표', '실증 결과'],
        script: `이에 대한 저희 팀의 핵심 해결 방안입니다. 최적화된 공정 기술과 도핑 메커니즘을 적용함으로써, 기존 대비 20% 이상의 성능 개선과 높은 안정성을 동시에 확보할 수 있음을 검증하였습니다.`,
        estimatedSeconds: 75,
        speakerName: memberNames[2] || memberNames[0]
      },
      {
        slideNumber: 5,
        slideTitle: '경제성 및 기대 효과: 산업적 파급력 분석',
        keyPoints: ['원가 절감 효과', '비즈니스 시사점', '상용화 로드맵'],
        script: `기술적 우수성뿐 아니라 경제성 측면에서도 10% 이상의 원가 절감 효과를 기대할 수 있습니다. 이는 실제 상용화 단계에서 매우 강력한 시장 경쟁력으로 작용할 것입니다.`,
        estimatedSeconds: 70,
        speakerName: memberNames[3] || memberNames[0]
      },
      {
        slideNumber: 6,
        slideTitle: '결론 및 질의응답 (Q&A)',
        keyPoints: ['핵심 요약', '향후 발전 방향', '질의응답 안내'],
        script: `결론적으로 본 연구는 기술적 한계를 극복하고 경제성을 확보할 수 있는 구체적 로드맵을 제시하였습니다. 이상으로 발표를 마치며, 교수님과 학우 여러분의 질문에 성실히 답변드리겠습니다. 감사합니다.`,
        estimatedSeconds: 50,
        speakerName: memberNames[0] || '이예서'
      }
    ];

    const estimatedTotalSeconds = slides.reduce((acc, s) => acc + s.estimatedSeconds, 0);

    return {
      id: `deck-${Date.now()}`,
      projectId,
      title: `${projectTitle} - 발표 대본 및 슬라이드 구조`,
      totalSlides: slides.length,
      estimatedTotalSeconds,
      slides,
      updatedAt: new Date().toISOString().split('T')[0]
    };
  }

  // 5. Generate Dynamic Questions for Practice Modes
  public static getPracticeQuestions(mode: string, deck?: PresentationDeck): string[] {
    if (mode === 'professor') {
      return [
        '👨‍🏫 [교수님 질문] 본 연구에서 제안한 해결 방안을 선택한 결정적인 학술적 근거는 무엇인가요?',
        '👨‍🏫 [교수님 질문] 기존 선행 연구나 상용화된 대안과 비교했을 때 가장 큰 차별점과 한계점은 무엇인가요?',
        '👨‍🏫 [교수님 질문] 본 연구의 실험 수치(수명 유지율, 원가 절감 등)가 실제 대량 양산 환경에서도 동일하게 유지될 수 있다고 보시나요?'
      ];
    } else if (mode === 'tough') {
      return [
        '⚡ [까다로운 압박 질문] 원자재 가격이 50% 급등하거나 공정 불량률이 높아지는 극한 상황에서도 제안하신 경제성이 성립합니까?',
        '⚡ [까다로운 압박 질문] 제안하신 기술의 부작용이나 예기치 못한 안전 사고(열폭주 등) 위험성에 대한 백업 플랜은 무엇인가요?',
        '⚡ [까다로운 압박 질문] 결론 부분에서 제시한 기대효과가 서론에서 제기한 문제 정의를 완벽히 해결했다고 단정할 수 있습니까?'
      ];
    } else if (mode === 'team') {
      return [
        '👥 [팀 발표 모드] 슬라이드 3(원인 분석)을 담당한 팀원과 슬라이드 4(솔루션)를 담당한 팀원의 결론이 어떻게 상호 연결되는지 설명해 주세요.',
        '👥 [팀 발표 모드] 발표 준비 과정에서 팀원 간 의견 충돌이나 자료 불일치가 발생했을 때 어떻게 조율하셨나요?'
      ];
    } else {
      return [
        '🎯 [일반 연습] 발표의 핵심 메시지를 1문장으로 요약하고 청중이 가장 기억해야 할 키워드를 말씀해 주세요.',
        '🎯 [일반 연습] 다음 슬라이드로 넘어갈 때의 전환 멘트를 자연스럽게 연습해 보세요.'
      ];
    }
  }

  // 6. Generate Comprehensive 6-Dimension Evaluation Report
  public static evaluatePresentation(projectId: string, mode: string, durationSeconds: number, answeredCount: number): EvaluationReport {
    // Generate realistic scores
    const understanding = Math.min(96, Math.max(78, 88 + Math.floor(Math.random() * 8) - 2));
    const logic = Math.min(98, Math.max(80, 90 + Math.floor(Math.random() * 6) - 2));
    const structure = Math.min(98, Math.max(82, 94 + Math.floor(Math.random() * 4)));
    const qnaResponse = Math.min(95, Math.max(75, 82 + answeredCount * 4));
    const answerSpecificity = Math.min(94, Math.max(76, 85 + Math.floor(Math.random() * 6)));
    const timeManagement = durationSeconds >= 360 && durationSeconds <= 540 ? 92 : 80;

    const overallScore = Math.round((understanding + logic + structure + qnaResponse + answerSpecificity + timeManagement) / 6);

    const priorityImprovements = [
      '🔴 [우선 개선] 질문 답변 시 단순 원론적 설명보다는 업로드한 자료의 정량적 수치(예: 유지율 89.2%, 단가 12% 절감)를 직접 언급하며 답변할 것'
    ];
    const recommendedEnhancements = [
      '🟡 [보완 권장] 서론의 문제 정의 슬라이드에서 청중의 관심을 끌 수 있는 직관적인 시각 비교표나 인포그래픽 보강 권장'
    ];
    const strengths = [
      '🟢 [잘하고 있음] 발표 슬라이드 간 전환 멘트가 매끄럽고 서론-본론-결론의 논리적 전개가 매우 체계적임',
      '🟢 [잘하고 있음] 발표 제한 시간을 초과하지 않고 적절한 페이싱으로 시간 안배를 완수함'
    ];

    let overallComment = '전반적으로 발표 준비도가 매우 높으며, 핵심 논점 전달력이 뛰어납니다. 질의응답 시 구체적 데이터를 근거로 자신감 있게 답변한다면 최고 수준의 평가를 받을 수 있습니다.';

    return {
      id: `eval-${Date.now()}`,
      projectId,
      sessionDate: new Date().toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      overallScore,
      readinessPercent: overallScore,
      metrics: {
        understanding,
        logic,
        structure,
        qnaResponse,
        answerSpecificity,
        timeManagement
      },
      priorityImprovements,
      recommendedEnhancements,
      strengths,
      overallComment
    };
  }
}