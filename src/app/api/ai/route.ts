import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, prompt, systemInstruction, modelName = 'gemini-1.5-flash', customApiKey } = body;

    // Server-side environment variable or custom key from user
    const apiKey = (process.env.GEMINI_API_KEY || customApiKey || '').trim();

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'NO_API_KEY',
        message: 'No GEMINI_API_KEY set on server or client' 
      }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction || '당신은 대한민국 대학생의 과제 및 팀프로젝트를 돕는 전문 학술 AI 코치입니다. 친절하고 명확하며 구체적인 학술적 근거와 실행 가능한 지침을 제공합니다.'
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    console.error('Server AI Route Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'AI generation failed' 
    }, { status: 500 });
  }
}