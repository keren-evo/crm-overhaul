#!/usr/bin/env python3
"""Validate all href targets in OneDrive hub index.html exist."""

import re
import sys
from pathlib import Path

HUB = Path(__file__).resolve().parents[1] / "onedrive-hub" / "index.html"
PACKAGE = Path(r"O:\EVO\OneDrive - EVO Healthcare Group\Documents\Link Homecare - CRM Overhaul")


def main() -> int:
    if not HUB.exists():
        print(f"Missing hub: {HUB}", file=sys.stderr)
        return 1
    if not PACKAGE.exists():
        print(f"Missing package (run sync first): {PACKAGE}", file=sys.stderr)
        return 1

    text = HUB.read_text(encoding="utf-8")
    hrefs = [h for h in re.findall(r'href="([^"]+)"', text) if not h.startswith(("http", "#", "mailto:"))]
    missing = []
    for href in hrefs:
        target = PACKAGE / href.replace("/", "\\")
        if not target.exists():
            missing.append(href)

    print(f"Checked {len(hrefs)} hub links under:\n  {PACKAGE}\n")
    for href in hrefs:
        status = "OK" if href not in missing else "MISSING"
        print(f"  [{status}] {href}")

    if missing:
        print(f"\n{len(missing)} broken link(s).", file=sys.stderr)
        return 1
    print("\nAll hub links OK.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
