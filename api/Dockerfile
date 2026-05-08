ARG NODE_VERSION
FROM public.ecr.aws/docker/library/node:${NODE_VERSION}

ENV NODE_ENV=production

RUN corepack enable

WORKDIR /app
RUN chown node:node /app

USER node

COPY --chown=node:node ["package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml", "./"]
RUN pnpm ci --prod --ignore-scripts

COPY --chown=node:node . .

# Keystone telemetry flag
ENV KEYSTONE_TELEMETRY_DISABLED=1

# Prisma telemetry flag
ENV CHECKPOINT_DISABLE=1

# NextJS telemetry flag
ENV NEXT_TELEMETRY_DISABLED=1

ARG SESSION_SECRET

# Allow scripts, keystone uses that to generate files
RUN pnpm rebuild

CMD [ "pnpm", "run", "start" ]
