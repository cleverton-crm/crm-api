FROM node:16
ENV NODE_ENV=development
RUN node -v
RUN mkdir -p /var/www/api
WORKDIR /var/www/api
ADD . /var/www/api
RUN yarn install
CMD yarn build && yarn start:dev
