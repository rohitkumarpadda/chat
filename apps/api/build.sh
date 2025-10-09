#!/usr/bin/env bash
# Render build script for the backend API

# Exit on error
set -o errexit

# Install dependencies
echo "Installing dependencies..."
yarn install

# Build the API
echo "Building API..."
yarn build

echo "Build completed successfully!"
