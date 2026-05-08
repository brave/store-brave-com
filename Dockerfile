ARG NODE_VERSION
FROM public.ecr.aws/docker/library/node:${NODE_VERSION}

RUN corepack enable

WORKDIR /app
RUN mkdir -p /pnpm && chown -R node:node /app /pnpm

USER node

# Use a short store path to keep tsx IPC socket paths under the 108-byte Unix domain socket limit.
#
# Git-hosted deps run prepare scripts via tsx, which creates a named pipe inside
# the pnpm store tmp dir that results in EINVAL on listen().
#
# Default dir: /root/.local/share/pnpm/store/v11/tmp/node_modules/.tmp/tsx-<id>/<pid>.pipe (>108 characters)
# Modified dir: /pnpm/v11/tmp/node_modules/.tmp/tsx-<id>/<pid>.pipe (<90 characters)
RUN pnpm config set store-dir /pnpm

COPY --chown=node:node ["package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml", "./"]
RUN pnpm ci --ignore-scripts

COPY --chown=node:node . .

ARG PUBLIC_ASSETS_PATH

RUN pnpm rebuild

CMD [ "pnpm", "run", "start" ]
