#!/usr/bin/env bash
# infra/vibe-container.sh — boot armalo-portfolio-web on the vibe box.
#
# Static Astro build (dist/) served by nginx:alpine, bound to 127.0.0.1:3030
# so the unified Caddy on the same host can reverse-proxy to it without
# exposing the port publicly. Runs as `--restart unless-stopped` to match the
# rest of the armalo-* containers on vibe (per INFRA-OPS.md rule 5).
#
# Apply on vibe AFTER:
#   1. The portfolio dist/ has been rsynced to /opt/portfolio/dist/
#      (via scripts/deploy-vibe.sh --apply).
#   2. The Caddyfile has been patched (infra/vibe-caddy.patch) and reloaded.
#   3. The Route53 A record (infra/route53-portfolio.json) is live, so
#      portfolio.armalo.ai resolves to 5.78.90.97.
#
# Run on vibe:
#     bash infra/vibe-container.sh
#
# This script is intentionally NOT wrapped in --apply / --yes — it is the
# operator's responsibility to inspect `docker ps | grep armalo-portfolio`
# before running, and to remove an old container if one exists with a
# different image tag. T1+ agents and humans only.

set -euo pipefail

CONTAINER="armalo-portfolio-web"
IMAGE="nginx:alpine"
HOST_PORT=3030
DIST_PATH="/opt/portfolio/dist"
NGINX_CONF_PATH="/etc/nginx/conf.d/portfolio.conf"

# Stop a stale instance if one is already running. The restart-policy is
# unless-stopped, so a previous container may still be around after a host
# reboot; this is the safe replacement path.
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}\$"; then
  echo "[vibe-container] removing existing ${CONTAINER}"
  docker rm -f "${CONTAINER}" >/dev/null
fi

# Drop the custom nginx config so we can tighten the response headers to match
# what vercel.json used to send. See infra/nginx-portfolio.conf for the
# source of truth; the file is rewritten every deploy to keep parity with
# vercel.json's approved static-site security policy.
cat > "${DIST_PATH}/../nginx.conf" <<'NGINX_CONF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Mirror vercel.json's approved static-site security policy.
    add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;

    # HSTS — Letsencrypt + the .armalo.ai preloaded HSTS list.
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Long-cache the hashed Astro assets.
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }

    # Robots and sitemap should not be immutable.
    location = /robots.txt { add_header Cache-Control "public, max-age=3600" always; }
    location = /sitemap.xml { add_header Cache-Control "public, max-age=3600" always; }
}
NGINX_CONF

echo "[vibe-container] starting ${CONTAINER} from ${IMAGE}"
docker run -d \
  --name "${CONTAINER}" \
  --restart unless-stopped \
  -p 127.0.0.1:${HOST_PORT}:80 \
  -v "${DIST_PATH}:/usr/share/nginx/html:ro" \
  -v "${DIST_PATH}/../nginx.conf:${NGINX_CONF_PATH}:ro" \
  "${IMAGE}"

# nginx:alpine ships a default.conf that listens on port 80 in parallel
# with portfolio.conf; both server blocks exist in conf.d/, and
# default.conf wins by alphabetic sort order, so the add_header directives
# in portfolio.conf are silently ignored. Remove the default and reload
# so our security headers actually go out.
docker exec "${CONTAINER}" rm -f /etc/nginx/conf.d/default.conf
docker exec "${CONTAINER}" kill -HUP 1

echo "[vibe-container] checking local probe"
sleep 3
curl -sS -o /dev/null -w 'local probe: HTTP %{http_code}, %{size_download} bytes\n' \
  "http://127.0.0.1:${HOST_PORT}/"

echo "[vibe-container] done"