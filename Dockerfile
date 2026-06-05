# Injected by GitHub Actions; for local builds, use '--build-arg NODE_VERSION=$(cat .node-version)'
ARG NODE_VERSION

FROM public.ecr.aws/docker/library/node:${NODE_VERSION}

RUN corepack enable

WORKDIR /app
RUN mkdir -p /pnpm && chown -R node:node /app /pnpm

USER node

COPY --chown=node:node ["package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml", "./"]

# Injected by GitHub Actions (fallback for local builds, gets overridden by an explicit '--build-arg')
ARG PUBLIC_ASSETS_PATH=""

COPY --chown=node:node ./scripts/postinstall.js ./scripts/
RUN SKIP_POSTINSTALL=1 pnpm ci

COPY --chown=node:node . .

RUN node scripts/postinstall.js
RUN pnpm run build

CMD [ "pnpm", "run", "start" ]
