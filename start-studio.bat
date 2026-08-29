@echo off
REM AI Design Studio - Start local servers
REM Jalankan ini dobel-klik, lalu buka dashboard di browser:
REM   http://localhost:9000/Dashboard Design Studio V2.html
REM   http://localhost:8000/index.html  (landing page)

cd /d "%~dp0"
echo Starting order bridge (port 7000)...
start "ADS-Bridge" python server.py

echo Starting file server (port 9000)...
cd /d "%~dp0.."
start "ADS-Files" python -m http.server 9000

echo Starting landing page server (port 8000)...
cd /d "%~dp0"
start "ADS-Landing" python -m http.server 8000

echo.
echo Servers started. Open:
echo   Dashboard : http://localhost:9000/Dashboard Design Studio V2.html
echo   Landing   : http://localhost:8000/index.html
echo.
echo Keep this window open. Close it to stop all servers.
pause
