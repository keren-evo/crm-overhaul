import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
data = json.loads((ROOT / "structure.json").read_text(encoding="utf-8"))
deps_data = json.loads((ROOT / "dependencies.json").read_text(encoding="utf-8"))
files_data = json.loads((ROOT / "task-files.json").read_text(encoding="utf-8"))
task_files_map: dict[str, list[str]] = files_data.get("tasks", {})

FILE_REF_RE = re.compile(
    r"(?:crm/)?([a-zA-Z0-9_./-]+?\.(?:md|json|sql|ts|html|csv)|crm-bot-discovery\.prompt\.md)"
)


def normalize_path(raw: str) -> str:
    path = raw.strip().replace("\\", "/")
    if path.startswith("crm/"):
        return path
    if path.startswith("alignment-meeting/"):
        return f"crm/{path}"
    if path.startswith("schema/"):
        return f"crm/{path}"
    if path.startswith("audit/"):
        return f"crm/{path}"
    if path.startswith("asana/"):
        return f"crm/{path}"
    if path.startswith("src/"):
        return path
    # repo-root paths (webhooks, discovery docs, etc.)
    known_roots = (
        "glossary",
        "flowcharts",
        "meeting-notes",
        "leadtrap",
        "onedrive-hub",
        "Link-Homecare",
    )
    if path.startswith(known_roots):
        return f"crm/{path}"
    if path == "nexus-episode-status-map.json":
        return "crm/schema/nexus-episode-status-map.json"
    return f"crm/{path}"


def extract_files_from_subtasks(subtasks: list[str]) -> list[str]:
    found: list[str] = []
    for sub in subtasks:
        for match in FILE_REF_RE.finditer(sub):
            normalized = normalize_path(match.group(0))
            if normalized not in found:
                found.append(normalized)
    return found


GITHUB_REPO = files_data.get("github", {}).get("repo", "keren-evo/crm-overhaul")
GITHUB_BRANCH = files_data.get("github", {}).get("branch", "main")
PAGES_BASE = files_data.get("github", {}).get(
    "pages_base", "https://keren-evo.github.io/crm-overhaul"
).rstrip("/")
GITHUB_BLOB = f"https://github.com/{GITHUB_REPO}/blob/{GITHUB_BRANCH}"


def repo_path_to_pages_rel(repo_path: str) -> str | None:
    """Map a crm/ repo path to its GitHub Pages URL path (None if not on the hub site)."""
    path = normalize_path(repo_path)
    if not path.startswith("crm/"):
        return None
    if path == "crm/onedrive-hub/index.html":
        return ""
    rel = path[len("crm/") :]
    if rel.startswith("onedrive-hub/flowcharts/"):
        rel = rel.replace("onedrive-hub/flowcharts/", "flowcharts/")
    if rel.endswith(".prompt.md"):
        return rel[: -len(".prompt.md")] + ".prompt.html"
    if rel.endswith(".md"):
        return rel[:-3] + ".html"
    return rel


def to_github_url(repo_path: str) -> str:
    """Map repo artifact to a clickable URL (Pages for hub docs, blob for src/)."""
    path = normalize_path(repo_path)
    pages_rel = repo_path_to_pages_rel(path)
    if pages_rel is not None:
        return f"{PAGES_BASE}/{pages_rel}" if pages_rel else f"{PAGES_BASE}/"
    return f"{GITHUB_BLOB}/{path}"


def to_doc_path(repo_path: str) -> str:
    """Map repo artifact path to OneDrive package doc path (HTML for markdown)."""
    path = normalize_path(repo_path)
    path = path.replace("crm/onedrive-hub/flowcharts/", "flowcharts/")
    if path.startswith("crm/"):
        path = path[len("crm/") :]
    if path.endswith(".prompt.md"):
        return path[: -len(".prompt.md")] + ".prompt.html"
    if path.endswith(".md"):
        return path[:-3] + ".html"
    return path


def related_files_for_task(task: dict, *, link_format: str = "github") -> str:
    name = task["name"]
    paths: list[str] = []
    for source in (
        task.get("files", []),
        task_files_map.get(name, []),
        extract_files_from_subtasks(task.get("subtasks", [])),
    ):
        for path in source:
            link = to_github_url(path) if link_format == "github" else to_doc_path(path)
            if link not in paths:
                paths.append(link)
    return "; ".join(paths)


def merge_dependencies(task_name: str, explicit: str) -> str:
    """Combine structure.json depends_on with dependencies.json within_section chains."""
    extra = [
        d["blocked_by"]
        for d in deps_data.get("within_section", [])
        if d.get("task") == task_name
    ]
    ordered: list[str] = []
    for dep in ([explicit] if explicit else []) + extra:
        if dep and dep not in ordered:
            ordered.append(dep)
    return "; ".join(ordered)


# --- evo-crm-sprint-tasks.csv (full matrix with subtasks) ---
rows = []
header = [
    "Section", "Task", "Subtask", "Workstream", "Decision Gate", "Blocker",
    "Requires Stakeholder Decision", "CRM Environment", "Effort", "Priority",
    "Baseline / Target Metric", "Assignee Primary", "Assignee Secondary",
    "Milestone", "Depends On", "Related Docs",
]

for section in data["sections"]:
    sec_name = section["name"]
    ws = section.get("workstream", "")
    for task in section["tasks"]:
        files_col = related_files_for_task(task)
        base = {
            "Section": sec_name,
            "Task": task["name"],
            "Workstream": task.get("workstream", ws),
            "Decision Gate": task.get("decision_gate", "No"),
            "Blocker": "Yes" if task.get("blocker") or task.get("milestone") else "No",
            "Requires Stakeholder Decision": "Yes" if task.get("requires_stakeholder_decision") else "No",
            "CRM Environment": task.get("crm_environment", "Discovery"),
            "Effort": task.get("effort", ""),
            "Priority": task.get("priority", ""),
            "Baseline / Target Metric": task.get("baseline_metric", ""),
            "Assignee Primary": task.get("assignee", ""),
            "Assignee Secondary": ", ".join(task.get("collaborators", [])),
            "Milestone": "Yes" if task.get("milestone") else "No",
            "Depends On": task.get("depends_on", ""),
            "Related Docs": files_col,
        }
        subs = task.get("subtasks", [])
        if subs:
            for i, sub in enumerate(subs):
                row = dict(base)
                row["Subtask"] = sub
                if i > 0:
                    row["Task"] = ""
                    row["Related Docs"] = ""
                rows.append(row)
        else:
            row = dict(base)
            row["Subtask"] = ""
            rows.append(row)

sprint_path = ROOT / "evo-crm-sprint-tasks.csv"
with sprint_path.open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=header)
    w.writeheader()
    for r in rows:
        w.writerow({k: r.get(k, "") for k in header})

# --- crm_asana_v3.csv (parent tasks only — simplified Asana import) ---
v3_header = [
    "Section",
    "Task Name",
    "Assignee",
    "Priority",
    "Effort",
    "Is Milestone",
    "Dependencies",
    "Related Docs",
]
v3_rows = []
missing_files = []
for section in data["sections"]:
    order = section.get("order", 0)
    sec_label = f"§{order} {section['name']}"
    for task in section["tasks"]:
        files_col = related_files_for_task(task)
        if not files_col:
            missing_files.append(task["name"])
        v3_rows.append({
            "Section": sec_label,
            "Task Name": task["name"],
            "Assignee": task.get("assignee", ""),
            "Priority": task.get("priority", ""),
            "Effort": task.get("effort", ""),
            "Is Milestone": "Yes" if task.get("milestone") else "No",
            "Dependencies": merge_dependencies(task["name"], task.get("depends_on", "")),
            "Related Docs": files_col,
        })

v3_path = ROOT / "crm_asana_v3.csv"
with v3_path.open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=v3_header)
    w.writeheader()
    for r in v3_rows:
        w.writerow(r)

task_count = sum(len(s["tasks"]) for s in data["sections"])
print(f"Wrote evo-crm-sprint-tasks.csv: {len(rows)} rows from {task_count} tasks")
print(f"Wrote crm_asana_v3.csv: {len(v3_rows)} parent tasks")
if missing_files:
    print(f"Warning: {len(missing_files)} task(s) without file mapping")
