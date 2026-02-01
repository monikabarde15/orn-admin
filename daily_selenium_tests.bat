REM IMPORTANT: Uses Vite dev server (npm run dev) for full React functionality
REM NOT the static build server (serve -s build -l 3000) - that won't work for Selenium tests

echo ========================================
echo FAST Daily Selenium Test Automation
echo OnrequestReactJS Application
echo ========================================
echo Started at: %DATE% %TIME%
echo.

REM Set environment variables
set NODE_ENV=test
set SELENIUM_BROWSER=chrome
set TEST_TIMEOUT=300000
set BASE_URL=http://localhost:3000

REM Change to project directory
cd /d "%~dp0\.."

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    goto :error
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed or not in PATH
    goto :error
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        goto :error
    )
)

REM Start the development server in background (ULTRA FAST mode)
echo 🚀 Starting Vite dev server on port 3000...
start /B npm run dev
timeout /t 5 /nobreak >nul

REM Ultra-fast server health check
echo 🔍 Checking server readiness...
curl -s --max-time 3 http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vite dev server failed to start on port 3000
    goto :error
)

echo ✅ Vite dev server ready on port 3000

REM Run ULTRA FAST Selenium browser tests only
echo 🌐 Running optimized Selenium browser tests...
npm run selenium:test
set SELENIUM_EXIT_CODE=%errorlevel%
npm list selenium-webdriver >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Selenium WebDriver...
    npm install --save-dev selenium-webdriver chromedriver
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Selenium dependencies
        goto :cleanup
    )
)

REM Run Selenium browser tests
echo 🌐 Running Selenium browser tests...
node tests/selenium_browser_test.js
set SELENIUM_EXIT_CODE=%errorlevel%

REM Generate test report summary
echo.
echo ========================================
echo Test Results Summary
echo ========================================
if %SELENIUM_EXIT_CODE% equ 0 (
    echo ✅ All tests passed successfully!
    echo.
    echo 📧 Sending success notification...
    REM Add email notification here if needed
) else (
    echo ❌ Some tests failed. Check the detailed report.
    echo.
    echo 📧 Sending failure notification...
    REM Add email notification here if needed
)

goto :cleanup

:error
echo ❌ Script failed with error
goto :cleanup

:cleanup
REM Stop the development server
echo 🛑 Stopping development server...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.cmd >nul 2>&1

echo.
echo ========================================
echo Daily Test Automation Complete
echo Finished at: %DATE% %TIME%
echo ========================================

REM Exit with Selenium test result code
exit /b %SELENIUM_EXIT_CODE%
