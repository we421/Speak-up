#!/bin/bash

echo "🚀 دليل نشر English Flow على Vercel"
echo ""
echo "=========================================="
echo ""

echo "📝 الخطوة 1: تأكد من وجود Git"
git --version
if [ $? -ne 0 ]; then
    echo "❌ Git غير مثبت. يرجى تثبيته أولاً"
    exit 1
fi

echo ""
echo "✅ Git مثبت"
echo ""

echo "📝 الخطوة 2: تهيئة Git Repository"
git init
git add .
git commit -m "Initial commit - English Flow App"
git branch -M main
echo "✅ تم تهيئة Git"
echo ""

echo "📝 الخطوة 3: إنشاء مستودع على GitHub"
echo ""
echo "الرجاء اتباع هذه الخطوات:"
echo "1. اذهب إلى: https://github.com/new"
echo "2. اسم المستودع: english-flow"
echo "3. اجعله Public"
echo "4. انقر 'Create repository'"
echo ""
echo "بعد الإنشاء، انسخ رابط المستودع وألصقه هنا:"
read REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ لم يتم إدخال رابط المستودع"
    exit 1
fi

echo ""
echo "📝 الخطوة 4: رفع الكود إلى GitHub"
git remote add origin $REPO_URL
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ تم رفع الكود بنجاح!"
    echo ""
    echo "📝 الخطوة 5: النشر على Vercel"
    echo ""
    echo "الرجاء اتباع هذه الخطوات:"
    echo "1. اذهب إلى: https://vercel.com"
    echo "2. سجل حساب (مجاني)"
    echo "3. انقر 'Add New Project'"
    echo "4. اختر مستودع 'english-flow' من GitHub"
    echo "5. انقر 'Import'"
    echo "6. انقر 'Deploy'"
    echo ""
    echo "⏳ انتظر دقيقة أو دقيقتين..."
    echo ""
    echo "✅ بعد النشر، ستحصل على رابط مثل:"
    echo "   https://english-flow.vercel.app"
    echo ""
    echo "📱 الخطوة 6: تثبيت التطبيق على الهاتف"
    echo ""
    echo "على Android:"
    echo "1. افتح Chrome"
    echo "2. اكتب الرابط من Vercel"
    echo "3. اضغط 'Add to Home Screen'"
    echo ""
    echo "على iPhone:"
    echo "1. افتح Safari"
    echo "2. اكتب الرابط من Vercel"
    echo "3. اضغط زر المشاركة ↑"
    echo "4. اختر 'Add to Home Screen'"
    echo ""
    echo "🎉 تم! التطبيق على هاتفك!"
else
    echo ""
    echo "❌ فشل رفع الكود"
    echo ""
    echo "الرجاء التأكد من:"
    echo "1. رابط المستودع صحيح"
    echo "2. قمت بمصادقة GitHub"
    echo "3. لديك صلاحيات الرفع"
fi
