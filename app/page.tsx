"use client";
import { useState } from "react";
import { MultiModalInterface } from "@/components/MultiModalInterface";

export default function HomePage() {
  const [aiResponse, setAiResponse] = useState<string>("Describe your dream website…");
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">VibeScript Website Builder</h1>
        <div className="text-sm opacity-80">voice + text</div>
      </header>
      <div className="card">
        <MultiModalInterface
          onRespond={setAiResponse}
          initialText={aiResponse}
        />
      </div>
      <footer className="text-sm opacity-60">
        © {new Date().getFullYear()} VibeScript
      </footer>
    </div>
  );
}
