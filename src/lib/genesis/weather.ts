/**
 * Weather derived from climate, air quality, humidity, season, star.
 */

import { deriveClimate, type WorldEnv } from "./world";

export type WeatherKind =
  | "clear"
  | "partly-cloudy"
  | "overcast"
  | "rain"
  | "storm"
  | "snow"
  | "blizzard"
  | "fog"
  | "dust"
  | "heat-haze";

export type WeatherState = {
  kind: WeatherKind;
  label: string;
  intensity: number; // 0–1
  wind: number; // 0–1
  precipRate: number; // particles scale
  fogBoost: number;
  lightDim: number; // multiply sun
  tint: string;
};

export function deriveWeather(env: WorldEnv, tick = 0): WeatherState {
  const c = deriveClimate(env, tick);
  const aq = c.airQuality;
  const hum = env.atmosphere.humidity;
  const dust = env.atmosphere.particulates;
  const tox = env.atmosphere.toxin;
  const season = c.season;
  const temp = c.tempC;

  let kind: WeatherKind = "clear";
  let intensity = 0.25;
  let wind = 0.15 + env.orbit.eccentricity * 0.4;
  let precipRate = 0;
  let fogBoost = 0;
  let lightDim = 1;
  let tint = "#c8dce8";

  if (dust > 0.45 || (aq < 0.35 && dust > 0.25)) {
    kind = "dust";
    intensity = clamp(dust * 1.1, 0.4, 1);
    wind = 0.45 + dust * 0.4;
    fogBoost = 0.04 + dust * 0.05;
    lightDim = 0.45;
    tint = "#c4a86a";
  } else if (hum > 0.55 && temp < 1 && (season === "winter" || temp < 5)) {
    kind = wind > 0.45 || hum > 0.8 ? "blizzard" : "snow";
    intensity = clamp(0.4 + hum * 0.5, 0.4, 1);
    precipRate = kind === "blizzard" ? 1.2 : 0.65;
    wind = kind === "blizzard" ? 0.75 : 0.35;
    fogBoost = 0.03;
    lightDim = kind === "blizzard" ? 0.4 : 0.65;
    tint = "#e8f0ff";
  } else if (hum > 0.62 && temp > 2) {
    const stormy =
      hum > 0.78 || env.atmosphere.pressure < 0.85 || tox > 0.25;
    kind = stormy ? "storm" : "rain";
    intensity = clamp(0.35 + hum * 0.55, 0.35, 1);
    precipRate = kind === "storm" ? 1.15 : 0.7;
    wind = kind === "storm" ? 0.7 : 0.35;
    fogBoost = kind === "storm" ? 0.035 : 0.02;
    lightDim = kind === "storm" ? 0.35 : 0.55;
    tint = tox > 0.2 ? "#a8c4a0" : "#9ec0d8";
  } else if (hum > 0.7 && aq < 0.55 && temp > 0 && temp < 22) {
    kind = "fog";
    intensity = clamp(0.5 + (1 - aq) * 0.4, 0.4, 1);
    fogBoost = 0.06 + (1 - aq) * 0.04;
    lightDim = 0.5;
    wind = 0.12;
    tint = "#b8c8c0";
  } else if (temp > 38 && c.lightLevel > 0.85 && hum < 0.4) {
    kind = "heat-haze";
    intensity = clamp((temp - 35) / 25, 0.3, 0.9);
    lightDim = 1.15;
    wind = 0.2;
    fogBoost = 0.01;
    tint = "#ffd090";
  } else if (hum > 0.45 || dust > 0.2 || aq < 0.65) {
    kind = hum > 0.55 || aq < 0.55 ? "overcast" : "partly-cloudy";
    intensity = 0.4;
    lightDim = kind === "overcast" ? 0.7 : 0.88;
    fogBoost = kind === "overcast" ? 0.015 : 0.008;
    tint = "#c0d0d8";
  } else {
    kind = "clear";
    intensity = 0.2;
    lightDim = 1.05;
    tint = "#d0e8ff";
  }

  if (season === "winter" && kind === "clear" && temp < 8) {
    kind = "partly-cloudy";
    lightDim = 0.85;
  }

  return {
    kind,
    label: weatherLabel(kind),
    intensity,
    wind,
    precipRate,
    fogBoost,
    lightDim,
    tint,
  };
}

export function weatherLabel(k: WeatherKind): string {
  const map: Record<WeatherKind, string> = {
    clear: "Clear skies",
    "partly-cloudy": "Partly cloudy",
    overcast: "Overcast",
    rain: "Rain",
    storm: "Thunderstorm",
    snow: "Snow",
    blizzard: "Blizzard",
    fog: "Dense fog",
    dust: "Dust / smog storm",
    "heat-haze": "Heat haze",
  };
  return map[k];
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
