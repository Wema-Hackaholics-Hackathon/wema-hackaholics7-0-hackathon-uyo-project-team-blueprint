import { useRef } from "react";
import {
  Camera,
  Checks,
  Sparkle,
  Trash,
  CircleNotch,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { InventoryItem, StagedProduct } from "@/store/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InventoryViewProps {
  inventory: InventoryItem[];
  stagedProducts: StagedProduct[];
  activeStagedIdx: number;
  scanning: boolean;
  onBatchScan: (files: FileList | null) => void;
  onSelectStaged: (idx: number) => void;
  onUpdateStagedField: (idx: number, field: keyof StagedProduct, value: string | number) => void;
  onCommitBatch: () => void;
  onDiscardBatch: () => void;
}

export function InventoryView({
  inventory,
  stagedProducts,
  activeStagedIdx,
  scanning,
  onBatchScan,
  onSelectStaged,
  onUpdateStagedField,
  onCommitBatch,
  onDiscardBatch,
}: InventoryViewProps) {
  const staged = stagedProducts[activeStagedIdx];
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6 pb-20">
      <input
        id="scan-file-input" ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => onBatchScan(e.target.files)}
        className="hidden"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-background p-5">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-foreground">Batch AI Photo Upload</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Upload multiple product items together to stage &amp; edit them before committing to inventory.
              </p>
            </div>
          </div>
          <label htmlFor={scanning ? undefined : "scan-file-input"} className={cn("mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all", scanning ? "cursor-not-allowed bg-foreground/60 text-background/70" : "cursor-pointer bg-foreground text-background hover:opacity-90 active:scale-[0.97]")}>
            {scanning ? <CircleNotch className="h-4 w-4 animate-spin" /> : <Camera weight="fill" className="h-4 w-4" />}
            <span>{scanning ? "Scanning..." : "Scan Products"}</span>
          </label>
        </div>
      </div>

      {stagedProducts.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="flex items-center text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle weight="fill" className="mr-1.5 h-3.5 w-3.5" />
              Scanned Items Staging Row
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
              {stagedProducts.length} Items Loaded
            </span>
          </div>

          <div className="flex snap-x gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
            {stagedProducts.map((p, i) => {
              const isActive = i === activeStagedIdx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectStaged(i)}
                  className={cn(
                    "snap-start shrink-0 w-36 cursor-pointer rounded-xl border-2 bg-background p-2.5 text-left transition-all select-none",
                    isActive ? "border-primary bg-primary/5" : "border-border",
                  )}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="mb-2 h-16 w-full rounded-lg border border-border object-cover"
                  />
                  <h5 className="truncate text-[11px] font-bold text-foreground">{p.name}</h5>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-muted-foreground">
                    <span>
                      Qty: <b>{p.qty}</b>
                    </span>
                    <span className="font-bold text-primary">₦{p.selling}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {staged && (
            <div className="space-y-3 rounded-xl border border-border bg-background/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-muted-foreground">
                  Selected Staged Item Editor
                </span>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Editing Card #{activeStagedIdx + 1}
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">
                    Product Name
                  </label>
                  <Input
                    type="text"
                    value={staged.name}
                    onChange={(e) => onUpdateStagedField(activeStagedIdx, "name", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Qty" value={staged.qty} onChange={(v) => onUpdateStagedField(activeStagedIdx, "qty", v)} />
                  <Field label="Cost (₦)" value={staged.cost} onChange={(v) => onUpdateStagedField(activeStagedIdx, "cost", v)} />
                  <Field label="Sell (₦)" value={staged.selling} onChange={(v) => onUpdateStagedField(activeStagedIdx, "selling", v)} />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={onCommitBatch}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground transition-all active:scale-[0.98]"
            >
              <Checks weight="bold" className="h-4 w-4" />
              <span>Save All to Inventory</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onDiscardBatch}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border-destructive/40 px-4 py-3 text-xs font-bold text-destructive transition-all active:scale-[0.98]"
            >
              <Trash weight="bold" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-xs font-bold tracking-widest text-muted-foreground">
          ALL ACTIVE INVENTORY PRODUCTS
        </h4>
        <div className="space-y-2.5">
          {inventory.map((item) => {
            const isAiParsed = item.name.startsWith("AI Parsed");
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between rounded-xl border bg-card p-3.5 text-xs",
                  isAiParsed
                    ? "border-amber-400/40 bg-amber-50/60 ring-1 ring-amber-400/20 dark:border-amber-500/30 dark:bg-amber-900/10"
                    : "border-border",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate font-bold text-card-foreground">{item.name}</h4>
                    {isAiParsed && (
                      <span className="shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        AI Detected
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-muted-foreground">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary">
                      Qty: {item.qty}
                    </span>
                    <span className="font-medium">
                      Cost: <span className="font-bold text-foreground">₦{item.cost}</span>
                    </span>
                    <span className="font-medium">
                      Retail: <span className="font-bold text-foreground">₦{item.selling}</span>
                    </span>
                  </div>
                </div>
                <div className="ml-3 shrink-0 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Margin
                  </span>
                  <p className="font-display text-lg font-black leading-tight text-foreground">
                    ₦{item.selling - item.cost}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase text-muted-foreground">{label}</label>
      <Input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
      />
    </div>
  );
}
