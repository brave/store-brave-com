FROM public.ecr.aws/docker/library/node:19

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci --omit=dev --ignore-scripts

COPY . .

ARG PUBLIC_ASSETS_PATH

RUN npm ci --omit=dev

RUN npm run build

CMD [ "npm", "run", "start" ]
