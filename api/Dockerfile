FROM public.ecr.aws/docker/library/node:19

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci --omit=dev --ignore-scripts

COPY . .

ARG SESSION_SECRET

# Allow scripts, keystone uses that to generate files
RUN npm ci --omit=dev

RUN npm run build

RUN npm run postinstall

CMD [ "npm", "run", "start" ]
