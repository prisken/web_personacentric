#!/bin/bash
set -e

echo "Starting build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install

# Build the client
echo "Building client..."
npm run build

echo "Build completed successfully!"
