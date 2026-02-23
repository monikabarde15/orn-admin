@echo off
echo ========================================
echo 🤖 HUMAN-LIKE SELENIUM TESTING STARTED
echo ========================================
echo.
echo 🚀 Chrome browser will open automatically on your screen!
echo 👀 WATCH the automated testing happen in real-time!
echo.
echo 📋 Test Coverage:
echo    ✅ Site Health Check
echo    ✅ User Signup
echo    ✅ User Login
echo    ✅ Labs Creation & Progress
echo    ✅ Courses & Learning
echo    ✅ Wallet & Balance
echo    ✅ Checkout Process
echo    ✅ Profile Management
echo    ✅ Logout
echo.
echo ⏱️  Duration: ~3-5 minutes
echo.
cd /d "%~dp0"
npm run selenium:human
echo.
echo ========================================
echo 🎉 HUMAN-LIKE TESTING COMPLETED
echo ========================================
pause