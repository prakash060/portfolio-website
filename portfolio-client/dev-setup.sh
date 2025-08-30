#!/bin/bash

echo "========================================"
echo "  Portfolio Client - Development Setup"
echo "========================================"
echo ""
echo "This script will help you get started with development."
echo ""

# Navigate to portfolio-client folder
echo "1. Navigating to portfolio-client folder..."
cd portfolio-client
echo ""

# Check if dependencies are installed
echo "2. Checking if dependencies are installed..."
if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Installing now..."
    npm install
    echo ""
else
    echo "Dependencies already installed."
    echo ""
fi

# Start development server
echo "3. Starting development server..."
echo ""
echo "The application will open at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
