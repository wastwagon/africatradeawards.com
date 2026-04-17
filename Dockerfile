# Production image: Next.js standalone server (not nginx + missing `out/`).
# Prisma engines are copied alongside the traced bundle.

FROM node:20-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run sass:build

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_STANDALONE=1
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3003
ENV HOSTNAME=0.0.0.0

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client

USER nextjs

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:3003/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
