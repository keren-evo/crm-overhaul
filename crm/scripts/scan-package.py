#!/usr/bin/env python3
"""Scan OneDrive package: Avi spelling + all internal href links."""

from __future__ import annotations

import re
import sys
from pathlib import Path

PACKAGE = Path(r"O:\EVO\OneDrive - EVO Healthcare Group\Documents\Link Homecare - CRM Overhaul")

# Wrong spellings for CRM implementation lead (exclude valid words like "ability")
AVI_WRONG = re.compile(
    r"\b(Abhi|Abh[iy]|Av[iy]s?\b(?!\s*(tech|meeting|review)))",
    re.IGNORECASE,
)
# More targeted wrong names from transcripts
NAME_WRONG = re.compile(r"\bAbhi\b|\bAbh[iy]\b", re.IGNORECASE)

HREF_RE = re.compile(r'href="([^"]+)"')


def scan_spelling(path: Path) -> list[tuple[str, int, str]]:
    hits = []
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return hits
    for i, line in enumerate(text.splitlines(), 1):
        if NAME_WRONG.search(line):
            hits.append((str(path.relative_to(PACKAGE)), i, line.strip()[:120]))
        # Also flag "Abhi" in prose
        if re.search(r"Abhi", line, re.IGNORECASE) and "Avi" not in line:
            if (str(path.relative_to(PACKAGE)), i, line.strip()[:120]) not in hits:
                hits.append((str(path.relative_to(PACKAGE)), i, line.strip()[:120]))
    return hits


def resolve_href(base: Path, href: str) -> Path | None:
    if href.startswith(("http://", "https://", "mailto:", "#", "data:")):
        return None
    if "&#" in href:  # encoded mailto in generated HTML
        return None
    return (base.parent / href).resolve()


def scan_links(html_path: Path) -> list[tuple[str, str]]:
    broken = []
    text = html_path.read_text(encoding="utf-8", errors="replace")
    for href in HREF_RE.findall(text):
        target = resolve_href(html_path, href)
        if target is None:
            continue
        if not target.exists():
            broken.append((str(html_path.relative_to(PACKAGE)), href))
    return broken


def main() -> int:
    if not PACKAGE.is_dir():
        print(f"Package not found: {PACKAGE}", file=sys.stderr)
        print("Run: powershell -File crm/sync-to-onedrive.ps1", file=sys.stderr)
        return 1

    spelling: list[tuple[str, int, str]] = []
    broken: list[tuple[str, str]] = []
    files_scanned = 0

    for path in sorted(PACKAGE.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() in {".html", ".md", ".json", ".csv", ".sql", ".txt"}:
            files_scanned += 1
            spelling.extend(scan_spelling(path))
        if path.suffix.lower() == ".html":
            broken.extend(scan_links(path))

    # Deduplicate
    spelling = list(dict.fromkeys(spelling))
    broken = list(dict.fromkeys(broken))

    print(f"Package: {PACKAGE}")
    print(f"Files scanned: {files_scanned}\n")

    print("=== AVI / NAME SPELLING ===")
    if spelling:
        print(f"FOUND {len(spelling)} issue(s) (Abhi etc.):\n")
        for f, line, snippet in spelling:
            print(f"  {f}:{line}")
            print(f"    {snippet}\n")
    else:
        print("OK — no Abhi/wrong spellings found.\n")

    # Count Avi references
    avi_count = 0
    for path in PACKAGE.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".html", ".md"}:
            try:
                avi_count += len(re.findall(r"\bAvi\b", path.read_text(encoding="utf-8", errors="replace")))
            except OSError:
                pass
    print(f"Avi references found: {avi_count}\n")

    print("=== BROKEN INTERNAL LINKS (HTML) ===")
    if broken:
        print(f"FOUND {len(broken)} broken link(s):\n")
        for src, href in broken:
            print(f"  {src}")
            print(f"    -> {href}\n")
    else:
        print("OK — all internal HTML href targets exist.\n")

    if spelling or broken:
        return 1
    print("All checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
