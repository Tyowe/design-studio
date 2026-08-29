@echo off
REM ============================================================
REM  AI Design Studio - Start Local Server (SATU port, no CORS)
REM ============================================================
REM  1. Dobel-klik file ini
REM  2. Biarkan window terminal terbuka
REM  3. Buka di browser:
REM       Dashboard : http://localhost:7000/dashboard
REM       Landing   : http://localhost:7000/
REM
REM  Login dashboard:
REM     Email : admin@studio.local
REM     Pass  : studio123
REM
REM  UNTUK BERHENTI: tutup window terminal ini (Ctrl+C)
REM ============================================================

cd /d "%~dp0"
echo.
echo  AI Design Studio server jalan di http://localhost:7000
echo  Dashboard: http://localhost:7000/dashboard
echo.
python server.py
pause
