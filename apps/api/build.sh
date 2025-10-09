#!/usr/bin/env bash
# Render build script for the backend API

# Exit on error
set -o errexit

# Install dependencies from root
echo "Installing dependencies..."
cd ../..
yarn install --frozen-lockfile

# Build the API
echo "Building API..."
yarn workspace cipherchat-api build

echo "Build completed successfully!"
