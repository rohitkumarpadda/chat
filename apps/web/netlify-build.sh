#!/bin/bash

# Build script for Netlify deployment
set -e

echo "📦 Installing dependencies from monorepo root..."
cd ../..
yarn install --frozen-lockfile

echo "🔨 Building web application with Turbo..."
yarn turbo run build --filter=cipherchat-web

echo "✅ Build completed successfully!"
