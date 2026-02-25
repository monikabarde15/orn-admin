#!/bin/bash

# LOCAL VISIBLE BROWSER TESTING SCRIPT
# Run this on your LOCAL MACHINE (not in dev container)

echo "🚀 STARTING VISIBLE BROWSER SELENIUM TESTING"
echo "=============================================="
echo ""
echo "🎯 This will:"
echo "   ✅ Open Chrome browser automatically"
echo "   👀 Let you watch testing happen live"
echo "   🤖 Test: signup → login → labs → courses → wallet → checkout → profile"
echo ""
echo "⏰ Expected time: 20-30 seconds"
echo ""

# Check if we're on a local machine with display
if [ -z "$DISPLAY" ] && [ -z "$WAYLAND_DISPLAY" ]; then
    echo "❌ ERROR: No display detected!"
    echo "💡 This script must be run on your LOCAL MACHINE, not in a dev container."
    echo ""
    echo "📋 How to run visible browser testing:"
    echo "   1. Open terminal on your local machine"
    echo "   2. Navigate to your project folder"
    echo "   3. Run: npm run selenium:visible"
    echo ""
    echo "🎭 You'll see Chrome open and automatically test your entire application!"
    exit 1
fi

echo "✅ Display detected - proceeding with visible browser testing..."
echo ""

# Run the visible browser test
npm run selenium:visible

echo ""
echo "🎉 Testing complete! Chrome browser showed you the full user journey."