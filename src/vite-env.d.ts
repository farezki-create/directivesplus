
/// <reference types="vite/client" />

interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
  __FORCE_JS_IMPLEMENTATION__: boolean;
  __ROLLUP_NO_NATIVE__: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}

// Add global declarations for our rollup flags
declare global {
  var __ROLLUP_NO_NATIVE__: boolean;
  var __FORCE_JS_IMPLEMENTATION__: boolean;
}
