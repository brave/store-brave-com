FROM public.ecr.aws/docker/library/node:18

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci --ignore-scripts

COPY . .

ARG PUBLIC_ASSETS_PATH

RUN npm run postinstall

RUN npm run build

CMD [ "npm", "run", "start" ]
