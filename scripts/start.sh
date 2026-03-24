#!/bin/sh

set -e

echo "[Start] Aplicando migraciones pendientes"
node_modules/.bin/prisma migrate deploy

echo "[Start] Iniciando aplicación Next.js"
exec node server.js