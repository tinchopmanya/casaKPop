@echo off
setlocal
title Casa de Munecas Modular
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0abrir-visor.ps1"
if errorlevel 1 (
  echo.
  echo No se pudo abrir el visor. Revisa el mensaje anterior.
  pause
)
endlocal

