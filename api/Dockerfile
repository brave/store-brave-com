FROM public.ecr.aws/docker/library/node:18.20.8

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci --omit=dev --ignore-scripts

COPY . .

# Keystone telemetry flag
ENV KEYSTONE_TELEMETRY_DISABLED=1

# Prisma telemetry flag
ENV CHECKPOINT_DISABLE=1

# NextJS telemetry flag
ENV NEXT_TELEMETRY_DISABLED=1

ARG SESSION_SECRET

# Allow scripts, keystone uses that to generate files
RUN npm ci --omit=dev

RUN npm run build

RUN npm run postinstall

CMD [ "npm", "run", "start" ]
