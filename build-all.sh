#!/bin/bash
# Build script for Free Calorie Track (Main App + Blog)
# This script builds both the main app and the blog, then combines them

set -e  # Exit on error

echo "🚀 Building Free Calorie Track (Main App + Blog)..."

# Build main app
echo "📦 Building main app (calorie-tracker)..."
cd calorie-tracker
npm install
npm run build
cd ..

# Build blog
echo "📝 Building blog (blog-astro)..."
cd blog-astro
npm install
npm run build
cd ..

# Copy blog output into main app dist
echo "🔗 Combining outputs..."
rm -rf calorie-tracker/dist/blog
mkdir -p calorie-tracker/dist/blog

# Copy blog articles and index from the nested blog directory
if [ -d "blog-astro/dist/blog" ]; then
  cp -r blog-astro/dist/blog/* calorie-tracker/dist/blog/
fi

# Copy landing pages to root of dist
echo "📄 Copying landing pages..."
if [ -d "blog-astro/dist/protein-tracker" ]; then
  cp -r blog-astro/dist/protein-tracker calorie-tracker/dist/
fi
if [ -d "blog-astro/dist/macro-tracker" ]; then
  cp -r blog-astro/dist/macro-tracker calorie-tracker/dist/
fi

# Copy static assets (_astro directory)
if [ -d "blog-astro/dist/_astro" ]; then
  cp -r blog-astro/dist/_astro calorie-tracker/dist/
fi

# Copy blog images to main app dist
echo "🖼️  Copying blog images..."
mkdir -p calorie-tracker/dist/images/blog
if [ -d "blog-astro/public/images/blog" ]; then
  cp -r blog-astro/public/images/blog/* calorie-tracker/dist/images/blog/
fi

echo "✅ Build complete! Output in calorie-tracker/dist"
echo "   - Main app: /calorie-tracker/dist"
echo "   - Blog: /calorie-tracker/dist/blog"
echo "   - Landing pages: /calorie-tracker/dist/protein-tracker, /macro-tracker"
