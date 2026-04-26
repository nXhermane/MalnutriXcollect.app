#!/usr/bin/env bash
# eas-build-on-success.sh


set -e

PROXY_URL="https://github-dispatch-proxy.nxhermane.workers.dev/nXhermane/MalnutriXcollect.app"
EVENT_TYPE="finalize-release"

if [ "$EAS_BUILD_PROFILE" = "development" ]; then
  echo "ℹ️ Build profile is 'development' — skipping dispatch. Nothing to do."
  exit 0
fi

echo "📋 Build profile: $EAS_BUILD_PROFILE"

if [ -z "$DISPATCH_PROXY_API_KEY" ]; then
  echo "❌ DISPATCH_PROXY_API_KEY is not set. Aborting."
  exit 1
fi

if [ -z "$EAS_BUILD_ID" ]; then
  echo "❌ EAS_BUILD_ID is not set. Aborting."
  exit 1
fi

PKG_JSON="$(dirname "$0")/../package.json"
if [ ! -f "$PKG_JSON" ]; then
  echo "❌ package.json not found at $PKG_JSON. Aborting."
  exit 1
fi

VERSION=$(jq -r '.version' "$PKG_JSON")
if [ -z "$VERSION" ] || [ "$VERSION" = "null" ]; then
  echo "❌ Could not read version from package.json. Aborting."
  exit 1
fi

ARTIFACT_URL="https://expo.dev/artifacts/eas/${EAS_BUILD_ID}"

echo "🚀 Triggering finalize-release dispatch..."
echo "   Version     : $VERSION"
echo "   Artifact URL: $ARTIFACT_URL"
echo "   Target repo : nXhermane/MalnutriXcollect.app"

PAYLOAD=$(cat <<EOF
{
  "event_type": "${EVENT_TYPE}",
  "client_payload": {
    "version": "${VERSION}",
    "artifact_url": "${ARTIFACT_URL}"
  }
}
EOF
)

HTTP_STATUS=$(curl -s -o /tmp/dispatch_response.json -w "%{http_code}" \
  -X POST "${PROXY_URL}" \
  -H "Content-Type: application/json" \
  -H "X-Proxy-Auth: ${DISPATCH_PROXY_API_KEY}" \
  -d "${PAYLOAD}")

RESPONSE_BODY=$(cat /tmp/dispatch_response.json)

if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 300 ]; then
  echo "✅ Dispatch triggered successfully (HTTP $HTTP_STATUS)"
else
  echo "❌ Dispatch failed (HTTP $HTTP_STATUS)"
  echo "   Response: $RESPONSE_BODY"
  exit 1
fi