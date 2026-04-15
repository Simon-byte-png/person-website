[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$slugPattern = "^[a-z0-9]+(?:-[a-z0-9]+)*$"

function New-UnicodeString {
  param([int[]]$CodePoints)
  return -join ($CodePoints | ForEach-Object { [char]$_ })
}

function Get-FrontmatterValue {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Frontmatter,
    [Parameter(Mandatory = $true)]
    [string]$Key
  )

  $pattern = "(?m)^\s*{0}\s*:\s*(.+?)\s*$" -f [regex]::Escape($Key)
  $match = [regex]::Match($Frontmatter, $pattern)
  if (-not $match.Success) {
    return $null
  }

  $value = $match.Groups[1].Value.Trim()
  if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
    $value = $value.Substring(1, $value.Length - 2)
  }
  return $value.Trim()
}

function Sync-NotesBySlug {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Source,
    [Parameter(Mandatory = $true)]
    [string]$Target
  )

  if (-not (Test-Path -LiteralPath $Source)) {
    Write-Warning "Source not found, skip: $Source"
    return
  }

  if (-not (Test-Path -LiteralPath $Target)) {
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
  }

  $files = Get-ChildItem -LiteralPath $Source -File -Filter *.md -Recurse
  if ($files.Count -eq 0) {
    Write-Host "  no markdown files found under: $Source"
    return
  }

  $seenSlugs = @{}

  foreach ($file in $files) {
    $raw = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
    $frontmatterMatch = [regex]::Match($raw, "(?s)^---\r?\n(?<front>.*?)\r?\n---\r?\n")

    if (-not $frontmatterMatch.Success) {
      Write-Warning "Skip (missing frontmatter): $($file.FullName)"
      continue
    }

    $frontmatter = $frontmatterMatch.Groups["front"].Value
    $slug = Get-FrontmatterValue -Frontmatter $frontmatter -Key "slug"

    if ([string]::IsNullOrWhiteSpace($slug)) {
      Write-Warning "Skip (missing slug): $($file.FullName)"
      continue
    }

    if ($slug -notmatch $slugPattern) {
      Write-Warning "Skip (invalid slug, use kebab-case): $($file.FullName) -> $slug"
      continue
    }

    if ($seenSlugs.ContainsKey($slug)) {
      Write-Warning "Skip (duplicate slug in same category): $($file.FullName) -> $slug"
      continue
    }
    $seenSlugs[$slug] = $true

    $targetPath = Join-Path $Target "$slug.md"
    Set-Content -LiteralPath $targetPath -Value $raw -Encoding UTF8
    Write-Host "  synced: $($file.Name) -> $(Split-Path -Leaf $targetPath)"
  }
}

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $repoRoot

if (-not (Test-Path -LiteralPath (Join-Path $repoRoot ".git"))) {
  throw "Current directory is not a git repository: $repoRoot"
}

$vaultRoot = Join-Path $env:USERPROFILE "Documents\Obsidian Vault"
$techDir = New-UnicodeString @(0x6280, 0x672F, 0x7B14, 0x8BB0)
$businessDir = New-UnicodeString @(0x5546, 0x4E1A, 0x7B14, 0x8BB0)
$artDir = New-UnicodeString @(0x6587, 0x827A, 0x7B14, 0x8BB0)
$journeyDir = New-UnicodeString @(0x4E00, 0x8DEF, 0x8D70, 0x6765)

$mappings = @(
  @{
    Source = Join-Path $vaultRoot $techDir
    Target = (Join-Path $repoRoot "content\notes\tech")
  },
  @{
    Source = Join-Path $vaultRoot $businessDir
    Target = (Join-Path $repoRoot "content\notes\business")
  },
  @{
    Source = Join-Path $vaultRoot $artDir
    Target = (Join-Path $repoRoot "content\notes\art")
  },
  @{
    Source = Join-Path $vaultRoot $journeyDir
    Target = (Join-Path $repoRoot "content\notes\journey")
  }
)

Write-Host "==> Start syncing Obsidian notes with slug guard..."
foreach ($mapping in $mappings) {
  Write-Host ("Sync: {0} -> {1}" -f $mapping.Source, $mapping.Target)
  Sync-NotesBySlug -Source $mapping.Source -Target $mapping.Target
}

Write-Host "==> Sync done. Preparing git commit..."
& git add content/notes
if ($LASTEXITCODE -ne 0) {
  throw "git add failed."
}

& git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No markdown changes detected. Nothing to commit."
  exit 0
}

& git commit -m "notes: sync from obsidian"
if ($LASTEXITCODE -ne 0) {
  throw "git commit failed."
}

& git push origin main
if ($LASTEXITCODE -ne 0) {
  throw "git push failed."
}

Write-Host "==> Done. Notes pushed to main. GitHub Actions will deploy automatically."
