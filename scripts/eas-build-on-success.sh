#!/usr/bin/env bash
# eas-build-on-success.sh


set -e

PROXY_URL="https://github-dispatch-proxy.nxhermane.workers.dev/nXhermane/MalnutriXcollect"
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

if [ -z "$EAS_BUILD_ARTIFACT_URL" ]; then
  echo "❌ EAS_BUILD_ARTIFACT_URL is not set. Aborting."
  exit 1
fi

if [ -z "$EAS_BUILD_APP_VERSION" ]; then
  echo "❌ EAS_BUILD_APP_VERSION is not set. Aborting."
  exit 1
fi

VERSION="$EAS_BUILD_APP_VERSION"
ARTIFACT_URL="$EAS_BUILD_ARTIFACT_URL"

echo "🚀 Triggering finalize-release dispatch..."
echo "   Version     : $VERSION"
echo "   Artifact URL: $ARTIFACT_URL"
echo "   Target repo : nXhermane/MalnutriXcollect"

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
