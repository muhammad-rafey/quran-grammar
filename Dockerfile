FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/core/package.json packages/core/package.json
RUN npm ci --workspace @quran-grammar/api --workspace @quran-grammar/web --workspace @quran-grammar/core --include-workspace-root=false
COPY apps/api apps/api
COPY apps/web apps/web
COPY packages/core packages/core
RUN npm run build -w @quran-grammar/web && npm run build -w @quran-grammar/api

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080 HOST=0.0.0.0 WEB_DIST=/app/apps/web/dist
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/core/package.json packages/core/package.json
RUN npm ci --omit=dev --workspace @quran-grammar/api --include-workspace-root=false && npm cache clean --force
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/web/dist apps/web/dist
COPY THIRD_PARTY_NOTICES.md ./
USER node
EXPOSE 8080
CMD ["node", "apps/api/dist/server.js"]
