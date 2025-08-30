# Portfolio Client - Development Setup Script
# Run this script to quickly start development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Portfolio Client - Development Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will help you get started with development." -ForegroundColor Yellow
Write-Host ""

# Navigate to portfolio-client folder
Write-Host "1. Navigating to portfolio-client folder..." -ForegroundColor Green
Set-Location "portfolio-client"
Write-Host ""

# Check if dependencies are installed
Write-Host "2. Checking if dependencies are installed..." -ForegroundColor Green
if (-not (Test-Path "node_modules")) {
    Write-Host "Dependencies not found. Installing now..." -ForegroundColor Yellow
    npm install
    Write-Host ""
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
    Write-Host ""
}

# Start development server
Write-Host "3. Starting development server..." -ForegroundColor Green
Write-Host ""
Write-Host "The application will open at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm start
