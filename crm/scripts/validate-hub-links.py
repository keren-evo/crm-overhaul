#!/usr/bin/env python3
"""Validate all href targets in OneDrive hub index.html exist."""

import re
import sys
from pathlib import Path

HUB_FILES = [
    Path(__file__).resolve().parents[1] / "onedrive-hub" / "index.html",
    Path(__file__).resolve().parents[1] / "onedrive-hub" / "hub.html",
]
PACKAGE = Path(r"O:\EVO\OneDrive - EVO Healthcare Group\Documents\Link Homecare - CRM Overhaul")


def main() -> int:
    if not PACKAGE.exists():
        print(f"Missing package (run sync first): {PACKAGE}", file=sys.stderr)
        return 1

    missing: list[str] = []
    all_hrefs: list[str] = []
    for hub in HUB_FILES:
        if not hub.exists():
            print(f"Missing hub: {hub}", file=sys.stderr)
            return 1
        text = hub.read_text(encoding="utf-8")
        hrefs = [h for h in re.findall(r'href="([^"]+)"', text) if not h.startswith(("http", "#", "mailto:"))]
        all_hrefs.extend(hrefs)
        for href in hrefs:
            target = PACKAGE / href.replace("/", "\\")
            if not target.exists() and href not in missing:
                missing.append(href)

    print(f"Checked {len(all_hrefs)} hub links under:\n  {PACKAGE}\n")
    for href in all_hrefs:
        status = "OK" if href not in missing else "MISSING"
        print(f"  [{status}] {href}")

    if missing:
        print(f"\n{len(missing)} broken link(s).", file=sys.stderr)
        return 1
    print("\nAll hub links OK.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
