@echo off

REM LOCAL VISIBLE BROWSER TESTING SCRIPT FOR WINDOWS
REM Run this on your LOCAL MACHINE (not in dev container)

echo 🚀 STARTING VISIBLE BROWSER SELENIUM TESTING
echo ==============================================
echo.
echo 🎯 This will:
echo    ✅ Open Chrome browser automatically
echo    👀 Let you watch testing happen live
echo    🤖 Test: signup → login → labs → courses → wallet → checkout → profile
echo.
echo ⏰ Expected time: 20-30 seconds
echo.

REM Check if Chrome is available
where chrome >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Chrome browser not found!
    echo 💡 Please install Google Chrome to run visible browser testing.
    echo.
    echo 📋 How to run visible browser testing:
    echo    1. Install Google Chrome from: https://www.google.com/chrome/
    echo    2. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Chrome detected - proceeding with visible browser testing...
echo.

REM Run the visible browser test
npm run selenium:visible

echo.
echo 🎉 Testing complete! Chrome browser showed you the full user journey.
pause