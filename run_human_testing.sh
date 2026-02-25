#!/bin/bash

echo "========================================"
echo "🤖 HUMAN-LIKE SELENIUM TESTING STARTED"
echo "========================================"
echo ""
echo "🚀 Chrome browser will open automatically on your screen!"
echo "👀 WATCH the automated testing happen in real-time!"
echo ""
echo "📋 Test Coverage:"
echo "   ✅ Site Health Check"
echo "   ✅ User Signup"
echo "   ✅ User Login"
echo "   ✅ Labs Creation & Progress"
echo "   ✅ Courses & Learning"
echo "   ✅ Wallet & Balance"
echo "   ✅ Checkout Process"
echo "   ✅ Profile Management"
echo "   ✅ Logout"
echo ""
echo "⏱️  Duration: ~3-5 minutes"
echo ""

# Navigate to the script directory
cd "$(dirname "$0")"

# Run the human-like testing
npm run selenium:human

echo ""
echo "========================================"
echo "🎉 HUMAN-LIKE TESTING COMPLETED"
echo "========================================"