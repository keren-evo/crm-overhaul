"use client";

import { useEffect } from "react";

type FbqFn = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: FbqFn;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Load Meta Pixel and expose helpers for Lead events + future CAPI wiring */
export default function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID) {
      console.warn("[meta] NEXT_PUBLIC_META_PIXEL_ID not set — pixel disabled");
      return;
    }

    if (window.fbq) return;

    const n = function (...args: unknown[]) {
      if (n.callMethod) {
        n.callMethod(...args);
      } else {
        n.queue.push(args);
      }
    } as FbqFn;

    window.fbq = n;
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);

    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
    console.log("[meta] pixel initialized:", PIXEL_ID);
  }, []);

  return PIXEL_ID ? (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  ) : null;
}

async function hashEmailClient(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Fire Meta Lead event with SHA-256 hashed email for advanced matching */
export function trackMetaLead(email: string) {
  if (!PIXEL_ID || !window.fbq) return;

  hashEmailClient(email).then((hashedEmail) => {
    window.fbq?.("track", "Lead", { em: hashedEmail });
    console.log("[meta] Lead event fired");
  });
}
