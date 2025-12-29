
#!/bin/bash

# This script must be run on your LOCAL COMPUTER, not in natively.dev
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME

if [ "$#" -ne 2 ]; then
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME"
    exit 1
fi

USERNAME=$1
REPO=$2

echo "Initializing Git repository..."
git init

echo "Adding all files..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit from natively.dev - Easy Cash App"

echo "Adding remote repository..."
git remote add origin "https://github.com/$USERNAME/$REPO.git"

echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Your code is now on GitHub at https://github.com/$USERNAME/$REPO"
