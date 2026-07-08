# Build CRM hub static site for GitHub Pages
# Run: powershell -File crm/build-pages.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$CrmSource = Join-Path $RepoRoot "crm"
$SiteRoot = Join-Path $RepoRoot "docs"
$MdScript = Join-Path $CrmSource "scripts\md-to-html.py"
$CustomFlowcharts = Join-Path $CrmSource "onedrive-hub\flowcharts\pipeline-flowcharts-v1.html"

Write-Host "Source: $CrmSource"
Write-Host "Target: $SiteRoot"

if (Test-Path $SiteRoot) {
    Remove-Item -Path $SiteRoot -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $SiteRoot | Out-Null

$RootMd = @(
    "glossary-pipeline-v2.md",
    "Link-Homecare-CRM-Status-Architecture-Execution-Workspace.md",
    "README.md"
)
foreach ($name in $RootMd) {
    Copy-Item (Join-Path $CrmSource $name) (Join-Path $SiteRoot $name) -Force
}

$Folders = @(
    "flowcharts",
    "glossary",
    "meeting-notes",
    "asana",
    "schema",
    "audit",
    "alignment-meeting",
    "leadtrap"
)

foreach ($folder in $Folders) {
    $src = Join-Path $CrmSource $folder
    if (Test-Path $src) {
        $dst = Join-Path $SiteRoot $folder
        New-Item -ItemType Directory -Force -Path $dst | Out-Null
        Get-ChildItem $src -File | Where-Object { $_.Name -notmatch '^_' } | ForEach-Object {
            Copy-Item $_.FullName (Join-Path $dst $_.Name) -Force
        }
    }
}

Copy-Item (Join-Path $CrmSource "crm-bot-discovery.prompt.md") (Join-Path $SiteRoot "crm-bot-discovery.prompt.md") -Force

$discoveryDir = Join-Path $SiteRoot "discovery"
New-Item -ItemType Directory -Force -Path $discoveryDir | Out-Null

$DiscoverySrc = Get-ChildItem -Path $RepoRoot -Filter "1-1-CRM*.md" | Select-Object -First 1
if ($DiscoverySrc) {
    Copy-Item $DiscoverySrc.FullName (Join-Path $discoveryDir "1-1-CRM-Discovery-Session.md") -Force
}

$DecisionWorkspace = Join-Path $RepoRoot "CRM DECISION WORKSPACE.md"
if (Test-Path $DecisionWorkspace) {
    Copy-Item $DecisionWorkspace (Join-Path $discoveryDir "CRM-DECISION-WORKSPACE.md") -Force
}

Copy-Item (Join-Path $CrmSource "onedrive-hub\index.html") (Join-Path $SiteRoot "index.html") -Force
Copy-Item (Join-Path $CrmSource "onedrive-hub\hub.html") (Join-Path $SiteRoot "hub.html") -Force
New-Item -ItemType File -Force -Path (Join-Path $SiteRoot ".nojekyll") | Out-Null

Write-Host "Converting markdown to styled HTML..."
python $MdScript $SiteRoot
if ($LASTEXITCODE -ne 0) {
    throw "Markdown conversion failed"
}

if (Test-Path $CustomFlowcharts) {
    $flowDst = Join-Path $SiteRoot "flowcharts\pipeline-flowcharts-v1.html"
    New-Item -ItemType Directory -Force -Path (Split-Path $flowDst) | Out-Null
    Copy-Item $CustomFlowcharts $flowDst -Force
    Write-Host "Applied custom flowcharts HTML"
}

Write-Host "`nDone. Site built at:`n  $SiteRoot"
