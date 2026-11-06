export type Scenario = {
  latency: [number, number];
  offline?: boolean;
  error?: number;
  fail?: { path: string; methods: string[]; status: number };
  expireSession?: boolean;
  empty?: boolean;
  orderTimeout?: boolean;
  payment: "confirm" | "reject";
};

const base = {
  latency: [150, 300] as [number, number],
  payment: "confirm" as const,
};
export const SCENARIOS: Record<string, Scenario> = {
  default: base,
  slow: { ...base, latency: [1800, 2500] },
  variable: { ...base, latency: [100, 2200] },
  offline: { ...base, offline: true },
  server500: { ...base, error: 500 },
  empty: { ...base, empty: true },
  expired: { ...base, expireSession: true },
  "order-timeout": { ...base, orderTimeout: true },
  "payment-rejected": { ...base, payment: "reject" },
  "favorites-fail": {
    ...base,
    fail: { path: "/favorites", methods: ["PUT", "DELETE"], status: 500 },
  },
};

const KEY = "kurio.scenario";
export function getScenario(): Scenario {
  const fromUrl = new URLSearchParams(location.search).get("scenario");
  if (fromUrl) sessionStorage.setItem(KEY, fromUrl);
  return (
    SCENARIOS[sessionStorage.getItem(KEY) ?? "default"] ?? SCENARIOS.default
  );
}
