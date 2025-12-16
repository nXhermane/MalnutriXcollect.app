#!/usr/bin/env bash
set -e

echo "📦 Creating crypto directory..."
mkdir -p assets/crypto

echo "🔐 Injecting server certificate..."

echo "$SERVER_CERT_CONTENT" > assets/crypto/server-cert.pem

echo "✅ Certificate ready!"