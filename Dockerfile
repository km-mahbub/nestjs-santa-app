FROM node:18-alpine as client-base

# RUN apk --no-cache add --virtual g++ gcc libgcc libstdc++ linux-headers make python2 

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ./client/package*.json /app/
COPY ./client/yarn.lock /app/
COPY ./client/.yarnrc.yml /app/

RUN rm -rf node_modules && yarn install --frozen-lockfile

FROM client-base as build-client

ENV CI=false
ENV PATH /app/node_modules/.bin:$PATH
ENV GENERATE_SOURCEMAP=false

COPY ./client /app/

RUN yarn build

FROM node:18-alpine as server-base

WORKDIR /app

COPY ./package*.json /app/
COPY ./yarn.lock /app/
COPY ./.yarnrc.yml /app/

RUN rm -rf node_modules && yarn install --frozen-lockfile

FROM server-base as server-production

WORKDIR /app

COPY . /app
RUN yarn build && yarn cache clean --force

RUN rm -rf node_modules && yarn install --production --frozen-lockfile

FROM node:18-alpine as production
WORKDIR /app

RUN apk update && apk upgrade
COPY --from=server-production ./app/package.json /app/package.json
COPY --from=server-production ./app/node_modules /app/node_modules
COPY --from=server-production ./app/dist /app/src
COPY --from=build-client /app/dist /app/public

CMD ["yarn", "start:prod"]
