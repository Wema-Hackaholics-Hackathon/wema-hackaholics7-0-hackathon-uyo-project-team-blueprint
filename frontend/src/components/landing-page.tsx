import { motion, useReducedMotion } from "motion/react";
import { Storefront, Receipt, ShieldCheck } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const trustItems = [
  {
    icon: Storefront,
    title: "Built for micro-SMEs",
    body: "Made for market sellers, okada riders, and shop owners, not accountants.",
  },
  {
    icon: Receipt,
    title: "Cash and transfer in one place",
    body: "Record every sale the moment it happens, whatever way the customer pays.",
  },
  {
    icon: ShieldCheck,
    title: "Know what is left to keep",
    body: "See your true daily balance after stock spend, without spreadsheets.",
  },
];

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

  return (
    <main className="min-h-dvh w-full bg-background text-foreground">
      <div className="bg-gradient-to-b from-primary/[0.04] to-background">
        <header className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
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

        <section className="mx-auto max-w-2xl px-6 pb-12 pt-10">
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
              className={cn(
                "rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]",
                focusRing(),
              )}
            >
              Get started
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/auth" })}
              className={cn(
                "rounded-xl border border-primary/30 px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]",
                focusRing(),
              )}
            >
              Sign in
            </button>
          </motion.div>
        </section>

        {/*
          Product image section — temporarily commented out.
          TODO: replace this placeholder with a real product image — a photo of a
          Nigerian micro-SME using Traka, or a clean screenshot of the app
          dashboard. Drop the file in /public (e.g. /public/landing-hero.jpg)
          and swap the block below for:
          <img src="/landing-hero.jpg" alt="..." className="w-full rounded-3xl shadow-card object-cover" />
          <motion.div
            {...fadeUp(0.24)}
            className="mx-auto max-w-3xl px-6"
          >
            <div className="flex aspect-[16/10] w-full items-center justify-center rounded-3xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/[0.06] to-background shadow-card">
              <div className="px-6 text-center">
                <p className="font-display text-base font-semibold text-foreground">
                  Product image
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a photo of a micro-SME owner using Traka, or an app screenshot.
                </p>
              </div>
            </div>
          </motion.div>
        */}

        <section className="mx-auto max-w-2xl px-6 pb-20 pt-16">
          <div className="grid grid-cols-1 gap-8">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="flex flex-col items-start"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon weight="bold" className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
