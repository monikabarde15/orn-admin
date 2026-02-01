#!/bin/bash
# Quick Selenium Test Runner for OnrequestReactJS
# This ensures proper setup for ultra-fast Selenium testing

echo "🚀 OnrequestReactJS Ultra-Fast Selenium Test Runner"
echo "=================================================="

# Check if dev server is running
if curl -s --max-time 2 http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Vite dev server is running on port 3000"
else
    echo "❌ Vite dev server not detected on port 3000"
    echo ""
    echo "🔧 To start the correct server for Selenium testing:"
    echo "   npm run dev"
    echo ""
    echo "⚠️  IMPORTANT: Do NOT use 'serve -s build -l 3000'"
    echo "   That serves static files without React functionality!"
    echo ""
    exit 1
fi

echo ""
echo "🧪 Running Ultra-Fast Selenium Tests..."
echo "⏱️  Expected completion: < 30 seconds"
echo ""

# Run the tests
npm run selenium:test

exit_code=$?
echo ""
echo "=================================================="

if [ $exit_code -eq 0 ]; then
    echo "✅ All Selenium tests passed!"
else
    echo "❌ Some Selenium tests failed. Check the report above."
fi

exit $exit_code