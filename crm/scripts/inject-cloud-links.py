#!/usr/bin/env python3
"""Inject OneDrive/SharePoint cloud navigation fix into all package HTML files."""

from __future__ import annotations

import sys
from pathlib import Path

MARKER = "data-cloud-nav-fix"

SCRIPT = f"""<script id="cloud-nav-fix">
(function () {{
  var MARK = "{MARKER}";
  function isRelative(href) {{
    return href && !/^(https?:|mailto:|#|data:)/i.test(href);
  }}
  function documentBase() {{
    var u = new URL(window.location.href);
    u.search = "";
    u.hash = "";
    var p = u.pathname;
    if (!p.endsWith("/")) {{
      u.pathname = p.slice(0, p.lastIndexOf("/") + 1);
    }}
    return u.href;
  }}
  function absoluteHref(href) {{
    try {{
      return new URL(href, documentBase()).href;
    }} catch (e) {{
      return href;
    }}
  }}
  function openDoc(url) {{
    try {{
      if (window.top && window.top !== window) {{
        window.top.location.assign(url);
        return;
      }}
    }} catch (e) {{}}
    var w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) window.location.assign(url);
  }}
  function enhance() {{
    document.querySelectorAll("a[href]").forEach(function (a) {{
      if (a.getAttribute(MARK)) return;
      var href = a.getAttribute("href");
      if (!isRelative(href)) return;
      a.href = absoluteHref(href);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute(MARK, "1");
    }});
  }}
  document.addEventListener("click", function (e) {{
    var a = e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href");
    if (!isRelative(href)) return;
    e.preventDefault();
    openDoc(absoluteHref(href));
  }}, true);
  if (document.readyState === "loading") {{
    document.addEventListener("DOMContentLoaded", enhance);
  }} else {{
    enhance();
  }}
}})();
</script>"""


def inject_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if MARKER in text or "cloud-nav-fix" in text:
        return False
    if "</body>" not in text.lower():
        return False
    # Case-insensitive replace for </body>
    idx = text.lower().rfind("</body>")
    updated = text[:idx] + SCRIPT + "\n" + text[idx:]
    path.write_text(updated, encoding="utf-8")
    return True


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if not root or not root.is_dir():
        print("Usage: inject-cloud-links.py <package-root>", file=sys.stderr)
        return 1

    count = 0
    for html in sorted(root.rglob("*.html")):
        if inject_file(html):
            count += 1

    print(f"Injected cloud link fix into {count} HTML file(s) under {root}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
