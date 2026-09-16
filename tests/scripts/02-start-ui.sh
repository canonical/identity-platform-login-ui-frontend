#!/bin/bash
set -x
set -e

cd "$(dirname "$0")/../.."

docker compose up -d frontend-ui identity-platform-login-ui
