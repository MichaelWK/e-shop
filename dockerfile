# ---------- base: shared by all stages ----------
FROM node:22-alpine AS base
# Prisma needs openssl on Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- deps: install dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
# skip postinstall: source files aren't copied yet
RUN npm ci --ignore-scripts

# ---------- builder: generate + build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# dummy URL so the build can load Prisma
# (not a secret, the real one comes at run time)
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN npx prisma generate
RUN npm run codegen
RUN npm run build

# ---------- runner: the final image ----------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node \
  /app/.next/standalone ./
COPY --from=builder --chown=node:node \
  /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]