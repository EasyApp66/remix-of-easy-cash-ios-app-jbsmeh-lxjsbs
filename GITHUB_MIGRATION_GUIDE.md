
# GitHub Migration Guide - Easy Cash App

## Prerequisites
- Git installed on your computer ([Download Git](https://git-scm.com/downloads))
- GitHub account (you have: EasyApp66)
- A repository created on GitHub

## Step-by-Step Instructions

### 1. Create a New Repository on GitHub
1. Go to [https://github.com/EasyApp66](https://github.com/EasyApp66)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., "easy-cash-app")
5. Choose "Private" or "Public"
6. **DO NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

### 2. Download Your Project from Natively
1. Download your entire project from natively.dev
2. Extract the files to a folder on your computer

### 3. Open Terminal/Command Prompt
- **Mac/Linux**: Open Terminal
- **Windows**: Open Git Bash (installed with Git)

### 4. Navigate to Your Project Folder
```bash
cd path/to/your/project
# Example: cd ~/Downloads/easy-cash-app
```

### 5. Run the Migration Commands

#### Option A: Use the Script (Recommended)
```bash
# Make the script executable
chmod +x push-to-github.sh

# Edit the script to replace DEIN-REPO-NAME with your actual repo name
# Then run it:
./push-to-github.sh
```

#### Option B: Run Commands Manually
```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Easy Cash App"

# Rename branch to main
git branch -M main

# Add your GitHub repository (REPLACE 'your-repo-name' with actual name!)
git remote add origin https://github.com/EasyApp66/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 6. Verify on GitHub
1. Go to your repository URL: `https://github.com/EasyApp66/your-repo-name`
2. You should see all your files there!

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/EasyApp66/your-repo-name.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: Authentication failed
You may need to use a Personal Access Token instead of your password:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with "repo" permissions
3. Use the token as your password when pushing

## Important Notes

- **Replace `DEIN-REPO-NAME`** with your actual repository name!
- The repository must exist on GitHub before pushing
- Make sure you're logged into GitHub on your computer
- If you have sensitive data (API keys, passwords), add them to `.gitignore` first

## Need Help?
- [GitHub Documentation](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
