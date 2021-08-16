FROM node:14-buster-slim

LABEL name="perpetual-spinach"
LABEL description="Cryptocurrency dashboard"
LABEL maintainers="8094390+ecs-hk@users.noreply.github.com"

ENV NODE_ENV="production"
WORKDIR "/usr/local/node-app"
#
# Copy package manifest, install packages, apply secfixes
#
COPY ./package.json ./package-lock.json ./
RUN npm install && npm audit fix && npm cache clean --force
#
# Copy complete app, run linting and unit tests
#
COPY . .
RUN npm test
#
# Launch Express HTTP server
#
CMD ["node", "app.js"]
EXPOSE 8080
