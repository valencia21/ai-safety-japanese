#!/usr/bin/env bash
# Screenshot a URL via Cloudflare Browser Rendering.
# Usage: ./screenshot.sh <url> [output.png]
# Reads CLOUDFLARE_API_TOKEN_BROWSER and CLOUDFLARE_ACCOUNT_ID_BROWSER from secrets.sh.

set -euo pipefail

URL="${1:-https://ai-2027.com/}"
OUT="${2:-/tmp/ai2027.png}"

source ~/sync/dotfiles/secrets.sh

curl -sS -f --output "$OUT" \
  -X POST "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID_BROWSER}/browser-rendering/screenshot" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN_BROWSER}" \
  -H "Content-Type: application/json" \
  --data @- <<JSON
{
  "url": "${URL}",
  "screenshotOptions": { "fullPage": true, "type": "png" },
  "viewport": { "width": 1440, "height": 900 },
  "gotoOptions": { "waitUntil": "networkidle0", "timeout": 45000 }
}
JSON

echo "Saved: $OUT ($(stat -c%s "$OUT") bytes)"
file "$OUT"
