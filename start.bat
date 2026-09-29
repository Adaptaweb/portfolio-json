@echo off
setlocal
chcp 65001 >nul
title Portafolio - servidor local
cd /d "%~dp0"

set PORT=4321
if not "%~1"=="" set PORT=%~1

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No se encontró Node.js. Instálalo desde https://nodejs.org ^(versión 22.12 o superior^).
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando dependencias por primera vez...
  call npm install
  if errorlevel 1 (
    echo [ERROR] Falló npm install.
    pause
    exit /b 1
  )
)

echo.
echo  Portafolio en modo desarrollo (se recarga solo al guardar cambios)
echo  -----------------------------------------------------------------
echo   En este PC:      http://localhost:%PORT%/
echo   En la red local:
powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL' -and $_.IPAddress -notlike '169.254.*' } | ForEach-Object { '                    http://' + $_.IPAddress + ':%PORT%/' }"
echo.
echo   Si otro equipo no conecta, permite Node.js en el Firewall de Windows (red privada).
echo   Si el puerto está ocupado, Astro usará el siguiente libre: revisa la URL que muestra abajo.
echo   Para detener el servidor: Ctrl + C
echo.

call npm run dev -- --host --port %PORT%

endlocal
