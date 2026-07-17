import { useState, useRef, useEffect } from "react";
import {
  MagicWand,
  PaperPlaneRight,
  X,
  Microphone,
  CircleNotch,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useToast } from "@/components/ui/toast";
import type { AiLanguage } from "@/lib/endpoints";
import { speakReply, cancelSpeech, ensureAudioReady } from "@/lib/tts";

interface AiAssistantProps {
  open: boolean;
  onClose: () => void;
  aiLang: AiLanguage;
  onSetAiLang: (lang: AiLanguage) => void;
  aiLoading: boolean;
  chips: string[];
  chatLogs: string[];
  onSubmitQuery: (text: string) => void;
  onSubmitVoice: (audio: Blob) => void;
}

const LANGUAGES: { code: AiLanguage; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pidgin", label: "Pidgin" },
  { code: "yo", label: "Yoruba" },
  { code: "ha", label: "Hausa" },
];

export function AiAssistant({
  open,
  onClose,
  aiLang,
  onSetAiLang,
  aiLoading,
  chips,
  chatLogs,
  onSubmitQuery,
  onSubmitVoice,
}: AiAssistantProps) {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [muted, setMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const prevLogsLen = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatLogs, aiLoading]);

  useEffect(() => {
    if (open) ensureAudioReady();
  }, [open]);

  useEffect(() => {
    return () => {
      mediaRef.current?.state !== "inactive" && mediaRef.current?.stop();
      cancelSpeech();
    };
  }, []);

  useEffect(() => {
    if (chatLogs.length <= prevLogsLen.current || muted) return;
    const last = chatLogs[chatLogs.length - 1];
    if (last?.startsWith("bot:")) {
      const text = last.slice(4);
      if (text && !text.includes("could not reach the advisor") && !text.includes("could not understand")) {
        speakReply(text, aiLang);
      }
    }
    prevLogsLen.current = chatLogs.length;
  }, [chatLogs, aiLang, muted]);

  const startRecording = async () => {
    ensureAudioReady();
    cancelSpeech();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size > 0) onSubmitVoice(blob);
      };
      recorder.start();
      mediaRef.current = recorder;
      setRecording(true);
    } catch {
      toast({
        title: "Microphone Blocked",
        description: "Allow microphone access to send a voice note.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    mediaRef.current = null;
    setRecording(false);
  };

  const handleSubmit = () => {
    if (!input.trim() || aiLoading) return;
    ensureAudioReady();
    cancelSpeech();
    onSubmitQuery(input);
    setInput("");
  };

  const lastLog = chatLogs[chatLogs.length - 1];
  const lastIsUser = !!lastLog && lastLog.startsWith("user:");
  const showTyping = aiLoading && lastIsUser;

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[420px] z-50 flex h-[480px] flex-col rounded-t-[30px] border-t border-slate-200/80 bg-white text-slate-900 outline-none shadow-2xl">
        {/* ── Draggable handle pill ── */}
        <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-slate-200" />

        {/* ── Strict flex container ── */}
        <div className="flex h-full min-h-0 flex-col overflow-hidden p-6 pb-6">

          {/* ── Header row ── */}
          <div className="flex shrink-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <MagicWand weight="fill" className="h-5 w-5 text-primary" />
              <span className="text-base font-bold text-slate-900">Traka Intelligent Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
                  muted ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {muted ? <SpeakerSlash weight="bold" className="h-4 w-4" /> : <SpeakerHigh weight="bold" className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
              >
                <X weight="bold" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Language pills ── */}
          <div className="mt-3 flex shrink-0 flex-wrap gap-1.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => onSetAiLang(lang.code)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  aiLang === lang.code
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* ── Dynamic scroll area ── */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 px-1 min-h-0">
            <div className="space-y-3">
              {chatLogs.map((log, i) => {
                if (log.startsWith("user:")) {
                  const text = log.slice(5);
                  return (
                    <div key={i} className="flex justify-end">
                      <span className="inline-block max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
                        {text}
                      </span>
                    </div>
                  );
                }
                const text = log.startsWith("bot:") ? log.slice(4) : log;
                return (
                  <div key={i}>
                    <div className="inline-block max-w-[85%] rounded-2xl rounded-tl-none bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 border border-slate-100/50 shadow-sm">
                      <MagicWand weight="fill" className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
                      {text}
                    </div>
                  </div>
                );
              })}

              {showTyping && (
                <div className="flex">
                  <div className="flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tl-none bg-slate-50 p-4 text-slate-700 border border-slate-100/50 shadow-sm">
                    <MagicWand weight="fill" className="h-3.5 w-3.5 text-primary" />
                    <CircleNotch className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}

              {chatLogs.length === 0 && (
                <div className="mb-4 max-w-[85%] rounded-2xl rounded-tl-none bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 border border-slate-100/50 shadow-sm">
                  <MagicWand weight="fill" className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
                  {aiLang === "pidgin"
                    ? "Ahn-ahn! I dey track your live data sharply. Drop your question like \"Who dey owe me?\" or \"Who clear debt last?\"."
                    : "Hello! I scan your live business data instantly. Ask me something like \"Who is owing me?\" or \"Who paid last?\"."}
                </div>
              )}
            </div>
          </div>

          {/* ── Horizontal suggestion pills ── */}
          <div className="flex shrink-0 items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={aiLoading}
                onClick={() => onSubmitQuery(chip)}
                className="cursor-pointer shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* ── Input action bar (mt-auto pushes to bottom) ── */}
          <div className="mt-auto flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-sm">
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              aria-label={recording ? "Stop recording" : "Record voice note"}
              className={`flex shrink-0 cursor-pointer items-center justify-center rounded-full p-2.5 transition-colors ${
                recording
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Microphone weight="fill" className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={input}
              disabled={aiLoading || recording}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={recording ? "Listening..." : "Ask anything about your business..."}
              className="flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={aiLoading || recording}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-950 p-2.5 text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              <PaperPlaneRight weight="fill" className="h-4 w-4" />
            </button>
          </div>

        </div>
      </DrawerContent>
    </Drawer>
  );
}
