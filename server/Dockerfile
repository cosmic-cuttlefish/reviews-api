FROM node:alpine

RUN mkdir reviews-api/

RUN mkdir reviews-api/server

WORKDIR reviews-api/server

COPY . .

RUN npm install

EXPOSE 80

CMD ["npm", "run", "start-dev"]

