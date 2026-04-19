"use client";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Jersey_15 } from "next/font/google";
import { motion } from "motion/react";
import NormalDistribution from "./normal-distribution";

const jersey = Jersey_15({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function HeroSection() {
  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-8 py-24 md:py-32 lg:py-40">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-start gap-8"
      >

        <h1 className="text-foreground text-4xl font-bold tracking-tighter md:text-6xl leading-[1.05]">
          Build{" "}
          <span className={`${jersey.className} text-5xl md:text-7xl`}>
            tables and graphs
          </span>
          <br className="hidden md:block" /> with{" "}
          <span
            className={`${jersey.className} text-5xl md:text-7xl text-primary`}
          >
            high
          </span>{" "}
          efficiency
        </h1>

        <p className="max-w-md text-base md:text-lg text-muted-foreground">
          Plot distributions, run quick analyses, and ship beautiful charts
          without wrestling with spreadsheets.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/create"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-medium text-background transition-all hover:gap-3 hover:bg-foreground/90"
          >
            Get Started
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-2.5 font-medium text-foreground transition-colors hover:bg-card"
          >
            See features
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-[640px] opacity-40 blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 35%, transparent) 0%, transparent 65%)",
          }}
        />
        <NormalDistribution />
      </motion.div>
    </section>
  );
}
