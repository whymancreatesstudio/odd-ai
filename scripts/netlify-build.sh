#!/bin/bash

# Netlify Build Script
echo "🚀 Starting Netlify build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
    echo "📁 Build output: $(pwd)/dist"
    ls -la dist/
else
    echo "❌ Frontend build failed!"
    exit 1
fi 