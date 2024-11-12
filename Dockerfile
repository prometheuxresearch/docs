FROM node:lts-alpine

COPY . /docs

WORKDIR /docs

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "serve", "--", "--port", "80"]
