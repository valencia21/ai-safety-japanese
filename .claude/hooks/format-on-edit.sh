#!/bin/bash

# Claude Code post-edit formatting hook
# Automatically formats files after Edit/MultiEdit/Write operations

set -e  # Exit on error

# Get the file path from Claude Code
FILE_PATH="$1"

# Exit if no file path provided
if [ -z "$FILE_PATH" ]; then
    echo "No file path provided to format-on-edit hook"
    exit 0
fi

# Exit if file doesn't exist
if [ ! -f "$FILE_PATH" ]; then
    echo "File does not exist: $FILE_PATH"
    exit 0
fi

# Get file extension
EXTENSION="${FILE_PATH##*.}"

# Normalize extension to lowercase
EXTENSION=$(echo "$EXTENSION" | tr '[:upper:]' '[:lower:]')

echo "🎨 Auto-formatting: $FILE_PATH"

case "$EXTENSION" in
    ts|tsx|js|jsx)
        echo "📝 Running ESLint --fix for TypeScript/JavaScript file..."

        # Run ESLint with --fix and capture both stdout and stderr
        ESLINT_OUTPUT=$(npx eslint --fix "$FILE_PATH" 2>&1)
        ESLINT_EXIT_CODE=$?

        if [ $ESLINT_EXIT_CODE -eq 0 ]; then
            echo "✅ TypeScript/JavaScript formatting completed successfully"
        else
            echo "⚠️  ESLint found issues that couldn't be auto-fixed:"
            echo "$ESLINT_OUTPUT"
            echo "💡 Some errors may require manual intervention"
        fi

        # Always run a final check to show remaining issues
        echo "🔍 Checking for remaining linting issues..."
        FINAL_CHECK=$(npx eslint "$FILE_PATH" 2>&1)
        FINAL_EXIT_CODE=$?

        if [ $FINAL_EXIT_CODE -eq 0 ]; then
            echo "✅ No remaining ESLint issues"
        else
            echo "📋 Remaining issues to address manually:"
            echo "$FINAL_CHECK"
        fi
        ;;
    md|markdown)
        echo "📄 Running Prettier for Markdown file..."
        if npx prettier --write "$FILE_PATH" 2>/dev/null; then
            echo "✅ Markdown formatting completed"
        else
            echo "⚠️  Prettier formatting failed (non-critical)"
        fi
        ;;
    json)
        echo "📋 Running Prettier for JSON file..."
        if npx prettier --write "$FILE_PATH" 2>/dev/null; then
            echo "✅ JSON formatting completed"
        else
            echo "⚠️  Prettier formatting failed (non-critical)"
        fi
        ;;
    *)
        echo "ℹ️  Skipping formatting for .$EXTENSION files"
        ;;
esac

echo "🎨 Auto-formatting completed for: $FILE_PATH"