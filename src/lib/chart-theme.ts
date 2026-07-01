/**
 * Chart & accent palette — aligned with Sapphire UI reference (image 3).
 * Purple monochromatic scale for data viz; semantic colors only outside charts.
 */
export const accent = {
  primary: "#9d7af2",
  primaryLight: "#c4a8ff",
  primaryMuted: "#7c6bb8",
  primaryDeep: "#5b4d8a",
  primaryDim: "#3d3358",
  primaryGlow: "#b89df8",
} as const;

export const chartColors = {
  /** Main series — overall score, primary metric */
  overall: accent.primary,
  /** Area breakdown — distinct semantic colors */
  security: "#f87171",
  compliance: "#60a5fa",
  efficiency: "#fbbf24",
  /** Radial / secondary series */
  series: {
    overall: accent.primary,
    security: "#a78bfa",
    compliance: "#60a5fa",
    efficiency: "#f472b6",
  },
  /** Heatmap-style intensity scale (low → high) */
  heatmap: [
    "#2a2438",
    "#3d3358",
    "#5b4d8a",
    "#7c6bb8",
    "#9d7af2",
    "#c4a8ff",
  ],
  grid: "rgba(157, 122, 242, 0.06)",
  axis: "#6b6280",
} as const;

export const surface = {
  background: "#121218",
  card: "#1c1c24",
  sidebar: "#0f0f14",
  border: "rgba(157, 122, 242, 0.08)",
  borderSubtle: "rgba(255, 255, 255, 0.06)",
} as const;
