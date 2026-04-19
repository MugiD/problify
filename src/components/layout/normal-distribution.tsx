"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

const WIDTH = 600;
const HEIGHT = 380;
const PADDING_X = 40;
const BASELINE = 320;
const PEAK = 70;
const MEAN_X = WIDTH / 2;
const SIGMA_PX = 70;

const pdf = (z: number) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);
const PEAK_PDF = pdf(0);

const yForZ = (z: number) =>
  BASELINE - (pdf(z) / PEAK_PDF) * (BASELINE - PEAK);

const xForZ = (z: number) => MEAN_X + z * SIGMA_PX;

function buildCurvePath() {
  const steps = 120;
  const zMin = -3.5;
  const zMax = 3.5;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const z = zMin + ((zMax - zMin) * i) / steps;
    const x = xForZ(z);
    const y = yForZ(z);
    d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

function buildAreaPath(zStart: number, zEnd: number) {
  const steps = 60;
  let d = `M ${xForZ(zStart).toFixed(2)} ${BASELINE}`;
  for (let i = 0; i <= steps; i++) {
    const z = zStart + ((zEnd - zStart) * i) / steps;
    d += ` L ${xForZ(z).toFixed(2)} ${yForZ(z).toFixed(2)}`;
  }
  d += ` L ${xForZ(zEnd).toFixed(2)} ${BASELINE} Z`;
  return d;
}

const BAR_COUNT = 21;
const BAR_GAP = 2;

function useBars() {
  return useMemo(() => {
    const bars: { x: number; y: number; width: number; height: number; z: number }[] = [];
    const totalWidth = SIGMA_PX * 6;
    const barWidth = totalWidth / BAR_COUNT - BAR_GAP;
    for (let i = 0; i < BAR_COUNT; i++) {
      const z = -3 + (6 * (i + 0.5)) / BAR_COUNT;
      const cx = xForZ(z);
      const x = cx - barWidth / 2;
      const y = yForZ(z);
      const height = BASELINE - y;
      bars.push({ x, y, width: barWidth, height, z });
    }
    return bars;
  }, []);
}

const TICKS: { z: number; label: string }[] = [
  { z: -3, label: "−3σ" },
  { z: -2, label: "−2σ" },
  { z: -1, label: "−σ" },
  { z: 0, label: "μ" },
  { z: 1, label: "σ" },
  { z: 2, label: "2σ" },
  { z: 3, label: "3σ" },
];

const PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rand = seed / 233280;
  const z = (rand - 0.5) * 5;
  return {
    z,
    delay: (i * 0.45) % 5,
    duration: 3 + ((i * 7) % 5) * 0.4,
  };
});

export default function NormalDistribution() {
  const curvePath = useMemo(() => buildCurvePath(), []);
  const area1 = useMemo(() => buildAreaPath(-1, 1), []);
  const area2a = useMemo(() => buildAreaPath(-2, -1), []);
  const area2b = useMemo(() => buildAreaPath(1, 2), []);
  const bars = useBars();

  return (
    <div className="relative w-full max-w-[640px] mx-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="Animated normal distribution bell curve"
      >
        <defs>
          <linearGradient id="dist-fill-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="dist-fill-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="dist-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.25" />
          </linearGradient>
          <pattern id="dist-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--border)"
              strokeOpacity="0.5"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>

        <rect
          x={PADDING_X}
          y={20}
          width={WIDTH - PADDING_X * 2}
          height={BASELINE - 20}
          fill="url(#dist-grid)"
          opacity="0.55"
        />

        <motion.path
          d={area2a}
          fill="url(#dist-fill-2)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        />
        <motion.path
          d={area2b}
          fill="url(#dist-fill-2)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        />
        <motion.path
          d={area1}
          fill="url(#dist-fill-1)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        />

        {bars.map((bar, i) => {
          const distFromCenter = Math.abs(i - (BAR_COUNT - 1) / 2);
          const delay = 0.3 + distFromCenter * 0.05;
          return (
            <motion.rect
              key={i}
              x={bar.x}
              width={bar.width}
              fill="url(#dist-bar)"
              rx={1.5}
              initial={{ y: BASELINE, height: 0 }}
              animate={{ y: bar.y, height: bar.height }}
              transition={{
                delay,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}

        <motion.path
          d={curvePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.6, ease: "easeInOut" }}
        />

        <motion.line
          x1={MEAN_X}
          x2={MEAN_X}
          y1={BASELINE}
          y2={yForZ(0)}
          stroke="var(--primary)"
          strokeWidth={1.25}
          strokeDasharray="4 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        />
        <motion.circle
          cx={MEAN_X}
          cy={yForZ(0)}
          r={4}
          fill="var(--primary)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.8, duration: 0.4, type: "spring", stiffness: 260 }}
        />

        <line
          x1={PADDING_X}
          x2={WIDTH - PADDING_X}
          y1={BASELINE}
          y2={BASELINE}
          stroke="var(--foreground)"
          strokeOpacity={0.45}
          strokeWidth={1}
        />

        {TICKS.map((tick) => {
          const x = xForZ(tick.z);
          const isMean = tick.z === 0;
          return (
            <motion.g
              key={tick.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 + Math.abs(tick.z) * 0.05, duration: 0.4 }}
            >
              <line
                x1={x}
                x2={x}
                y1={BASELINE}
                y2={BASELINE + 5}
                stroke="var(--foreground)"
                strokeOpacity={0.55}
                strokeWidth={1}
              />
              <text
                x={x}
                y={BASELINE + 20}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={11}
                fontFamily="var(--font-mono)"
                style={{ fontWeight: isMean ? 600 : 400 }}
              >
                {tick.label}
              </text>
            </motion.g>
          );
        })}

        <motion.text
          x={MEAN_X}
          y={PEAK - 18}
          textAnchor="middle"
          className="fill-foreground"
          fontSize={12}
          fontFamily="var(--font-mono)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          f(x) = 1/√(2π) · e^(−x²/2)
        </motion.text>

        <g>
          {PARTICLES.map((p, i) => {
            const x = xForZ(p.z);
            const yEnd = yForZ(p.z) - 6;
            return (
              <motion.circle
                key={i}
                cx={x}
                r={2.5}
                fill="var(--primary)"
                initial={{ cy: 30, opacity: 0 }}
                animate={{ cy: [30, yEnd, yEnd], opacity: [0, 1, 0] }}
                transition={{
                  delay: 2.2 + p.delay,
                  duration: p.duration,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: "easeIn",
                  times: [0, 0.7, 1],
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
