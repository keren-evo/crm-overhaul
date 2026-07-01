"use client";

const UTM_STORAGE_KEY = "evo_utm_attribution";

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  landing_page?: string;
}

/** Read UTM params from the current URL and persist for attribution across pages */
export function captureUtmFromUrl(): UtmParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};

  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const content = params.get("utm_content");

  if (source) utm.source = source;
  if (medium) utm.medium = medium;
  if (campaign) utm.campaign = campaign;
  if (content) utm.content = content;

  utm.landing_page = window.location.pathname + window.location.search;

  if (Object.keys(utm).length > 1) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    console.log("[utm] captured:", utm);
  }

  return utm;
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
