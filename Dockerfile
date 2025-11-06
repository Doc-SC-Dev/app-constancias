FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV NODE_ENV=production
ENV DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19LR3pvNkF4VzdYMGNSOWFQSWZfQmQiLCJhcGlfa2V5IjoiMDFLN1NOMFRQRlFKRFRZMTRNN0QwMTE5UTIiLCJ0ZW5hbnRfaWQiOiJlZDVjYjU0MWE5ZWY4NmRmMThlOTRhYjlkOGQ4NjE3MGM4YzE1OTU5NDQzMzE0YjAyMDE5YjA5OTkyZGYwZjEyIiwiaW50ZXJuYWxfc2VjcmV0IjoiNDhjYjY3ZTQtMGI0Mi00Mjk4LWEzNTItYzQ2MDg4NGUxNjUzIn0.Zyc0Db0ReYhKZJc9kpqi1TX8tanB0FSHfWVTJ-dS3L8"
ENV BETTER_AUTH_SECRET=GYLUqo5h2XAad761s4PnmxzTJcHOzLOD
ENV BETTER_AUTH_URL=http://localhost:3000
RUN pnpm run build

FROM base AS dokploy
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary files
COPY --from=build /app/.next/stand./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]
