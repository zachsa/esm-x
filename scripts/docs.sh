#!/bin/bash

# Extract the current version from package.json
CURRENT_VERSION=$(cat package.json | grep '"version"' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

# Use awk to increment the patch version
NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{printf("%d.%d.%d", $1, $2, $3+1)}')

# Update README.md
sed -i.bak "s/@zachsa\/esm-x@[0-9]*\.[0-9]*\.[0-9]*\/dist/@zachsa\/esm-x@$NEW_VERSION\/dist/g" README.md

# Remove the backup file
rm -f README.md.bak

# Add and commit the changes to README.md
git add README.md
git commit --amend --no-edit --no-verify
