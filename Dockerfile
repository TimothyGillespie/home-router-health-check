FROM node:16-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

# Nx won't build without
RUN apk add git
RUN npx nx build server

WORKDIR /app/dist/apps/server

EXPOSE 3333

CMD ["node", "main.js"]
