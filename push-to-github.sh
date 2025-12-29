
#!/bin/bash

# Easy Cash App - GitHub Migration Script
# This script must be run on your LOCAL COMPUTER, not in natively.dev
# 
# INSTRUCTIONS:
# 1. Download your entire project from natively.dev
# 2. Open Terminal (Mac/Linux) or Git Bash (Windows)
# 3. Navigate to your project folder: cd path/to/your/project
# 4. Make this script executable: chmod +x push-to-github.sh
# 5. Run this script: ./push-to-github.sh
#
# Make sure you have Git installed and are logged into GitHub

echo "🚀 Starting GitHub migration for Easy Cash App..."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed. Please install Git first."
    echo "   Visit: https://git-scm.com/downloads"
    exit 1
fi

# Initialize Git repository
echo "📦 Initializing Git repository..."
git init

# Add all files
echo "📝 Adding all files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit - Easy Cash App"

# Rename branch to main
echo "🔄 Renaming branch to main..."
git branch -M main

# Add remote repository
echo "🔗 Adding GitHub remote repository..."
git remote add origin https://github.com/EasyApp66/DEIN-REPO-NAME.git

echo ""
echo "⚠️  IMPORTANT: Replace 'DEIN-REPO-NAME' with your actual repository name!"
echo "   You can do this by running:"
echo "   git remote set-url origin https://github.com/EasyApp66/YOUR-ACTUAL-REPO-NAME.git"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your code should now be on GitHub!"
echo "   Visit: https://github.com/EasyApp66/DEIN-REPO-NAME"
echo ""
