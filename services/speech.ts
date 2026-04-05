import { Platform } from 'react-native';

type SpeechCallback = {
  onResult: (text: string) => void;
  onEnd?: () => void;
  onError?: (err: string) => void;
};

let recognition: any = null;

export function isVoiceAvailable(): boolean {
  if (Platform.OS !== 'web') return false;
  return !!(window as any).webkitSpeechRecognition || !!(window as any).SpeechRecognition;
}

export function startListening(locale: string, cb: SpeechCallback) {
  if (!isVoiceAvailable()) {
    cb.onError?.('Voice not available on this platform');
    return;
  }

  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = locale === 'es' ? 'es-US' : 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event: any) => {
    const text = event.results[0][0].transcript;
    cb.onResult(text);
  };
  recognition.onend = () => cb.onEnd?.();
  recognition.onerror = (event: any) => cb.onError?.(event.error);

  recognition.start();
}

export function stopListening() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}
