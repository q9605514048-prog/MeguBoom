$ErrorActionPreference = 'Stop'
$distPath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\dist'))
$installers = @(Get-ChildItem -LiteralPath $distPath -File | Where-Object { $_.Name -match '^MeguBoom-Setup-(\d+\.\d+\.\d+)\.exe$' } | Sort-Object { [version]($_.BaseName -replace '^MeguBoom-Setup-', '') } -Descending)
if ($installers.Count -lt 2) { exit 0 }
$keepVersions = @($installers | Select-Object -First 2 | ForEach-Object { $_.BaseName -replace '^MeguBoom-Setup-', '' })
foreach ($artifact in Get-ChildItem -LiteralPath $distPath -File) {
    if ($artifact.Name -match '^MeguBoom-Setup-(\d+\.\d+\.\d+)\.exe(?:\.blockmap)?$') {
        if ($Matches[1] -notin $keepVersions) {
            Remove-Item -LiteralPath $artifact.FullName
            Write-Output "Removed $($artifact.Name)"
        }
    }
}
Write-Output "Kept versions: $($keepVersions -join ', ')"
