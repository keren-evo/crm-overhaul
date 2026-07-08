#!/usr/bin/env python3
"""Convert CRM markdown files to styled HTML for OneDrive hub browsing."""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

import markdown
from markdown.extensions.tables import TableExtension
from markdown.extensions.fenced_code import FencedCodeExtension
from markdown.extensions.toc import TocExtension

HTML_SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  {extra_head}
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    :root {{
      --bg: #f4f6f9;
      --card: #ffffff;
      --text: #172033;
      --muted: #5c6578;
      --accent: #0f766e;
      --accent-light: #e6f4f2;
      --border: #d8dee9;
      --code-bg: #f1f5f9;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 16px/1.65 "Segoe UI", system-ui, -apple-system, sans-serif;
    }}
    .topbar {{
      background: linear-gradient(135deg, #0f766e 0%, #134e4a 100%);
      color: #fff;
      padding: 0.75rem 1.25rem;
      font-size: 0.9rem;
    }}
    .topbar a {{
      color: #fff;
      text-decoration: none;
      opacity: 0.95;
    }}
    .topbar a:hover {{ text-decoration: underline; }}
    main {{
      max-width: 860px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }}
    article {{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem 2.25rem;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }}
    article h1 {{
      margin-top: 0;
      font-size: 1.75rem;
      color: #0d5c56;
      line-height: 1.25;
      border-bottom: 2px solid var(--accent-light);
      padding-bottom: 0.5rem;
    }}
    article h2 {{
      margin-top: 2rem;
      font-size: 1.25rem;
      color: #134e4a;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.35rem;
    }}
    article h3 {{ margin-top: 1.5rem; color: #1e3a38; }}
    article h4 {{ margin-top: 1.25rem; }}
    a {{ color: var(--accent); }}
    a:hover {{ color: #0d5c56; }}
    p {{ margin: 0.85rem 0; }}
    ul, ol {{ padding-left: 1.5rem; }}
    li {{ margin: 0.35rem 0; }}
    li > ul {{ margin-top: 0.25rem; }}
    blockquote {{
      margin: 1.25rem 0;
      padding: 0.75rem 1rem;
      border-left: 4px solid var(--accent);
      background: var(--accent-light);
      border-radius: 0 8px 8px 0;
    }}
    blockquote p {{ margin: 0.35rem 0; }}
    code {{
      font-family: Consolas, "SF Mono", monospace;
      font-size: 0.9em;
      background: var(--code-bg);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }}
    pre {{
      background: #1e293b;
      color: #e2e8f0;
      padding: 1rem 1.15rem;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.88rem;
      line-height: 1.5;
    }}
    pre code {{
      background: transparent;
      padding: 0;
      color: inherit;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 1.25rem 0;
      font-size: 0.95rem;
    }}
    th, td {{
      border: 1px solid var(--border);
      padding: 0.6rem 0.75rem;
      text-align: left;
      vertical-align: top;
    }}
    th {{
      background: #f8fafc;
      font-weight: 600;
      color: #134e4a;
    }}
    tr:nth-child(even) td {{ background: #fafbfc; }}
    hr {{
      border: none;
      border-top: 1px solid var(--border);
      margin: 2rem 0;
    }}
    .mermaid {{
      margin: 1.5rem 0;
      text-align: center;
    }}
    .toc {{
      background: var(--accent-light);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
    }}
    .toc ul {{ margin: 0.5rem 0 0; }}
    input[type="checkbox"] {{ margin-right: 0.35rem; }}
    {extra_css}
    @media print {{
      body {{ background: #fff; }}
      .topbar {{ display: none; }}
      .signoff-toolbar {{ display: none; }}
      article {{ box-shadow: none; border: none; }}
      textarea.signoff-comment {{
        border: 1px solid #ccc;
        min-height: 2.5rem;
        print-color-adjust: exact;
      }}
    }}
  </style>
</head>
<body{class_attr}>
  <nav class="topbar">{nav}</nav>
  <main><article>{body}</article></main>
  <script>
    mermaid.initialize({{ startOnLoad: true, theme: "neutral", securityLevel: "loose" }});
  </script>
  {extra_scripts}
</body>
</html>
"""

SIGNOFF_CSS = """
    .signoff-banner {
      margin: 0 0 1.25rem;
      padding: 0.75rem 1rem;
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      font-size: 0.92rem;
      color: #78350f;
    }
    .signoff-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem 1rem;
      margin: 0 0 1.25rem;
      padding: 0.75rem 1rem;
      background: var(--accent-light);
      border: 1px solid #b8ddd8;
      border-radius: 8px;
      font-size: 0.88rem;
    }
    .signoff-toolbar .signoff-hint { color: var(--muted); flex: 1 1 12rem; }
    .signoff-toolbar button {
      font: inherit;
      font-size: 0.85rem;
      padding: 0.4rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: #fff;
      color: var(--text);
      cursor: pointer;
    }
    .signoff-toolbar button:hover { background: #f8fafc; border-color: #b8ddd8; }
    .signoff-toolbar button.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
    .signoff-toolbar button.primary:hover { background: #0d5c56; }
    table.signoff-table th:last-child,
    table.signoff-table td:last-child { min-width: 11rem; }
    textarea.signoff-comment {
      width: 100%;
      min-width: 10rem;
      min-height: 2.75rem;
      font: inherit;
      font-size: 0.88rem;
      line-height: 1.45;
      padding: 0.45rem 0.55rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      resize: vertical;
      background: #fff;
      color: var(--text);
    }
    textarea.signoff-comment:focus {
      outline: 2px solid #99f6e4;
      border-color: var(--accent);
    }
    textarea.signoff-comment::placeholder { color: #94a3b8; }
    .section-comment-wrap {
      margin: 0.75rem 0 1.25rem;
      padding: 0.65rem 0.85rem;
      background: #f8fafc;
      border: 1px dashed var(--border);
      border-radius: 8px;
    }
    .section-comment-wrap label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--muted);
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    textarea.section-comment {
      width: 100%;
      min-height: 3rem;
      font: inherit;
      font-size: 0.9rem;
      padding: 0.5rem 0.6rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      resize: vertical;
      background: #fff;
    }
"""

def signoff_banner(md_path: Path, root: Path) -> str:
    prefix = asset_prefix(md_path, root)
    return (
        f'<div class="signoff-banner"><strong>Sign-off:</strong> Joel → Avi → Hillel (CEO) · cc Leah. '
        f'<strong>How to comment:</strong> Type in the '
        f'<strong>Comments</strong> column on any row — saved automatically as you type. '
        f'<a href="{prefix}index.html">Back to sign-off package</a>.</div>'
    )


def asset_prefix(md_path: Path, root: Path) -> str:
    rel = md_path.parent.relative_to(root)
    depth = len(rel.parts)
    return "../" * depth if depth else ""


def signoff_assets(md_path: Path, root: Path) -> tuple[str, str]:
    prefix = asset_prefix(md_path, root)
    css = f'<link rel="stylesheet" href="{prefix}signoff-comments.css" />'
    scripts = (
        f'<script src="{prefix}signoff-comments.js"></script>\n'
        "  <script>document.addEventListener('DOMContentLoaded', function () { "
        "LinkCrmSignoff.initPage(); });</script>"
    )
    return css, scripts

SIGNOFF_DOCS = frozenset({
    "joel-model-signoff-onepager.md",
    "glossary-pipeline-v2.md",
    "drop-reasons-for-signoff.md",
})


def hub_link(md_path: Path, root: Path) -> str:
    rel = md_path.parent.relative_to(root)
    depth = len(rel.parts)
    prefix = "../" * depth if depth else ""
    return f'<a href="{prefix}index.html">← Sign-off package</a>'


def preprocess_mermaid(text: str) -> str:
    """Convert ```mermaid blocks to div.mermaid for client-side rendering."""

    def repl(match: re.Match[str]) -> str:
        content = match.group(1).strip()
        return f'<div class="mermaid">\n{content}\n</div>'

    return re.sub(
        r"```mermaid\s*\n(.*?)```",
        repl,
        text,
        flags=re.DOTALL,
    )


def rewrite_md_links(html: str, md_path: Path, root: Path) -> str:
    """Resolve relative .md links to .html paths relative to the output HTML file."""

    html_path = md_path.with_suffix(".html")

    def repl(match: re.Match[str]) -> str:
        href = match.group(1)
        if href.startswith(("http://", "https://", "mailto:", "#")):
            return match.group(0)
        if ".md" not in href and ".prompt.md" not in href:
            return match.group(0)
        path_part, _, fragment = href.partition("#")
        if not (path_part.endswith(".md") or path_part.endswith(".prompt.md")):
            return match.group(0)
        resolved = (md_path.parent / path_part).resolve()
        try:
            resolved.relative_to(root.resolve())
        except ValueError:
            return match.group(0)
        target_html = resolved.with_suffix(".html")
        rel = os.path.relpath(target_html, html_path.parent).replace("\\", "/")
        if fragment:
            rel += "#" + fragment
        return f'href="{rel}"'

    return re.sub(r'href="([^"]+)"', repl, html)


def extract_title(text: str, fallback: str) -> str:
    for line in text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def is_signoff_doc(md_path: Path) -> bool:
    return md_path.name in SIGNOFF_DOCS


def convert_file(md_path: Path, root: Path) -> Path:
    text = md_path.read_text(encoding="utf-8")
    title = extract_title(text, md_path.stem.replace("-", " "))
    processed = preprocess_mermaid(text)

    body = markdown.markdown(
        processed,
        extensions=[
            TableExtension(),
            FencedCodeExtension(),
            TocExtension(permalink=False, toc_depth=3),
            "nl2br",
        ],
        output_format="html5",
    )
    body = rewrite_md_links(body, md_path, root)

    signoff = is_signoff_doc(md_path)
    if signoff:
        body = signoff_banner(md_path, root) + body

    nav = hub_link(md_path, root)
    signoff_css_link, signoff_scripts = signoff_assets(md_path, root) if signoff else ("", "")

    html = HTML_SHELL.format(
        title=title,
        nav=nav,
        body=body,
        class_attr=' class="signoff-doc"' if signoff else "",
        extra_head=signoff_css_link,
        extra_css=SIGNOFF_CSS if signoff else "",
        extra_scripts=signoff_scripts,
    )

    out_path = md_path.with_suffix(".html")
    out_path.write_text(html, encoding="utf-8")
    return out_path


def convert_tree(root: Path) -> int:
    count = 0
    patterns = ["*.md", "*.prompt.md"]
    seen: set[Path] = set()
    for pattern in patterns:
        for md in sorted(root.rglob(pattern)):
            if md in seen:
                continue
            seen.add(md)
            if "onedrive-hub" in md.parts:
                continue
            convert_file(md, root)
            count += 1
    return count


def main() -> None:
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if not target or not target.is_dir():
        print("Usage: md-to-html.py <onedrive-package-root>", file=sys.stderr)
        sys.exit(1)
    n = convert_tree(target)
    print(f"Converted {n} markdown files to HTML in {target}")


if __name__ == "__main__":
    main()
