# Notes:
# use array for commands to avoid spawning sh processes that use resources. Also avoids node not receiving (exit) signals.
ARG NODE_VERSION=20.0.0

# Prepare OS
FROM node:${NODE_VERSION}-alpine as os
RUN ["apk", "--no-cache", "--quiet", "add", "g++", "make", "py3-pip"]

# Install dependencies & build
FROM os as build
WORKDIR /build
COPY [".", "."]
RUN ["npm", "ci"]
RUN ["npm", "run", "build"]

FROM os as packages
WORKDIR /packages
COPY ["./package.json", "./package-lock.json", "./"]
RUN ["npm", "ci", "--omit=dev"]

FROM node:${NODE_VERSION}-alpine as runner
WORKDIR /discord

RUN ["apk", "--update-cache", "upgrade"]
RUN ["apk", "--purge", "--quiet", "del", "npm", "py-pip"]

COPY ["./LICENSE", "./package.json", "./"]

COPY --from=build ["/build/dist/", "./gateway"]
COPY --from=packages ["/packages/node_modules", "./node_modules"]

USER node
ENV NODE_ENV production
CMD ["node", "./gateway/manager/main.js"]