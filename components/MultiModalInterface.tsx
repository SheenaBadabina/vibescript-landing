"use client";
import { useEffect, useRef, useState } from "react";
import { speakText, startListening, stopListening, isSpeechSupported } from "@/lib/voice";
import clsx from "clsx";

interface Props {
  onRespond: (text: string) => void;
  initialText?: string;
}

export function MultiModalInterface({ onRespond, initialText = "" }: Props) {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState(initialText);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onRespond(aiResponse);
  }, [aiResponse, onRespond]);

  const handleVoiceToggle = async () => {
    if (!voiceEnabled) {
      setVoiceEnabled(true);
      await speakText("AI voice enabled. Describe your website when ready.");
    } else {
      setVoiceEnabled(false);
      stopListening();
    }
  };

  const handleVoiceInput = async () => {
    if (!isSpeechSupported()) {
      setAiResponse("Voice not supported on this browser. Please switch to text.");
      return;
    }
    setInputMode('voice');
    const text = await startListening({ interim: false });
    setPrompt(text);
    setAiResponse(`Got it. You said: "${text}". I will prepare your SiteSpec next.`);
    if (voiceEnabled) await speakText("Thanks! I captured that.");
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setAiResponse("Thanks! I captured that. I will craft your SiteSpec next.");
    if (voiceEnabled) await speakText("Thanks! I captured that.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          className={clsx('btn', inputMode === 'text' && 'ring-2 ring-primary/60')}
          onClick={() => setInputMode('text')}
        >⌨️ Type</button>
        <button
          className={clsx('btn', inputMode === 'voice' && 'ring-2 ring-primary/60')}
          onClick={() => setInputMode('voice')}
        >🎤 Speak</button>
        <button className={clsx('btn', voiceEnabled && 'ring-2 ring-primary/60')} onClick={handleVoiceToggle}>
          {voiceEnabled ? "🔊 AI Voice On" : "🔇 AI Voice Off"}
        </button>
      </div>

      <div className="space-y-3">
        {inputMode === 'text' ? (
          <textarea
            placeholder="Describe your dream website..."
            className="input min-h-[120px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        ) : (
          <div className="flex items-center gap-3">
            <button className="btn" onClick={handleVoiceInput}>🎙️ Start Listening</button>
            <button className="btn" onClick={() => { stopListening(); setInputMode('text'); }}>⏹ Stop</button>
            <div className="opacity-70">Speak your request and I'll transcribe it.</div>
          </div>
        )}
        <div className="flex gap-2">
          <button className="btn" onClick={handleSubmit}>Send</button>
          <button className="btn" onClick={() => { setPrompt(''); setAiResponse(''); }}>Clear</button>
        </div>
      </div>

      <div className="card">
        <div className="text-sm opacity-70 mb-2">AI Response</div>
        <div className="whitespace-pre-wrap" ref={transcriptRef}>{aiResponse}</div>
        {voiceEnabled && (
          <div className="mt-3">
            <button className="btn" onClick={() => speakText(aiResponse)}>▶️ Play Response</button>
          </div>
        )}
      </div>
    </div>
  );
}
