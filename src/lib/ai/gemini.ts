// Gemini API client integration wrapper
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function callGemini(apiKey: string, prompt: string, systemInstruction?: string, modelName: string = 'gemini-1.5-flash'): Promise<string> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('No API key provided');
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstruction || '당신은 대한민국 대학생의 과제 및 팀프로젝트를 돕는 전문 학술 AI 코치입니다. 친절하고 명확하며 구체적인 학술적 근거와 실행 가능한 지침을 제공합니다.'
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}