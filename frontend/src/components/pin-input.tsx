import { useRef } from "react";

interface PinInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function PinInput({ value, onChange }: PinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("").concat(Array(6 - value.length).fill(""));

  const handleChange = (idx: number, char: string) => {
    if (!/^\d$/.test(char)) return;
    const newVal = value.substring(0, idx) + char + value.substring(idx + 1);
    onChange(newVal.substring(0, 6));
    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[idx] && idx > 0) {
        onChange(value.substring(0, idx - 1) + value.substring(idx));
        inputRefs.current[idx - 1]?.focus();
      } else if (value[idx]) {
        onChange(value.substring(0, idx) + value.substring(idx + 1));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").substring(0, 6);
    if (pasted) {
      onChange(pasted);
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs.current[nextIdx]?.focus();
    }
  };

  const handleFocus = (idx: number) => {
    inputRefs.current[idx]?.select();
  };

  return (
    <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <input
          key={idx}
          ref={(el) => { inputRefs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx]}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onFocus={() => handleFocus(idx)}
          className="h-14 w-11 rounded-xl border border-border bg-card text-center text-lg font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          autoFocus={idx === 0}
        />
      ))}
    </div>
  );
}
