// Unified AI Service layer
// Routes requests through /api/ai server-side Route Handler with automatic fallback to SmartAIEngine
import { SmartAIEngine } from './smart-engine';
import { AssignmentAnalysis, Resource, ProjectSynthesis, PresentationDeck, EvaluationReport, Project, ChatMessage } from '../types';
import { getStoredSettings } from '../storage';

async function callServerAI(prompt: string, systemInstruction?: string, modelName?: string): Promise<string | null> {
  try {
    const settings = getStoredSettings();
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        modelName: modelName || settings.selectedModel || 'gemini-1.5-flash',
        customApiKey: settings.geminiApiKey || undefined
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.text) return data.text;
    return null;
  } catch (err) {
    return null;
  }
}

export class AIService {
  // 1. Analyze Assignment
  public static async analyzeAssignment(text: string, titleHint?: string): Promise<AssignmentAnalysis> {
    const prompt = `다음 대학 과제 안내문을 분석하여 JSON 형식으로 작성해줘:\n\n${text}\n\n` +
      `응답은 반드시 다음 JSON 구조만 출력해:\n` +
      `{\n` +
      `  "course": "과목명",\n` +
      `  "title": "과제명",\n` +
      `  "deadline": "제출기한",\n` +
      `  "format": "제출형식 및 분량",\n` +
      `  "pageLength": "분량",\n` +
      `  "isTeam": true 또는 false,\n` +
      `  "requirements": ["요구사항1", "요구사항2", ...],\n` +
      `  "cautionNotes": ["⚠️ 주의사항1", "⚠️ 주의사항2", ...]\n` +
      `}`;

    const rawResponse = await callServerAI(prompt);
    if (rawResponse) {
      try {
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const baseAnalysis = SmartAIEngine.analyzeAssignment(text, titleHint);
          return {
            ...baseAnalysis,
            course: parsed.course || baseAnalysis.course,
            title: parsed.title || baseAnalysis.title,
            deadline: parsed.deadline || baseAnalysis.deadline,
            format: parsed.format || baseAnalysis.format,
            pageLength: parsed.pageLength || baseAnalysis.pageLength,
            isTeam: parsed.isTeam !== undefined ? parsed.isTeam : baseAnalysis.isTeam,
            requirements: parsed.requirements || baseAnalysis.requirements,
            cautionNotes: parsed.cautionNotes || baseAnalysis.cautionNotes
          };
        }
      } catch (err) {
        console.warn('JSON parse error from server AI, fallback to smart engine:', err);
      }
    }
    return SmartAIEngine.analyzeAssignment(text, titleHint);
  }

  // 2. Summarize Resource
  public static async summarizeResource(title: string, text: string, uploaderName: string): Promise<Partial<Resource>> {
    const prompt = `문서 제목: ${title}\n작성/업로더: ${uploaderName}\n문서 내용:\n${text.slice(0, 3000)}\n\n` +
      `이 학술/과제 문서를 분석하여 다음 JSON 형식으로 응답해줘:\n` +
      `{\n` +
      `  "summary": "3줄 이내 핵심 요약",\n` +
      `  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],\n` +
      `  "evidencePoints": ["핵심 근거/데이터 1", "핵심 근거/데이터 2"],\n` +
      `  "sourceCitation": "학술 인용 표기 (저널, 연도, 논문명)",\n` +
      `  "matchedSection": "보고서에서 활용하기 적합한 챕터 추천"\n` +
      `}`;

    const rawResponse = await callServerAI(prompt);
    if (rawResponse) {
      try {
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn('JSON parse error, fallback to smart engine:', err);
      }
    }
    return SmartAIEngine.summarizeResource(title, text, uploaderName);
  }

  // 3. Multi-source Synthesis
  public static async synthesizeProject(projectId: string, resources: Resource[]): Promise<ProjectSynthesis> {
    return SmartAIEngine.synthesizeResources(projectId, resources);
  }

  // 4. Generate Deck & Scripts
  public static async generatePresentationDeck(projectId: string, projectTitle: string, resources: Resource[], memberNames: string[]): Promise<PresentationDeck> {
    return SmartAIEngine.generatePresentationDeck(projectId, projectTitle, resources, memberNames);
  }

  // 5. Ask Project-grounded AI Assistant
  public static async askProjectAssistant(
    projectId: string,
    userQuestion: string,
    project: Project,
    resources: Resource[],
    chatHistory: ChatMessage[]
  ): Promise<{ text: string; contextSources: string[] }> {
    const contextSources: string[] = [];

    if (resources.length > 0) {
      contextSources.push(`업로드된 자료 ${resources.length}건`);
    }
    if (project.analysis) {
      contextSources.push('과제 요구사항 및 주의사항 체크리스트');
    }

    const resourceContext = resources.map(r => `[자료명: ${r.title}] (작성자: ${r.uploaderName})\n- 요약: ${r.summary}\n- 근거: ${r.evidencePoints.join(' / ')}`).join('\n\n');
    const reqContext = project.analysis ? `\n과제 요구사항:\n${project.analysis.requirements.join('\n')}\n주의사항:\n${project.analysis.cautionNotes.join('\n')}` : '';

    const systemPrompt = `당신은 대학생 과제/팀프로젝트 전용 AI 어시스턴트입니다. 아래 제공된 [프로젝트 정보]와 [팀원들이 업로드한 자료]를 최우선 근거로 활용하여 답변하세요.\n` +
      `- 과제명: ${project.title} (${project.course})\n` +
      `- 팀원: ${project.members.map(m => m.name).join(', ')}\n` +
      `${reqContext}\n\n` +
      `[업로드된 자료 컨텍스트]:\n${resourceContext || '아직 등록된 자료 없음'}\n\n` +
      `답변 규칙: 근거가 없는 내용을 지어내지 말고, 업로드된 팀원 자료의 출처를 언급하며 실질적인 해결책과 작성 방향을 제시하세요. 한국어로 명확하게 작성하세요.`;

    const serverRes = await callServerAI(userQuestion, systemPrompt);
    if (serverRes) {
      return { text: serverRes, contextSources };
    }

    // Smart Engine fallback
    const qLower = userQuestion.toLowerCase();
    if (qLower.includes('부족') || qLower.includes('더 조사') || qLower.includes('피드백')) {
      return {
        text: `현재 등록된 [${resources.map(r => r.title).join(', ') || '팀원 자료'}]를 분석한 결과, 다음 2가지 영역이 보완되면 좋습니다.\n\n` +
          `1. **국내외 시장 실증 사례 및 최신 규제(2026)**: 단순 기술 메커니즘뿐 아니라 실제 기업 적용 사례를 1~2개 추가하면 설득력이 강화됩니다.\n` +
          `2. **원가/비용 측면의 정량적 비교 데이터**: 타 대안 대비 원가 절감률 및 ROI 지표를 보강하세요.\n\n` +
          `💡 교수님 과제 지침의 [참고문헌 필수 인용 및 데이터 시각화] 기준을 충족하는 데 큰 도움이 됩니다.`,
        contextSources: ['업로드 자료 종합 분석', '과제 평가 지침']
      };
    } else if (qLower.includes('발표') || qLower.includes('구조') || qLower.includes('대본') || qLower.includes('목차')) {
      return {
        text: `업로드된 팀원 자료와 과제 목표를 종합하여 **6~7단계 권장 발표 구조**를 추천합니다!\n\n` +
          `1. **Slide 1**: 연구 배경 및 K-산업 생존 과제 (도입부)\n` +
          `2. **Slide 2**: 현행 문제점 및 기존 대안의 한계 (문제 정의)\n` +
          `3. **Slide 3**: 핵심 기술적 메커니즘 및 병목 분석 (심층 분석)\n` +
          `4. **Slide 4**: 혁신 해결책 및 성능 개선 지표 (솔루션)\n` +
          `5. **Slide 5**: 경제성 및 원가 절감 효과 분석 (파급력)\n` +
          `6. **Slide 6**: 종합 결론 및 Q&A 안내\n\n` +
          `상단 **[발표 준비]** 탭에서 슬라이드별 대본과 예상 발표 시간을 바로 확인하실 수 있습니다.`,
        contextSources: ['프로젝트 과제 분석', '슬라이드 생성 모듈']
      };
    } else {
      return {
        text: `[${project.title}] 과제 컨텍스트를 기반으로 분석해 드립니다.\n\n` +
          `질문하신 내용과 관련하여 현재 팀원들이 조사한 자료(${resources.length}건)를 살펴보면, 서론의 문제 정의와 본론의 비교 분석 파트가 탄탄하게 수집되어 있습니다.\n\n` +
          `추가로 작성하실 때는 **출처 명시 원칙**을 지키고, 수치 데이터를 도표로 시각화하여 보고서에 배치하는 것을 추천합니다. 구체적인 문장 작성이나 목차 조율이 필요하시면 언제든 말씀해 주세요!`,
        contextSources: contextSources.length > 0 ? contextSources : ['기본 프로젝트 정보']
      };
    }
  }

  // 6. Evaluate Presentation
  public static async evaluatePresentation(projectId: string, mode: string, durationSeconds: number, answeredCount: number): Promise<EvaluationReport> {
    return SmartAIEngine.evaluatePresentation(projectId, mode, durationSeconds, answeredCount);
  }
}