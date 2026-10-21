# syntax=docker/dockerfile:1

# Versión exacta de Node y Alpine: builds reproducibles y sin "latest"
FROM node:24.22.0-alpine3.24 AS base
WORKDIR /app
# la imagen oficial ya trae el usuario "node" (uid 1000) sin privilegios
RUN chown node:node /app
USER node


# Dependencias: solo los manifiestos, así esta capa se reusa mientras
# package.json / package-lock.json no cambien
FROM base AS deps
COPY --chown=node:node package.json package-lock.json ./
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 \
    npm ci


# Desarrollo: lo usa docker-compose con hot reload
FROM deps AS dev
ENV NODE_ENV=development
COPY --chown=node:node . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]


# Build: compila TypeScript y después deja solo las dependencias de producción
FROM deps AS build
COPY --chown=node:node . .
RUN npm run build && npm prune --omit=dev


# Producción: solo dist/ y node_modules de runtime, sin código fuente ni dev deps
FROM base AS prod
ARG APP_VERSION=dev
ENV NODE_ENV=production \
    APP_VERSION=${APP_VERSION} \
    PORT=3000
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "dist/main.js"]
