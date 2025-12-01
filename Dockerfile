# Dockerfile para Next.js 15 con pnpm y Prisma
# Etapa 1: Dependencias
FROM node:25-slim AS deps

RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm@latest-10
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Etapa 2: Builder
FROM node:25-slim AS builder

RUN npm install -g pnpm@latest-10
WORKDIR /app

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Variables de entorno para build
ENV NODE_ENV=production
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_TRUST_HOST
ARG BETTER_AUTH_URL
ARG FROM_EMAIL
ARG RESEND_API_KEY

ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_TRUST_HOST=$BETTER_AUTH_TRUST_HOST
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV FROM_EMAIL=$FROM_EMAIL
ENV RESEND_API_KEY=$RESEND_API_KEY
# Generar cliente de Prisma
RUN pnpm prisma generate

# Install Chrome
RUN 

# Construir aplicación
RUN pnpm build

# Etapa 3: Runner
FROM node:25-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install Chrome
RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
  && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# 2. Le decimos a Puppeteer dónde está el Chrome que acabamos de instalar
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Crear usuario no privilegiado
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir -p /home/nextjs/Downloads \
  && chown -R nextjs:nodejs /home/nextjs

# 3. 👇 IMPORTANTE: Definir la variable de entorno HOME
# Sin esto, Chrome seguirá buscando en /nonexistent aunque la carpeta exista
ENV HOME=/home/nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma

# Cambiar permisos
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
