#!/bin/sh
set -e

echo "Esperando a que la base de datos este lista..."
sleep 3

echo "Ejecutando migraciones de Prisma..."
npx prisma db push --skip-generate

echo "Ejecutando seeds..."
npx prisma db seed || echo "Seeds ya ejecutados o error (continuando...)"

echo "Iniciando servidor..."
exec node dist/index.js
