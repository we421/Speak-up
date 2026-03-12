#!/bin/bash

# SpeakUp Auto-Deploy Script for Vercel
# This script will deploy your app to Vercel automatically

echo "🚀 SpeakUp Auto-Deploy Script"
echo "============================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found!"
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo ""
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
echo ""

vercel --prod --yes

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment Successful!"
    echo ""
    echo "🎉 Your app is now live!"
    echo ""
    echo "📱 Next Steps:"
    echo "1. Open the URL shown above"
    echo "2. Initialize curriculum: /api/curriculum?action=initialize"
    echo "3. Test all features"
    echo ""
    echo "📊 Check your Vercel dashboard at: https://vercel.com/dashboard"
else
    echo ""
    echo "❌ Deployment Failed!"
    echo ""
    echo "Please check the error messages above and try again."
    echo "If you need help, let me know!"
    exit 1
fi
