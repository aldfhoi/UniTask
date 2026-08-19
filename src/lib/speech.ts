// Web Speech API Wrapper for presentation speech recognition and synthesis

export interface SpeechRecognitionResultHandler {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class WebSpeechController {
  private recognition: any = null;
  private isListening = false;
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'ko-KR';
      }
      this.synth = window.speechSynthesis || null;
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(handler: SpeechRecognitionResultHandler) {
    if (!this.recognition || this.isListening) return;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text.trim()) {
        handler.onResult(text, !!finalTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      handler.onError(event.error || '음성 인식 오류');
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      handler.onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.synth.cancel(); // cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick Korean voice if available
    const voices = this.synth.getVoices();
    const koreanVoice = voices.find(v => v.lang.includes('ko') || v.name.includes('Korean') || v.name.includes('Yuna') || v.name.includes('Heami'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    this.synth.speak(utterance);
  }

  public cancelSpeech() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}