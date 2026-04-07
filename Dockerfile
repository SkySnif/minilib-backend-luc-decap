########################################
# STAGE 1 — BUILD
########################################
FROM node:25.7.0-alpine AS builder

WORKDIR /app

# pnpm installer 
RUN npm install -g pnpm

# Copy necesary file for install modules
COPY package.json pnpm-lock.yaml ./
COPY tsconfig*.json ./

# External lib ts
COPY .npmrc .npmrc

# Variables for registry
ARG HENDEC_NPM_REGISTERY_HOST
ARG HENDEC_NPM_REGISTERY_PORT

ENV HENDEC_NPM_REGISTERY_HOST=${HENDEC_NPM_REGISTERY_HOST}
ENV HENDEC_NPM_REGISTERY_PORT=${HENDEC_NPM_REGISTERY_PORT}

# Install depencies - secret file loaded during docker build
RUN --mount=type=secret,id=service_npm_token \
    export HENDEC_NPM_TOKEN=$(cat /run/secrets/service_npm_token) && \
    pnpm install --frozen-lockfile && \
    unset HENDEC_NPM_TOKEN

# copy source code 
COPY src ./src

# Build TypeScript → dist/
RUN pnpm run build

########################################
# STAGE 2 — RUNTIME
########################################
FROM node:25.7.0-alpine

WORKDIR /app

# pnpm installer
RUN npm install -g pnpm

# Copy necesary file for install modules
COPY package.json pnpm-lock.yaml ./

# Copy build from builder
# node_module are copied from builder stage to avoid pnpm install again and dependencies with registry - like .npmrc 
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Entrypoint and scripts copy
COPY ./entrypoint/ /usr/local/bin/entrypoint/
RUN chmod -R +rx /usr/local/bin/entrypoint/

# SQL associated to the service copy
COPY ./sql/ /usr/local/bin/entrypoint/sql/
RUN chmod -R +r /usr/local/bin/entrypoint/sql/

# Expose port
# TODO: Change according to PORT set the app listener
EXPOSE 4000

# Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint/entrypoint.sh"]

# Run app (only JS compiled during build stage)
CMD ["pnpm", "run", "start"]
