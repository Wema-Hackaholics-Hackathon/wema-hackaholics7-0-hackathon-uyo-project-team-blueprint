import { Fragment } from "react";
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
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Live store
          </span>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700">
              User-first
            </span>
            <span className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600">
              In context
            </span>
            <span className="rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700">
              Ship weekly
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Cash and transfer in one place",
      body: "Record every sale the moment it happens, whatever way the customer pays. If a feature doesn't help you keep clean records this week, we don't ship it.",
      visual: (
        <div className="rounded-xl bg-slate-100 p-6">
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <span>Ship bar</span>
            <span className="text-slate-900">74%</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-3 rounded-full bg-green-500" style={{ width: "74%" }} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600">
              High impact
            </span>
            <span className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-500">
              Cut scope
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Know what is left to keep",
      body: "See your true daily balance and profit margins without spreadsheet headache. Small loops, fast feedback, and absolute accuracy for tools you rely on daily.",
      visual: (
        <div className="rounded-xl bg-slate-100 p-6">
          <div className="flex flex-wrap items-center gap-3">
            {["Build", "Learn", "Ship"].map((label, i, arr) => (
              <Fragment key={label}>
                <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-400" weight="bold" />
                )}
              </Fragment>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
            Same loop that tracks cash flow &amp; balances
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-dvh w-full bg-background text-foreground">
      <div className="bg-gradient-to-b from-primary/[0.04] to-background">
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
              className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl"
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
                  "rounded-full border border-primary/30 px-8 py-3.5 text-sm font-bold text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]",
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
                className="mb-8 grid grid-cols-1 items-center gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12 lg:grid-cols-12 lg:gap-12"
              >
                <div className="lg:col-span-6">{card.visual}</div>
                <div className="lg:col-span-6">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">
                    {card.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
