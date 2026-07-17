import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { cn, primaryCta } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function focusRing() {
  return "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
}

export function LandingPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: reduce ? {} : { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease },
  });

  const cards = [
    {
      title: "Built for micro-SMEs",
      body: "Made for market sellers, okada riders, and shop owners. We meet you in the tools and habits you already have—instead of asking you to learn another complex dashboard.",
      visual: (
        <div className="rounded-xl bg-slate-100 p-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Live store
            </span>
            <span className="text-xs font-medium text-slate-500">Lagos · Market stall</span>
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">This week</p>
            <p className="mt-1 font-mono text-2xl font-black text-slate-900">47 sales</p>
            <p className="mt-1 text-sm text-slate-500">Logged without leaving the counter</p>
          </div>
        </div>
      ),
    },
    {
      title: "Cash and transfer in one place",
      body: "Record every sale the moment it happens, whatever way the customer pays. If a feature doesn't help you keep clean records this week, we don't ship it.",
      visual: (
        <div className="rounded-xl bg-slate-100 p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Today's entries</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
              <span className="text-sm text-slate-600">Cash</span>
              <span className="font-mono text-sm font-bold text-slate-900">₦2,350</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
              <span className="text-sm text-slate-600">Transfer</span>
              <span className="font-mono text-sm font-bold text-slate-900">₦1,180</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
              <span className="text-sm text-slate-600">Transfer</span>
              <span className="font-mono text-sm font-bold text-slate-900">₦7,800</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
            <span className="text-sm font-semibold text-slate-600">Total logged</span>
            <span className="font-mono text-lg font-black text-slate-900">₦11,330</span>
          </div>
        </div>
      ),
    },
    {
      title: "Know what is left to keep",
      body: "See your true daily balance and profit margins without spreadsheet headache. Small loops, fast feedback, and absolute accuracy for tools you rely on daily.",
      visual: (
        <div className="rounded-xl bg-slate-100 p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Daily close</p>
          <p className="mt-2 font-mono text-3xl font-black text-slate-900">₦8,420</p>
          <p className="mt-1 text-sm text-slate-500">Profit after counting stock spent</p>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            <ArrowRight className="h-4 w-4" weight="bold" />
            No spreadsheet needed
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-dvh w-full bg-background text-foreground">
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/[0.05] via-background to-background">
        <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.04]" />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <header className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Traka
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/auth" })}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]",
              focusRing(),
            )}
          >
            Sign in
          </button>
        </header>

        <section className="mx-auto max-w-[1400px] px-6 pb-12 pt-10 md:px-12">
          <div className="max-w-2xl">
            <motion.h1
              {...fadeUp(0)}
              className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl"
            >
              The smarter way for micro-SMEs to see, track, and prove their daily
              business.
            </motion.h1>

            <motion.p
              {...fadeUp(0.08)}
              className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground"
            >
              Log cash and transfer sales, track stock spend, and see what is left each
              day, without changing how you work.
            </motion.p>

            <motion.div {...fadeUp(0.16)} className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/auth" })}
                className={cn(primaryCta, "cursor-pointer")}
              >
                Get started
                <ArrowRight weight="bold" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/auth" })}
                className={cn(
                  "rounded-xl border border-primary/30 px-8 py-3.5 text-sm font-bold text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]",
                  focusRing(),
                )}
              >
                Sign in
              </button>
            </motion.div>
          </div>
        </section>

        {/*
          Product image section — temporarily commented out.
          TODO: replace this placeholder with a real product image — a photo of a
          Nigerian micro-SME using Traka, or a clean screenshot of the app
          dashboard. Drop the file in /public (e.g. /public/landing-hero.jpg)
          and swap the block below for:
          <img src="/landing-hero.jpg" alt="..." className="w-full rounded-3xl shadow-card object-cover" />
        */}

        <section className="mx-auto max-w-[1400px] px-6 pb-20 pt-16 md:px-12">
          <div>
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease }}
                className="mb-8"
              >
                <div
                  className="grid grid-cols-1 items-center gap-8 rounded-2xl bg-white p-8 shadow-[0_16px_45px_-15px_rgba(29,78,216,0.35)] md:p-12 lg:grid-cols-12 lg:gap-12 animate-float"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <div className="lg:col-span-6">{card.visual}</div>
                  <div className="lg:col-span-6">
                    <h3 className="text-balance font-display text-2xl font-bold tracking-tight text-slate-900">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">
                      {card.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
