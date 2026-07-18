param(
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

try {
    $projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
    $statePath = Join-Path $PSScriptRoot '.viewer-server.json'
    $viewerUrl = $null

    if (Test-Path -LiteralPath $statePath) {
        try {
            $state = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
            $process = Get-Process -Id $state.pid -ErrorAction Stop
            $response = Invoke-WebRequest -Uri $state.url -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200 -and $response.Content -match 'Plano maestro 3D') {
                $viewerUrl = $state.url
            }
        }
        catch {
            $viewerUrl = $null
        }
    }

    if (-not $viewerUrl) {
        $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
        if (-not $pythonCommand) {
            $pythonCommand = Get-Command py -ErrorAction SilentlyContinue
        }
        if (-not $pythonCommand) {
            throw 'No se encontró Python. Instalá Python 3 o abrí la carpeta con la extensión Live Server de VS Code.'
        }

        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
        $listener.Start()
        $port = ([System.Net.IPEndPoint]$listener.LocalEndpoint).Port
        $listener.Stop()

        $arguments = @('-m', 'http.server', "$port", '--bind', '127.0.0.1', '--directory', $projectRoot)
        $server = Start-Process -FilePath $pythonCommand.Source -ArgumentList $arguments -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru
        $viewerUrl = "http://127.0.0.1:$port/viewer/"

        $ready = $false
        for ($attempt = 0; $attempt -lt 30; $attempt++) {
            Start-Sleep -Milliseconds 200
            try {
                $response = Invoke-WebRequest -Uri $viewerUrl -UseBasicParsing -TimeoutSec 1
                if ($response.StatusCode -eq 200 -and $response.Content -match 'Plano maestro 3D') {
                    $ready = $true
                    break
                }
            }
            catch {
                # El servidor puede tardar unos instantes en iniciar.
            }
        }

        if (-not $ready) {
            Stop-Process -Id $server.Id -ErrorAction SilentlyContinue
            throw 'El servidor local no respondió a tiempo.'
        }

        @{
            pid = $server.Id
            port = $port
            url = $viewerUrl
            projectRoot = $projectRoot
        } | ConvertTo-Json | Set-Content -LiteralPath $statePath -Encoding UTF8
    }

    if (-not $NoBrowser) {
        Start-Process $viewerUrl
    }
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
