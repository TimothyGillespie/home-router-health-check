FROM node:16-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

# Nx won't build without git
RUN apk add git
RUN npx nx build server

FROM node:16-alpine

WORKDIR /server

COPY package*.json ./

# Based on https://github.com/EugeneKorshenko/nestjs-dockerize
RUN npm ci --only=production
COPY --from=build /app/dist/apps/server .

EXPOSE 3333

CMD ["node", "main.js"]
