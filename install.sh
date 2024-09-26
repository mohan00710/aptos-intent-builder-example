#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Variables - Change these as needed
REPO_URL="https://github.com/aptos-labs/aptos-ts-sdk.git"
BRANCH="runtianz/intent_sdk"
PACKAGE_NAME="@aptos-labs/aptos-ts-sdk"

# Step 1: Clone the repository and checkout the specific branch
echo "Cloning the repository..."
git clone --branch "$BRANCH" "$REPO_URL"
cd aptos-ts-sdk

# Step 2: Install dependencies
echo "Installing dependencies..."
npm install

export NODE_OPTIONS=--max-old-space-size=4096

# Step 3: Build the package
echo "Building the package..."
npm run build

# Step 4: Pack the package into a tarball
echo "Packing the package..."
npm pack

# Step 5: Copy the packed file to the root directory
echo "Copying the package to the root directory..."
TARBALL=$(ls aptos-labs-ts-sdk-*.tgz)
cp $TARBALL ../

# Step 6: Go back to the root directory
cd ..

# Step 7: Install the copied package
echo "Installing the package..."
npm install ./$TARBALL

# Step 8: Clean up (optional)
echo "Cleaning up..."
rm -rf aptos-ts-sdk

echo "Package installed successfully!"