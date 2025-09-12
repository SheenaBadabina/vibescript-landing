// Client-side helpers for Web Speech APIs (browser-native)
// Falls back gracefully if not supported

export function isSpeechSupported(): boolean {
  const hasRecog = typeof window !== "undefined" && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const hasSynth = typeof window !== "undefined" && !!window.speechSynthesis;
  return hasRecog && hasSynth;
}

export async function speakText(text: string) {
  if (typeof window === "undefined") return;
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
  await new Promise<void>((resolve) => {
    utter.onend = () => resolve();
  });
}

type ListenOptions = { interim?: boolean };

export async function startListening(opts: ListenOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve("");
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return resolve("");
    const recog = new SR();
    recog.interimResults = !!opts.interim;
    recog.lang = "en-US";
    let finalTranscript = "";
    recog.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscript += t;
      }
    };
    recog.onerror = (e: any) => reject(e.error);
    recog.onend = () => resolve(finalTranscript.trim());
    recog.start();
  });
}

export function stopListening() {
  if (typeof window === "undefined") return;
  // @ts-ignore
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  try {
    // there is no global stop; recognition instance controls this.
    // This method is a no-op used to keep the API symmetric for UI.
  } catch {}
}
