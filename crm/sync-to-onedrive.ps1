# Sync Link Homecare CRM overhaul package to OneDrive (clickable hub + styled HTML)
# Run: powershell -File crm/sync-to-onedrive.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$CrmSource = Join-Path $RepoRoot "crm"
$OneDriveRoot = "O:\EVO\OneDrive - EVO Healthcare Group\Documents\Link Homecare - CRM Overhaul"
$MdScript = Join-Path $CrmSource "scripts\md-to-html.py"
$ValidateScript = Join-Path $CrmSource "scripts\validate-hub-links.py"
$ScanScript = Join-Path $CrmSource "scripts\scan-package.py"
$CloudLinksScript = Join-Path $CrmSource "scripts\inject-cloud-links.py"
$CustomFlowcharts = Join-Path $CrmSource "onedrive-hub\flowcharts\pipeline-flowcharts-v1.html"

Write-Host "Source: $CrmSource"
Write-Host "Target: $OneDriveRoot"

if (Test-Path $OneDriveRoot) {
    Remove-Item -Path $OneDriveRoot -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $OneDriveRoot | Out-Null

# Root-level markdown (html generated later)
$RootMd = @(
    "glossary-pipeline-v2.md",
    "Link-Homecare-CRM-Status-Architecture-Execution-Workspace.md",
    "README.md"
)
foreach ($name in $RootMd) {
    Copy-Item (Join-Path $CrmSource $name) (Join-Path $OneDriveRoot $name) -Force
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
        $dst = Join-Path $OneDriveRoot $folder
        New-Item -ItemType Directory -Force -Path $dst | Out-Null
        Get-ChildItem $src -File | Where-Object { $_.Name -notmatch '^_' } | ForEach-Object {
            Copy-Item $_.FullName (Join-Path $dst $_.Name) -Force
        }
    }
}

foreach ($name in $RootMd) {
    Copy-Item (Join-Path $CrmSource $name) (Join-Path $OneDriveRoot $name) -Force
}
Copy-Item (Join-Path $CrmSource "crm-bot-discovery.prompt.md") (Join-Path $OneDriveRoot "crm-bot-discovery.prompt.md") -Force

$discoveryDir = Join-Path $OneDriveRoot "discovery"
New-Item -ItemType Directory -Force -Path $discoveryDir | Out-Null

$DiscoverySrc = Get-ChildItem -Path $RepoRoot -Filter "1-1-CRM*.md" | Select-Object -First 1
if ($DiscoverySrc) {
    Copy-Item $DiscoverySrc.FullName (Join-Path $discoveryDir "1-1-CRM-Discovery-Session.md") -Force
}

$DecisionWorkspace = Join-Path $RepoRoot "CRM DECISION WORKSPACE.md"
if (Test-Path $DecisionWorkspace) {
    Copy-Item $DecisionWorkspace (Join-Path $discoveryDir "CRM-DECISION-WORKSPACE.md") -Force
}

Copy-Item (Join-Path $CrmSource "onedrive-hub\index.html") (Join-Path $OneDriveRoot "index.html") -Force

Write-Host "Converting markdown to styled HTML..."
python $MdScript $OneDriveRoot

# Custom flowcharts page (richer Mermaid layout) overrides md-generated version
if (Test-Path $CustomFlowcharts) {
    $flowDst = Join-Path $OneDriveRoot "flowcharts\pipeline-flowcharts-v1.html"
    New-Item -ItemType Directory -Force -Path (Split-Path $flowDst) | Out-Null
    Copy-Item $CustomFlowcharts $flowDst -Force
    Write-Host "Applied custom flowcharts HTML"
}

Write-Host "Injecting OneDrive cloud link navigation..."
python $CloudLinksScript $OneDriveRoot
if ($LASTEXITCODE -ne 0) {
    throw "Cloud link injection failed"
}

Write-Host "Validating hub links..."
python $ValidateScript
if ($LASTEXITCODE -ne 0) {
    throw "Hub link validation failed"
}

Write-Host "Full package scan (Avi spelling + all HTML links)..."
python $ScanScript
if ($LASTEXITCODE -ne 0) {
    throw "Package scan failed - fix spelling or broken links before sharing"
}

$indexPath = Join-Path $OneDriveRoot "index.html"
Write-Host "`nDone. Package synced to:`n  $OneDriveRoot"
Start-Process $indexPath
