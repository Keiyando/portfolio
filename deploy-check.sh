#!/bin/bash

# Deploy Check Script for Portfolio Site
# デプロイ前チェック用スクリプト

set -e  # エラー時に停止

echo "🚀 デプロイ前チェックを開始します..."

# 1. 必要なファイルの存在確認
echo "📁 必要なファイルの確認..."
required_files=("index.html" "manifest.json" "robots.txt" "sw.js")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ エラー: $file が見つかりません"
        exit 1
    fi
    echo "✅ $file 確認完了"
done

# 2. HTMLファイルの基本構造確認
echo "🔍 HTML構造の確認..."
if ! grep -q "<!DOCTYPE html>" index.html; then
    echo "❌ エラー: DOCTYPE宣言が見つかりません"
    exit 1
fi

if ! grep -q '<html lang="ja">' index.html; then
    echo "❌ エラー: html lang属性が見つかりません"
    exit 1
fi

if ! grep -q '<meta charset="UTF-8">' index.html; then
    echo "❌ エラー: 文字コード指定が見つかりません"
    exit 1
fi

echo "✅ HTML構造チェック完了"

# 3. CSSファイルの存在確認
echo "🎨 CSSファイルの確認..."
css_files=("css/style.css" "css/responsive.css" "css/animations.css" "css/critical.css")
for css_file in "${css_files[@]}"; do
    if [ ! -f "$css_file" ]; then
        echo "❌ エラー: $css_file が見つかりません"
        exit 1
    fi
    echo "✅ $css_file 確認完了"
done

# 4. JavaScriptファイルの確認
echo "⚡ JavaScriptファイルの確認..."
js_files=("js/main.js")
for js_file in "${js_files[@]}"; do
    if [ ! -f "$js_file" ]; then
        echo "❌ エラー: $js_file が見つかりません"
        exit 1
    fi
    echo "✅ $js_file 確認完了"
done

# 5. 画像ファイルの存在確認（基本的なもの）
echo "🖼️  重要画像ファイルの確認..."
if [ ! -d "assets/images" ]; then
    echo "❌ エラー: assets/images ディレクトリが見つかりません"
    exit 1
fi
echo "✅ 画像ディレクトリ確認完了"

# 6. JSONデータファイルの確認
echo "📊 データファイルの確認..."
data_files=("data/projects.json" "data/skills.json")
for data_file in "${data_files[@]}"; do
    if [ ! -f "$data_file" ]; then
        echo "❌ エラー: $data_file が見つかりません"
        exit 1
    fi
    
    # JSONの妥当性確認
    if ! python3 -c "import json; json.load(open('$data_file'))" 2>/dev/null; then
        echo "❌ エラー: $data_file のJSON形式が不正です"
        exit 1
    fi
    echo "✅ $data_file 確認完了"
done

# 7. Service Workerの確認
echo "🔧 Service Worker確認..."
if grep -q "navigator.serviceWorker" index.html || grep -q "navigator.serviceWorker" js/main.js; then
    if [ ! -f "sw.js" ]; then
        echo "❌ エラー: Service Workerが参照されていますが、sw.js が見つかりません"
        exit 1
    fi
    echo "✅ Service Worker設定確認完了"
fi

# 8. PWA Manifestの確認
echo "📱 PWA Manifest確認..."
if ! python3 -c "import json; json.load(open('manifest.json'))" 2>/dev/null; then
    echo "❌ エラー: manifest.json の形式が不正です"
    exit 1
fi
echo "✅ PWA Manifest確認完了"

# 9. ファイルサイズチェック
echo "📏 ファイルサイズチェック..."
large_files=$(find . -name "*.js" -o -name "*.css" -o -name "*.html" | xargs ls -la | awk '{if ($5 > 100000) print $9 " (" $5 " bytes)"}')
if [ ! -z "$large_files" ]; then
    echo "⚠️  警告: 大きなファイルが検出されました:"
    echo "$large_files"
    echo "パフォーマンスに影響する可能性があります"
fi

# 10. vercel.json設定確認
echo "⚙️  Vercel設定確認..."
if [ ! -f "vercel.json" ]; then
    echo "❌ エラー: vercel.json が見つかりません"
    exit 1
fi

if ! python3 -c "import json; json.load(open('vercel.json'))" 2>/dev/null; then
    echo "❌ エラー: vercel.json の形式が不正です"
    exit 1
fi
echo "✅ Vercel設定確認完了"

echo ""
echo "🎉 すべてのチェックが完了しました！"
echo "✨ デプロイの準備ができています"
echo ""
echo "次のステップ:"
echo "1. git add ."
echo "2. git commit -m \"Deploy: Portfolio site to Vercel\""
echo "3. git push origin main"
echo "4. Vercelでリポジトリをインポート"
echo ""