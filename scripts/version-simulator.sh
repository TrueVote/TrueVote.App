#!/bin/bash

# Save current version
cp public/version.json public/version.json.bak

# Wait for 5 seconds
echo "Current version:"
cat public/version.json
echo "\nModifying version in 5 seconds..."
sleep 5

# Modify version
sed -i 's/"LastTag": ".*"/"LastTag": "9.9.9"/' public/version.json
echo "Version modified to 9.9.9. Check your browser for the notification."

# Wait for testing
read -p "Press enter to restore original version..."

# Restore original version
mv public/version.json.bak public/version.json
echo "Original version restored."