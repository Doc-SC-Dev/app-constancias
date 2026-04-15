#!/bin/sh

set -e

echo "[Start] Aplicando migraciones pendientes"
npx --yes prisma migrate deploy

echo "[Start] Iniciando aplicación Next.js"
exec node server.js