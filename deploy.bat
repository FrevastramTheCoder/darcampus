@echo off
echo ========================================
echo   DEPLOYING NYUMBA SALAMA
echo ========================================

echo.
echo [1/2] Starting Backend...
cd nyumba-salama-backend
start "Nyumba Backend" cmd /k "npm install && npm start"
cd ..

echo [2/2] Starting Frontend...
cd nyumbasalama-frontend
start "Nyumba Frontend" cmd /k "npm install && npm start"
cd ..

echo.
echo ========================================
echo   ✅ DEPLOYMENT STARTED!
echo   📱 Frontend: http://localhost:3000
echo   🔧 Backend: http://localhost:5000
echo ========================================
echo.
echo Press any key to close this window...
pause > nul
