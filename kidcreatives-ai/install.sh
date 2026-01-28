#!/bin/bash
# KidCreatives AI - Install Dependencies
# Alternative install script for bash

echo "Installing dependencies for KidCreatives AI..."

# Try to install with npm
if command -v npm &> /dev/null; then
    npm install
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Dependencies installed successfully!"
        echo ""
        echo "Next steps:"
        echo "1. Copy .env.example to .env and add your API keys"
        echo "2. Run 'npm run dev' to start the development server"
    else
        echo "❌ Installation failed. See errors above."
    fi
else
    echo "❌ npm is not installed or not in PATH"
    echo ""
    echo "Please install Node.js and npm first:"
    echo "https://nodejs.org/"
fi
