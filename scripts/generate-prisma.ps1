Set-Location -Path $PSScriptRoot\..
$env:PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = "1"
$env:PRISMA_QUERY_ENGINE_LIBRARY = (Resolve-Path "node_modules\@prisma\engines\query_engine-windows.dll.node").Path
npx prisma generate
