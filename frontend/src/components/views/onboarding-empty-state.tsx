import { Package, PlayCircle, ArrowRight } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/store/app-context";
import { useToast } from "@/components/ui/toast";
import { cn, primaryCta } from "@/lib/utils";

const QUICK_ITEMS = ["Peak Milk Tin", "Spaghetti Packet", "Loaf of Bread"];

export function OnboardingEmptyState() {
  const { addStagedProduct } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const goAdd = (name?: string) => {
    addStagedProduct(name);
    navigate({ to: "/inventory" });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Package weight="fill" className="h-6 w-6" />
      </div>

      <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        Welcome to Traka! Let's stock your shop
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
        Before you can record cash or transfer sales, you need to add at least one
        product to your inventory so the app knows what you are selling.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => goAdd()}
          className={cn(primaryCta, "cursor-pointer")}
        >
          Add Your First Product
          <ArrowRight weight="bold" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            toast({
              title: "Demo on the way",
              description: "The 1-minute product tour will land here soon.",
              variant: "default",
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
        >
          <PlayCircle weight="fill" className="h-4 w-4 text-primary" />
          Watch 1-Min Demo
        </button>
      </div>

      <div className="mt-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick start
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => goAdd(item)}
              className="cursor-pointer rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
