$statePath = Join-Path $PSScriptRoot '.viewer-server.json'

if (Test-Path -LiteralPath $statePath) {
    try {
        $state = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
        Stop-Process -Id $state.pid -ErrorAction SilentlyContinue
    }
    finally {
        Remove-Item -LiteralPath $statePath -Force -ErrorAction SilentlyContinue
    }
}

