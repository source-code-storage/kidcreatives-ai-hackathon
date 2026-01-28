# KidCreatives AI - Install Dependencies
# Run this script from Windows PowerShell

Write-Host "Installing dependencies for KidCreatives AI..." -ForegroundColor Green

# Navigate to project directory
Set-Location -Path $PSScriptRoot

# Install dependencies
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDependencies installed successfully! ✅" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Copy .env.example to .env and add your API keys"
    Write-Host "2. Run 'npm run dev' to start the development server"
} else {
    Write-Host "`nInstallation failed. Please check the error messages above." -ForegroundColor Red
}
